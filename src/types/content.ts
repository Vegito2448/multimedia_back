import { Document } from "mongoose";
import { ICategory } from "./category.ts";
import { ITopic } from "./topic.ts";
import { IUser } from "./user.ts";

export interface IContent extends Document {
  title: string;
  category: string | ICategory;
  topic: string | ITopic;
  createdBy: string | IUser;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  url?: string;
  filePublicId?: string;
  description?: string;
}