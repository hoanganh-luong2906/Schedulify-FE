import { WhereFilterOp } from 'firebase/firestore';

export interface INavigation {
	name: string;
	url: string;
}

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

export const publicPaths = ['/landing', '/community', '/contact', '/schools', '/schedules'];
export const authPaths = ['/login', '/register', '/forgot-password'];
export const adminPaths = ['/dashboard'];
export const teacherPaths = ['/teacher-dashboard'];
export const teacherDepartmentHeadPaths = ['/teacher-head-dashboard'];
export const schoolManagerPaths = [
	'/publish-timetable',
	'/teacher-management',
	'/subject-management',
	'/subject-group-management',
	'/lesson-management',
	'/class-management',
	'/room-management',
	'/curriculum',
	'/teaching-assignments',
	'/homeroom-assignments',
	'/system-constraints',
	'/import-timetable',
	'/migrate-timetable',
];

export interface ICommonResponse<T = any> {
	status: number;
	message: string;
	result: T;
}

export interface IPaginatedResponse<T> extends ICommonResponse {
	result: {
		'total-item-count': number;
		'page-size': number;
		'total-pages-count': number;
		'page-index': number;
		next: boolean;
		previous: boolean;
		items: T[];
	};
}

export interface ICommonOption {
	img: string;
	title: string;
}

export interface ISchoolYearResponse {
	id: number;
	'start-year': string;
	'end-year': string;
	'school-year-code': string;
	'is-public': boolean;
	'term-view-model': ITermInSchoolYear[];
}

export interface ITermInSchoolYear {
	id: number;
	name: string;
	'start-week': number;
	'end-week': number;
	'start-date': string;
	'end-date': string;
}

export interface ITermResponse {
	id: number;
	name: string;
	'start-week': number;
	'end-week': number;
	'school-year-id': number;
	'school-year-code': string;
	'school-year-start': string;
	'school-year-end': string;
}

export const SUBJECT_GROUP_TYPE: { key: string; value: number }[] = [
	{ key: '', value: -1 },
	{ key: 'TN', value: 0 },
	{ key: 'XH', value: 1 },
	{ key: 'CN_VA_MT', value: 2 },
	{ key: 'BAT_BUOC', value: 3 },
	{ key: 'TU_CHON', value: 4 },
];

export const CLASSGROUP_STRING_TYPE: { key: string; value: number }[] = [
	{ key: 'Khối 10', value: 10 },
	{ key: 'Khối 11', value: 11 },
	{ key: 'Khối 12', value: 12 },
];

export const CLASSGROUP_TRANSLATOR: { [key: string]: number } = {
	GRADE_10: 10,
	GRADE_11: 11,
	GRADE_12: 12,
};
export const CLASSGROUP_TRANSLATOR_REVERSED: { [key: number]: string } = {
	10: 'GRADE_10',
	11: 'GRADE_11',
	12: 'GRADE_12',
};

export enum ERoomType {
	PRACTICE_ROOM = 'PRACTICE_ROOM',
	LECTURE_ROOM = 'LECTURE_ROOM',
}

export const ROOM_STRING_TYPE: { key: string; value: number }[] = [
	{ key: 'PRACTICE_ROOM', value: 1 },
	{ key: 'LECTURE_ROOM', value: 2 },
];

export const ROOM_TYPE_TRANSLATOR: { [key: string]: string } = {
	PRACTICE_ROOM: 'Phòng thực hành',
	LECTURE_ROOM: 'Phòng học lý thuyết',
};

export const TEACHER_STATUS: { key: string; value: number }[] = [
	{ key: 'HoatDong', value: 1 },
	{ key: 'CongTac', value: 2 },
	{ key: 'HauSan', value: 3 },
	{ key: 'DinhChi', value: 4 },
	{ key: 'NgungHoatDong', value: 5 },
];

export const TEACHER_STATUS_REVERSED: { [key: number]: string } = {
	1: 'HoatDong',
	2: 'CongTac',
	3: 'HauSan',
	4: 'DinhChi',
	5: 'NgungHoatDong',
};

export const TEACHER_STATUS_TRANSLATOR: { [key: number]: string } = {
	1: 'Hoạt động',
	2: 'Công tác',
	3: 'Hậu sản',
	4: 'Định chỉ',
	5: 'Ngừng hoạt động',
};

export const TEACHER_STATUS_TRANSLATOR_REVERSED: { [key: string]: number } = {
	'hoạt động': 1,
	'công tác': 2,
	'hậu sản': 3,
	'định chỉ': 4,
	'ngừng hoạt động': 5,
};

export const TEACHER_ROLE: { key: string; value: number }[] = [
	{ key: 'TEACHER', value: 1 },
	{ key: 'TEACHER_DEPARTMENT_HEAD', value: 2 },
];

export const TEACHER_ROLE_REVERSED: { [key: number]: string } = {
	1: 'TEACHER',
	2: 'TEACHER_DEPARTMENT_HEAD',
};

export const TEACHER_ROLE_TRANSLATOR: { [key: number]: string } = {
	1: 'Giáo viên',
	2: 'Trưởng bộ môn',
};

export const TEACHER_ROLE_TRANSLATOR_REVERSED: { [key: string]: number } = {
	'giáo viên': 1,
	'trưởng bộ môn': 2,
};

export const SUBJECT_ABBREVIATION: { [key: string]: string } = {
	'Ngữ văn': 'Văn',
	Toán: 'Toán',
	'Ngoại ngữ 1': 'NN1',
	'Lịch sử': 'Sử',
	'Giáo dục thể chất': 'GDTC',
	'Giáo dục quốc phòng và an ninh': 'QPAN',
	'Địa lí': 'Địa',
	'Giáo dục kinh tế và pháp luật': 'GDPL',
	'Vật lí': 'Lý',
	'Hóa học': 'Hóa',
	'Sinh học': 'Sinh',
	'Công nghệ': 'CN',
	'Tin học': 'Tin',
	'Âm nhạc': 'Nhạc',
	'Mỹ thuật': 'M.thuật',
	'Hoạt động trải nghiệm, hướng nghiệp': 'HĐTN',
	'Nội dung giáo dục của địa phương': 'GDĐP',
	'Tiếng dân tộc thiểu số': 'Tiếng DTTS',
	'Ngoại ngữ 2': 'NN2',
	'Sinh Hoạt Dưới Cờ': 'SHDC',
};

export const TEACHER_GENDER: { key: string; value: number }[] = [
	{ key: 'Male', value: 1 },
	{ key: 'Female', value: 2 },
];

export const TEACHER_GENDER_REVERSED: { [key: number]: string } = {
	1: 'Male',
	2: 'Female',
};

export const TEACHER_GENDER_TRANSLATOR: { [key: number]: string } = {
	1: 'Nam',
	2: 'Nữ',
};

export const TEACHER_GENDER_TRANSLATOR_REVERSED: { [key: string]: number } = {
	nam: 1,
	nữ: 2,
};

export const ROOM_SUBJECT_MODEL: { key: string; value: number }[] = [
	{ key: 'Full', value: 1 },
	{ key: 'NotFull', value: 2 },
];

export const MAIN_SESSION: { key: string; value: number }[] = [
	{ key: 'Morning', value: 1 },
	{ key: 'Afternoon', value: 2 },
];

export const MAIN_SESSION_TRANSLATOR: { [key: number]: string } = {
	1: 'Buổi sáng',
	2: 'Buổi chiều',
};

export interface QueryCondition {
	field: string;
	operator: WhereFilterOp;
	value: any;
}

export const APPROPRIATE_LEVEL: { key: number; value: string }[] = [
	{ key: 1, value: ' Unqualified' },
	{ key: 2, value: 'Basic' },
	{ key: 3, value: 'Proficient' },
	{ key: 4, value: 'Advanced' },
	{ key: 5, value: 'Mastery' },
];

export const APPROPRIATE_LEVEL_TRANSLATOR: { [key: string]: number } = {
	Unqualified: 1,
	Basic: 2,
	Proficient: 3,
	Advanced: 4,
	Mastery: 5,
};

export const TIMETABLE_SLOTS = [
	{ period: 'Sáng', slots: ['Tiết 1', 'Tiết 2', 'Tiết 3', 'Tiết 4', 'Tiết 5'] },
	{ period: 'Chiều', slots: ['Tiết 6', 'Tiết 7', 'Tiết 8', 'Tiết 9', 'Tiết 10'] },
];

export const WEEK_DAYS = ['T.2', 'T.3', 'T.4', 'T.5', 'T.6', 'T.7'];
export const WEEK_DAYS_FULL = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

// =============================================TIMETABLE CONSTANTS===================================================
// Phân công giáo viên
export interface ITeachingAssignmentObject {
	'assignment-id': number;
	'teacher-id': number;
}

// Tiết cố định
export interface IFixedPeriodObject {
	'subject-id': number;
	'class-id': number;
	'start-at': number;
	'teacher-id': number;
	'is-combination'?: boolean;
}

// Tiết không xếp
export interface INoAssignPeriodObject {
	'start-at': number;
	'class-id': number | null;
	'teacher-id': number;
	'subject-id': number | null;
}

// Tiết rảnh
export interface IFreePeriodObject {
	'start-at': number;
	'class-id': number;
}

export interface IClassCombinationObject {
	'subject-id': number;
	'class-ids': number[];
	'room-id'?: number;
	session: EClassSession | null;
	'teacher-id': number | null;
}

export enum EClassSession {
	Morning = 'Morning',
	Afternoon = 'Afternoon',
}

// Interface của cấu hình đi cùng với thời khóa biểu bên dưới
export interface IConfigurationStoreObject {
	id?: string;
	'timetable-id': string;
	'fixed-periods-para': IFixedPeriodObject[];
	'no-assign-periods-para': INoAssignPeriodObject[];
	'free-timetable-periods-para': IFreePeriodObject[];
	'teacher-assignments': ITeachingAssignmentObject[];
	'teacher-assignments-summary': ITeacherAssignmentSummary[];
	'applied-curriculum-id': number;
	'required-break-periods': number;
	'minimum-days-off': number;
	'days-in-week': number;
	'max-execution-time-in-seconds': number;
}

// Interface thêm để lưu trữ tổng số tiết dạy của giáo viên
export interface ITeacherAssignmentSummary {
	'teacher-id': number;
	'teacher-name': string;
	'teacher-abbreviation': string;
	'total-periods-per-week': ITeacherPeriodsPerWeek[];
}

export interface ITeacherPeriodsPerWeek {
	'subject-name': string;
	'subject-abbreviation': string;
	'subject-id': number;
	'period-count': number;
}

// Interface của record thời khóa biểu
export interface ITimetableStoreObject {
	id?: string;
	'timetable-name': string;
	'timetable-abbreviation': string;
	'school-id': number;
	// ID của TKB được công bố dưới DB
	'published-timetable-id': number | null;
	'year-id': number;
	'year-name': string;
	'term-name': string;
	'term-id': number;
	'config-id': string;
	// Id của thời khóa biểu đã tạo.
	'generated-schedule-id': string | null;
	'generated-date': string | null;
	// End date của công bố Nội bộ
	'internal-end-date': string | null;
	'fitness-point': number;
	'time-cost': number;
	'applied-week': number | null;
	'ended-week': number | null;
	status: string;
}
// Record kết quả generate thời khóa biểu
export interface IScheduleResponse {
	'school-year-id': number;
	'start-week': number;
	'end-week': number;
	'school-id': number;
	'term-id': number;
	'term-name': string | null;
	name: string;
	'fitness-point': number;
	'class-schedules': IClassSchedule[];
	'class-combinations': IClassCombinationScheduleObject[];
	'excute-time': number;
	id: number;
	'create-date': string;
	'update-date': string | null;
	'is-deleted': boolean;
}

export interface IClassCombinationScheduleObject {
	'class-combination-id': number;
	'class-combination-name': string;
	'class-combination-code': string;
	classes: { id: number; name: string }[];
	'start-at': number[];
	'teacher-id': number;
	'teacher-abbreviation': string;
	'teacher-name': string;
	'subject-id': number;
	'subject-name': string;
	'subject-abbreviation': string;
}

export interface IClassSchedule {
	'school-schedule-id': number;
	'student-class-id': number;
	'student-class-name': string;
	'class-periods': IClassPeriod[];
	id: number;
	'create-date': string;
	'update-date': string | null;
	'is-deleted': boolean;
}

export interface IClassPeriod {
	'class-schedule-id': number | null;
	'room-id': number | null;
	'room-code': string | null;
	'teacher-id': number;
	'subject-id': number;
	'date-of-week': number;
	'subject-abbreviation': string;
	'teacher-abbreviation': string;
	'start-at': number;
	priority: string;
	id: number;
	'create-date': string;
	'update-date': string | null;
	'is-deleted': boolean;
}

export const TIMETABLE_FIRESTORE_NAME = 'timetables';
export const CONFIGURATION_FIRESTORE_NAME = 'configurations';
export const GENERATED_SCHEDULE_FIRESTORE_NAME = 'schedule-responses';

export const SCHEDULE_STATUS: { key: string; value: number }[] = [
	{ key: 'Draft', value: 1 },
	{ key: 'PublishedInternal', value: 2 },
	{ key: 'Published', value: 3 },
	{ key: 'Disabled', value: 5 },
	{ key: 'Expired', value: 4 },
];

export const SCHEDULE_STATUS_TRANSLATOR: { [key: number]: string } = {
	1: 'Bản nháp',
	2: 'Nội bộ',
	3: 'Công bố',
	5: 'Thu hồi',
	4: 'Hết hạn',
};

export const REQUEST_TYPE_TRANSLATOR: { [key: string]: string } = {
	All: 'Tất cả',
	Other: 'Các loại đơn khác',
	RequestAbsenntSchedule: 'Đơn xin nghỉ',
	RequestChangeSlot: 'Đơn xin thay đổi lịch dạy',
};
