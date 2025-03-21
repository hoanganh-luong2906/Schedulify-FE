import useSWR from "swr";

interface IClassDataProps {
  sessionToken: string;
  schoolId: string;
  pageSize: number;
  pageIndex: number;
  schoolYearId: number;
  grade?: string; 
}

const useClassData = ({
  sessionToken,
  schoolId,
  pageSize,
  pageIndex,
  schoolYearId,
  grade,
}: IClassDataProps) => {
  const api = process.env.NEXT_PUBLIC_API_URL || "Unknown";
  
  const fetcher = async (url: string) => {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    return data;
  };

  const endpoint = `${api}/api/schools/${schoolId}/academic-years/${schoolYearId}/classes?includeDeleted=false&pageIndex=${pageIndex}&pageSize=${pageSize}${grade ? `&grade=${grade}` : ''}`;

  const { data, error, isValidating, mutate } = useSWR(
    sessionToken ? endpoint : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      revalidateIfStale: true,
      shouldRetryOnError: false,
    }
  );

  return { data, error, isValidating, mutate };
};

export default useClassData;
