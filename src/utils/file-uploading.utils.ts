import * as fs from 'fs';
import { extname } from 'path';
import * as sharp from 'sharp';

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

export const excelFileFilter = (req, file, callback) => {
  if (
    file.mimetype !==
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ) {
    return callback(new Error('Only Excell files are allowed!'), false);
  }
  callback(null, true);
};

export const csvFileFilter = (req, file, callback) => {
  if (
    file.mimetype !== 'text/csv' &&
    file.mimetype !== 'application/vnd.ms-excel'
  ) {
    return callback(new Error('Only CSV files are allowed!'), false);
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const name: string = file.originalname.split('.')[0];
  const fileExtName: string = extname(file.originalname);
  const randomName: string = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};

export async function imageResizer(image, folderPath) {
  const resizeImage = await sharp(image.path)
    .resize(350, 180)
    .png()
    .toBuffer();

  const resizeImageName = image.filename.split('.')[0] + '_350_180.png';

  const resizeImagePathName = `./uploads/images/${folderPath}/${resizeImageName}`;

  const imagePathPromise = new Promise((resolve, reject) => {
    fs.writeFile(resizeImagePathName, resizeImage, (err) => {
      if (!err) {
        fs.unlink(
          `./uploads/images/${folderPath}/${image.filename}`,
          (delErr) => {
            if (delErr) {
              console.log(delErr);
            }
          }
        );
        resolve('images/' + folderPath + '/' + resizeImageName);
      } else {
        reject(err.message);
      }
    });
  });
  return imagePathPromise;
}
