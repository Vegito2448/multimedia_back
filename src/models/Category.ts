import { Schema, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { ICategory } from "../types/index.ts";

const CategorySchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  deletedAt: {
    type: Date,
    default: null
  }
});

CategorySchema.methods.toJSON = function () {
  const { __v, _id, ...category } = this.toObject();
  category.id = _id;
  return category;
};

CategorySchema.plugin(uniqueValidator, { message: "{PATH} must be unique" });

const Category = model<ICategory>('Category', CategorySchema);

export default Category;
