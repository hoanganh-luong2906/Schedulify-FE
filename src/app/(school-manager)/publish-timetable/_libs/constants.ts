import { IDropdownOption } from "../../_utils/contants";

export interface ITermResponse {
	id: number;
	name: string;
	'start-week': number;
	'end-week': number;
	'start-date': string;
	'end-date': string;
	'school-year-id': number;
	'school-year-code': string;
	'school-year-start': string;
	'school-year-end': string;
}

export interface ITimetableProcessData {
	classId: number;
	className: string;
	mainSessionId: number;
	periods: IPeriodProcessData[];
}

export interface IPeriodProcessData {
  periodId:number
	teacherId: number;
	teacherName: string;
	subjectId: number;
	subjectAbbreviation: string;
	classId: number;
	className: string;
	slot: number;
	roomId: number;
	roomName: string;
	priority: 'Fixed' | 'Double' | 'Combination' | 'Medium' | 'Low' | 'None';
}

export interface ISwitchPeriod extends IPeriodProcessData {
	isDoubleSlot: boolean;
}

export interface IWeekdayResponse {
	'week-number': number;
	'start-date': string;
	'end-date': string;
}

export interface IUpdateTimetableRequest {
	'class-period-id': number;
	'start-at'?: number;
	week: number;
	'teacher-id'?: number;
	'room-id'?: number;
}

export interface IExtendedDropdownOption<T> extends IDropdownOption<T> {
  extra: any;
}