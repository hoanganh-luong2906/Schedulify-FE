import { CLASSGROUP_TRANSLATOR, TIMETABLE_SLOTS, WEEK_DAYS } from '@/utils/constants';
import DriveFileRenameOutlineSharpIcon from '@mui/icons-material/DriveFileRenameOutlineSharp';
import ListIcon from '@mui/icons-material/List';
import TableChartSharpIcon from '@mui/icons-material/TableChartSharp';
import {
	IconButton,
	Paper,
	styled,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	ToggleButton,
	ToggleButtonGroup,
	Toolbar,
	Tooltip,
	tooltipClasses,
	TooltipProps,
} from '@mui/material';
import { MouseEvent, useEffect, useMemo, useState } from 'react';
import useGetSlotDetails from '../_hooks/useGetSlotDetails';
import { ITeachersLessonsObject } from '../_libs/constants';
import FixedPeriodEditModal from './teachers_lessons_modal_edit';

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
	<Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: theme.palette.common.white,
		color: 'rgba(0, 0, 0, 0.87)',
		boxShadow: theme.shadows[1],
		fontSize: 15,
	},
}));

const getExistingSlot = (
	data: ITeachersLessonsObject[],
	slotId: number
): ITeachersLessonsObject | undefined => {
	const existingSlot: ITeachersLessonsObject | undefined = data.find((item) =>
		item.slots.includes(slotId)
	);
	return existingSlot;
};

interface EnhancedTableProps {
	numberOfSlots: number;
}
function EnhancedTableHead(props: EnhancedTableProps) {
	const { numberOfSlots } = props;
	return (
		<TableHead>
			<TableRow>
				<TableCell
					rowSpan={2}
					sx={{
						fontWeight: 'bold',
						borderRight: '1px solid #f0f0f0',
						borderLeft: '1px solid #f0f0f0',
						borderTop: '1px solid #f0f0f0',
					}}
				>
					Môn học
				</TableCell>
				<TableCell
					rowSpan={2}
					sx={{
						fontWeight: 'bold',
						borderRight: '1px solid #f0f0f0',
						borderLeft: '1px solid #f0f0f0',
						borderTop: '1px solid #f0f0f0',
					}}
				>
					Giáo viên
				</TableCell>
				<TableCell
					colSpan={numberOfSlots}
					sx={{
						fontWeight: 'bold',
						borderRight: '1px solid #f0f0f0',
						borderLeft: '1px solid #f0f0f0',
						borderTop: '1px solid #f0f0f0',
					}}
				>
					Tiết học
				</TableCell>
				<TableCell
					rowSpan={2}
					sx={{
						fontWeight: 'bold',
						borderRight: '1px solid #f0f0f0',
						borderLeft: '1px solid #f0f0f0',
						borderTop: '1px solid #f0f0f0',
					}}
				></TableCell>
			</TableRow>
			<TableRow>
				{Array.from({ length: numberOfSlots }, (_, index) => (
					<TableCell
						key={index}
						sx={{
							textAlign: 'center',
							fontWeight: 'bold',
							borderRight: '1px solid #f0f0f0',
							borderLeft: '1px solid #f0f0f0',
							borderTop: '1px solid #f0f0f0',
						}}
					>
						Tiết {index + 1}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

interface ITeachersLessonsTableProps {
	data: ITeachersLessonsObject[];
	maxSlot: number;
	homeroomTeacher: string;
	mainSession: number;
	isCombinationClass: boolean;
}

const TeachersLessonsTable = (props: ITeachersLessonsTableProps) => {
	const { data, maxSlot, homeroomTeacher, mainSession, isCombinationClass } = props;

	const [alignment, setAlignment] = useState<string>('list');
	const [isAssignModalOpen, setIsAssignModalOpen] = useState<boolean>(false);
	const [selectedObject, setSelectedObject] = useState<ITeachersLessonsObject>(
		{} as ITeachersLessonsObject
	);

	const handleChange = (event: MouseEvent<HTMLElement>, newAlignment: string) => {
		if (newAlignment !== null) {
			setAlignment(newAlignment);
		}
	};

	const handleOpenAssignModal = (object: ITeachersLessonsObject) => {
		setSelectedObject(object);
		setIsAssignModalOpen(true);
	};

	const sortedData = useMemo(() => {
		return data ? data.sort((a, b) => a.subjectName.localeCompare(b.subjectName)) : [];
	}, [data]);

	return (
		<div className='w-full h-fit flex justify-start items-center '>
			{alignment === 'list' && (
				<Paper sx={{ width: '100%', mb: 2 }}>
					<Toolbar>
						<div className='w-full flex flex-row justify-start items-baseline'>
							<ToggleButtonGroup
								color='primary'
								value={alignment}
								exclusive
								onChange={handleChange}
								aria-label='Platform'
								sx={{ height: 35 }}
							>
								<ToggleButton value='list'>
									<ListIcon sx={{ mr: 1 }} />
									Lịch
								</ToggleButton>
								<ToggleButton value='grid'>
									<TableChartSharpIcon fontSize='small' sx={{ mr: 1 }} />
									TKB
								</ToggleButton>
							</ToggleButtonGroup>
						</div>
						{!isCombinationClass ? (
							<div className='w-full h-[5vh] flex flex-row justify-end items-end gap-1'>
								<h3 className='text-body-medium opacity-80'>GVCN:</h3>
								<h2 className='text-body-medium-strong font-normal'>{homeroomTeacher}</h2>
							</div>
						) : (
							<div className='w-full h-[5vh] flex flex-row justify-end items-end gap-1'>
								<h3 className='text-body-medium opacity-80'>
									Khối {CLASSGROUP_TRANSLATOR[selectedObject.className ?? '']}:{' '}
								</h3>
								<h2 className='text-body-medium-strong font-normal'>
									{homeroomTeacher.split('|')[1] ??
										selectedObject.appliedClass?.map((item) => item.name).join(', ')}
								</h2>
							</div>
						)}
					</Toolbar>
					<TableContainer>
						<Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle' size='small'>
							<EnhancedTableHead numberOfSlots={maxSlot} />
							<TableBody>
								{sortedData.map((row, index) => (
									<TableRow key={index}>
										<TableCell>{row.subjectName}</TableCell>
										<TableCell>{row.teacherName}</TableCell>
										{Array.from({ length: maxSlot }, (_, index) => (
											<TableCell key={index} sx={{ textAlign: 'center' }}>
												<LightTooltip
													title={
														row.slots[index]
															? useGetSlotDetails(row.slots[index], false)
															: 'Tiết chưa xếp sẵn'
													}
													arrow
													placement='right'
												>
													{index < row.totalSlotPerWeek ? (
														<h3>
															{row.slots[index]
																? useGetSlotDetails(row.slots[index], true)
																: '- - -'}
														</h3>
													) : (
														<h3></h3>
													)}
												</LightTooltip>
											</TableCell>
										))}
										<TableCell width={50}>
											<IconButton onClick={() => handleOpenAssignModal(row)}>
												<DriveFileRenameOutlineSharpIcon />
											</IconButton>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</Paper>
			)}
			{alignment === 'grid' && (
				<Paper sx={{ width: '100%', mb: 2 }}>
					<Toolbar>
						<div className='w-full flex flex-row justify-start items-baseline'>
							<ToggleButtonGroup
								color='primary'
								value={alignment}
								exclusive
								onChange={handleChange}
								aria-label='Platform'
								sx={{ height: 35 }}
							>
								<ToggleButton value='list'>
									<ListIcon sx={{ mr: 1 }} />
									Lịch
								</ToggleButton>
								<ToggleButton value='grid'>
									<TableChartSharpIcon fontSize='small' sx={{ mr: 1 }} />
									TKB
								</ToggleButton>
							</ToggleButtonGroup>
						</div>
						{!isCombinationClass ? (
							<div className='w-full h-[5vh] flex flex-row justify-end items-end gap-1'>
								<h3 className='text-body-medium opacity-80'>GVCN:</h3>
								<h2 className='text-body-medium-strong font-normal'>{homeroomTeacher}</h2>
							</div>
						) : (
							<div className='w-full h-[5vh] flex flex-row justify-end items-end gap-1'>
								<h3 className='text-body-medium opacity-80'>
									Khối {CLASSGROUP_TRANSLATOR[selectedObject.className ?? '']}:{' '}
								</h3>
								<h2 className='text-body-medium-strong font-normal'>
									{homeroomTeacher.split('|')[1] ??
										selectedObject.appliedClass?.map((item) => item.name).join(', ')}
								</h2>
							</div>
						)}
					</Toolbar>
					<TableContainer component={Paper} sx={{ maxWidth: 900, margin: 'auto' }}>
						{/* <Table onMouseUp={handleMouseUp} size='small' onMouseLeave={handleMouseUp}> */}
						<Table size='small'>
							<TableHead>
								<TableRow>
									<TableCell align='center' sx={{ fontWeight: 'bold', width: 80 }}>
										Buổi
									</TableCell>
									<TableCell align='center' sx={{ fontWeight: 'bold', width: 80 }}>
										Tiết
									</TableCell>
									{WEEK_DAYS.map((day) => (
										<TableCell key={day} align='center' sx={{ fontWeight: 'bold' }}>
											{day}
										</TableCell>
									))}
								</TableRow>
							</TableHead>
							<TableBody>
								{TIMETABLE_SLOTS.map((session, sessionIndex) => (
									<>
										{session.slots.map((slot, slotIndex) => (
											<TableRow key={`${session.period}-${slot}`}>
												{slotIndex === 0 && (
													<TableCell
														rowSpan={session.slots.length}
														align='center'
														sx={{
															fontWeight: 'bold',
															border: '1px solid #ddd',
														}}
													>
														{session.period}
													</TableCell>
												)}
												<TableCell align='center'>{slot}</TableCell>
												{WEEK_DAYS.map((day: string, weekdayIndex: number) => {
													const cellId = weekdayIndex * 10 + sessionIndex * 5 + slotIndex + 1;
													const existingSlot = getExistingSlot(data, cellId);
													return (
														<TableCell
															key={cellId}
															align='center'
															sx={{
																// cursor: 'pointer',
																userSelect: 'none',
																border: '1px solid #ddd',
																':hover': {
																	backgroundColor: '#f0f0f0',
																},
																minWidth: 60,
																maxWidth: 60,
																minHeight: 40,
																height: 40,
																maxHeight: 40,
															}}
															// onClick={() =>
															// 	handleOpenAssignModal(
															// 		existingSlot ??
															// 			({} as ITeachersLessonsObject)
															// 	)
															// }
														>
															{existingSlot ? (
																<LightTooltip title={existingSlot.subjectName}>
																	<div className='w-full h-full flex flex-col justify-center items-center'>
																		<p className='w-full overflow-hidden text-ellipsis whitespace-nowrap font-semibold'>
																			{existingSlot.subjectName}
																		</p>
																		<p>{existingSlot.teacherName}</p>
																	</div>
																</LightTooltip>
															) : (
																'- - -'
															)}
														</TableCell>
													);
												})}
											</TableRow>
										))}
										{sessionIndex === 0 && (
											<TableRow key={sessionIndex}>
												<TableCell
													colSpan={WEEK_DAYS.length - 1}
													sx={{ maxHeight: 10, height: 10 }}
												></TableCell>
											</TableRow>
										)}
									</>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</Paper>
			)}
			<FixedPeriodEditModal
				open={isAssignModalOpen}
				setOpen={setIsAssignModalOpen}
				selectedObject={selectedObject}
				data={data}
				mainSession={mainSession}
				isClassCombination={isCombinationClass}
			/>
		</div>
	);
};

export default TeachersLessonsTable;
