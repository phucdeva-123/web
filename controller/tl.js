const mysql2 = require("mysql2");
const connect = mysql2.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "phuc1234",
    database: "ql",
});
connect.connect((err, connect) => {
    if (!err) {
        // console.log("seceedd..");
    } else {
        console.log(err);
    }
});
exports.tl = (req, res) => {
    console.log(req.query.tl);
    connect.query(
        `SELECT * from books where theloai="${req.query.tl}" `,
        (err, book) => {
            console.log(book);
            res.render("theloai", {
                mascots: book,
            });
            //, {
            //mascots: mascots,
            //}
        }
    );
};