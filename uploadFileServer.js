const http = require("http");
const formidable = require("formidable");
const fs = require("fs");
//import { formidable } from "formidable";
//import { fs } from "fs";
http
  .createServer(function (req, res) {
    if (req.url == "/fileupload") {
      const form = new formidable.IncomingForm();
      form.parse(req, (err, fields, files) => {
        console.log("fields: " + fields);
        console.log(files.load.filepath);
        fs.readFile(files.load.filepath, (err, data) => {
          if (err) {
            console.log("there something Wrong!!");
            throw err;
          }
          console.log("doc thanh cong" + data);
        });
        res.end(JSON.stringify({ fields, files }));
        /*var oldpath = files.filetoupload.filepath;
        var newpath = "F:/" + files.filetoupload.originalFilename;
        fs.rename(oldpath, newpath, function (err) {
          if (err) throw err;
          res.write("File uploaded and moved!");
          res.end();
        });*/

        /*fs.readFile("files.filetoupload.filepath", (err, data) => {
          console.log("doc thanh cong" + data);
          fs.writeFile("hoc.txt", data, (err) => {
            console.log("ghi thanh cong");
          });
        });*/
      });
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(
        '<form action="fileupload" method="post" enctype="multipart/form-data">'
      );
      res.write('<input type="file" name="load"  multiple="multiple"><br>');
      res.write('<input type="submit">');
      res.write("</form>");
      return res.end();
    }
  })
  .listen(8080);
