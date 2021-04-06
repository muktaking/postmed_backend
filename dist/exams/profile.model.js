"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.ExamProfileSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    exams: {
        type: [
            {
                _id: {
                    type: mongoose.Types.ObjectId,
                    required: true,
                },
                attemptNumbers: {
                    type: Number,
                    default: 1,
                },
                averageScore: {
                    type: Number,
                    set: function (v) {
                        if (!this.averageScore)
                            return v;
                        return +((this.averageScore * (this.attemptNumbers - 1) + v) /
                            this.attemptNumbers).toFixed(2);
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
    },
});
//# sourceMappingURL=profile.model.js.map