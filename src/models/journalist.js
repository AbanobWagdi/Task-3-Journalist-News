const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const journalistSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    age: {
      type: Number,
      default: 20,
      validate(value) {
        if (value < 0) {
          throw new Error("Age must be positive number");
        }
      },
    },
    phoneNumber: {
      type: Number,
      validate(value) {
        if (!validator.isMobilePhone(value.toString(), "ar-EG")) {
          throw new Error("Phone is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 6,
      validate(value) {
        let strongPassword = new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"
        );
        if (!strongPassword.test(value)) {
          throw new Error("Password must include ..........");
        }
      },
    },
    image: {
      type: Buffer,
    },
    tokens: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

journalistSchema.virtual("newss", {
  ref: "News",
  localField: "_id",
  foreignField: "owner",
});

journalistSchema.pre("save", async function () {
  const journalist = this;
  if (journalist.isModified("password"))
    journalist.password = await bcryptjs.hash(journalist.password, 8);
});

journalistSchema.statics.findByCredentials = async (email, password) => {
  const journalist = await Journalist.findOne({ email });
  if (!journalist) {
    throw new Error("Please check email or password");
  }
  const isMatch = await bcryptjs.compare(password, journalist.password);
  if (!isMatch) {
    throw new Error("Please check email or password");
  }
  return journalist;
};

journalistSchema.methods.generateToken = async function () {
  const journalist = this;
  const token = jwt.sign({ _id: journalist._id.toString() }, "nodecourse");
  journalist.tokens = journalist.tokens.concat(token);
  await journalist.save();
  return token;
};

journalistSchema.methods.toJSON = function () {
  const journalist = this;
  const journalistObject = journalist.toObject();

  delete journalistObject.password;
  delete journalistObject.tokens;

  return journalistObject;
};

const Journalist = mongoose.model("Journalist", journalistSchema);
module.exports = Journalist;
