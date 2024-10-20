'use client';
import useNotify from '@/hooks/useNotify';
import fetchWithToken from '@/hooks/useRefreshToken';
import { createContext, useContext, useEffect, useState } from 'react';
import useSWR from 'swr';
const AppContext = createContext({
	sessionToken: '',
	setSessionToken: (sessionToken: string) => {},
	refreshToken: '',
	setRefreshToken: (refreshToken: string) => {},
	userRole: '',
	setUserRole: (userRole: string) => {},
	schoolId: '',
	schoolName: '',
});
export const useAppContext = () => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error('useAppContext must be used within an AppProvider');
	}
	return context;
};
export default function AppProvider({
	children,
	inititalSessionToken = '',
	inititalRefreshToken = '',
	initUserRole = '',
	initSchoolId = '',
	initSchoolName = '',
}: {
	children: React.ReactNode;
	inititalSessionToken?: string;
	inititalRefreshToken?: string;
	initUserRole?: string;
	initSchoolId?: string;
	initSchoolName?: string;
}) {
	const [sessionToken, setSessionToken] = useState(inititalSessionToken);
	const [refreshToken, setRefreshToken] = useState(inititalRefreshToken);
	const [userRole, setUserRole] = useState(initUserRole);
	const schoolId = initSchoolId;
	const schoolName = initSchoolName;

	const { data, error } = useSWR(
		refreshToken ? ['/api/refresh', refreshToken] : null,
		([url, token]) => fetchWithToken(url, token),
		{
			revalidateOnReconnect: true,
			refreshInterval: 480000,
		}
	);

	useEffect(() => {
		if (data) {
			setSessionToken(data['jwt-token']);
			setRefreshToken(data['jwt-refresh-token']);
		}
	}, [data]);

	if (error) {
		useNotify({
			message: error.message,
			type: 'error',
		});
	}

	return (
		<AppContext.Provider
			value={{
				sessionToken,
				setSessionToken,
				refreshToken,
				setRefreshToken,
				userRole,
				setUserRole,
				schoolId,
				schoolName,
			}}
		>
			{children}
		</AppContext.Provider>
	);
}
