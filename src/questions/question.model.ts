import * as mongoose from "mongoose";

export enum QType {
  singleBestAnswer = "sba",
  Matrix = "matrix",
}

export interface Stem {
  qStem: string;
  aStem: string;
  fbStem?: string;
}

export interface Question extends mongoose.Document {
  id: string;
  title: string;
  category: string;
  qType: QType;
  qText: string;
  stems: Array<Partial<Stem>>;
  generalFeedbacks: string;
  tags: Array<string>;
  createdAt: Date;
  modifiedAt: Date;
  creator: string;
}

export const QuestionSchema = new mongoose.Schema({
  title: {
    type: String,
    max: 200,
    required: true,
  },
  category: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "Category",
  },
  qType: {
    type: String,
    enum: [QType.singleBestAnswer, QType.Matrix],
    required: true,
  },
  qText: {
    type: String,
    max: 500,
    required: true,
  },
  stems: {
    type: [
      {
        qStem: {
          type: String,
          maxlength: 200,
          required: true,
        },
        aStem: {
          type: String,
          maxlength: 1,
          required: true,
        },
        fbStem: {
          type: String,
          maxlength: 200,
        },
      },
    ],
    required: true,
    _id: false,
  },
  generalFeedbacks: String,
  tags: [String],
  createDate: {
    type: Date,
    default: Date.now,
  },
  modifiedDate: {
    type: Date,
  },
  creator: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  modifiedBy: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: "User",
  },
});
