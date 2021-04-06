"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
var QType;
(function (QType) {
    QType["singleBestAnswer"] = "sba";
    QType["Matrix"] = "matrix";
})(QType = exports.QType || (exports.QType = {}));
exports.QuestionSchema = new mongoose.Schema({
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
//# sourceMappingURL=question.model.js.map