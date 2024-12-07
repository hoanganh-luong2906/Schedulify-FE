import { IDropdownOption } from '@/app/(school-manager)/_utils/contants';
import {
	Button,
	Checkbox,
	Collapse,
	FormControl,
	InputLabel,
	ListItemText,
	MenuItem,
	Paper,
	Select,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Theme,
	Typography,
	useTheme,
} from '@mui/material';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import { TIMETABLE_SLOTS, WEEK_DAYS } from '@/utils/constants';

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

interface CellState {
	selected: boolean;
}

interface ITeacherUnavailableSelectorProps {
	data: IDropdownOption<number>[];
	selectedTeacherIds: number[];
	setSelectedTeacherIds: Dispatch<SetStateAction<number[]>>;
}

const TeacherUnavailableSelector = (props: ITeacherUnavailableSelectorProps) => {
	const { data, selectedTeacherIds, setSelectedTeacherIds } = props;
	const theme = useTheme();

	const [isSelecting, setIsSelecting] = useState(false);
	const [selectedCells, setSelectedCells] = useState<{ [key: string]: CellState }>({});

	const handleMouseDown = (cellId: string) => {
		setIsSelecting(true);
		setSelectedCells((prev) => ({
			...prev,
			[cellId]: { selected: !prev[cellId]?.selected },
		}));
	};

	const handleMouseEnter = (cellId: string) => {
		if (isSelecting) {
			setSelectedCells((prev) => {
				const newSelectedCells = { ...prev };

				// Nếu cellId đã tồn tại thì xóa nó khỏi object
				if (cellId in newSelectedCells) {
					delete newSelectedCells[cellId];
				} else {
					// Nếu cellId chưa tồn tại thì thêm vào
					newSelectedCells[cellId] = { selected: true };
				}

				return newSelectedCells;
			});
		}
	};

	const handleMouseUp = () => {
		setIsSelecting(false);
	};

	const handleSelectTeachers = (teacherId: number) => {
		if (selectedTeacherIds.includes(teacherId)) {
			setSelectedTeacherIds(selectedTeacherIds.filter((id) => id !== teacherId));
		} else {
			setSelectedTeacherIds([...selectedTeacherIds, teacherId]);
		}
	};

	const selectedTeachersLabels = useMemo(() => {
		return data
			.filter((item) => selectedTeacherIds.includes(item.value))
			.map((item) => item.label)
			.join(', ');
	}, [data, selectedTeacherIds]);

	return (
		<div className='w-[60%] h-[90vh] border-r-1 border-basic-gray-active px-[2vw] pt-[5vh] flex flex-col justify-start items-start gap-5'>
			<div
				id='teacher-selector'
				className='w-full h-[5vh] flex flex-row justify-between items-baseline'
			>
				<FormControl sx={{ width: '50%' }}>
					<InputLabel id='teacher-selector-label' variant='standard'>
						Chọn giáo viên áp dụng
					</InputLabel>
					<Select
						labelId='teacher-selector-label'
						id='teacher-selector-select'
						variant='standard'
						value={selectedTeacherIds}
						multiple
						onChange={(e) => handleSelectTeachers(Number(e.target.value))}
						MenuProps={MenuProps}
						sx={{ width: '100%' }}
						renderValue={() => selectedTeachersLabels}
					>
						{data.length === 0 && (
							<MenuItem disabled value={0}>
								Không tìm thấy môn học
							</MenuItem>
						)}
						{data.map((option: IDropdownOption<number>, index: number) => (
							<MenuItem
								key={option.label + index}
								value={option.value}
								style={getStyles(option, data, theme)}
							>
								<Checkbox checked={selectedTeacherIds.indexOf(option.value) > -1} />
								<ListItemText primary={option.label} />
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<Button
					variant='contained'
					// onClick={handleQuickAssign}
					color='inherit'
					// disabled={selectedCurriculumId === 0}
					sx={{
						bgcolor: '#175b8e',
						color: 'white',
						borderRadius: 0,
						width: 150,
						boxShadow: 'none',
					}}
				>
					Lưu thay đổi
				</Button>
			</div>
			<div className='w-full h-fit select-none'>
				<TableContainer
					component={Paper}
					sx={{ maxWidth: 900, margin: 'auto', marginTop: 5 }}
				>
					<Table onMouseUp={handleMouseUp} size='small'>
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
							{TIMETABLE_SLOTS.map((session, i) => (
								<>
									{session.slots.map((slot, index) => (
										<TableRow key={`${session.period}-${slot}`}>
											{index === 0 && (
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
											{WEEK_DAYS.map((day) => {
												const cellId = `${day}-${session.period}-${slot}`;
												const isSelected =
													selectedCells[cellId]?.selected || false;
												return (
													<TableCell
														key={cellId}
														align='center'
														sx={{
															backgroundColor: isSelected
																? '#E0E0E0'
																: 'transparent',
															cursor: 'pointer',
															userSelect: 'none',
															border: '1px solid #ddd',
														}}
														onMouseDown={() => handleMouseDown(cellId)}
														onMouseEnter={() =>
															handleMouseEnter(cellId)
														}
													>
														<Collapse in={isSelected} timeout={200}>
															<Typography fontSize={13}>
																<ClearIcon
																	fontSize='small'
																	sx={{ opacity: 0.6 }}
																/>
															</Typography>
														</Collapse>
													</TableCell>
												);
											})}
										</TableRow>
									))}
									{i === 0 && (
										<TableRow key={i}>
											<TableCell colSpan={WEEK_DAYS.length - 1}></TableCell>
										</TableRow>
									)}
								</>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</div>
		</div>
	);
};

export default TeacherUnavailableSelector;
