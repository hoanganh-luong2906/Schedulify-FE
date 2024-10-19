'use client';

import SMHeader from '@/commons/school_manager/header';
import FilterListIcon from '@mui/icons-material/FilterList';
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

interface IClassTableData {
	id: number;
	className: string;
	classGroupName: string;
	homeroomName: string;
	studyPeriod: string;
	mainSeason: string;
}

function importRecord(props: IClassTableData): IClassTableData {
	const { id, className, classGroupName, homeroomName, studyPeriod, mainSeason } =
		props;
	return {
		id,
		className,
		classGroupName,
		homeroomName,
		studyPeriod,
		mainSeason,
	};
}

const classTableData: IClassTableData[] = [
	importRecord({
		id: 1,
		className: '6A1',
		classGroupName: '6',
		homeroomName: 'ThangNC',
		studyPeriod: '2024 - 2025',
		mainSeason: 'Sáng',
	}),
	importRecord({
		id: 2,
		className: '6A2',
		classGroupName: '6',
		homeroomName: 'MaiNHT',
		studyPeriod: '2024 - 2025',
		mainSeason: 'Chiều',
	}),
	importRecord({
		id: 3,
		className: '6A3',
		classGroupName: '6',
		homeroomName: 'AnhLH',
		studyPeriod: '2024 - 2025',
		mainSeason: 'Chiều',
	}),
	importRecord({
		id: 4,
		className: '7A1',
		classGroupName: '7',
		homeroomName: 'LongNT',
		studyPeriod: '2024 - 2025',
		mainSeason: 'Sáng',
	}),
	importRecord({
		id: 5,
		className: '7A1',
		classGroupName: '7',
		homeroomName: 'LongNT',
		studyPeriod: '2024 - 2025',
		mainSeason: 'Sáng',
	}),
	importRecord({
		id: 6,
		className: '7A1',
		classGroupName: '7',
		homeroomName: 'LongNT',
		studyPeriod: '2024 - 2025',
		mainSeason: 'Sáng',
	}),
	importRecord({
		id: 7,
		className: '7A1',
		classGroupName: '7',
		homeroomName: 'LongNT',
		studyPeriod: '2024 - 2025',
		mainSeason: 'Sáng',
	}),
	importRecord({
		id: 8,
		className: '7A1',
		classGroupName: '7',
		homeroomName: 'LongNT',
		studyPeriod: '2024 - 2025',
		mainSeason: 'Sáng',
	}),
	importRecord({
		id: 9,
		className: '7A1',
		classGroupName: '7',
		homeroomName: 'LongNT',
		studyPeriod: '2024 - 2025',
		mainSeason: 'Sáng',
	}),
	importRecord({
		id: 10,
		className: '7A1',
		classGroupName: '7',
		homeroomName: 'LongNT',
		studyPeriod: '2024 - 2025',
		mainSeason: 'Sáng',
	}),
	importRecord({
		id: 11,
		className: '7A1',
		classGroupName: '7',
		homeroomName: 'LongNT',
		studyPeriod: '2024 - 2025',
		mainSeason: 'Sáng',
	}),
	importRecord({
		id: 12,
		className: '7A1',
		classGroupName: '7',
		homeroomName: 'LongNT',
		studyPeriod: '2024 - 2025',
		mainSeason: 'Sáng',
	}),
];

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
): (
	a: { [key in Key]: number | string },
	b: { [key in Key]: number | string }
) => number {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
	disablePadding: boolean;
	id: keyof IClassTableData;
	label: string;
	centered: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'id' as keyof IClassTableData,
		centered: true,
		disablePadding: true,
		label: 'STT',
	},
	{
		id: 'className' as keyof IClassTableData,
		centered: false,
		disablePadding: false,
		label: 'Tên lớp',
	},
	{
		id: 'classGroupName' as keyof IClassTableData,
		centered: true,
		disablePadding: true,
		label: 'Tên khối',
	},
	{
		id: 'homeroomName' as keyof IClassTableData,
		centered: true,
		disablePadding: true,
		label: 'GVCN',
	},
	{
		id: 'studyPeriod' as keyof IClassTableData,
		centered: true,
		disablePadding: true,
		label: 'Năm học',
	},
	{
		id: 'mainSeason' as keyof IClassTableData,
		centered: true,
		disablePadding: true,
		label: 'Loại môn học',
	},
];

// For extrafunction of Table head (filter, sort, etc.)
interface EnhancedTableProps {
	onRequestSort: (
		event: React.MouseEvent<unknown>,
		property: keyof IClassTableData
	) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}
function EnhancedTableHead(props: EnhancedTableProps) {
	const { order, orderBy, rowCount, onRequestSort } = props;
	const createSortHandler =
		(property: keyof IClassTableData) => (event: React.MouseEvent<unknown>) => {
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
									sx={[
										visuallyHidden,
										{ position: 'absolute', zIndex: 10 },
									]}
								>
									{order === 'desc'
										? 'sorted descending'
										: 'sorted ascending'}
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

export default function SMClass() {
	const [order, setOrder] = React.useState<Order>('asc');
	const [orderBy, setOrderBy] = React.useState<keyof IClassTableData>('id');
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);

	const handleRequestSort = (
		event: React.MouseEvent<unknown>,
		property: keyof IClassTableData
	) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - classTableData.length) : 0;

	const visibleRows = React.useMemo(
		() =>
			[...classTableData]
				.sort(getComparator(order, orderBy))
				.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
		[order, orderBy, page, rowsPerPage]
	);

	return (
		<div className='w-[84%] h-screen flex flex-col justify-start items-start'>
			<SMHeader>
				<div>
					<h3 className='text-title-small text-white font-semibold tracking-wider'>
						Lớp học
					</h3>
				</div>
			</SMHeader>
			<div className='w-full h-fit flex flex-col justify-center items-center px-[15vw] pt-[5vh]'>
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
								Lớp học
							</h2>
							<Tooltip title='Filter list'>
								<IconButton>
									<FilterListIcon />
								</IconButton>
							</Tooltip>
						</Toolbar>
						<TableContainer>
							<Table
								sx={{ minWidth: 750 }}
								aria-labelledby='tableTitle'
								size='medium'
							>
								<EnhancedTableHead
									order={order}
									orderBy={orderBy}
									onRequestSort={handleRequestSort}
									rowCount={classTableData.length}
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
												sx={{ cursor: 'pointer' }}
											>
												<TableCell
													component='th'
													id={labelId}
													scope='row'
													padding='none'
													align='center'
												>
													{row.id}
												</TableCell>
												<TableCell align='left'>
													{row.className}
												</TableCell>
												<TableCell align='center'>
													{row.classGroupName}
												</TableCell>
												<TableCell align='center'>
													{row.homeroomName}
												</TableCell>
												<TableCell align='center'>
													{row.studyPeriod}
												</TableCell>
												<TableCell align='center'>
													<h2
														className={`font-semibold ${
															row.mainSeason === 'Chiều'
																? 'text-tertiary-normal'
																: 'text-primary-400'
														}`}
													>
														{row.mainSeason}
													</h2>
												</TableCell>
												<TableCell width={80}>
													<IconButton
														color='success'
														sx={{ zIndex: 10 }}
													>
														<Image
															src='/images/icons/menu.png'
															alt='notification-icon'
															unoptimized={true}
															width={20}
															height={20}
														/>
													</IconButton>
												</TableCell>
											</TableRow>
										);
									})}
									{emptyRows > 0 && (
										<TableRow
											style={{
												height: 40 * emptyRows,
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
							count={classTableData.length}
							rowsPerPage={rowsPerPage}
							page={page}
							onPageChange={handleChangePage}
							onRowsPerPageChange={handleChangeRowsPerPage}
						/>
					</Paper>
				</Box>
			</div>
		</div>
	);
}
