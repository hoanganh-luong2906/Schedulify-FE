import {
  IAddCombineClassRequest,
  ICombineClassDetail,
  IExistingCombineClassResponse,
  IUpdateCombineClass,
} from "./constants";

const api = process.env.NEXT_PUBLIC_API_URL || "Unknown";

export const getSubjectName = async (
  sessionToken: string,
  selectedSchoolYearId: number
) => {
  // Get total count first
  const initialResponse = await fetch(
    `${api}/api/subjects?schoolYearIdint=${selectedSchoolYearId}&includeDeleted=false&pageIndex=1&pageSize=20`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    }
  );

  const initialData = await initialResponse.json();
  const totalCount = initialData.result["total-item-count"];

  // Fetch all items
  const response = await fetch(
    `${api}/api/subjects?schoolYearIdint=${selectedSchoolYearId}&includeDeleted=false&pageIndex=1&pageSize=${totalCount}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    }
  );

  const data = await response.json();
  return data;
};

export const getRoomName = async (
  sessionToken: string,
  schoolId: string,
  capacity: number
) => {
  const initialResponse = await fetch(
    `${api}/api/schools/${schoolId}/rooms?capacity=${capacity}&pageIndex=1&pageSize=20`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    }
  );
  const initialData = await initialResponse.json();
  const totalCount = initialData.result["total-item-count"];

  const response = await fetch(
    `${api}/api/schools/${schoolId}/rooms?capacity=${capacity}&pageIndex=1&pageSize=${totalCount}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    }
  );
  const data = await response.json();
  return data;
};

export const getTermName = async (
  sessionToken: string,
  selectedSchoolYearId: number
) => {
  const initialResponse = await fetch(
    `${api}/api/academic-years/${selectedSchoolYearId}/terms?pageIndex=1&pageSize=20`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    }
  );

  const initialData = await initialResponse.json();
  const totalCount = initialData.result["total-item-count"];

  const response = await fetch(
    `${api}/api/academic-years/${selectedSchoolYearId}/terms?pageIndex=1&pageSize=${totalCount}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    }
  );
  const data = await response.json();
  return data;
};

// get class can combine
export const getClassCombination = async (
  sessionToken: string,
  schoolId: string,
  academicYearId: number,
  subjectId: number,
  termId: number,
  grade: string,
  session: string
) => {
  const response = await fetch(
    `${api}/api/schools/${schoolId}/academic-years/${academicYearId}/classes/class-combination?subjectId=${subjectId}&termId=${termId}&grade=${grade}&session=${session}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    }
  );

  const data = await response.json();
  return data;
};

export const addCombineClass = async (
  sessionToken: string,
  requestData: IAddCombineClassRequest
) => {
  const response = await fetch(`${api}/api/room-subjects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
    body: JSON.stringify(requestData),
  });
  const data = await response.json();
  return data;
};

export const deleteCombineClass = async (
  id: number,
  schoolId: string,
  sessionToken: string
) => {
  const url = `${api}/api/room-subjects/${id}?schoolId=${schoolId}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};

export const getExistingCombineClass = async (
  schoolId: string,
  sessionToken: string
): Promise<IExistingCombineClassResponse> => {
  const initialResponse = await fetch(
    `${api}/api/room-subjects?schoolId=${schoolId}&pageIndex=1&pageSize=20`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    }
  );

  const initialData = await initialResponse.json();
  const totalCount = initialData.result["total-item-count"];

  const response = await fetch(
    `${api}/api/room-subjects?schoolId=${schoolId}&pageIndex=1&pageSize=${totalCount}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    }
  );
  const data = await response.json();
  return data;
};

export const getTeachableSubject = async (
  schoolId: number,
  subjectId: number,
  grade: string,
  sessionToken: string
) => {
  const response = await fetch(
    `${api}/api/schools/${schoolId}/subjects/${subjectId}/teachable-subjects?eGrade=${grade}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    }
  );

  const data = await response.json();
  return data;
};

export const updateCombineClass = async (
  id: number,
  schoolId: string,
  sessionToken: string,
  combineClassData: IUpdateCombineClass
): Promise<boolean> => {
  if (!sessionToken) {
    throw new Error("Session token not found. Please log in.");
  }

  const url = `${api}/api/room-subjects/${id}?schoolId=${schoolId}`;
  const requestBody = combineClassData;
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify(requestBody),
    });
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error occurred while sending request:", error);
    return false;
  }
};


export const getCombineClassDetail = async (
  schoolId: string,
  roomSubjectId: number,
  sessionToken: string,
) => {
  const initialResponse = await fetch(
    `${api}/api/room-subjects?schoolId=${schoolId}&roomSubjectId=${roomSubjectId}&pageIndex=1&pageSize=20`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    }
  );

  const initialData = await initialResponse.json();
  const totalCount = initialData.result["total-item-count"];

  const response = await fetch(
    `${api}/api/room-subjects?schoolId=${schoolId}&roomSubjectId=${roomSubjectId}&pageIndex=1&pageSize=${totalCount}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    }
  );
  const data = await response.json();
  return data;
};

