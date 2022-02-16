import * as fs from 'fs';

export const firstltrCapRestLow = (word: string): string => {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};

//a very interesting small func to manage async-await error handling

export function to(promise) {
  return promise
    .then((data) => {
      return [null, data];
    })
    .catch((err) => [err]);
}

export async function deleteImageFile(imageUrl: string): Promise<unknown> {
  console.log(imageUrl);
  const delPromise = new Promise((resolve, reject) => {
    fs.unlink('uploads/' + imageUrl, (error) => {
      if (!error) {
        resolve('File Deleted Successfully');
      } else {
        console.log(error);
        reject(error.message);
      }
    });
  });
  return delPromise;
}

// export function shuffle(array) {
//   var currentIndex = array.length,
//     temporaryValue,
//     randomIndex;

//   // While there remain elements to shuffle...
//   while (0 !== currentIndex) {
//     // Pick a remaining element...
//     randomIndex = Math.floor(Math.random() * currentIndex);
//     currentIndex -= 1;

//     // And swap it with the current element.
//     temporaryValue = array[currentIndex];
//     array[currentIndex] = array[randomIndex];
//     array[randomIndex] = temporaryValue;
//   }

//   return array;
// }

export function twoDigits(d) {
  if (0 <= d && d < 10) return '0' + d.toString();
  if (-10 < d && d < 0) return '-0' + (-1 * d).toString();
  return d.toString();
}
