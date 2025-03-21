'use client';
import SMHeader from '@/commons/school_manager/header';
import { useAppContext } from '@/context/app_provider';
import useFetchSchoolYear from '@/hooks/useFetchSchoolYear';
import useFetchTerm from '@/hooks/useFetchTerm';
import useNotify from '@/hooks/useNotify';
import {
	IConfigurationStoreObject,
	ISchoolYearResponse,
	ITermResponse,
	ITimetableStoreObject,
} from '@/utils/constants';
import { firestore } from '@/utils/firebaseConfig';
import {
	Button,
	Checkbox,
	FormControl,
	InputLabel,
	ListItemText,
	MenuItem,
	Select,
	TextField,
} from '@mui/material';
import { addDoc, collection, updateDoc } from 'firebase/firestore';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { IDropdownOption } from '../_utils/contants';
import { TIMETABLE_GENERATION_TABS } from './_libs/constants';
import useFetchWeekDays from '../publish-timetable/_hooks/useFetchWeekdays';
import { IWeekdayResponse } from '../publish-timetable/_libs/constants';
import dayjs from 'dayjs';

const ITEM_HEIGHT = 30;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
			scrollbars: 'none',
		},
	},
};

interface ISortableDropdown<T> extends IDropdownOption<T> {
	criteria: string | number;
}

export default function Home() {
	const isMenuOpen: boolean = useSelector((state: any) => state.schoolManager.isMenuOpen);
	const { selectedSchoolYearId, schoolId, sessionToken } = useAppContext();
	const router = useRouter();
	const pathName = usePathname();

	const [selectedYearId, setSelectedYearId] = useState<number>(0);
	const [selectedTermId, setSelectedTermId] = useState<number>(0);
	const [timetableName, setTimetableName] = useState<string>('');
	const [startWeek, setStartWeek] = useState<number>(1);
	const [endWeek, setEndWeek] = useState<number>(2);
	const [timetableAbbreviation, setTimetableAbbreviation] = useState<string>('');

	const [schoolYearIdOptions, setSchoolYearIdOptions] = useState<IDropdownOption<number>[]>([]);
	const [termIdOptions, setTermIdOptions] = useState<ISortableDropdown<number>[]>([]);
	const [weekdayOptions, setWeekdayOptions] = useState<IDropdownOption<number>[]>([]);

	const { data: schoolYearData, mutate } = useFetchSchoolYear({ includePrivate: false });
	const { data: termData, mutate: updateTerm } = useFetchTerm({
		pageIndex: 1,
		pageSize: 100,
		schoolYearId: selectedSchoolYearId,
	});

	const { data: weekdayData, mutate: updateWeekdayData } = useFetchWeekDays({
		schoolId: Number(schoolId),
		sessionToken,
		termId: selectedTermId,
		yearId: selectedSchoolYearId,
	});

	useEffect(() => {
		updateWeekdayData();
		if (weekdayData?.status === 200) {
			setWeekdayOptions([]);
			const tmpWeekdayOptions: IDropdownOption<number>[] = weekdayData.result.map(
				(weekday: IWeekdayResponse) =>
					({
						label: `Tuần ${weekday['week-number']} (${dayjs(weekday['start-date']).format(
							'DD/MM/YYYY'
						)} - ${dayjs(weekday['end-date']).format('DD/MM/YYYY')})`,
						value: weekday['week-number'],
					} as IDropdownOption<number>)
			);
			if (tmpWeekdayOptions.length > 0) {
				setWeekdayOptions(tmpWeekdayOptions.sort((a, b) => a.value - b.value));
				setStartWeek(tmpWeekdayOptions[0].value);
				setEndWeek(tmpWeekdayOptions[tmpWeekdayOptions.length - 1].value);
			}
		}
	}, [weekdayData, selectedTermId, selectedSchoolYearId, open]);

	// Process data
	useEffect(() => {
		if (termData?.status === 200) {
			const studyOptions: ISortableDropdown<number>[] = termData.result.items.map(
				(item: ITermResponse) => ({
					value: item.id,
					label: `${item.name} | (${item['school-year-start']}-${item['school-year-end']}) `,
					criteria: item.name,
				})
			);
			setTermIdOptions(
				studyOptions.sort((a, b) => (a.criteria as string).localeCompare(b.criteria as string))
			);
			setSelectedTermId(studyOptions[0].value);
			const selectedTerm: ITermResponse = termData.result.items.find(
				(item: ITermResponse) => item.id === studyOptions[0].value
			);
			if (selectedTerm) {
				setStartWeek(selectedTerm['start-week']);
				setEndWeek(selectedTerm['end-week']);
			}
		}
	}, [termData]);

	useEffect(() => {
		updateTerm({ schoolYearId: selectedYearId });
		if (termData?.status === 200) {
			const termInYear: ITermResponse[] = termData.result.items.filter(
				(term: ITermResponse) => term['school-year-id'] === selectedYearId
			);
			if (termInYear.length > 0) {
				const studyOptions: ISortableDropdown<number>[] = termInYear.map((item: ITermResponse) => ({
					value: item.id,
					label: `${item.name} | (${item['school-year-start']}-${item['school-year-end']}) `,
					criteria: item.name,
				}));
				setTermIdOptions(
					studyOptions.sort((a, b) => (a.criteria as string).localeCompare(b.criteria as string))
				);
				if (!studyOptions.some((item) => item.value === selectedTermId)) {
					setSelectedTermId(studyOptions[0].value);
				} else {
					useNotify({
						type: 'error',
						message: 'Không có học kỳ cho năm học này',
					});
				}
			}
		}
	}, [selectedYearId]);

	const handleCreateTimetable = async () => {
		// Tạo timetable object lên Firebase
		let newTimetableData: ITimetableStoreObject = {
			'timetable-name': timetableName,
			'timetable-abbreviation': timetableAbbreviation,
			'school-id': Number(schoolId),
			'year-id': selectedSchoolYearId,
			'generated-schedule-id': null,
			'generated-date': null,
			'fitness-point': 0,
			'time-cost': 0,
			'year-name': schoolYearIdOptions.find((item) => item.value === selectedYearId)?.label ?? '',
			'term-name': termIdOptions.find((item) => item.value === selectedTermId)?.label ?? '',
			'term-id': selectedTermId,
			'config-id': '',
			'applied-week': startWeek,
			'ended-week': endWeek,
			'internal-end-date': null,
			'published-timetable-id': null,
			status: 'Draft',
		};
		let newConfigurationData: IConfigurationStoreObject = {
			id: '',
			'timetable-id': '',
			'teacher-assignments': [],
			'fixed-periods-para': [],
			'no-assign-periods-para': [],
			'free-timetable-periods-para': [],
			'teacher-assignments-summary': [],
			'applied-curriculum-id': 0,
			'days-in-week': 6,
			'minimum-days-off': 0,
			'required-break-periods': 1,
			'max-execution-time-in-seconds': 600, // 10 minutes
		};
		const timetableRef = await addDoc(collection(firestore, 'timetables'), newTimetableData);
		const configRef = await addDoc(collection(firestore, 'configurations'), newConfigurationData);
		if (timetableRef.id && configRef.id) {
			await updateDoc(timetableRef, { 'config-id': configRef.id });
			await updateDoc(configRef, { 'timetable-id': timetableRef.id });
			useNotify({
				type: 'success',
				message: 'Tạo thời khóa biểu thành công',
			});
			router.push(`${pathName}/${timetableRef.id}/${TIMETABLE_GENERATION_TABS[0].value}`);
		}
	};

	useEffect(() => {
		mutate();
		if (schoolYearData?.status === 200) {
			const options: IDropdownOption<number>[] = schoolYearData.result.map(
				(item: ISchoolYearResponse) => {
					const currentYear = new Date().getFullYear();
					if (
						parseInt(item['start-year']) <= currentYear &&
						parseInt(item['end-year']) >= currentYear
					) {
						setSelectedYearId(item.id);
					}
					return {
						label: `${item['start-year']} - ${item['end-year']}`,
						value: item.id,
					} as IDropdownOption<number>;
				}
			);
			setSchoolYearIdOptions(options.sort((a, b) => a.label.localeCompare(b.label)));
		}
	}, [schoolYearData]);

	return (
		<div
			className={`w-[${
				!isMenuOpen ? '84' : '100'
			}%] h-screen flex flex-col justify-start items-start`}
		>
			<SMHeader>
				<div>
					<h3 className='text-title-small text-white font-medium tracking-wider'>
						Tạo thời khóa biểu
					</h3>
				</div>
			</SMHeader>
			<div className='w-full h-full flex flex-col justify-start pt-[20vh] items-center'>
				<div className='w-[30vw] h-[40vh] flex flex-col justify-start items-center gap-3'>
					<h1 className='text-title-large-strong text-primary-500'>Thông tin Thời khóa biểu</h1>
					<TextField
						fullWidth
						variant='standard'
						id='abbreviation'
						name='abbreviation'
						label='Nhập mã Thời khóa biểu'
						value={timetableAbbreviation}
						onChange={(event) => setTimetableAbbreviation(event.target.value)}
						slotProps={{
							input: {
								endAdornment: (
									<Image
										className='opacity-30 mx-2 select-none'
										src='/images/icons/text-formatting.png'
										alt='email'
										width={20}
										height={20}
									/>
								),
							},
						}}
					/>
					<TextField
						fullWidth
						variant='standard'
						id='timetableName'
						name='timetableName'
						label='Nhập tên Thời khóa biểu'
						value={timetableName}
						onChange={(event) => setTimetableName(event.target.value)}
						slotProps={{
							input: {
								endAdornment: (
									<Image
										className='opacity-30 mx-2 select-none'
										src='/images/icons/text-formatting.png'
										alt='email'
										width={20}
										height={20}
									/>
								),
							},
						}}
					/>
					<FormControl sx={{ width: '100%' }}>
						<InputLabel id='school-year-label' variant='standard'>
							Chọn năm học
						</InputLabel>
						<Select
							labelId='school-year-label'
							id='school-year'
							variant='standard'
							value={selectedYearId}
							onChange={(event) => setSelectedYearId(Number(event.target.value))}
							MenuProps={MenuProps}
							renderValue={(selected) => {
								return schoolYearIdOptions.find((item) => item.value === selected)?.label ?? '';
							}}
							sx={{ width: '100%', fontSize: '1.000rem' }}
						>
							{schoolYearIdOptions?.length === 0 && (
								<MenuItem disabled value={0}>
									Không tìm thấy năm học
								</MenuItem>
							)}
							{schoolYearIdOptions.map((item, index) => (
								<MenuItem key={item.label + index} value={item.value}>
									<Checkbox
										checked={selectedYearId === 0 ? false : selectedYearId === item.value}
									/>
									<ListItemText primary={item.label} />
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<FormControl sx={{ width: '100%' }}>
						<InputLabel id='school-term-label' variant='standard'>
							Chọn học kỳ
						</InputLabel>
						<Select
							labelId='school-term-label'
							id='school-term'
							variant='standard'
							value={selectedTermId}
							onChange={(event) => setSelectedTermId(Number(event.target.value))}
							MenuProps={MenuProps}
							renderValue={(selected) => {
								return termIdOptions.find((item) => item.value === selected)?.label ?? '';
							}}
							sx={{ width: '100%', fontSize: '1.000rem' }}
						>
							{termIdOptions?.length === 0 && (
								<MenuItem disabled value={0}>
									Không tìm thấy năm học
								</MenuItem>
							)}
							{termIdOptions.map((item, index) => (
								<MenuItem key={item.label + index} value={item.value}>
									<Checkbox
										checked={selectedTermId === 0 ? false : selectedTermId === item.value}
									/>
									<ListItemText primary={item.label} />
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<div className='w-full h-fit flex flex-row justify-between items-center'>
						<FormControl sx={{ width: '45%' }}>
							<InputLabel id='school-year-label' variant='standard'>
								Tuần bắt đầu
							</InputLabel>
							<Select
								labelId='school-year-label'
								id='school-year'
								variant='standard'
								value={startWeek}
								onChange={(event) => setStartWeek(Number(event.target.value))}
								MenuProps={MenuProps}
								renderValue={(selected) => {
									return weekdayOptions.find((item) => item.value === selected)?.label ?? '';
								}}
								sx={{ width: '100%', fontSize: '1.000rem' }}
							>
								{weekdayOptions.map((option: IDropdownOption<number>, index: number) => (
									<MenuItem key={index} value={option.value}>
										<Checkbox checked={startWeek === 0 ? false : startWeek === option.value} />
										<ListItemText primary={option.label} />
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<FormControl sx={{ width: '45%' }}>
							<InputLabel id='school-year-label' variant='standard'>
								Tuần kết thúc
							</InputLabel>
							<Select
								labelId='school-year-label'
								id='school-year'
								variant='standard'
								value={endWeek}
								onChange={(event) => setEndWeek(Number(event.target.value))}
								MenuProps={MenuProps}
								renderValue={(selected) => {
									return weekdayOptions.find((item) => item.value === selected)?.label ?? '';
								}}
								sx={{ width: '100%', fontSize: '1.000rem' }}
							>
								{weekdayOptions.map((option: IDropdownOption<number>, index: number) => (
									<MenuItem key={index} value={option.value}>
										<Checkbox checked={startWeek === 0 ? false : startWeek === option.value} />
										<ListItemText primary={option.label} />
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</div>
					<Button
						variant='contained'
						fullWidth
						onClick={handleCreateTimetable}
						disabled={timetableName.length === 0 || timetableAbbreviation.length === 0}
						color='inherit'
						sx={{
							bgcolor: '#175b8e',
							color: 'white',
							borderRadius: 0,
							marginTop: '2vh',
						}}
					>
						Tạo thời khóa biểu
					</Button>
				</div>
			</div>
		</div>
	);
}
