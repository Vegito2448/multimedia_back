import { model, Schema } from "mongoose";
import uniqueValidator from 'mongoose-unique-validator';
import { IUser } from "../types/index.ts";

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  username: {
    type: String,
    required: [true, 'UserName is required'],
    unique: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    validate: {
      validator: function (email: string) {
        const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailRegex.test(email);
      },
      message: (props: {
        value: string;
      }) => `${props.value} is not a valid email address!`
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  role: {
    type: String,
    enum: ['admin', 'creator', 'reader'],
    required: [true, 'Role is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  deletedAt: {
    type: Date,
  },
});

UserSchema.methods.toJSON = function () {
  const { __v, password: _password, _id, ...user } = this.toObject();
  user.id = _id;
  return user;
};

UserSchema.plugin(uniqueValidator, { message: "{PATH} must be unique" });

const User = model<IUser>('User', UserSchema);

export default User;
