const express = require("express");
const router = express.Router();
const Expense = require("../models/expense");

// Get all expenses
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new expense
router.post("/", async (req, res) => {
  const expense = new Expense({
    item: req.body.item,
    spender: req.body.spender,
    amount: req.body.amount,
    date: req.body.date,
    members: req.body.members,
  });

  try {
    const newExpense = await expense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
