const checkoutController = {};
import axios from "axios";

// Function to create an order using Paymob's API
checkoutController.toPaymob = async (req, res) => {
  try {
    const toPaymobOrder = await createOrder();
    
    // Redirect user to Paymob's payment page with orderId
    res.redirect(`https://paymob.com/link-to-payment-page/${toPaymobOrder}`);
  } catch (error) {
    // Handle error
    res.status(500).send('Error initiating payment');
  }
}

// Function to create an order using Paymob's API
async function createOrder(req) {
  try {
    const paymobApiUrl = 'https://accept.paymob.com/api/ecommerce/orders';

    const { delivery_needed, amount_cents, order_id } = req.body;

    const payload = {
      "auth_token": "ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2T1RReE1EUXhMQ0p1WVcxbElqb2lhVzVwZEdsaGJDSjkuX0tyTGZoR2FnR2xYclZqc0FKb2JiY09zYXBDTGwxa2RXa1paQi0wYTlIT2FzVDVlbUMyU3lzcXhtdVhUN25aVTBFZk1JZzFoZ1ZsRkJ5VkhUMktaekE=",
      "delivery_needed": delivery_needed,
      "amount_cents": amount_cents,
      "currency": "EGP",
      "merchant_order_id": order_id,
    };

    const response = await axios.post(paymobApiUrl, payload);
    
    if (response && response.data && response.data.id) {
      // Order creation successful, return the order ID
      return response.data.id;
    } else {
      // Handle error scenario where order creation failed
      throw new Error('Failed to create order');
    }
  } catch (error) {
    // Handle any exceptions or errors
    console.error('Error creating order:', error.message);
    throw error;
  }
}

export default checkoutController;