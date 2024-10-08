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
		url: '/about',
	},
	{
		name: 'Quản lý trường học',
		url: '/about',
	},
	{
		name: 'Cộng đồng',
		url: '/about',
	},
	{
		name: 'Liên hệ',
		url: '/contact',
	},
];

export default interface ILoginUser {
	id: string;
	email: string;
	name: string;
	role: string;
}