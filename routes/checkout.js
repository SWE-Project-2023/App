const express = require('express');
const router = express.Router();

const checkoutController = require('../controllers/checkoutController.js');

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

module.exports = router;