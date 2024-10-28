import { Document } from 'mongoose';

export interface ITopicPermissions {
  images: boolean;
  videos: boolean;
  texts: boolean;
}

export interface ITopic extends Document {
  name: string;
  permissions: ITopicPermissions;
  deletedAt?: Date;
}

