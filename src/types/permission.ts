import { Document } from 'mongoose';
import { ICategory } from "./category.ts";
import { IUser } from "./user.ts";
export interface IPermission extends Document {
  user: IUser;
  category: ICategory;
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;
}