import * as React from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Tooltip,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import { IDepartment, ITeacherTableData } from "../_libs/constants";
import DeleteConfirmationModal from "./delete_teacher";
import Image from "next/image";
import AddIcon from "@mui/icons-material/Add";
import { ICommonOption, TEACHER_STATUS_TRANSLATOR } from "@/utils/constants";
import UpdateTeacherModal from "./update_teacher";
import { KeyedMutator } from "swr";
import AddTeacherModal from "./add_teacher";
import { useRouter } from "next/navigation";

//Teacher's data table

function descendingComparator<T>(a: T, b: T, orderBy: keyof T): number {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  id: keyof ITeacherTableData;
  label: string;
  centered: boolean;
}
const headCells: readonly HeadCell[] = [
  {
    id: "id" as keyof ITeacherTableData,
    centered: false,
    label: "STT",
  },
  {
    id: "teacherName" as keyof ITeacherTableData,
    centered: false,
    label: "Tên giáo viên",
  },
  {
    id: "nameAbbreviation" as keyof ITeacherTableData,
    centered: false,
    label: "Mã giáo viên",
  },
  {
    id: "subjectDepartment" as keyof ITeacherTableData,
    centered: false,
    label: "Tên bộ môn",
  },
  {
    id: "teachableSubjects" as keyof ITeacherTableData,
    centered: false,
    label: "Dạy môn",
  },
  {
    id: "email" as keyof ITeacherTableData,
    centered: false,
    label: "Email",
  },
  {
    id: "phoneNumber" as keyof ITeacherTableData,
    centered: false,
    label: "Số điện thoại",
  },
  {
    id: "status" as keyof ITeacherTableData,
    centered: true,
    label: "Trạng thái",
  },
];

interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof ITeacherTableData
  ) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, rowCount, onRequestSort } = props;
  const createSortHandler =
    (property: keyof ITeacherTableData) =>
    (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.centered ? "center" : "left"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{
              fontWeight: "bold",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {headCell.id === "teacherName" ? (
              <span>{headCell.label}</span>
            ) : (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(
                  headCell.id as keyof ITeacherTableData
                )}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
        <TableCell>
          <h2 className="font-semibold text-white"></h2>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

interface ITeacherTableProps {
  teacherTableData: ITeacherTableData[];
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  rowsPerPage: number;
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
  totalRows?: number;
  mutate: KeyedMutator<any>;
  isFilterable: boolean;
  setIsFilterable: React.Dispatch<React.SetStateAction<boolean>>;
}

const TeacherTable = (props: ITeacherTableProps) => {
  const {
    teacherTableData,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    totalRows,
    mutate,
    isFilterable,
    setIsFilterable,
  } = props;

  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] =
    React.useState<keyof ITeacherTableData>("teacherName");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openAddForm, setOpenAddForm] = React.useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState<boolean>(false);
  const [openUpdateModal, setOpenUpdateModal] = React.useState<boolean>(false);
  const [selectedRow, setSelectedRow] = React.useState<
    ITeacherTableData | undefined
  >();
  const open = Boolean(anchorEl);
  const router = useRouter();

  const handleRowClick = (teacherId: number) => {
    router.push(`/teacher-management/detail?id=${teacherId}`);
  };

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    row: ITeacherTableData
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof ITeacherTableData
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleMenuItemClick = (index: number, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    switch (index) {
      case 0:
        setOpenDeleteModal(true);
        break;
      default:
        break;
    }
    setAnchorEl(null);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value));
  };

  const visibleRows = React.useMemo(
    () => [...teacherTableData].sort(getComparator(order, orderBy)),
    [order, orderBy, page, rowsPerPage, teacherTableData]
  );

  const emptyRows =
    teacherTableData.length < rowsPerPage && rowsPerPage < 10
      ? rowsPerPage - teacherTableData.length + 1
      : 0;

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenAddForm = () => setOpenAddForm(true);

  const handleFilterable = () => {
    setIsFilterable(!isFilterable);
  };

  const handleDeleteClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    row: ITeacherTableData
  ) => {
    event.stopPropagation();
    setSelectedRow(row);
    setOpenDeleteModal(true);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2,         
      "& .MuiDialog-paper": {
          overflowX: "auto"
        }}}>
        <Toolbar
          sx={[
            {
              pl: { sm: 2 },
              pr: { xs: 1, sm: 1 },
              width: "100%",
            },
          ]}
        >
          <h2 className="text-title-medium-strong font-semibold w-full text-left">
            Danh sách giáo viên
          </h2>
          <Tooltip title="Thêm giáo viên">
            <IconButton onClick={handleOpenAddForm}>
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Lọc danh sách">
            <IconButton onClick={handleFilterable}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
        <TableContainer
          sx={{
            "&::-webkit-scrollbar": {
              display: "none",
            },
            "-ms-overflow-style": "none",
            scrollbarWidth: "none",
          }}
        >
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={teacherTableData.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <TableRow
                    hover
                    onClick={() => handleRowClick(row.id)}
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      align="left"
                    >
                      {index + 1 + page * rowsPerPage}
                    </TableCell>
                    <TableCell align="left">{row.teacherName}</TableCell>
                    <TableCell align="left">{row.nameAbbreviation}</TableCell>
                    <TableCell align="left">{row.subjectDepartment}</TableCell>
                    <TableCell align="left">{row.teachableSubjects}</TableCell>
                    <TableCell align="left">{row.email}</TableCell>
                    <TableCell align="left">{row.phoneNumber}</TableCell>
                    <TableCell align="left">
                      <div className="w-full h-full flex justify-center items-center">
                        <div
                          className={`w-fit h-fit px-[6%] py-[2%] rounded-[5px] font-semibold 
                          ${
                            row.status === 1
                              ? "bg-basic-positive-hover text-basic-positive"
                              : row.status === 5 || row.status === 4
                              ? "bg-basic-negative-hover text-basic-negative"
                              : "bg-basic-gray-hover text-basic-gray"
                          }`}
                          style={{ whiteSpace: "nowrap" }}
                        >
                          {TEACHER_STATUS_TRANSLATOR[row.status]}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell width={80}>
                      <IconButton
                        color="error"
                        sx={{ zIndex: 10 }}
                        onClick={(event) => handleDeleteClick(event, row)}
                      >
                        <Image
                          src="/images/icons/delete.png"
                          alt="Xóa giáo viên"
                          width={15}
                          height={15}
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
                  <TableCell colSpan={8} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          labelRowsPerPage="Số hàng"
          labelDisplayedRows={({ from, to, count }) =>
            `${from} - ${to} của ${count !== -1 ? count : `hơn ${to}`}`
          }
          count={totalRows ?? teacherTableData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <DeleteConfirmationModal
        open={openDeleteModal}
        onClose={setOpenDeleteModal}
        teacherName={selectedRow?.teacherName ?? "Không xác định"}
        teacherId={selectedRow?.id ?? 0}
        mutate={mutate}
      />
      <AddTeacherModal
        open={openAddForm}
        onClose={setOpenAddForm}
        mutate={mutate}
      />
      <UpdateTeacherModal
        open={openUpdateModal}
        onClose={setOpenUpdateModal}
        teacherId={selectedRow?.id ?? 0}
        mutate={mutate}
      />
    </Box>
  );
};
export default TeacherTable;
