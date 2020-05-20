const fs = require("fs");
const uploadHandler = (file) => {
  return new Promise((resolve, reject) => {
    const filename = file.hapi.filename;
    const filetype = filename.slice(filename.lastIndexOf("."));
    const data = file._data;
    const pattern = /(.png|.jpg|.jpeg)/g;
    if (filetype.match(pattern) == "") {
      reject({ message: "Please upload only image." });
    }
    const tmpFilename = Date.now();
    fs.writeFile("./upload/menu/" + tmpFilename + filetype, data, (err) => {
      if (err) {
        reject(err);
      }
      resolve({
        message: "Upload successfully!",
        filename: tmpFilename + filetype,
      });
    });
  });
};

module.exports = {
  uploadHandler,
};
