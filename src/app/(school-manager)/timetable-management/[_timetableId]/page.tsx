"use client";

import SMHeader from "@/commons/school_manager/header";
import { useParams, useRouter } from "next/navigation";
import {
  WEEKDAYS,
  TIME_SLOTS,
  SAMPLE_CLASSES,
  ITimetableTableData,
} from "../_libs/constants";
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useMemo, useRef, useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "@/utils/firebaseConfig";
import {
  IScheduleResponse,
  TIMETABLE_SLOTS,
  WEEK_DAYS_FULL,
} from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import AddIcon from "@mui/icons-material/Add";
import TuneIcon from "@mui/icons-material/Tune";

export default function TimetableDetail() {
  const params = useParams();
  const timetableId = params._timetableId;
  const router = useRouter();
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [selectedTeacher, setSelectedTeacher] = useState("all");
  const [displayCount, setDisplayCount] = useState(5);
  const [startIndex, setStartIndex] = useState(0);
  const [scheduleData, setScheduleData] = useState<IScheduleResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const isMenuOpen = useSelector(
    (state: any) => state.schoolManager.isMenuOpen
  );

  const handleBack = () => {
    router.push("/timetable-management");
  };

  const grades = Array.from(new Set(SAMPLE_CLASSES.map((c) => c.grade)));
  const filteredClasses =
    selectedGrade === "all"
      ? SAMPLE_CLASSES
      : SAMPLE_CLASSES.filter((c) => c.grade === selectedGrade);

  const visibleClasses = filteredClasses.slice(
    startIndex,
    startIndex + displayCount
  );

  const teacherNames = useMemo(() => {
    if (!scheduleData) return [];
    const teachers = new Set();
    scheduleData["class-schedules"].forEach((schedule) => {
      schedule["class-periods"].forEach((period) => {
        teachers.add(period["teacher-abbreviation"]);
      });
    });
    return Array.from(teachers) as string[];
  }, [scheduleData]);

  const handleScrollLeft = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => prev - 1);
    }
  };

  const handleScrollRight = () => {
    if (startIndex + displayCount < filteredClasses.length) {
      setStartIndex((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const fetchScheduleData = async () => {
      setIsLoading(true);
      try {
        // First get the timetable document to get generated-schedule-id
        const timetableRef = doc(
          firestore,
          "timetables",
          timetableId as string
        );
        const timetableSnap = await getDoc(timetableRef);

        if (timetableSnap.exists()) {
          const timetableData = timetableSnap.data();
          const scheduleId = timetableData["generated-schedule-id"];

          // Then get the schedule data using generated-schedule-id
          const scheduleRef = doc(firestore, "schedule-responses", scheduleId);
          const scheduleSnap = await getDoc(scheduleRef);

          if (scheduleSnap.exists()) {
            const data = scheduleSnap.data() as IScheduleResponse;
            setScheduleData(data);
          }
        }
      } catch (error) {
        console.error("Error fetching schedule:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (timetableId) {
      fetchScheduleData();
    }
  }, [timetableId]);

  const classNames = useMemo(() => {
    if (!scheduleData) return [];
    return Array.from(
      new Set(
        scheduleData["class-schedules"].map(
          (schedule) => schedule["student-class-name"]
        )
      )
    );
  }, [scheduleData]);

  return (
    <div
      className={`w-[${
        !isMenuOpen ? "84" : "100"
      }%] h-screen flex flex-col justify-start items-start overflow-y-scroll no-scrollbar`}
    >
      <SMHeader>
        <div className="flex items-center gap-4">
          <IconButton onClick={handleBack} sx={{ color: "white" }}>
            <ArrowBackIcon />
          </IconButton>
          <h3 className="text-title-small text-white font-semibold tracking-wider">
            Chi tiết Thời khóa biểu
          </h3>
        </div>
      </SMHeader>

      {!isLoading && !scheduleData && (
        <div className="flex flex-col justify-center items-center w-full h-full gap-8 bg-gradient-to-b from-gray-50 to-white p-12 rounded-xl shadow-xl">
          {/* Image Section with Animation */}
          <div className="flex justify-center transform transition-all duration-500 hover:scale-110">
            <Image
              src="/images/icons/empty-folder.png"
              alt="No schedule available"
              width={350}
              height={300}
              unoptimized={true}
              className="opacity-90 drop-shadow-lg"
            />
          </div>

          <div className="text-center space-y-2">
            <Typography
              variant="h5"
              className="text-gray-700 font-semibold tracking-wide"
            >
              Thời khóa biểu chưa được tạo!
            </Typography>
            <Typography variant="body1" className="text-gray-500">
              Bấm nút bên dưới để bắt đầu tạo thời khóa biểu mới
            </Typography>
          </div>

          <Button
            variant="contained"
            size="large"
            className="!bg-primary-500 !hover:bg-primary-600 text-white px-8 py-3 rounded-s 
                 transform transition-all duration-300 hover:scale-105 hover:shadow-lg
                 flex items-center gap-2"
            onClick={() =>
              router.push(`/timetable-generation/${timetableId}/information`)
            }
          >
            <AddIcon />
            Tạo thời khóa biểu
          </Button>
        </div>
      )}

      {!isLoading && scheduleData && (
        <div className="w-full h-fit flex flex-col justify-center items-center px-[8vw] pt-[3vh]">
          <div className="w-full mb-4 flex justify-between items-center">
            <FormControl sx={{ minWidth: 170 }}>
              <InputLabel>Giáo viên</InputLabel>
              <Select
                value={selectedTeacher}
                label="Giáo viên"
                onChange={(e) => setSelectedTeacher(e.target.value)}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 200,
                      width: 250,
                    },
                  },
                }}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                {teacherNames.map((teacher) => (
                  <MenuItem key={teacher} value={teacher}>
                    {teacher}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Tooltip title="Cấu hình">
              <IconButton
                onClick={() =>
                  router.push(
                    `/timetable-generation/${timetableId}/information`
                  )
                }
              >
                <TuneIcon />
              </IconButton>
            </Tooltip>
          </div>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 750 }} aria-label="timetable">
              <TableHead>
                <TableRow>
                  <TableCell className="!font-semibold">Thứ</TableCell>
                  <TableCell className="!font-semibold">Tiết/Lớp</TableCell>
                  <TableCell colSpan={visibleClasses.length + 2}>
                    <div className="flex items-center justify-center gap-2 ">
                      {classNames.map((className) => (
                        <div
                          key={className}
                          className="font-semibold w-full text-center"
                        >
                          {className}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {WEEK_DAYS_FULL.map((day, dayIndex) =>
                  TIMETABLE_SLOTS.map((session, sessionIndex) =>
                    session.slots.map((slot, slotIndex) => (
                      <TableRow key={`${day}-${session.period}-${slotIndex}`}>
                        {slotIndex === 0 && sessionIndex === 0 && (
                          <TableCell
                            rowSpan={TIMETABLE_SLOTS.reduce(
                              (acc, s) => acc + s.slots.length,
                              0
                            )}
                            className="!font-semibold"
                            sx={{
                              borderRight: "1px solid #e5e7eb",
                              textAlign: "center",
                            }}
                          >
                            {day}
                          </TableCell>
                        )}
                        <TableCell component="th" scope="row">
                          {slot}
                        </TableCell>
                        <TableCell
                          colSpan={
                            (scheduleData?.["class-schedules"]?.length ?? 0) + 2
                          }
                        >
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-[40px]" />
                            {scheduleData?.["class-schedules"].map(
                              (classSchedule) => {
                                const currentSlotIndex =
                                  dayIndex * 10 +
                                  sessionIndex * 5 +
                                  slotIndex +
                                  1;
                                const period = classSchedule[
                                  "class-periods"
                                ].find(
                                  (p) =>
                                    p["start-at"] === currentSlotIndex &&
                                    !p["is-deleted"] &&
                                    (selectedTeacher === "all" ||
                                      p["teacher-abbreviation"] ===
                                        selectedTeacher)
                                );

                                return (
                                  <div
                                    key={`${classSchedule["student-class-id"]}-${currentSlotIndex}`}
                                    className="w-full"
                                  >
                                    <div className="min-h-[60px] p-2 border border-dashed border-gray-200 rounded flex flex-col justify-between">
                                      <div className="text-sm font-medium text-center">
                                        {period?.["subject-abbreviation"]}
                                      </div>
                                      <div className="flex justify-center text-xs text-gray-500">
                                        <span>
                                          {period?.["teacher-abbreviation"]}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            )}
                            <div className="w-[40px]" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </div>
  );
}
