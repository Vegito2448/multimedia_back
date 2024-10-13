import { model, Schema } from "mongoose";
import { IUser } from "../types";


const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  role: {
    type: String,
    default: 'USER_ROLE',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

});

const User = model<IUser>('User', UserSchema);

export default User;
