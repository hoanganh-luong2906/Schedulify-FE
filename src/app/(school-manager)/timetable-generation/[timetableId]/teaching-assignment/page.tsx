'use client';
import { IDropdownOption } from '@/app/(school-manager)/_utils/contants';
import { useAppContext } from '@/context/app_provider';
import { ITimetableGenerationState } from '@/context/slice_timetable_generation';
import useFetchTerm from '@/hooks/useFetchTerm';
import useFilterArray from '@/hooks/useFilterArray';
import useNotify from '@/hooks/useNotify';
import { ITeacherAssignmentSummary } from '@/utils/constants';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import TeachingAssignmentFilterableSkeleton from './_components/skeleton_filterable';
import TeachingAssignmentSideNavSkeleton from './_components/skeleton_sidenav';
import TeachingAssignmentTableSkeleton from './_components/skeleton_table';
import TeachingAssignmentFilterable from './_components/teaching_assignment_filterable';
import TeachingAssignmentAdjustModal from './_components/teaching_assignment_modal_adjust';
import TeachingAssignmentAutoApplyModal from './_components/teaching_assignment_modal_auto';
import TeachingAssignmentSummaryModal from './_components/teaching_assignment_modal_summary';
import TeachingAssignmentSideNav from './_components/teaching_assignment_sidenav';
import TeachingAssignmentTable from './_components/teaching_assignment_table';
import useFetchClassData from './_hooks/useFetchClass';
import useFetchTeachingAssignment from './_hooks/useFetchTA';
import useFetchTeacher from './_hooks/useFetchTeacher';
import useSidenavDataConverter from './_hooks/useSidenavDataConverter';
import {
	IAutoTeacherAssignmentResponse,
	IClassResponse,
	ITeacherAssignmentRequest,
	ITeacherResponse,
	ITeachingAssignmentResponse,
	ITeachingAssignmentSidenavData,
	ITeachingAssignmentTableData,
	ITermResponse,
} from './_libs/constants';

interface ISortableDropdown<T> extends IDropdownOption<T> {
	criteria: string | number;
}

export default function SMTeachingAssignment() {
	const { sessionToken, schoolId, selectedSchoolYearId } = useAppContext();
	const { dataStored , timetableStored}: ITimetableGenerationState = useSelector(
		(state: any) => state.timetableGeneration
	);

	// Selected
	const [selectedClassId, setSelectedClassId] = useState<number>(0);
	const [selectedCurriculumName, setSelectedCurriculumName] = useState<string>('');
	const [selectedGrade, setSelectedGrade] = useState<string>('');
	const [selectedTermId, setSelectedTermId] = useState<number>(1);
	const [maxPeriodPerWeek, setMaxPeriodPerWeek] = useState<number>(17);
	const [minPeriodPerWeek, setMinPeriodPerWeek] = useState<number>(5);

	// Data
	const [tableData, setTableData] = useState<ITeachingAssignmentTableData[]>([]);
	const [sidenavData, setSidenavData] = useState<ITeachingAssignmentSidenavData[]>([]);
	const [termStudyOptions, setTermStudyOptions] = useState<IDropdownOption<number>[]>([]);
	const [automationResult, setAutomationResult] = useState<IAutoTeacherAssignmentResponse[]>([]);
	const [editingObjects, setEditingObjects] = useState<ITeacherAssignmentRequest[]>([]);
	const [assignmentSummary, setAssignmentSummary] = useState<ITeacherAssignmentSummary[]>([]);

	//Modal status
	const [isFilterable, setIsFilterable] = useState<boolean>(true);
	const [isModifyingResultModalOpen, setModifyingResultModalOpen] = useState<boolean>(false);
	const [isAutoApplyModalOpen, setIsAutoApplyModalOpen] = useState<boolean>(false);
	const [isSummaryModalOpen, setIsSummaryModalOpen] = useState<boolean>(false);

	// Fetch data
	const {
		data: classData,
		isValidating: isClassValidating,
		mutate: updateClass,
	} = useFetchClassData({
		sessionToken,
		schoolId,
		pageSize: 1000,
		pageIndex: 1,
		schoolYearId: selectedSchoolYearId,
	});
	const {
		data: teachingAssignmentData,
		mutate: updateTeachingAssignment,
		isValidating: isTeachingAssignmentValidating,
	} = useFetchTeachingAssignment({
		sessionToken,
		schoolId: Number(schoolId),
		schoolYearId: selectedSchoolYearId,
		studentClassId: selectedClassId,
		termId: selectedTermId,
	});
	const {
		data: teacherData,
		mutate: updateTeacher,
		isValidating: isTeacherValidating,
	} = useFetchTeacher({
		sessionToken,
		schoolId,
		pageSize: 1000,
		pageIndex: 1,
	});

	// Lấy data summary từ dataStored
	useEffect(() => {
		if (dataStored) {
			setAssignmentSummary(dataStored['teacher-assignments-summary']);
			setSelectedTermId(timetableStored['term-id'])
		}
	}, [dataStored]);

	useEffect(() => {
		updateClass();
		if (classData?.status === 200) {
			const tmpData: ITeachingAssignmentSidenavData[] = useSidenavDataConverter(
				classData.result.items as IClassResponse[]
			);
			if (tmpData.length > 0) {
				setSidenavData(tmpData);
				setSelectedClassId(tmpData[0].items[0].value);
				setSelectedCurriculumName(tmpData[0].items[0].extra);
				setSelectedGrade(tmpData[0].grade);
			}
		}
	}, [classData]);

	// Process data after fetching teaching assignment data
	useEffect(() => {
		updateTeachingAssignment();
		updateTeacher();
		setTableData([]);
		if (teachingAssignmentData?.status === 200 && teacherData?.status === 200) {
			const assignedList: ITeachingAssignmentTableData[] = teachingAssignmentData.result[
				'teacher-assignt-view'
			].map((item: ITeachingAssignmentResponse) => {
				const existingAssignment =
					editingObjects.find((assignment) => assignment['assignment-id'] === item.id) ??
					dataStored['teacher-assignments']?.find(
						(assignment) => assignment['assignment-id'] === item.id
					);
				if (existingAssignment !== undefined) {
					const existingTeacher: ITeacherResponse = teacherData.result.items.find(
						(teacher: ITeacherResponse) => teacher.id === existingAssignment['teacher-id']
					);
					return {
						id: item.id,
						subjectName: item['subject-name'],
						teacherOption: existingAssignment
							? {
									label: `${existingTeacher['first-name']} ${existingTeacher['last-name']} (${existingTeacher.abbreviation})`,
									value: existingAssignment['teacher-id'],
							  }
							: {
									label: '- - -',
									value: 0,
							  },
						totalSlotPerWeek: item['period-count'],
						subjectKey: item['subject-id'],
					} as ITeachingAssignmentTableData;
				}
				return {
					id: item.id,
					subjectName: item['subject-name'],
					teacherOption: { label: '- - -', value: 0 },
					totalSlotPerWeek: item['period-count'],
					subjectKey: item['subject-id'],
				} as ITeachingAssignmentTableData;
			});
			const notAssignedList: ITeachingAssignmentTableData[] = teachingAssignmentData.result[
				'teacher-not-assignt-view'
			].map((item: ITeachingAssignmentResponse) => {
				const existingAssignment =
					editingObjects.find((assignment) => assignment['assignment-id'] === item.id) ??
					dataStored['teacher-assignments']?.find(
						(assignment) => assignment['assignment-id'] === item.id
					);
				if (existingAssignment !== undefined) {
					const existingTeacher: ITeacherResponse = teacherData.result.items.find(
						(teacher: ITeacherResponse) => teacher.id === existingAssignment['teacher-id']
					);
					return {
						id: item.id,
						subjectName: item['subject-name'],
						teacherOption: existingAssignment
							? {
									label: `${existingTeacher['first-name']} ${existingTeacher['last-name']} (${existingTeacher.abbreviation})`,
									value: existingAssignment['teacher-id'],
							  }
							: {
									label: '- - -',
									value: 0,
							  },
						totalSlotPerWeek: item['period-count'],
						subjectKey: item['subject-id'],
					} as ITeachingAssignmentTableData;
				}
				return {
					id: item.id,
					subjectName: item['subject-name'],
					teacherOption: { label: '- - -', value: 0 },
					totalSlotPerWeek: item['period-count'],
					subjectKey: item['subject-id'],
				} as ITeachingAssignmentTableData;
			});
			const tableData: ITeachingAssignmentTableData[] = useFilterArray(
				[...notAssignedList, ...assignedList],
				['id']
			).reverse();
			setTableData(tableData);
		}
	}, [teachingAssignmentData, teacherData, selectedSchoolYearId, selectedClassId, dataStored]);

	// Render skeleton if data while fetching data
	if (isClassValidating || isTeachingAssignmentValidating || isTeacherValidating) {
		return (
			<div className='w-full h-screen flex flex-col justify-start items-start overflow-y-scroll no-scrollbar'>
				<div className='w-full h-full flex flex-row justify-start items-start'>
					{isClassValidating ? (
						<TeachingAssignmentSideNavSkeleton />
					) : (
						<TeachingAssignmentSideNav
							selectedClass={selectedClassId}
							setSelectedClass={setSelectedClassId}
							setSelectedCurriculumName={setSelectedCurriculumName}
							classData={sidenavData}
							setSelectedGrade={setSelectedGrade}
						/>
					)}
					<div className='w-[85%] h-full flex justify-center items-start gap-5 overflow-y-scroll no-scrollbar'>
						<TeachingAssignmentTableSkeleton />
						{termStudyOptions.length > 0 ? (
							<TeachingAssignmentFilterable
								open={isFilterable}
								setOpen={setIsFilterable}
								selectedTermId={selectedTermId}
								setSelectedTermId={setSelectedTermId}
								termStudyOptions={termStudyOptions}
								setIsApplyModalOpen={setIsAutoApplyModalOpen}
								maxPeriodPerWeek={maxPeriodPerWeek}
								minPeriodPerWeek={minPeriodPerWeek}
								setMaxPeriodPerWeek={setMaxPeriodPerWeek}
								setMinPeriodPerWeek={setMinPeriodPerWeek}
								setIsSummaryModalOpen={setIsSummaryModalOpen}
							/>
						) : (
							<TeachingAssignmentFilterableSkeleton />
						)}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='w-full h-screen flex flex-col justify-start items-start overflow-y-scroll no-scrollbar'>
			<div className='w-full h-full flex flex-row justify-start items-start overflow-y-hidden'>
				<TeachingAssignmentSideNav
					selectedClass={selectedClassId}
					setSelectedClass={setSelectedClassId}
					setSelectedCurriculumName={setSelectedCurriculumName}
					classData={sidenavData}
					setSelectedGrade={setSelectedGrade}
				/>
				<div className='w-[85%] h-full flex justify-center items-start gap-5'>
					<TeachingAssignmentTable
						assignmentData={tableData}
						mutate={updateTeachingAssignment}
						isFilterable={isFilterable}
						setIsFilterable={setIsFilterable}
						selectedCurriculumName={selectedCurriculumName}
						editingObjects={editingObjects}
						setEditingObjects={setEditingObjects}
						selectedGrade={selectedGrade}
						assignmentSummary={assignmentSummary}
					/>
					<TeachingAssignmentFilterable
						open={isFilterable}
						setOpen={setIsFilterable}
						selectedTermId={selectedTermId}
						setSelectedTermId={setSelectedTermId}
						termStudyOptions={termStudyOptions}
						setIsApplyModalOpen={setIsAutoApplyModalOpen}
						maxPeriodPerWeek={maxPeriodPerWeek}
						minPeriodPerWeek={minPeriodPerWeek}
						setMaxPeriodPerWeek={setMaxPeriodPerWeek}
						setMinPeriodPerWeek={setMinPeriodPerWeek}
						setIsSummaryModalOpen={setIsSummaryModalOpen}
					/>
					<TeachingAssignmentAutoApplyModal
						open={isAutoApplyModalOpen}
						setOpen={setIsAutoApplyModalOpen}
						setAutomationResult={setAutomationResult}
						setModifyingResultModalOpen={setModifyingResultModalOpen}
						assignedTeachers={editingObjects}
						dataStored={dataStored}
						maxPeriodPerWeek={maxPeriodPerWeek}
						minPeriodPerWeek={minPeriodPerWeek}
					/>
					<TeachingAssignmentAdjustModal
						open={isModifyingResultModalOpen}
						setOpen={setModifyingResultModalOpen}
						automationResult={automationResult}
						sidenavData={sidenavData}
						updateTeachingAssignment={updateTeachingAssignment}
						selectedGrade={selectedGrade}
						setSelectedGrade={setSelectedGrade}
					/>
					<TeachingAssignmentSummaryModal
						isModalOpen={isSummaryModalOpen}
						setIsModalOpen={setIsSummaryModalOpen}
					/>
				</div>
			</div>
		</div>
	);
}
