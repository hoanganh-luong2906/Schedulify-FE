"use client";

import { useAppContext } from "@/context/app_provider";
import useNotify from "@/hooks/useNotify";
import {
  IScheduleResponse,
  SCHEDULE_STATUS,
  SCHEDULE_STATUS_TRANSLATOR,
} from "@/utils/constants";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { FormControl, MenuItem, Select } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import { alpha } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import { visuallyHidden } from "@mui/utils";
import { useRouter } from "next/navigation";
import * as React from "react";
import { KeyedMutator } from "swr";
import { publishTimetable, updateTimetableStatus } from "../_libs/apiTimetable";
import { ITimetableTableData } from "../_libs/constants";
import { firestore } from "@/utils/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import dayjs from "dayjs";
import ConfirmStatusModal from "./confirm_status_modal";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
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
  disablePadding: boolean;
  id: keyof ITimetableTableData;
  label: string;
  centered: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "timetableCode",
    centered: true,
    disablePadding: false,
    label: "Mã TKB",
  },
  {
    id: "timetableName",
    centered: false,
    disablePadding: false,
    label: "Tên TKB",
  },
  {
    id: "termName",
    centered: true,
    disablePadding: false,
    label: "Học kỳ",
  },
  {
    id: "generatedDate",
    centered: true,
    disablePadding: false,
    label: "Ngày tạo",
  },
  {
    id: "status",
    centered: true,
    disablePadding: false,
    label: "Trạng thái",
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof ITimetableTableData
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler =
    (property: keyof ITimetableTableData) =>
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
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ fontWeight: "bold", paddingLeft: "3%" }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box
                  component="span"
                  sx={[visuallyHidden, { position: "absolute", zIndex: 10 }]}
                >
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props;
  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        },
      ]}
    >
      {numSelected > 0 ? (
        <h2 className="text-title-medium-strong font-semibold w-full text-left flex justify-start items-center gap-1">
          Thời khóa biểu{" "}
          <p className="text-body-medium pt-[2px]">(đã chọn {numSelected})</p>
        </h2>
      ) : (
        <h2 className="text-title-medium-strong font-semibold w-full text-left">
          Thời khóa biểu
        </h2>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Xóa">
          <IconButton color="error">
            <DeleteIcon color="error" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Lọc">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

interface TimetableTableProps {
  data: ITimetableTableData[];
  mutate: KeyedMutator<any>;
}

const TimetableTable = (props: TimetableTableProps) => {
  const { data, mutate } = props;
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] =
    React.useState<keyof ITimetableTableData>("timetableCode");
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const router = useRouter();
  const [confirmModal, setConfirmModal] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState<number | null>(
    null
  );
  const [selectedRow, setSelectedRow] =
    React.useState<ITimetableTableData | null>(null);

  const { schoolId, selectedSchoolYearId, sessionToken } = useAppContext();
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof ITimetableTableData
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n.id);
      // setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleRows = React.useMemo(
    () =>
      [...data]
        // .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, data]
  );

  const handleRowClick = (row: ITimetableTableData) => {
    router.push(`/timetable-management/${row.id}`);
  };

  // Handle initial status selection
  const handleStatusChange = (row: ITimetableTableData, newStatus: number) => {
    setSelectedStatus(newStatus);
    setSelectedRow(row);
    setConfirmModal(true);
  };

  // Handle actual status update after confirmation
  const handleConfirmStatus = async () => {
    if (!selectedRow || selectedStatus === null) return;

    try {
      const termId = selectedRow.termId;

      if (selectedStatus === 2) {
        const timetablesRef = collection(firestore, "timetables");
        const q = query(
          timetablesRef,
          where("term-id", "==", termId),
          where("status", "==", SCHEDULE_STATUS.find((s) => s.value === 2)?.key)
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          useNotify({
            message: "Trong 1 học kì chỉ có 1 thời khóa biểu được áp dụng.",
            type: "error",
          });
          return;
        }
      }

      // Update status via API
      await updateTimetableStatus(
        schoolId,
        selectedSchoolYearId,
        termId,
        SCHEDULE_STATUS.find((status) => status.value === selectedStatus)
          ?.key || "",
        sessionToken
      );

      if (selectedStatus === 2) {
        const scheduleRef = doc(
          firestore,
          "schedule-responses",
          selectedRow.generatedScheduleId
        );
        const scheduleSnap = await getDoc(scheduleRef);

        if (scheduleSnap.exists()) {
          const scheduleData = scheduleSnap.data() as IScheduleResponse;
          const publishResult = await publishTimetable(
            schoolId,
            selectedSchoolYearId,
            scheduleData,
            sessionToken
          );

          if (publishResult) {
            useNotify({
              message: `Công bố thời khóa biểu ${selectedRow.timetableCode} thành công`,
              type: "success",
            });
          }
        }
      }

      // Update status in Firebase
      const timetableRef = doc(firestore, "timetables", selectedRow.id);
      await updateDoc(timetableRef, {
        status: SCHEDULE_STATUS.find(
          (status) => status.value === selectedStatus
        )?.key,
      });

      useNotify({
        message: "Cập nhật trạng thái thành công",
        type: "success",
      });

      setConfirmModal(false);
      mutate();
    } catch (error) {
      useNotify({
        message: "Cập nhật trạng thái thất bại",
        type: "error",
      });
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={() => handleRowClick(row)}
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                      align="center"
                    >
                      {row.timetableCode}
                    </TableCell>
                    <TableCell align="left">{row.timetableName}</TableCell>
                    <TableCell align="center">{row.termName}</TableCell>
                    <TableCell align="center">
                      {dayjs(row.generatedDate).format("DD-MM-YYYY")}
                    </TableCell>
                    <TableCell align="center">
                      <FormControl
                        variant="standard"
                        sx={{ m: 1, minWidth: 100 }}
                      >
                        <Select
                          value={row.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleStatusChange(row, Number(e.target.value));
                          }}
                          sx={{
                            "&.MuiSelect-select": {
                              borderRadius: "4px",
                            },
                          }}
                        >
                          {SCHEDULE_STATUS.map((status) => (
                            <MenuItem
                              key={status.key}
                              value={status.value}
                              disabled={
                                (row.status === 2 && (status.value === 1 || status.value === 3)) || 
                                (row.status === 4 && (status.value === 2 || status.value === 3))
                              }
                            >
                              {SCHEDULE_STATUS_TRANSLATOR[status.value]}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
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
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <ConfirmStatusModal
          open={confirmModal}
          onClose={() => setConfirmModal(false)}
          onConfirm={handleConfirmStatus}
          status={selectedStatus || 0}
          timetableCode={selectedRow?.timetableCode || ""}
          timetableName={selectedRow?.timetableName || ''}
          termName={selectedRow?.termName || ''}
          appliedWeek={selectedRow?.appliedWeek || null}
          endedWeek={selectedRow?.endedWeek || null}
        />
      </Paper>
    </Box>
  );
};

export default TimetableTable;
