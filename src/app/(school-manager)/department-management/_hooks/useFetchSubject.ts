import useSWR from 'swr';
import { getFetchSubjectApi } from '../_libs/apis';
import { IPaginatedResponse } from '@/utils/constants';
import { ISubjectResponse } from '../_libs/constants';

interface IFetcherProps {
	sessionToken: string;
	schoolYearId: number;
	pageSize: number;
	pageIndex: number;
	subjectName?: string;
	isRequired?: boolean;
	deletedIncluded?: boolean;
}

const useFetchSubjects = (props: IFetcherProps) => {
	const {
		sessionToken,
		schoolYearId,
		pageSize,
		pageIndex,
		subjectName,
		isRequired,
		deletedIncluded,
	} = props;
	const endpoint = getFetchSubjectApi({
		schoolYearId,
		pageSize,
		pageIndex,
		subjectName,
		isRequired,
		deletedIncluded,
	});

	async function fetcher(url: string) {
		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${sessionToken}`,
			},
		});
		const data = await response.json();
		if (!response.ok) {
			throw new Error(data.message);
		}
		return data as IPaginatedResponse<ISubjectResponse>;
	}

	const { data, error, isLoading, isValidating, mutate } = useSWR(endpoint, fetcher, {
		revalidateIfStale: false,
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
		revalidateOnMount: false,
		shouldRetryOnError: false,
	});

	return { data, error, isLoading, isValidating, mutate };
};

export default useFetchSubjects;
