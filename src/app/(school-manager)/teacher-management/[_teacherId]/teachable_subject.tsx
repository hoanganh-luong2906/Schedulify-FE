import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  Toolbar,
  IconButton,
  Tooltip,
} from "@mui/material";
import { ITeachableSubject } from "../_libs/constants";
import { getTeacherSubject } from "../_libs/apiTeacher";
import {
  APPROPRIATE_LEVEL_TRANSLATOR,
  CLASSGROUP_TRANSLATOR,
} from "@/utils/constants";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddTeachableSubjectModal from "./add_teachable_subject";
import useSWR, { KeyedMutator } from "swr";
import Image from "next/image";
import DeleteTeachableSubjectModal from "./delete_teachable_subject";

interface TeachableSubjectTableProps {
  teacherId: string | null;
  schoolId: string;
  sessionToken: string;
  mutate: KeyedMutator<any>;
}

export default function TeachableSubjectTable({
  teacherId,
  schoolId,
  sessionToken,
  mutate,
}: TeachableSubjectTableProps) {
  const [teachableSubjects, setTeachableSubjects] = useState<
    ITeachableSubject[]
  >([]);
  const [departmentName, setDepartmentName] = useState<string>("");
  const [openAddForm, setOpenAddForm] = React.useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState<boolean>(false);
  const [selectedRow, setSelectedRow] = React.useState<
    ITeachableSubject | undefined
  >();

  const fetchData = async () => {
    if (teacherId) {
      const response = await getTeacherSubject(
        schoolId,
        Number(teacherId),
        sessionToken
      );
      if (response.status === 200) {
        setTeachableSubjects(response.result["teachable-subjects"]);
        setDepartmentName(response.result["department-name"]);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [teacherId, schoolId, sessionToken]);

  const handleOpenAddForm = () => setOpenAddForm(true);

  const handleDeleteClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    row: ITeachableSubject
  ) => {
    event.stopPropagation();
    setSelectedRow(row);
    setOpenDeleteModal(true);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            width: "100%",
          }}
        >
          <h2 className="text-title-medium-strong font-semibold w-full text-left">
            Danh sách môn học có thể dạy
          </h2>
          <Tooltip title="Thêm môn học">
            <IconButton onClick={handleOpenAddForm}>
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Lọc danh sách">
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>

        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <TableHead className="bg-gray-50">
              <TableRow>
                <TableCell className="font-semibold">Tổ bộ môn</TableCell>
                <TableCell className="font-semibold">Môn học</TableCell>
                <TableCell className="font-semibold">Mã môn học</TableCell>
                <TableCell className="font-semibold">Khối lớp</TableCell>
                <TableCell className="font-semibold">Trình độ</TableCell>
                <TableCell className="font-semibold text-center">
                  Môn chính
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teachableSubjects.map((subject, index) => (
                <TableRow key={index} hover className="hover:bg-gray-50">
                  <TableCell
                    rowSpan={index === 0 ? teachableSubjects.length : 0}
                    style={{
                      display: index === 0 ? "table-cell" : "none",
                      borderRight: "1px solid #e0e0e0",
                    }}
                  >
                    {departmentName}
                  </TableCell>
                  <TableCell>{subject["subject-name"]}</TableCell>
                  <TableCell className="text-center">
                    {subject.abbreviation}
                  </TableCell>
                  <TableCell>
                    {subject["list-approriate-level-by-grades"].map(
                      (grade, idx) => (
                        <span key={idx}>
                          {`Khối ${CLASSGROUP_TRANSLATOR[grade.grade]}`}
                          {idx <
                          subject["list-approriate-level-by-grades"].length - 1
                            ? ", "
                            : ""}
                        </span>
                      )
                    )}
                  </TableCell>
                  <TableCell>
                    {subject["list-approriate-level-by-grades"].map(
                      (grade, idx) => (
                        <div
                          key={idx}
                          className="flex justify-center items-center"
                        >
                          <span
                            className={`font-medium ${
                              APPROPRIATE_LEVEL_TRANSLATOR[
                                grade["appropriate-level"]
                              ] === 1
                                ? "text-red-500"
                                : APPROPRIATE_LEVEL_TRANSLATOR[
                                    grade["appropriate-level"]
                                  ] === 5
                                ? "text-green-600"
                                : "text-gray-700"
                            }`}
                          >
                            {
                              APPROPRIATE_LEVEL_TRANSLATOR[
                                grade["appropriate-level"]
                              ]
                            }
                          </span>
                        </div>
                      )
                    )}
                  </TableCell>

                  <TableCell align="center">
                    <div className="w-full h-full flex justify-center items-center">
                      <div
                        className={`w-full h-fit px-[6%] py-[2%] rounded-[5px] font-semibold ${
                          subject["is-main"]
                            ? "bg-basic-positive-hover text-basic-positive"
                            : "bg-basic-gray-hover text-basic-gray"
                        }`}
                        style={{
                          whiteSpace: "nowrap",
                          margin: "0 auto",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        {subject["is-main"] ? "Có" : "Không"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell width={80}>
                    <IconButton
                      color="error"
                      sx={{ zIndex: 10 }}
                      onClick={(event) => handleDeleteClick(event, subject)}
                    >
                      <Image
                        src="/images/icons/delete.png"
                        alt="Xóa chuyên môn"
                        width={15}
                        height={15}
                      />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <AddTeachableSubjectModal
          open={openAddForm}
          onClose={setOpenAddForm}
          teacherId={teacherId}
          mutate={fetchData}
        />
        <DeleteTeachableSubjectModal
          open={openDeleteModal}
          onClose={setOpenDeleteModal}
          subjectName={selectedRow?.["subject-name"] ?? "Không xác định"}
          subjectId={selectedRow?.["subject-id"] ?? 0}
          mutate={mutate}
        />
      </Paper>
    </Box>
  );
}
