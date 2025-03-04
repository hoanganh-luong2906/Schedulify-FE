"use client";

import React from "react";
import { useAppContext } from "@/context/app_provider";
import SMHeader from "@/commons/school_manager/header";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ClassTimetableTable from "./_components/class_timetable_table";

export default function PublishTimetablePage() {
  const { schoolId, sessionToken, selectedSchoolYearId } = useAppContext();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="w-[84%] h-screen flex flex-col justify-start items-start overflow-y-scroll no-scrollbar">
        <SMHeader>
          <h3 className="text-title-small text-white font-semibold tracking-wider">
            Thời khóa biểu lớp
          </h3>
        </SMHeader>
        <div className="w-full h-fit flex flex-col justify-center items-center px-[2vw] pt-[5vh]">
          <ClassTimetableTable
            schoolId={schoolId}
            schoolYearId={selectedSchoolYearId}
            sessionToken={sessionToken}
          />
        </div>
      </div>
    </LocalizationProvider>
  );
}
