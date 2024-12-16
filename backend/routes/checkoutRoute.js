const express = require("express");
const router = express.Router();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Add the create-checkout-session endpoint
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { products } = req.body;
    // const total = product.boostDays * 10000;
    const lineItems = products.map((product) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: product.name,
        },
        // unit_amount: total,
        unit_amount: product.boostDays * 10000,
      },
      quantity: product.boostDays,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:5173/payment-success",
      cancel_url: "http://localhost:5173/boostCheckout",
    });
    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({
      error: "An error occurred while creating the checkout session.",
    });
  }
});

module.exports = router;
