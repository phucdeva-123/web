const User = require("../models/userModels");
const AppError = require("./utils/appError");
exports.getAllUsers = async (req, res, next) => {
  const users = await User.find();
  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
};

exports.updateMe = async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email");

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
};
exports.deleteMe = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: "success",
    data: null,
  });
};
exports.switchRole = async (req, res, next) => {
  let user = await User.findById(req.user._id);
  console.log(user);
  user.role = "guide";
  user.save({ validateBeforeSave: false });
  res.json({
    status: "suceed",
    message: "update role thanh cong///",
  });
};
//user delete nhug ta ko muon xoa no khoi database
//chi muon xoa vs ng dug kh hien all tour ko hien ra user do thui
//vi vay dug middleware query find
