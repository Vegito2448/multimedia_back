import { Schema, model } from 'mongoose';
import { IContent } from "../types/index.ts";



const ContentSchema: Schema = new Schema<IContent>({
  title: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  topic: { type: Schema.Types.ObjectId, ref: 'Topic', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: null },
  deletedAt: { type: Date, default: null },
  url: { type: String, required: true },
  filePublicId: { type: String, required: true },
  description: { type: String, required: true },
});

ContentSchema.methods.toJSON = function () {
  const { __v, _id, ...content } = this.toObject();
  content.id = _id;
  return content;
};

const Content = model<IContent>('Content', ContentSchema);

export default Content;
