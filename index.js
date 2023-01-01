const fs = require("fs");
const readXlsxFile = require("read-excel-file/node");

const rootFolder = "/home/ivo/Desktop/nffis-excel/";
const firstFolder = "/home/ivo/Desktop/nffis-excel/1101/";

//Iterate through subfolders
//TODO: Check if excel file is empty (only one row with column titles)
//TODO: Delete empty files
//TODO: Check missing columns in files with same name, or any difference in column names or order
//return JSON.stringify(a1)==JSON.stringify(a2);
//TODO: Append content of all files with the same name to the first file

const rootDir = fs.opendirSync(rootFolder);
let subDir;
while ((subDir = rootDir.readSync()) !== null) {
  let subFolderPath = rootFolder + subDir.name + "/";
  console.log(subFolderPath);
  let currentDir = fs.opendirSync(subFolderPath);
  let fileName;
  while ((fileName = currentDir.readSync()) !== null) {
    console.log(subFolderPath + fileName.name);
  }
  currentDir.closeSync();
}
rootDir.closeSync();

/*readXlsxFile(excelFilePath).then((rows) => {
  rows.forEach((documentRow) => {    

  });

  // `rows` is an array of rows
  // each row being an array of cells.
});*/
