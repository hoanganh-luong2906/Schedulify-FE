'use client';

import useNotify from '@/hooks/useNotify';
import { CLASSGROUP_STRING_TYPE, ICommonOption } from '@/utils/constants';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Menu, MenuItem, Toolbar, Tooltip } from '@mui/material';
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
import { ISubjectGroupTableData } from '../_libs/constants';
import UpdateSubjectGroupModal from './subject-group_update_modal';
import ApplySubjectGroupModal from './subject_group_apply_modal';
import CreateSubjectGroupModal from './subject_group_create_modal';
import DeleteSubjectGroupModal from './subject_group_delete_modal';

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
	id: keyof ISubjectGroupTableData;
	label: string;
	centered: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'id' as keyof ISubjectGroupTableData,
		centered: false,
		disablePadding: false,
		label: 'STT',
	},
	{
		id: 'subjectGroupName' as keyof ISubjectGroupTableData,
		centered: false,
		disablePadding: false,
		label: 'Tên khối',
	},
	{
		id: 'subjectGroupCode' as keyof ISubjectGroupTableData,
		centered: false,
		disablePadding: false,
		label: 'Mã tổ hợp',
	},
	{
		id: 'grade' as keyof ISubjectGroupTableData,
		centered: false,
		disablePadding: false,
		label: 'Khối áp dụng',
	},
];

// For extrafunction of Table head (filter, sort, etc.)
interface EnhancedTableProps {
	onRequestSort: (
		event: React.MouseEvent<unknown>,
		property: keyof ISubjectGroupTableData
	) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}
function EnhancedTableHead(props: EnhancedTableProps) {
	const { order, orderBy, rowCount, onRequestSort } = props;
	const createSortHandler =
		(property: keyof ISubjectGroupTableData) => (event: React.MouseEvent<unknown>) => {
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
						sx={[
							{ fontWeight: 'bold' },
							headCell.centered ? { paddingLeft: '3%' } : {},
						]}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : 'asc'}
							onClick={createSortHandler(headCell.id)}
						>
							{headCell.label}
							{orderBy === headCell.id ? (
								<Box
									component='span'
									sx={[visuallyHidden, { position: 'absolute', zIndex: 10 }]}
								>
									{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
								</Box>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
				<TableCell>
					<h2 className='font-semibold text-white'>CN</h2>
				</TableCell>
			</TableRow>
		</TableHead>
	);
}

interface ISubjectGroupTableProps {
	subjectGroupTableData: ISubjectGroupTableData[];
	page: number;
	setPage: React.Dispatch<React.SetStateAction<number>>;
	rowsPerPage: number;
	setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
	totalRows?: number;
	mutate: KeyedMutator<any>;
	isFilterable: boolean;
	setIsFilterable: React.Dispatch<React.SetStateAction<boolean>>;
	selectedSubjectGroupId: number;
	setSelectedSubjectGroupId: React.Dispatch<React.SetStateAction<number>>;
	isOpenViewDetails: boolean;
	setOpenViewDetails: React.Dispatch<React.SetStateAction<boolean>>;
}

const dropdownOptions: ICommonOption[] = [
	{ img: '/images/icons/compose.png', title: 'Chỉnh sửa thông tin' },
	{ img: '/images/icons/checklist.png', title: 'Áp dụng Tổ hợp môn' },
	{ img: '/images/icons/delete.png', title: 'Xóa Tổ hợp môn' },
];

const GRADE_COLOR: { [key: number]: string } = {
	10: '#ff6b35',
	11: 'black',
	12: '#004e89',
};
const SubjectGroupTable = (props: ISubjectGroupTableProps) => {
	const {
		subjectGroupTableData,
		page,
		rowsPerPage,
		setPage,
		setRowsPerPage,
		totalRows,
		mutate,
		isFilterable,
		setIsFilterable,
		selectedSubjectGroupId,
		setSelectedSubjectGroupId,
		isOpenViewDetails,
		setOpenViewDetails,
	} = props;

	const [order, setOrder] = React.useState<Order>('asc');
	const [orderBy, setOrderBy] = React.useState<keyof ISubjectGroupTableData>('grade');
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const [isAddModalOpen, setIsAddModalOpen] = React.useState<boolean>(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState<boolean>(false);
	const [iUpdateModalOpen, setIUpdateModalOpen] = React.useState<boolean>(false);
	const [iApplyModalOpen, setIApplyModalOpen] = React.useState<boolean>(false);
	const [selectedRow, setSelectedRow] = React.useState<ISubjectGroupTableData | undefined>();

	const open = Boolean(anchorEl);

	const handleFilterable = () => {
		setIsFilterable(!isFilterable);
	};

	const handleClick = (
		event: React.MouseEvent<HTMLButtonElement>,
		row: ISubjectGroupTableData
	) => {
		setAnchorEl((event.target as HTMLElement) ?? null);
		setSelectedRow(row);
	};

	const handleMenuItemClick = (index: number) => {
		switch (index) {
			case 0:
				setIUpdateModalOpen(true);
				break;
			case 1:
				setIApplyModalOpen(true);
				break;
			case 2:
				setIsDeleteModalOpen(true);
				break;
			default:
				useNotify({
					message: 'Chức năng đang được phát triển',
					type: 'warning',
				});
				break;
		}
		setAnchorEl(null);
	};

	const handleViewDetails = (row: ISubjectGroupTableData) => {
		setSelectedSubjectGroupId(row.subjectGroupKey);
		setOpenViewDetails(true);
	};

	const handleAddSubject = () => {
		setIsAddModalOpen(true);
	};

	const handleRequestSort = (
		event: React.MouseEvent<unknown>,
		property: keyof ISubjectGroupTableData
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
		subjectGroupTableData.length < rowsPerPage && rowsPerPage < 10
			? rowsPerPage - subjectGroupTableData.length + 1
			: 0;

	const visibleRows = React.useMemo(
		() => [...subjectGroupTableData].sort(getComparator(order, orderBy)),
		[order, orderBy, page, rowsPerPage]
	);
	return (
		<div className='w-full h-fit flex flex-row justify-center items-center gap-6 px-1 pt-[2vh]'>
			<Box sx={{ width: '100%' }}>
				<Paper sx={{ width: '100%', mb: 2 }}>
					<Toolbar
						sx={[
							{
								pl: { sm: 2 },
								pr: { xs: 1, sm: 1 },
								width: '100%',
							},
						]}
					>
						<h2 className='text-title-medium-strong font-semibold w-full text-left'>
							Tổ hợp môn
						</h2>
						<div className='w-fit h-fit flex flex-row justify-center items-center'>
							<Tooltip title='Thêm Môn học'>
								<IconButton onClick={handleAddSubject}>
									<AddIcon />
								</IconButton>
							</Tooltip>
							<Tooltip title='Lọc danh sách'>
								<IconButton onClick={handleFilterable}>
									<FilterListIcon />
								</IconButton>
							</Tooltip>
						</div>
					</Toolbar>
					<TableContainer>
						<Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle' size='medium'>
							<EnhancedTableHead
								order={order}
								orderBy={orderBy}
								onRequestSort={handleRequestSort}
								rowCount={subjectGroupTableData.length}
							/>
							<TableBody>
								{visibleRows.length === 0 && (
									<TableRow>
										<TableCell colSpan={6} align='center'>
											<h1 className='text-body-large-strong italic text-basic-gray'>
												Tổ hợp chưa có dữ liệu
											</h1>
										</TableCell>
									</TableRow>
								)}
								{visibleRows.map((row, index) => {
									const labelId = `enhanced-table-checkbox-${index}`;

									return (
										<TableRow
											hover
											role='checkbox'
											tabIndex={-1}
											key={row.id}
											sx={[
												{ userSelect: 'none' },
												selectedSubjectGroupId === row.subjectGroupKey &&
													isOpenViewDetails && {
														backgroundColor: '#f5f5f5',
													},
											]}
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
												width={300}
												sx={{
													whiteSpace: 'nowrap',
													overflow: 'hidden',
													textOverflow: 'ellipsis',
													cursor: 'pointer',
												}}
												onClick={() => handleViewDetails(row)}
											>
												{row.subjectGroupName}
											</TableCell>
											<TableCell align='left'>
												{row.subjectGroupCode
													? row.subjectGroupCode
													: '- - - - -'}
											</TableCell>
											<TableCell
												align='left'
												width={200}
												className='!font-semibold'
												sx={{ color: GRADE_COLOR[row.grade] }}
											>
												{row.grade > 0
													? CLASSGROUP_STRING_TYPE.find(
															(item) => item.value === row.grade
													  )?.key
													: '- - -'}
											</TableCell>
											<TableCell width={80}>
												<IconButton
													color='success'
													sx={{ zIndex: 10 }}
													id={`basic-button${
														row.subjectGroupCode + index
													}`}
													aria-controls={
														open ? `basic-menu${index}` : undefined
													}
													aria-haspopup='true'
													aria-expanded={open ? 'true' : undefined}
													onClick={(event) => handleClick(event, row)}
												>
													<Image
														src='/images/icons/menu.png'
														alt='notification-icon'
														unoptimized={true}
														width={20}
														height={20}
													/>
												</IconButton>
												<Menu
													id={row.subjectGroupCode + 'menu' + index}
													anchorEl={anchorEl}
													elevation={1}
													open={open}
													onClose={() => setAnchorEl(null)}
													MenuListProps={{
														'aria-labelledby': `${
															row.subjectGroupCode + 'menu' + index
														}`,
													}}
												>
													{dropdownOptions.map((option, i) => (
														<MenuItem
															key={option.title + i}
															onClick={() => handleMenuItemClick(i)}
															className={`flex flex-row items-center ${
																i === dropdownOptions.length - 1 &&
																'hover:bg-basic-negative-hover hover:text-basic-negative'
															}`}
														>
															<Image
																className='mr-4'
																src={option.img}
																alt={option.title}
																width={15}
																height={15}
															/>
															<h2 className='text-body-medium'>
																{option.title}
															</h2>
														</MenuItem>
													))}
												</Menu>
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
						labelRowsPerPage='Số hàng'
						labelDisplayedRows={({ from, to, count }) =>
							`${from} - ${to} của ${count !== -1 ? count : `hơn ${to}`}`
						}
						count={totalRows ?? subjectGroupTableData.length}
						rowsPerPage={rowsPerPage}
						page={page}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
				</Paper>
			</Box>
			<CreateSubjectGroupModal
				open={isAddModalOpen}
				setOpen={setIsAddModalOpen}
				subjectGroupMutator={mutate}
			/>
			<DeleteSubjectGroupModal
				open={isDeleteModalOpen}
				setOpen={setIsDeleteModalOpen}
				subjectGroupName={selectedRow?.subjectGroupCode ?? 'Không xác định'}
				subjectGroupId={selectedRow?.subjectGroupKey ?? 0}
				mutate={mutate}
			/>
			<UpdateSubjectGroupModal
				open={iUpdateModalOpen}
				setOpen={setIUpdateModalOpen}
				subjectGroupId={selectedRow?.subjectGroupKey ?? 0}
				subjectGroupMutator={mutate}
			/>
			<ApplySubjectGroupModal
				open={iApplyModalOpen}
				setOpen={setIApplyModalOpen}
				grade={selectedRow?.grade.toString() ?? '0'}
				subjectGroupName={selectedRow?.subjectGroupName ?? 'Không xác định'}
				subjectGroupId={selectedRow?.subjectGroupKey ?? 0}
			/>
		</div>
	);
};

export default SubjectGroupTable;
