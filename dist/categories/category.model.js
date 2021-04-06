"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.CategorySchema = new mongoose.Schema({
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
//# sourceMappingURL=category.model.js.map