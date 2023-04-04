const express = require("express");
const tourcontrol = require("./../controllers/tourController.js");
const router = express.Router();
const authController = require("./../controllers/authController");
const fs = require("fs");
//router.get("/top5-cheap", tourcontrol.aliasTopTours, tourcontrol.getAllTours);
//yeu cau dang nhap ms dc nhan cac tour
router.get("/", authController.protect, tourcontrol.getaltour);
router.get("/get", tourcontrol.get);
router.get("/loc", tourcontrol.getAlltour);
router.post("/", tourcontrol.creatTour);
//dung promise bi cho lau
/*router.get("/ha", (req, res) => {
  return async (req, res) => {
    try {
      const tour1 = await JSON.parse(
        fs.readFileSync(`${__dirname}/../dev-data/data/tour-simple.json`)
      );
      res.json({
        data: "phuc",
        nhandang: "depzai",
        dta: tour1,
      });
    } catch {
      res.json({
        error: "fail",
      });
    }
  };
  //console.log("thanh cong"); //do o level code cao nhat nen se dc xuat ra dtien
});*/
router.get("/ha", (req, res) => {
  const tour1 = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tour-simple.json`)
  );
  res.json({
    data: "phuc",
    nhandang: "depzai",
    dta: tour1,
  });
});
//console.log("thanh cong"); //do o level code cao nhat nen se dc xuat ra dtien
router.get("/:id", tourcontrol.gettTour);
router.patch("/:id", tourcontrol.updateTour);
router.delete(
  "/:id",
  authController.protect,
  authController.restrictTo("admin", "lead-guide"),
  tourcontrol.deleteTour
);
//param middleware là dc truyen vào url id
//là middleware chỉ chay khi id có mặt trong param url
//áp dụng thực tế khi ta muốn kiểm tra id có hợp lệ không khi mooic lần chạy router thay vì
//viết nhiều mã code và xử lí trong controller
module.exports = router;
//
