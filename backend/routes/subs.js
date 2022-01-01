const express = require('express');
const router = express.Router();
const stripe = require('../utils/stripe')
const middleware = require('../middleware/auth')


router.get("/prices",middleware, async (req, res) => {
  const prices = await stripe.prices.list({
    apiKey: process.env.STRIPE_SECRET_KEY,
  });

  return res.json(prices);
});

router.post("/session", middleware, async (req, res) => {

  try{
  const user = req.user
  console.log(user.stripeCustomerId)
  const session = await stripe.checkout.sessions.create(
    {
      mode:"subscription",
      payment_method_types:['card'],
      line_items: [
        {
          price: req.body.priceId,
          quantity: 1,
        },
      ],
      success_url: "http://localhost:3000/lesson",
      cancel_url: "http://localhost:3000/drive-plans",
      customer: user.stripeCustomerId,
    },
    {
      apiKey: process.env.STRIPE_SECRET_KEY,
    }
  );

  return res.json(session);
  }catch(err){
    console.log(err)
  }
});

module.exports = router