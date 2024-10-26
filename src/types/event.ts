import { Document } from "mongoose";
import type { IUser } from "./user.ts";

export interface IEvent extends Document {
  title: string;
  notes?: string;
  start: Date;
  end: Date;
  createdBy: IUser | string;
  updatedBy?: IUser | string;
  deletedBy?: IUser | string;
  __v: number;
}