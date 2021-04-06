import * as mongoose from "mongoose";

export interface Exam extends mongoose.Document {
  id: string;
  title: string;
  type: ExamType;
  categoryType: Array<string>;
  description: string;
  questions: Array<string>;
  singleQuestionMark: number;
  questionStemLength: number;
  singleStemMark: number;
  penaltyMark: number;
  timeLimit: number;
  createdAt: Date;
  creator: string;
}

export enum ExamType {
  Assignment = 0,
  Weekly = 1,
  Monthly = 2,
  Assesment = 3,
  Term = 4,
  Test = 5,
  Final = 6,
}

export const ExamSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5],
    required: true,
  },
  categoryType: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
  ],
  description: { type: String, required: true },
  questions: {
    type: [mongoose.SchemaTypes.ObjectId],
    required: true,
    ref: "QuestionSchema",
  },
  singleQuestionMark: { type: Number, default: 1 },
  singleStemMark: { type: Number, default: 0.2 },
  penaltyMark: { type: Number, default: 0 },
  timeLimit: { type: Number, default: 40 },
  createdAt: { type: Date, default: Date.now() },
  creator: { type: mongoose.SchemaTypes.ObjectId, required: true },
});
