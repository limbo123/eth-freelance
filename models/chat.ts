import { DocumentData } from "firebase/firestore";
import { IDeveloper, IEmployer } from "./user";
export interface IMessage {
  type: string;
  message: string;
  author: string;
  viewed: string[];
  createdAt: any;
}

export interface IChat {
  chat:
    | {
        id: string;
        members: string[];
        messages: IMessage[];
        taskAddress: string;
      }
    | DocumentData;
  guest: IDeveloper | IEmployer;
}
