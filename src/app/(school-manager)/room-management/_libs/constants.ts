import { ERoomType } from "@/utils/constants";

export interface IRoomTableData {
	id: number;
	roomName: string;
	buildingName: string;
	availableSubjects: string;
	roomType: string;
	status: string;
}

export interface ISubject {
	id: number;
	"subject-name": string;
	abbreviation: string;
}
export interface IRoom {
	id: number;
	name: string;
	"building-id": number;
	"room-type": ERoomType;
	"availabilitye-status": string;
	subjects: ISubject[];
  }
  
  export interface IBuilding {
	id:number;
	name: string;
	description: string;
	floor: number;
	"building-code": string;
  }

  export interface IAddRoomData {
	name: string;
	'room-code': string;
	'max-class-per-time': number;
	'building-code': string;
	'room-type': string;
	'subjects-abreviation': string[];
  }

  export interface IUpdateRoomData {
	name: string;
	"room-type": string;
	"max-class-per-time": number;
	"room-code": string;
	"building-id": string;
	"availabilitye-status": string;
	"subject-ids": number[];
  }

  export interface IRoomDetail {
	id: number;
	name: string;
	"room-type": string;
	"max-class-per-time": number;
	"room-code": string;
	"building-id": number;
	"availabilitye-status": string;
	subjects: ISubject[];
	"create-date": string;
	"update-date": string;
	"is-deleted": boolean;
  } 

  export interface IExistingRoom {
	id: number;
	name: string;
	"room-code": string;
  }

  export interface IRoomResponse {
	status: number;
	message: string;
	result: {
	  items: IExistingRoom[];
	  "total-item-count": number;
	};
  }