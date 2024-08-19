const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  item: String,
  spender: String,
  amount: Number,
  date: Date,
  members: [String],
});

module.exports = mongoose.model("Expense", expenseSchema);
