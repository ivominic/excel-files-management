const fs = require("fs");
const readXlsxFile = require("read-excel-file/node");

const rootFolder = "/home/ivo/Desktop/nffis-excel/";
const firstFolder = "/home/ivo/Desktop/nffis-excel/1101/";
let currentFile = "GranicneLinije.xlsx";
let currentTitle = "";
//Iterate through subfolders
//TODO: Check if excel file is empty (only one row with column titles)
//TODO: Delete empty files
//TODO: Check missing columns in files with same name, or any difference in column names or order
//return JSON.stringify(a1)==JSON.stringify(a2);
//TODO: Append content of all files with the same name to the first file

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
})();

/**
 * Prints stringified array of column titles. Reads column names from first file, prints it as "MAIN TITLE".
 * For each file with same name in other directories, if it has different column names prints that file and columns.
 * @param {*} filePath
 */
async function checkColumnTitles(filePath) {
  readXlsxFile(filePath)
    .then((rows) => {
      if (currentTitle) {
        if (currentTitle !== JSON.stringify(rows[0])) {
          console.log(filePath, JSON.stringify(rows[0]));
        }
      } else {
        currentTitle = JSON.stringify(rows[0]);
        console.log("MAIN TITLE", currentTitle);
      }
    })
    .catch((error) => {
      console.error(error);
    });
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
