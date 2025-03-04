'use client';

import ContainedButton from '@/commons/button-contained';
import { useAppContext } from '@/context/app_provider';
import useNotify from '@/hooks/useNotify';
import { CLASSGROUP_STRING_TYPE, CLASSGROUP_TRANSLATOR } from '@/utils/constants';
import { TRANSLATOR } from '@/utils/dictionary';
import CloseIcon from '@mui/icons-material/Close';
import {
	Box,
	Checkbox,
	FormControl,
	FormHelperText,
	IconButton,
	InputLabel,
	ListItemText,
	MenuItem,
	Modal,
	Select,
	TextField,
	Typography,
} from '@mui/material';
import { Theme, useTheme } from '@mui/material/styles';
import { useFormik } from 'formik';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { KeyedMutator } from 'swr';
import { IDropdownOption } from '../../_utils/contants';
import useFetchCurriculumDetails from '../_hooks/useFetchCuriculumnDetail';
import useFetchSubjectOptions from '../_hooks/useFetchSubjectOptions';
import useUpdateCurriculum from '../_hooks/useUpdateCuriculumn';
import {
	ICurriculumDetailResponse,
	ISubjectOptionResponse,
	IUpdateCurriculumRequest,
} from '../_libs/constants';
import { curriculumSchema } from '../_libs/curiculumn_schema';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '50vw',
	height: 'fit-content',
	bgcolor: 'background.paper',
};

const ITEM_HEIGHT = 48;
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
function getStyles(
	selected: IDropdownOption<number>,
	personName: IDropdownOption<number>[],
	theme: Theme
) {
	return {
		fontWeight: personName.includes(selected)
			? theme.typography.fontWeightMedium
			: theme.typography.fontWeightRegular,
	};
}

interface IAddSubjectModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	subjectGroupId: number;
	subjectGroupMutator: KeyedMutator<any>;
}

const UpdateCurriculumModal = (props: IAddSubjectModalProps) => {
	const { open, setOpen, subjectGroupId, subjectGroupMutator } = props;
	const theme = useTheme();
	const { schoolId, sessionToken, selectedSchoolYearId } = useAppContext();
	const [specialisedSubjects, setSpecialisedSubjects] = useState<IDropdownOption<number>[]>([]);
	const [optionalSubjects, setOptionalSubjects] = useState<IDropdownOption<number>[]>([]);
	const [oldData, setOldData] = useState<ICurriculumDetailResponse | undefined>(undefined);
	const [isErrorShown, setIsErrorShown] = useState<boolean>(true);

	// Fetch data
	const { data: requiredSubjectsData, error: requiredError } = useFetchSubjectOptions({
		sessionToken: sessionToken,
		schoolId: schoolId,
		isRequired: true,
		schoolYearId: selectedSchoolYearId,
		pageIndex: 1,
		pageSize: 1000,
	});
	const { data: optionalSubjectsData, error: optionalError } = useFetchSubjectOptions({
		sessionToken: sessionToken,
		schoolId: schoolId,
		isRequired: false,
		schoolYearId: selectedSchoolYearId,
		pageIndex: 1,
		pageSize: 1000,
	});
	const { data: subjectGroupDetailData } = useFetchCurriculumDetails({
		sessionToken: sessionToken,
		subjectGroupId: subjectGroupId,
		schoolId: Number(schoolId),
		schoolYearId: selectedSchoolYearId,
	});

	const handleClose = () => {
		formik.handleReset(formik.initialValues);
		setOpen(false);
	};

	const handleFormSubmit = async (body: IUpdateCurriculumRequest) => {
		await useUpdateCurriculum({
			schoolId: Number(schoolId),
			schoolYearId: selectedSchoolYearId,
			formData: {
				...body,
				'is-deleted': false,
			} as IUpdateCurriculumRequest,
			sessionToken: sessionToken,
			subjectGroupId: subjectGroupId,
		});
		subjectGroupMutator();
		handleClose();
	};

	const formik = useFormik({
		initialValues: {
			'curriculum-name': '',
			'curriculum-code': '',
			grade: 0,
			'elective-subject-ids': [],
			'specialized-subject-ids': [],
		} as IUpdateCurriculumRequest,
		validationSchema: curriculumSchema,
		onSubmit: async (formData) => {
			// Add additional logic here
		},
		validateOnMount: true,
	});

	useEffect(() => {
		if ((optionalError || requiredError) && !isErrorShown && open) {
			useNotify({
				type: 'error',
				message:
					TRANSLATOR[optionalError?.message || requiredError?.message || ''] ??
					'Có lỗi xảy ra khi tải dữ liệu Khung chương trình',
			});
			setIsErrorShown(true);
		}
		if (requiredSubjectsData?.status === 200) {
			const requiredSubjects: IDropdownOption<number>[] = requiredSubjectsData.result.items.map(
				(subject: ISubjectOptionResponse) => ({
					label: subject['subject-name'],
					value: subject.id,
				})
			);
			setSpecialisedSubjects(requiredSubjects);
		}
		if (optionalSubjectsData?.status === 200) {
			const optionalSubjects: IDropdownOption<number>[] = optionalSubjectsData.result.items.map(
				(subject: ISubjectOptionResponse) => ({
					label: subject['subject-name'],
					value: subject.id,
				})
			);
			setOptionalSubjects(optionalSubjects);
		}
		if (subjectGroupDetailData?.status === 200) {
			setOldData({ ...subjectGroupDetailData?.result });
		}
		setIsErrorShown(false);
	}, [requiredSubjectsData, optionalSubjectsData, subjectGroupDetailData]);

	useEffect(() => {
		if (formik.values['elective-subject-ids'].length > 0) {
			const selectedSubjects: IDropdownOption<number>[] = optionalSubjects.filter((subject) =>
				formik.values['elective-subject-ids'].includes(subject.value)
			);
			if (requiredSubjectsData?.result.items ?? false) {
				const initialData: IDropdownOption<number>[] = requiredSubjectsData.result.items.map(
					(subject: ISubjectOptionResponse) => ({
						label: subject['subject-name'],
						value: subject.id,
					})
				);
				setSpecialisedSubjects([...initialData, ...selectedSubjects]);
			}
		}
	}, [formik.values['elective-subject-ids']]);

	useEffect(() => {
		if (oldData) {
			const electiveSubjectIds: Set<number> = new Set<number>();
			const specialisedSubjectIds: Set<number> = new Set<number>();
			oldData['subject-selective-views']?.map((item) => {
				const selectedId =
					optionalSubjects.find((subject) => subject.label === item['subject-name'])?.value ?? 0;
				if (selectedId !== 0) electiveSubjectIds.add(selectedId);
			});
			oldData['subject-specializedt-views']?.map((item) => {
				const selectedId =
					[...specialisedSubjects, ...optionalSubjects].find(
						(subject) => subject.label === item['subject-name']
					)?.value ?? 0;
				if (selectedId !== 0) specialisedSubjectIds.add(selectedId);
			});
			formik.setValues({
				'curriculum-name': oldData['curriculum-name'],
				'curriculum-code': oldData['curriculum-code'],
				grade: CLASSGROUP_TRANSLATOR[oldData.grade],
				'elective-subject-ids': Array.from(electiveSubjectIds),
				'specialized-subject-ids': Array.from(specialisedSubjectIds),
			});
		}
	}, [oldData, open]);

	const selectedElectiveLabels = useMemo(() => {
		return optionalSubjects
			.filter((item) => formik.values['elective-subject-ids'].includes(item.value))
			.map((item) => item.label)
			.join(', ');
	}, [formik.values['elective-subject-ids'], optionalSubjects]);

	const selectedSpecialisedLabels = useMemo(() => {
		return specialisedSubjects
			.filter((item) => formik.values['specialized-subject-ids'].includes(item.value))
			.map((item) => item.label)
			.join(', ');
	}, [formik.values['specialized-subject-ids'], specialisedSubjects]);

	return (
		<Modal
			disableEnforceFocus
			disableAutoFocus
			disableRestoreFocus
			open={open}
			onClose={handleClose}
			aria-labelledby='keep-mounted-modal-title'
			aria-describedby='keep-mounted-modal-description'
		>
			<Box sx={style}>
				<div
					id='modal-header'
					className='w-full h-fit flex flex-row justify-between items-center bg-primary-50 p-3 py-2'
				>
					<Typography
						variant='h6'
						component='h2'
						className='text-title-medium-strong font-normal opacity-60'
					>
						Cập nhật Khung chương trình
					</Typography>
					<IconButton onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</div>
				<form
					onSubmit={(event: any) => {
						event.preventDefault();
						handleFormSubmit(formik.values);
					}}
					className='w-full h-fit flex flex-col justify-start items-center'
				>
					<div className='w-full p-3 flex flex-col justify-start items-center gap-3'>
						<div className='w-full h-fit flex flex-row justify-between items-center'>
							<h3 className=' h-full flex justify-start pt-4'>Tên Khung chương trình</h3>
							<TextField
								className='w-[70%]'
								variant='standard'
								label='Nhập tên Khung chương trình'
								id='curriculum-name'
								name='curriculum-name'
								value={formik.values['curriculum-name']}
								onChange={formik.handleChange('curriculum-name')}
								onBlur={formik.handleBlur}
								error={
									formik.touched['curriculum-name'] && Boolean(formik.errors['curriculum-name'])
								}
								helperText={formik.touched['curriculum-name'] && formik.errors['curriculum-name']}
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
						</div>
						<div className='w-full h-fit flex flex-row justify-between items-center'>
							<h3 className=' h-full flex justify-start pt-4'>Mã Khung chương trình</h3>
							<TextField
								className='w-[70%]'
								variant='standard'
								label='Nhập mã Khung chương trình'
								id='curriculum-code'
								name='curriculum-code'
								value={formik.values['curriculum-code']}
								onChange={formik.handleChange('curriculum-code')}
								onBlur={formik.handleBlur}
								error={
									formik.touched['curriculum-code'] && Boolean(formik.errors['curriculum-code'])
								}
								helperText={formik.touched['curriculum-code'] && formik.errors['curriculum-code']}
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
						</div>
						<div className='w-full h-fit flex flex-row justify-between items-center'>
							<h3 className=' h-full flex justify-start '>Môn tự chọn</h3>
							<FormControl sx={{ width: '70%' }}>
								<InputLabel id='elective-label' variant='standard'>
									Thêm môn tự chọn
								</InputLabel>
								<Select
									labelId='elective-label'
									id='elective'
									multiple
									variant='standard'
									value={formik.values['elective-subject-ids']}
									onChange={(event) => {
										formik.setFieldValue('specialized-subject-ids', []);
										formik.setFieldValue('elective-subject-ids', event.target.value);
									}}
									onBlur={formik.handleBlur('elective-subject-ids')}
									error={
										formik.touched['elective-subject-ids'] &&
										Boolean(formik.errors['elective-subject-ids'])
									}
									MenuProps={MenuProps}
									sx={{ width: '100%' }}
									renderValue={() => selectedElectiveLabels}
								>
									{optionalSubjects?.length === 0 && (
										<MenuItem disabled value={0}>
											Không tìm thấy môn học
										</MenuItem>
									)}
									{optionalSubjects.map((item, index) => (
										<MenuItem
											key={item.label + index}
											value={item.value}
											style={getStyles(item, optionalSubjects, theme)}
										>
											<Checkbox
												checked={formik.values['elective-subject-ids'].indexOf(item.value) > -1}
											/>
											<ListItemText primary={item.label} />
										</MenuItem>
									))}
								</Select>
								{formik.touched['elective-subject-ids'] &&
									formik.errors['elective-subject-ids'] && (
										<FormHelperText error variant='standard'>
											{formik.errors['elective-subject-ids']}
										</FormHelperText>
									)}
							</FormControl>
						</div>
						<div className='w-full h-fit flex flex-row justify-between items-center'>
							<h3 className=' h-full flex justify-start '>Môn chuyên đề</h3>
							<FormControl sx={{ width: '70%' }}>
								<InputLabel id='specialised-label' variant='standard'>
									Thêm môn chuyên đề
								</InputLabel>
								<Select
									labelId='specialised-label'
									id='specialised'
									multiple
									variant='standard'
									value={formik.values['specialized-subject-ids']}
									onChange={(event) =>
										formik.setFieldValue('specialized-subject-ids', event.target.value)
									}
									onBlur={formik.handleBlur('specialized-subject-ids')}
									error={
										formik.touched['specialized-subject-ids'] &&
										Boolean(formik.errors['specialized-subject-ids'])
									}
									MenuProps={MenuProps}
									sx={{ width: '100%' }}
									renderValue={() => selectedSpecialisedLabels}
								>
									{specialisedSubjects?.length === 0 && (
										<MenuItem disabled value={0}>
											Không tìm thấy môn học
										</MenuItem>
									)}
									{specialisedSubjects.map((item, index) => (
										<MenuItem
											key={item.label + index}
											value={item.value}
											style={getStyles(item, optionalSubjects, theme)}
										>
											<Checkbox
												checked={formik.values['specialized-subject-ids'].indexOf(item.value) > -1}
											/>
											<ListItemText primary={item.label} />
										</MenuItem>
									))}
								</Select>
								{formik.touched['specialized-subject-ids'] &&
									formik.errors['specialized-subject-ids'] && (
										<FormHelperText error variant='standard'>
											{formik.errors['specialized-subject-ids']}
										</FormHelperText>
									)}
							</FormControl>
						</div>
						<div className='w-full h-fit flex flex-row justify-between items-center'>
							<h3 className=' h-full flex justify-start '>Khối áp dụng</h3>
							<FormControl sx={{ width: '70%' }}>
								<InputLabel id='grade-label' variant='standard'>
									Thêm khối áp dụng
								</InputLabel>
								<Select
									labelId='grade-label'
									id='grade'
									variant='standard'
									value={formik.values.grade}
									onChange={(event) => formik.setFieldValue('grade', event.target.value)}
									onBlur={formik.handleBlur('grade')}
									error={formik.touched.grade && Boolean(formik.errors.grade)}
									MenuProps={MenuProps}
									sx={{ width: '100%' }}
								>
									{CLASSGROUP_STRING_TYPE.map((item, index) => (
										<MenuItem key={item.key + index} value={item.value}>
											{item.key}
										</MenuItem>
									))}
								</Select>
								{formik.touched.grade && formik.errors.grade && (
									<FormHelperText error variant='standard'>
										{formik.errors.grade}
									</FormHelperText>
								)}
							</FormControl>
						</div>
					</div>
					<div className='w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover p-3'>
						<ContainedButton
							title='Huỷ'
							onClick={handleClose}
							disableRipple
							styles='!bg-basic-gray-active !text-basic-gray !py-1 px-4'
						/>
						<ContainedButton
							title='Cập nhật'
							disableRipple
							type='submit'
							disabled={!formik.isValid}
							styles='bg-primary-300 text-white !py-1 px-4'
						/>
					</div>
				</form>
			</Box>
		</Modal>
	);
};

export default UpdateCurriculumModal;
