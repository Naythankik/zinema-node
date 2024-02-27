const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");

const UserModel = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      min: 2,
    },
    last_name: {
      type: String,
      required: true,
      min: 2,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    telephone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      min: 6,
    },
    username: {
      type: String,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["approved", "pending"],
      default: "pending",
    },
    refreshToken: {
      type: String,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    token: String
  },
  { timestamps: true }
);


UserModel.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  try {
    const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

UserModel.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", UserModel);

module.exports = User;