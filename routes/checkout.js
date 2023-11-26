import express from "express";
const router = express.Router();

import checkoutController from "../controllers/checkoutController.js";

router.get('/', (req, res) => {
  console.log("Checkout request received");
  res.render('checkout', {user: req.session.user===undefined?"":req.session.user});
});

// Handle payment initiation
router.post('/initiatePayment', checkoutController.toPaymob);

// Handle callback from Paymob after successful payment
router.post('/paymentCallback', (req, res) => {
  // Handle callback from Paymob
  // Update your database with payment details
  // Return appropriate response
});[]

export default router;