"use client";

import SMHeader from "@/commons/school_manager/header";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toggleMenu } from "@/context/slice_school_manager";
import TimetableTable from "./_components/timetable_table";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses, TooltipProps } from "@mui/material/Tooltip";
import { ITimetableTableData } from "./_libs/constants";
import { firestore } from "@/utils/firebaseConfig";
import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAppContext } from "@/context/app_provider";
import { mutate } from "swr";
import { SCHEDULE_STATUS } from "@/utils/constants";

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 13,
  },
}));

export default function TimetableManagement() {
  const router = useRouter();
  const isMenuOpen = useSelector(
    (state: any) => state.schoolManager.isMenuOpen
  );
  const dispatch = useDispatch();
  const [timetableData, setTimetableData] = useState<ITimetableTableData[]>([]);
  const { schoolId } = useAppContext();

  useEffect(() => {
    const fetchTimetables = async () => {
      const timetablesRef = collection(firestore, 'timetables');
      const q = query(timetablesRef, where('school-id', '==', Number(schoolId)));
      
      //onSnapshot() function from Firebase creates a real-time listener 
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const timetables: ITimetableTableData[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            timetableCode: data['timetable-abbreviation'],
            timetableName: data['timetable-name'],
            appliedWeek: data['applied-week'],
            endedWeek: data['ended-week'],
            status: SCHEDULE_STATUS.find(s => s.key === data.status)?.value || 0,
            termName: data['term-name'],
            termId: data['term-id'],
            yearName: data['year-name'],
            generatedScheduleId: data['generated-schedule-id'],
            generatedDate: data['generated-date'],
            "applied-week": data['applied-week'],
            "ended-week": data['ended-week'],
            "term-id": data['term-id'],
            "term-name": data['term-name'],
          };
        });
        setTimetableData(timetables);
      });
  
      // Cleanup listener on unmount
      return () => unsubscribe();
    };
  
    fetchTimetables();
  }, [schoolId]);
  

  const handleGenerateTimetable = () => {
    if (!isMenuOpen) {
      dispatch(toggleMenu());
    }
    router.push("timetable-generation");
  };

  const filteredTimetableData = timetableData.filter(
    (timetable) => timetable.status !== SCHEDULE_STATUS.find(s => s.key === 'Published')?.value
  );

  return (
    <div
      className={`w-[${
        !isMenuOpen ? "84" : "100"
      }%] h-screen flex flex-col justify-start items-start overflow-y-scroll no-scrollbar`}
    >
      <SMHeader>
        <div>
          <h3 className="text-title-small text-white font-semibold tracking-wider">
            Thời khóa biểu
          </h3>
        </div>
      </SMHeader>
      <div className="w-full h-fit flex flex-col justify-center items-center px-[8vw] pt-[5vh]">
        <TimetableTable data={timetableData} mutate={mutate} />
      </div>
      <div className="absolute w-fit h-fit overflow-visible bottom-[3vw] right-[3vw]">
        <LightTooltip title="Tạo Thời khóa biểu" placement="top" arrow>
          <Fab
            color="primary"
            aria-label="add"
            onClick={handleGenerateTimetable}
          >
            <AddIcon color="inherit" sx={{ color: "white" }} />
          </Fab>
        </LightTooltip>
      </div>
    </div>
  );
}
