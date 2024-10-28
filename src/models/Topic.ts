import { Schema, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import type { ITopic } from "../types/index.ts";

const topicSchema = new Schema<ITopic>({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  permissions: {
    images: {
      type: Boolean,
      default: false,
      required: true,
    },
    videos: {
      type: Boolean,
      default: false,
      required: true,
    },
    texts: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  deletedAt: {
    type: Date,
    default: null,
  },
});

topicSchema.methods.toJSON = function () {
  const { __v, _id, ...topic } = this.toObject();
  topic.id = _id;
  return topic;
};

topicSchema.plugin(uniqueValidator, {
  message: '{PATH} must be unique',
});

const Topic = model<ITopic>('Topic', topicSchema);

export default Topic;