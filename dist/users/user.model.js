"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
var RolePermitted;
(function (RolePermitted) {
    RolePermitted[RolePermitted["guest"] = 0] = "guest";
    RolePermitted[RolePermitted["student"] = 1] = "student";
    RolePermitted[RolePermitted["mentor"] = 2] = "mentor";
    RolePermitted[RolePermitted["moderator"] = 3] = "moderator";
    RolePermitted[RolePermitted["coordinator"] = 4] = "coordinator";
    RolePermitted[RolePermitted["admin"] = 5] = "admin";
})(RolePermitted = exports.RolePermitted || (exports.RolePermitted = {}));
var Gender;
(function (Gender) {
    Gender["male"] = "male";
    Gender["female"] = "female";
})(Gender = exports.Gender || (exports.Gender = {}));
exports.UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true, maxlength: 15 },
    lastName: { type: String, required: false, maxlength: 15 },
    userName: { type: String, required: true, maxlength: 15 },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gender: { type: String, enum: ['male', 'female'], required: true },
    createdAt: { type: Date, default: Date.now() },
    role: { type: Number, enum: [0, 1, 2, 3, 4, 5], required: true, default: 1 }
});
//# sourceMappingURL=user.model.js.map