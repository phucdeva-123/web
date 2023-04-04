const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");
const User = require("./userModels");
//SCHEMA
const tourSchema = new mongoose.Schema(
  {
    //name: String,
    //rating: Number,
    //price: Number
    name: {
      type: String,
      required: true,
      unique: true,
      //unique la khi tao 2 document cung ten se error
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    rating: {
      type: Number,
      required: [true, "A tour must have a name"],
      //bung err khi khong dc nhap loi validate
      default: 4.5,
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
    price: Number,
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    //Guide: Array,
    Guide: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});
//ko the query thuoc tinh ao do ko la 1 phan trong db
// DOCUMENT MIDDLEWARE: runs before .save() and .create() la middleware trc khi dATA dc luu vao db
//this la db trc khi luu vao csdl va ta co the thao tac vs no trc khi luu vao
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
// tourSchema.pre('save', function(next) {
//   console.log('Will save document...');
//   next();
// });

// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });
// QUERY MIDDLEWARE
// tourSchema.pre('find', function(next) {
tourSchema.pre(/^find/, function (next) {
  //this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  this.populate({
    path: "Guide",
    select: "-__v ",
  });
  //console.log(`thoi gian bat dau la ${this.start}`);
  next();
});

/*tourSchema.pre("save", (next) => {
  const newguide = this.Guide.map((data, index) => User.findById(data));
  this.Guide = newguide;
  next();
});*/
/*tourSchema.pre("save", async function (next) {
  const guidesPromises = this.Guide.map(async (id) => await User.findById(id));
  //const guidesPromises = this.Guide.map( (id) =>  User.findById(id));
  //them async await vao cug dc hoac ko do cac ham no bat dong bo san roi
  //neu them async await vao thi trong ham async no dong bo thoi con giua cac
  //ham async vs nhau van bat dong bo bthg
  //cho await de cho dong bo
  this.Guide = await Promise.all(guidesPromises);
  //this.Guide = guidesPromises;
  //neu ko dung thi se ko thu dc j ra mang rong
  next();
});*/
//trc query
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  console.log(docs);
  next();
});
//sau pre
// AGGREGATION MIDDLEWARE
tourSchema.pre("aggregate", function (next) {
  //this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  //console.log(this.pipeline());
  //this.pipeline() la 1 mang unshift them ptu vao dau mang
  next();
});
//MODEL
const tour = mongoose.model("tour", tourSchema);
const testTour = new tour({
  name: "phuc",
  rating: 4.6,
  price: 45,
});
/*
For instance, if you wanted to add an updatedAt timestamp to every updateOne() call, you would use the following pre hook.

schema.pre('updateOne', function() {
  this.set({ updatedAt: new Date() });
});
You cannot access the document being updated in pre('updateOne') or pre('findOneAndUpdate') query middleware. If you need to access the document that will be updated, you need to execute an explicit query for the document.

schema.pre('findOneAndUpdate', async function() {
  const docToUpdate = await this.model.findOne(this.getQuery());
  console.log(docToUpdate); // The document that `findOneAndUpdate()` will modify
});
However, if you define pre('updateOne') document middleware, this will be the document being updated. That's because pre('updateOne') document middleware hooks into Document#updateOne() rather than Query#updateOne().

schema.pre('updateOne', { document: true, query: false }, function() {
  console.log('Updating');
});
const Model = mongoose.model('Test', schema);

const doc = new Model();
await doc.updateOne({ $set: { name: 'test' } }); // Prints "Updating"

// Doesn't print "Updating", because `Query#updateOne()` doesn't fire
// document middleware.
await Model.updateOne({}, { $set: { name: 'test' } });
*/

module.exports = tour;
