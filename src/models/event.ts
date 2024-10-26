import { model, Schema } from "mongoose";
import { IEvent } from "../types/index.ts";


const EventSchema = new Schema<IEvent>({
  title: {
    type: String,
    required: true
  },
  notes: {
    type: String
  },
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId, ref: "User",
    required: true
  },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
});

EventSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  // object.id = _id;
  return object;
});

const Event = model('Event', EventSchema);

export default Event;