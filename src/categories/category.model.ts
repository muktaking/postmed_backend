import * as mongoose from "mongoose";

export interface Category extends mongoose.Document {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId: string;
  imageUrl: string;
  order: number;
}

export const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 25,
    ref: "Exam",
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
    maxlength: 300,
  },
  parentId: { type: mongoose.SchemaTypes.ObjectId, default: null },

  imageUrl: { type: String, required: true },

  order: {
    type: Number,
    default: 1000,
  },
});
