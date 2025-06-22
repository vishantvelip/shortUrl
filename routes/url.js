
const { Router } = require("express");
const { handleGenerateNewShortURL, handleGetAnalytics } = require("../controllers/url");
const URL = require("../models/url");

const router = Router();

// Generate new short URL
router.post("/", handleGenerateNewShortURL);

// Redirect to original URL
router.get("/:shortid", async (req, res) => {
  try {
    const shortid = req.params.shortid;
    const entry = await URL.findOneAndUpdate(
      { shortId: shortid },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      },
      { new: true }
    );
    if (!entry) {
      return res.render("home", {
        id: null,
        urls: await URL.find({}),
        error: "Short URL not found",
      });
    }
    return res.redirect(entry.redirectURL);
  } catch (error) {
    console.error("Error redirecting URL:", error);
    res.render("home", {
      id: null,
      urls: await URL.find({}),
      error: "Error redirecting URL. Please try again.",
    });
  }
});

// Get analytics for a short URL
router.get("/analytics/:shortid", handleGetAnalytics);

// Delete a short URL
router.post("/:shortid/delete", async (req, res) => {
  try {
    const shortid = req.params.shortid;
    const result = await URL.findOneAndDelete({ shortId: shortid });
    if (!result) {
      return res.render("home", {
        id: null,
        urls: await URL.find({}),
        error: "Short URL not found",
      });
    }
    res.redirect("/");
  } catch (error) {
    console.error("Error deleting URL:", error);
    res.render("home", {
      id: null,
      urls: await URL.find({}),
      error: "Error deleting URL. Please try again.",
    });
  }
});

module.exports = router;