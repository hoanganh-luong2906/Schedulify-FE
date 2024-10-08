import exp from 'constants';

export interface INavList {
	name: string;
	url: string;
}

export const NAV_LINKS: INavList[] = [
	{
		name: 'Trang chủ',
		url: '/',
	},
	{
		name: 'Thời khóa biểu',
		url: '/timetable',
	},
	{
		name: 'Trường học',
		url: '/schools',
	},
	{
		name: 'Cộng đồng',
		url: '/community',
	},
	{
		name: 'Liên hệ',
		url: '/contact',
	},
];

export interface IUser {
	id: string;
	email: string;
	role: string;
	jwt: IJWT;
}

export interface IJWT {
	token: string;
	refreshToken: string;
	expired: Date;
}
