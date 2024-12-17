'use client';
import TeacherHeader from "@/commons/teacher/header";
import React from "react";
import ViewApplicationTable from "./_components/view_application_table";
import { useTeacherSelector } from "@/hooks/useReduxStore";
import { useAppContext } from "@/context/app_provider";

export default function ViewApplicationPage() {
  const { teacherInfo } = useTeacherSelector((state) => state.teacher);
  const { sessionToken, selectedSchoolYearId } = useAppContext();
  
  return (
    <div className="w-[84%] h-screen flex flex-col justify-start items-start overflow-y-scroll no-scrollbar">
      <TeacherHeader>
        <h3 className="text-title-small text-white font-semibold tracking-wider">
          Xem đơn
        </h3>
      </TeacherHeader>
      <div className="w-full h-fit flex flex-col justify-center items-center px-[2vw] pt-[5vh]">
        <ViewApplicationTable 
          teacherId={teacherInfo?.id ?? 0} 
          schoolYearId={selectedSchoolYearId}
          sessionToken={sessionToken}
        />
      </div>
    </div>
  );
}