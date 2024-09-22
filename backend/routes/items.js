// routes/items.js
const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

// Route to get nearest items based on user location
router.get("/nearest", async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).send("Latitude and longitude are required");
  }

  try {
    const items = await Item.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: 5000, // Maximum distance in meters
        },
      },
    });

    res.json(items);
  } catch (error) {
    console.error("Error fetching nearest items:", error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
