const mongoose = require("mongoose");
const fs = require("fs");
const tour = require("./../models/tourModels.js");
const AppError = require("./utils/appError");
const ObjectId = mongoose.Types.ObjectId;
const User = require("./../models/userModels");
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};
exports.get = (_req, res) => {
  const dta = tour.aggregate(
    [
      { $match: { duration: { $gte: 6 } } },
      {
        $group: {
          /*_id: null,
          count: { $sum: 1 }, //dem slg dua tren _id vd _id : "$state" group by
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },*/
          _id: "$duration",
          count: { $sum: 1 }, //dem slg dua tren _id vd _id : "$state" group by
          avgPrice: { $avg: "$price" }, //$sum 1 dem tong dua tren thyoc tinh group by
          minPrice: { $min: "$price" }, //$avg "$price" tinh dua tren thuoc tinh price(group lai de tinh)
          maxPrice: { $max: "$price" },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
    ],
    (err, dta) => {
      if (!err) {
        res.status(200).json({
          status: "success",
          data: {
            dta,
          },
        });
      } else {
        res.status(404).json({
          status: "fail",
          message: err,
        });
      }
    }
  );
};
exports.getAlltour = (req, res) => {
  tour.find({}, (err, data) => {
    if (!err) {
      res.status(200).json({
        status: "success",
        results: data.length,
        data: {
          data,
        },
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: err,
      });
    }
  });
};
exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $unwind: "$startDates",
      },
      {
        $match: {
          ratingsAverage: { $gte: 4.5 },
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $toUpper: "$difficulty" },
          numTours: { $sum: 1 },
          numRatings: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
      // {
      //   $match: { _id: { $ne: 'EASY' } }
      // }
    ]);

    res.status(200).json({
      status: "success",
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
/*exports.getAllTours = async (req, res) => {
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};*/
exports.getaltour = async (req, res) => {
  try {
    const Tour = await tour.find({});
    res.status(200).json({
      status: "sucess",
      result: Tour.length,
      data: {
        Tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
}; //lm theo day dc
exports.getTour = (req, res) => {
  const Tour = tour.findById(req.params.id, (err, Tour) => {
    if (!err) {
      res.status(200).json({
        status: "sucess",
        data: {
          Tour,
        },
      });
    } else {
      res.status(400).json({
        status: "fail",
        message: err,
      });
    }
  });
};
exports.gettTour = async (req, res, next) => {
  //const Tour = await tour.findById(req.params.id).populate("User");
  // Tour.findOne({ _id: req.params.id })
  console.log(req.params.id);
  const Tour = await tour.findOne({ _id: req.params.id });
  /*.populate({
    path: "Guide",
    select: "-__v ",
  });*/
  //trick dat rong middware qurery de dung dc cho ca alltour
  if (!Tour) {
    return next(new AppError("No tour found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      Tour,
    },
  });
};
exports.creatTour = (req, res) => {
  tour
    .create(req.body)
    .then((data) => {
      console.log("thanh cong");
      res.status(201).json({
        status: "success",
        data: {
          Tour: data,
        },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "faill",
        message: err,
      });
    });
};
exports.updateTour = (req, res) => {
  const Tour = tour.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
    (err, data) => {
      if (!err) {
        res.status(200).json({
          status: "success",
          data: {
            tour: data,
          },
        });
      } else {
        res.status(400).json({
          status: "fail",
          message: err,
        });
      }
    }
  );
};
exports.deleteTour = (req, res) => {
  tour.findByIdAndDelete(req.params.id, (err, _data) => {
    if (!err) {
      res.status(204).json({
        status: "success",
        data: {
          tour: null,
        },
      });
    } else {
      res.status(400).json({
        status: "fail",
        message: err,
      });
    }
  });
};
