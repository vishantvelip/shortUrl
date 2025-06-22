const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
  try {
    const body = req.body;
    if (!body.url) {
      return res.render("home", {
        id: null,
        urls: await URL.find({}),
        error: "URL is required",
      });
    }

    const shortID = shortid.generate();
    await URL.create({
      shortId: shortID,
      redirectURL: body.url,
      visitHistory: [],
    });

    // Store shortId in session
    req.session.shortId = shortID;

    return res.redirect("/");
  } catch (error) {
    console.error("Error generating short URL:", error);
    res.render("home", {
      id: null,
      urls: await URL.find({}),
      error: "Error generating short URL. Please try again.",
    });
  }
}

async function handleGetAnalytics(req, res) {
  try {
    const shortid = req.params.shortid;
    const result = await URL.findOne({ shortId: shortid });
    if (!result) {
      return res.render("home", {
        id: null,
        urls: await URL.find({}),
        error: "Short URL not found",
      });
    }
    return res.json({
      totalClicks: result.visitHistory.length,
      analytics: result.visitHistory,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.render("home", {
      id: null,
      urls: await URL.find({}),
      error: "Error fetching analytics. Please try again.",
    });
  }
}

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
};