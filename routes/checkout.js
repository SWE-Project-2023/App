import express from "express";
const router = express.Router();

import checkoutController from "../controllers/checkoutController.js";

// router.get('/', async function(req, res, next) {
//   try {
//     const userId = req.session.user.user_id;
//     console.log("User ID:", userId);
//     const user = await execute.getUserById(userId);
//     console.log("User Data:", user);
//     res.render('checkout', { user: req.session.user===undefined?"":req.session.user, myUser: user[0]});
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// });

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