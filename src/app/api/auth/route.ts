import { IUser } from '@/utils/constants';

export async function POST(request: Request) {
	const res = await request.json();
	const requestBody: IUser = { ...res };
	const sessionToken = requestBody.jwt.token ?? undefined;
	const refreshToken = requestBody.jwt.refreshToken ?? undefined;
	const selectedSchoolYearId = res.selectedSchoolYearId ?? 0;

	if (!sessionToken && !refreshToken) {
		return Response.json(
			{ message: 'Không nhận được session token' },
			{
				status: 400,
			}
		);
	}
	return Response.json(res, {
		status: 200,
		headers: {
			'Set-Cookie': [
				`sessionToken=${sessionToken}; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=2592000`,
				`refreshToken=${refreshToken}; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=2592000`,
				`userRole=${requestBody.role}; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=2592000`,
				`selectedSchoolYearId=${selectedSchoolYearId}; HttpOnly; Secure; Path=/; SameSite=Lax`,
			].join(','),
		},
	});
}
