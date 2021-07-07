"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
exports.imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
};
exports.excelFileFilter = (req, file, callback) => {
    if (file.mimetype !==
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        return callback(new Error('Only Excell files are allowed!'), false);
    }
    callback(null, true);
};
exports.csvFileFilter = (req, file, callback) => {
    if (file.mimetype !== 'text/csv' &&
        file.mimetype !== 'application/vnd.ms-excel') {
        return callback(new Error('Only CSV files are allowed!'), false);
    }
    callback(null, true);
};
exports.editFileName = (req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = path_1.extname(file.originalname);
    const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
    callback(null, `${name}-${randomName}${fileExtName}`);
};
//# sourceMappingURL=file-uploading.utils.js.map