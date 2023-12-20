const checkoutController = {};
import fs from "fs";
import execute from "../queries/checkoutQueries.js";
import axios from "axios";

// Function to create an order using Paymob's API
checkoutController.toPaymob = async (req, res) => {
  try {
   

    const itemid=req.body.item_id;
    const userid=req.body.user_id;
    const item_quantity=req.body.item_quantity;
    console.log(itemid,userid,item_quantity)
    
   await execute.placeorder(itemid,userid,item_quantity);
    const toPaymobOrder = await createOrder();
    
    // Redirect user to Paymob's payment page with orderId
    res.redirect(`https://paymob.com/link-to-payment-page/${toPaymobOrder}`);
   
  } catch (error) {
    console.log(error)
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

checkoutController.checkout = async(req,res)=>{
const user = req.body.prod_Info_checkout;
const subtotal = req.body.prod_Quantity_checkout;
console.log(user);
const results = await execute.checkout(user);
try{
  let products= []
if(results.length>0){

    products = results;
    console.log(products);
    res.render('checkout.ejs', { user: req.session.user === undefined ? '' : req.session.user, products ,subtotal});
}
}catch(error){
  console.error('Error :', error);
  // res.render('404.ejs', { user: req.session.user === undefined ? '' : req.session.user });

}
};

export default checkoutController;