"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path_1 = require("path");
exports.firstltrCapRestLow = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};
function to(promise) {
    return promise
        .then((data) => {
        return [null, data];
    })
        .catch((err) => [err]);
}
exports.to = to;
function deleteImageFile(imageUrl) {
    fs.unlink(path_1.join(__dirname, "..", "uploads/images/", imageUrl), (error) => {
        console.log("File was deleted");
    });
}
exports.deleteImageFile = deleteImageFile;
function twoDigits(d) {
    if (0 <= d && d < 10)
        return "0" + d.toString();
    if (-10 < d && d < 0)
        return "-0" + (-1 * d).toString();
    return d.toString();
}
exports.twoDigits = twoDigits;
//# sourceMappingURL=utils.js.map