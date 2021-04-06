"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
var ExamType;
(function (ExamType) {
    ExamType[ExamType["Assignment"] = 0] = "Assignment";
    ExamType[ExamType["Weekly"] = 1] = "Weekly";
    ExamType[ExamType["Monthly"] = 2] = "Monthly";
    ExamType[ExamType["Assesment"] = 3] = "Assesment";
    ExamType[ExamType["Term"] = 4] = "Term";
    ExamType[ExamType["Test"] = 5] = "Test";
    ExamType[ExamType["Final"] = 6] = "Final";
})(ExamType = exports.ExamType || (exports.ExamType = {}));
exports.ExamSchema = new mongoose.Schema({
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
//# sourceMappingURL=exam.model.js.map