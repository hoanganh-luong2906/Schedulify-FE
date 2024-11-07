import useSWR from 'swr';
import { getFetchSubjectGroupDetailApi } from '../_libs/apis';

interface IFetchSubjectGroupDetailProps {
	sessionToken: string;
	subjectGroupId: number;
}

const useFetchSGDetail = (props: IFetchSubjectGroupDetailProps) => {
	const { sessionToken, subjectGroupId } = props;
	const endpoint = getFetchSubjectGroupDetailApi({ subjectGroupId });

	async function fetcher(url: string) {
		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${sessionToken}`,
			},
		});
		const data = await response.json();
		if (!response.ok) {
			throw new Error(data);
		}
		return data;
	}

	const { data, error, mutate, isValidating } = useSWR(endpoint, fetcher, {
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
		revalidateIfStale: false,
		shouldRetryOnError: false,
		refreshWhenHidden: false,
		refreshWhenOffline: false,
	});

	return { data, error, mutate, isValidating };
};

export default useFetchSGDetail;
