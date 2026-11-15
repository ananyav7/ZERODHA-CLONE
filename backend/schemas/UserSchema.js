const { Schema } = require("mongoose");

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String },
  funds: {
    availableMargin: { type: Number, default: 25000 },
    usedMargin: { type: Number, default: 0 },
    openingBalance: { type: Number, default: 25000 },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = { UserSchema };
