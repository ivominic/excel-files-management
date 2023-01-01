const fs = require("fs");
const readXlsxFile = require("read-excel-file/node");
const xlsx = require("xlsx");

const rootFolder = "/home/ivo/Desktop/nffis-excel/";
let currentFile = "Indikacija.xlsx";
let currentTitle = "";
let promiseArray = [];
let dataArray = [];
let isThereDifferentColumns = false;
let completedFilesArray = ["GranicneLinije.xlsx"];

//Iterate through subfolders
//Check if excel file is empty (only one row with column titles)
//Delete empty files
//Check missing columns in files with same name, or any difference in column names or order
//return JSON.stringify(a1)==JSON.stringify(a2);
//Create new file in root dir with the same name and content from all the other files with the same name.

(async function iterateFiles() {
  const rootDir = fs.opendirSync(rootFolder);
  let subDir;
  while ((subDir = rootDir.readSync()) !== null) {
    let subFolderPath = rootFolder + subDir.name + "/";
    let currentDir = fs.opendirSync(subFolderPath);
    let fileName;
    while ((fileName = currentDir.readSync()) !== null) {
      //await deleteFile(subFolderPath + fileName.name);
      if (fileName.name === currentFile) {
        await checkColumnTitles(subFolderPath + fileName.name);
      }
    }
    currentDir.closeSync();
  }
  rootDir.closeSync();

  Promise.all(promiseArray).then(function () {
    if (isThereDifferentColumns) {
      console.log("There are files with difference in column names. It needs to be corrected.");
    } else {
      console.log("LENGTH", dataArray.length);
      const workSheet = xlsx.utils.aoa_to_sheet(dataArray);
      const workBook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workBook, workSheet, currentFile.split(".")[0]);
      xlsx.writeFile(workBook, rootFolder + currentFile);
    }
  });
})();

/**
 * Prints stringified array of column titles. Reads column names from first file, prints it as "MAIN TITLE".
 * For each file with same name in other directories, if it has different column names prints that file and columns.
 * @param {*} filePath
 */
async function checkColumnTitles(filePath) {
  promiseArray.push(
    readXlsxFile(filePath)
      .then((rows) => {
        if (currentTitle) {
          if (currentTitle !== JSON.stringify(rows[0])) {
            console.log(filePath, JSON.stringify(rows[0]));
            isThereDifferentColumns = true;
          }
          dataArray = dataArray.concat(rows.slice(1));
          console.log(filePath, rows.length);
          console.log("dataLength", dataArray.length);
        } else {
          currentTitle = JSON.stringify(rows[0]);
          dataArray = [...rows];
          console.log("MAIN length", rows.length);
          console.log("MAIN file", filePath);
          console.log("MAIN TITLE", currentTitle);
        }
      })
      .catch((error) => {
        console.error(error);
      })
  );
}

/**
 * One time used function to delete all excel files with less thant 2 rows (empty files, only column titles)
 * @param {*} filePath - absolute file path
 */
async function deleteFile(filePath) {
  console.log(filePath);
  readXlsxFile(filePath)
    .then((rows) => {
      if (rows.length <= 1) {
        console.log("empty", filePath);
        fs.unlinkSync(filePath);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

/*readXlsxFile(excelFilePath).then((rows) => {
  rows.forEach((documentRow) => {    

  });

  // `rows` is an array of rows
  // each row being an array of cells.
});*/
