import * as mongoose from "mongoose";

export interface ExamProfile extends mongoose.Document {
  user: string;
  exams: Array<ExamStat>;
}
export interface ExamStat {
  _id: string;
  attemptNumbers: number;
  averageScore: number;
  totalMark: number;
  firstAttemptTime: number;
  lastAttemptTime: number;
}

export const ExamProfileSchema = new mongoose.Schema({
  user: {
    type: String, // save user email address here
    required: true,
  },
  exams: {
    type: [
      {
        _id: {
          //can be examId
          type: mongoose.Types.ObjectId,
          required: true,
        },
        attemptNumbers: {
          type: Number,
          default: 1,
        },
        averageScore: {
          type: Number,
          set: function(v) {
            if (!this.averageScore) return v;

            return +(
              (this.averageScore * (this.attemptNumbers - 1) + v) /
              this.attemptNumbers
            ).toFixed(2);
          },
        },
        totalMark: {
          type: Number,
          required: true,
        },
        firstAttemptTime: {
          type: Date,
          default: Date.now,
        },
        lastAttemptTime: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // set: function(v) {
    //   return this.exams.push(v);
    // }
  },
});
