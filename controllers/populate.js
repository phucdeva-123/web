const mongoose = require("mongoose");
const express = require("express");

exports.ham = () => {
  const personSchema = new mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    name: String,
    age: Number,
  });
  const storySchema = new mongoose.Schema({
    author: { type: mongoose.Schema.ObjectId, ref: "Person" },
    title: String,
  });
  const Story = mongoose.model("Story", storySchema);
  const Person = mongoose.model("Person", personSchema);
  //1) saving ref
  const author = Person.create({
    _id: new mongoose.Types.ObjectId(),
    name: "phuc",
    age: 20,
  })
    .then((data) => {
      const newStory = Story.create({
        author: data._id,
        title: "ng noi tieng",
      });
    })
    .then(() => {
      const a = Story.find();
    });
};
