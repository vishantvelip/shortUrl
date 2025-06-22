const express = require("express");
const mongoose = require("mongoose");
const urlRoute = require("./routes/url");
const { connectDB } = require("./connection/connect");
const URL = require("./models/url");
const path = require("path");
const session = require("express-session");

const port = 8000;
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// Set up EJS as view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Routes
app.use("/url", urlRoute);

// Home route to display all URLs
app.get("/", async (req, res) => {
  try {
    const allurls = await URL.find({});
    res.render("home", {
      id: req.session.shortId || null, // Persist id from session
      urls: allurls,
      error: null,
    });
  } catch (error) {
    console.error("Error fetching URLs:", error);
    res.render("home", {
      id: null,
      urls: [],
      error: "Failed to load URLs. Please try again.",
    });
  }
});

// Start server
app.listen(port, () => console.log(`Server started at port: ${port}`));