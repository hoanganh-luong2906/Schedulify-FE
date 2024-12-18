'use client';

import AddIcon from '@mui/icons-material/Add';
import { Toolbar, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import Image from 'next/image';
import * as React from 'react';
import { KeyedMutator } from 'swr';
import { ISubjectTableData } from '../_libs/constants';
import CreateSubjectModal from './subject_modal_create';
import DeleteSubjectModal from './subject_modal_delete';
import UpdateSubjectModal from './subject_modal_update';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
	order: Order,
	orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
	disablePadding: boolean;
	id: keyof ISubjectTableData;
	label: string;
	centered: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'id' as keyof ISubjectTableData,
		centered: false,
		disablePadding: false,
		label: 'STT',
	},
	{
		id: 'subjectName' as keyof ISubjectTableData,
		centered: false,
		disablePadding: false,
		label: 'Tên môn học',
	},
	{
		id: 'subjectCode' as keyof ISubjectTableData,
		centered: false,
		disablePadding: false,
		label: 'Mã môn',
	},
	{
		id: 'subjectGroup' as keyof ISubjectTableData,
		centered: false,
		disablePadding: false,
		label: 'Tổ bộ môn',
	},
	{
		id: 'subjectType' as keyof ISubjectTableData,
		centered: true,
		disablePadding: true,
		label: 'Loại môn học',
	},
];

// For extrafunction of Table head (filter, sort, etc.)
interface EnhancedTableProps {
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof ISubjectTableData) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}
function EnhancedTableHead(props: EnhancedTableProps) {
	const { order, orderBy, rowCount, onRequestSort } = props;
	const createSortHandler =
		(property: keyof ISubjectTableData) => (event: React.MouseEvent<unknown>) => {
			onRequestSort(event, property);
		};

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.centered ? 'center' : 'left'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
						sortDirection={orderBy === headCell.id ? order : false}
						sx={[{ fontWeight: 'bold' }, headCell.centered ? { paddingLeft: '3%' } : {}]}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : 'asc'}
							onClick={createSortHandler(headCell.id)}
						>
							{headCell.label}
							{orderBy === headCell.id ? (
								<Box component='span' sx={[visuallyHidden, { position: 'absolute', zIndex: 10 }]}>
									{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
								</Box>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
				{/* <TableCell>
					<h2 className='font-semibold text-white'>CN</h2>
				</TableCell> */}
			</TableRow>
		</TableHead>
	);
}

interface ISubjectTableProps {
	subjectTableData: ISubjectTableData[];
	page: number;
	setPage: React.Dispatch<React.SetStateAction<number>>;
	rowsPerPage: number;
	setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
	totalRows?: number;
	mutate: KeyedMutator<any>;
	selectedSubjectId: number;
	setSelectedSubjectId: React.Dispatch<React.SetStateAction<number>>;
	isDetailsShown: boolean;
	setIsDetailsShown: React.Dispatch<React.SetStateAction<boolean>>;
	isUpdateModalOpen: boolean;
	setIsUpdateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SubjectTable = (props: ISubjectTableProps) => {
	const {
		subjectTableData,
		page,
		rowsPerPage,
		setPage,
		setRowsPerPage,
		totalRows,
		mutate,
		selectedSubjectId,
		setIsDetailsShown,
		isDetailsShown,
		setSelectedSubjectId,
		isUpdateModalOpen,setIsUpdateModalOpen,
	} = props;

	const [order, setOrder] = React.useState<Order>('asc');
	const [orderBy, setOrderBy] = React.useState<keyof ISubjectTableData>('subjectName');
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const [isAddModalOpen, setIsAddModalOpen] = React.useState<boolean>(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState<boolean>(false);
	const [selectedRow, setSelectedRow] = React.useState<ISubjectTableData | undefined>();

	const open = Boolean(anchorEl);

	const handleSelectSubject = (row: ISubjectTableData) => {
		setSelectedSubjectId(row.subjectKey);
		setIsDetailsShown(true);
	};

	const handleDeleteClick = (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		row: ISubjectTableData
	) => {
		event.stopPropagation();
		setSelectedRow(row);
		setIsDeleteModalOpen(true);
	};

	const handleAddSubject = () => {
		setIsAddModalOpen(true);
	};

	const handleRequestSort = (
		event: React.MouseEvent<unknown>,
		property: keyof ISubjectTableData
	) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value));
	};

	const emptyRows =
		subjectTableData.length < rowsPerPage && rowsPerPage < 10
			? rowsPerPage - subjectTableData.length + 1
			: 0;

	const visibleRows = React.useMemo(
		() => [...subjectTableData].sort(getComparator(order, orderBy)),
		[order, orderBy, page, rowsPerPage]
	);
	return (
		<div className='w-full h-fit flex flex-col justify-center items-center px-5 pt-[5vh]'>
			<Box sx={{ width: '100%' }}>
				<Paper sx={{ width: '100%', mb: 2 }}>
					<Toolbar
						sx={[
							{
								pl: { sm: 2 },
								pr: { xs: 4, sm: 4 },
								width: '100%',
							},
						]}
					>
						<h2 className='text-title-medium-strong font-semibold w-full text-left'>Môn học</h2>
						<Tooltip title='Thêm Môn học'>
							<IconButton onClick={handleAddSubject}>
								<AddIcon />
							</IconButton>
						</Tooltip>
					</Toolbar>
					<TableContainer>
						<Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle' size='medium'>
							<EnhancedTableHead
								order={order}
								orderBy={orderBy}
								onRequestSort={handleRequestSort}
								rowCount={subjectTableData.length}
							/>
							<TableBody>
								{visibleRows.map((row, index) => {
									const labelId = `enhanced-table-checkbox-${index}`;

									return (
										<TableRow
											hover
											role='checkbox'
											tabIndex={-1}
											key={row.id}
											sx={[
												{ cursor: 'pointer' },
												selectedSubjectId === row.id &&
													isDetailsShown && {
														backgroundColor: '#f5f5f5',
													},
											]}
											onClick={() => handleSelectSubject(row)}
										>
											<TableCell
												component='th'
												id={labelId}
												scope='row'
												padding='normal'
												align='left'
											>
												{index + 1 + page * rowsPerPage}
											</TableCell>
											<TableCell
												align='left'
												width={250}
												sx={{
													whiteSpace: 'nowrap',
													overflow: 'hidden',
													textOverflow: 'ellipsis',
												}}
											>
												{row.subjectName}
											</TableCell>
											<TableCell align='left'>{row.subjectCode}</TableCell>
											<TableCell align='left' width={130}>
												{row.subjectGroup}
											</TableCell>
											<TableCell align='center' width={150}>
												<h2
													className={`font-semibold ${
														row.subjectType === 'Bắt buộc'
															? 'text-tertiary-normal'
															: 'text-primary-400'
													}`}
												>
													{row.subjectType}
												</h2>
											</TableCell>
											<TableCell width={80}>
												<IconButton
													color='success'
													sx={{ zIndex: 10 }}
													id={`basic-button${row.subjectCode + index}`}
													aria-controls={open ? `basic-menu${index}` : undefined}
													aria-haspopup='true'
													aria-expanded={open ? 'true' : undefined}
													onClick={(event) => handleDeleteClick(event, row)}
												>
													<Image
														src='/images/icons/delete.png'
														alt='notification-icon'
														unoptimized={true}
														width={18}
														height={18}
													/>
												</IconButton>
											</TableCell>
										</TableRow>
									);
								})}
								{emptyRows > 0 && (
									<TableRow
										style={{
											height: 50 * emptyRows,
										}}
									>
										<TableCell colSpan={6} />
									</TableRow>
								)}
							</TableBody>
						</Table>
					</TableContainer>
					<TablePagination
						rowsPerPageOptions={[5, 10, 25]}
						component='div'
						count={totalRows ?? subjectTableData.length}
						rowsPerPage={rowsPerPage}
						page={page}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
				</Paper>
			</Box>
			<CreateSubjectModal open={isAddModalOpen} setOpen={setIsAddModalOpen} mutate={mutate} />
			<DeleteSubjectModal
				open={isDeleteModalOpen}
				setOpen={setIsDeleteModalOpen}
				subjectName={selectedRow?.subjectName ?? 'Không xác định'}
				subjectId={selectedRow?.subjectKey ?? 0}
				mutate={mutate}
			/>
			<UpdateSubjectModal
				open={isUpdateModalOpen}
				setOpen={setIsUpdateModalOpen}
				subjectId={selectedSubjectId ?? 0}
				mutate={mutate}
			/>
		</div>
	);
};

export default SubjectTable;
