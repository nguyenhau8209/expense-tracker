const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const expensesRouter = require("./routes/expenses");

const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection
mongoose
  .connect(`${process.env.URL_MONGODB}`)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to MongoDB"));

app.use(cors());
app.use(bodyParser.json());
// Serve static files from the "public" directory
app.use(express.static("public"));
app.use("/expenses", expensesRouter);

app.listen(port, () => console.log(`Server started on port ${port}`));
