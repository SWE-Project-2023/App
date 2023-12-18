
function addToBag(event) {
  event.preventDefault();

  // Get the item ID from the data attribute
  const productId = $(event.target).closest('form').data('product-id');
  const userId = $(event.target).closest('form').data('user-id');
  // Set the aria-hidden attribute to false for the form in the header
  // const addToBagForm = $('.min-cart');
  // addToBagForm.attr('aria-hidden', 'false');

  // Use Ajax to send a request to the server to add the item to the cart
  $.ajax({
      url: '/product/cart/add', // Replace with your server endpoint for adding to the cart
      method: 'POST',
      data: { itemId: productId, userId: userId },
      success: function (response) {
          console.log('Server response:', response);
          const quantity = response.quantity;
          const itemId = response.item_id;

          // to pass the user_id to the input tag in the form
          const userIdInput = $('#userId');
          const currentuserIds = userIdInput.val(userId);
          if (response.quantity > 1) {
              updateCartItemQuantity(itemId, quantity);
          } else {
              createCartItemDiv(response);
          }

          console.log('Item added to bag:', response);
      },
      error: function (error) {
          console.error('Error adding to bag:', error);
      },
  });
}

// Load cart state from local storage
function loadCartState() {
  const storedCartState = localStorage.getItem('cartState');
  return storedCartState ? JSON.parse(storedCartState) : [];
}

// Render the cart based on the loaded state
function renderCartFromState(cartState) {
  console.log("cartState:",cartState)
  for (const item of cartState) {
    console.log("item")
      createCartItemDiv(item);
  }
}

// Add event listeners for quantity increment and decrement
$('#cart').on('click', '.quanity_btn', function (event) {
  event.preventDefault();
  const quantityInput = $(this).siblings('.quantity_val');
  const cartItem = $(this).closest('.cart-item');
  const priceElement = cartItem.find('.product-price');

  let quantity = parseInt(quantityInput.val(), 10) || 0;
  if ($(this).hasClass('inc')) {
      // Increment button clicked
      quantity += 1;
  } else if ($(this).hasClass('dec')) {
      // Decrement button clicked
      quantity = Math.max(1, quantity - 1); // Ensure quantity doesn't go below 1
  }
  quantityInput.val(quantity);

  // Update the price based on the quantity change
  updatePrice(quantity, priceElement);
});

// Function to update the price based on the quantity
function updatePrice(quantity, priceElement) {
  const unitPrice = parseFloat(priceElement.data('price'));
  const totalPrice = unitPrice * quantity;
  priceElement.text(`EGY ${totalPrice.toFixed(2)}`);
}

// Load cart state from local storage on page load
$(document).ready(function () {
  const cartState = loadCartState();
  renderCartFromState(cartState);
  console.log("ji")
});

function createCartItemDiv(response) {
  // ... (your existing code for creating cart item div)
  const itemName = response.item_title;
      const itemPrice = response.item_price;
      const quantity = response.quantity;
      const itemId = response.item_id
  
      console.log("itemNamel"+itemName)
      // Create the cart item container
      
      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');
      cartItem.setAttribute('data-item-id', itemId);
  
      
  
      // Create the cart item info container
      const cartItemInfo = document.createElement('div');
      cartItemInfo.classList.add('cart-item-info');
  
      // Create the cart product info container
      const cartProductInfo = document.createElement('div');
      cartProductInfo.classList.add('cart_product_info');
  
      // Create the product name link
      const productNameLink = document.createElement('a');
      productNameLink.href = '#';
      productNameLink.classList.add('product-name');
      productNameLink.textContent = itemName;
  
      // Create the cart product price container
      const cartProductPrice = document.createElement('div');
      cartProductPrice.classList.add('cart_product_price');
  
      // Create the product price span
      const productPriceSpan = document.createElement('span');
      productPriceSpan.classList.add('product-price');
      productPriceSpan.dataset.price = itemPrice;
      productPriceSpan.textContent = `EGY ${itemPrice}`;
  
      // Append elements to their respective containers
      cartProductInfo.appendChild(productNameLink);
      cartProductPrice.appendChild(productPriceSpan);
      cartProductInfo.appendChild(cartProductPrice);
      cartItemInfo.appendChild(cartProductInfo);
  
      // Create the min-cart-quantity container
      const minCartQuantity = document.createElement('div');
      minCartQuantity.classList.add('min-cart_quanity');
  
      // Create the quantity container
      const quantityContainer = document.createElement('div');
      quantityContainer.classList.add('quanity');
  
      // Create the increment button
      const incrementButton = document.createElement('button');
      incrementButton.classList.add('quanity_btn', 'dec');
      incrementButton.innerHTML = '<i class="fa-solid fa-minus"></i>';
  
      // Create the quantity input
      const quantityInput = document.createElement('input');
      quantityInput.type = 'text';
      quantityInput.classList.add('quantity_val');
      quantityInput.value = quantity;
  
      // Create the decrement button
      const decrementButton = document.createElement('button');
      decrementButton.classList.add('quanity_btn', 'inc');
      decrementButton.innerHTML = '<i class="fa-solid fa-plus"></i>';
  
      // Append elements to their respective containers
      quantityContainer.appendChild(incrementButton);
      quantityContainer.appendChild(quantityInput);
      quantityContainer.appendChild(decrementButton);
  
      // Create the remove link
      const removeLink = document.createElement('a');
      removeLink.href = '#';
      removeLink.classList.add('remove_link');
      removeLink.textContent = 'Remove';
  
      // Append elements to the min-cart-quantity container
      minCartQuantity.appendChild(quantityContainer);
      minCartQuantity.appendChild(removeLink);
  
      // Append the min-cart-quantity container to the cart item container
      cartItemInfo.appendChild(minCartQuantity);
  
      // Append the cart item info to the cart item container
      cartItem.appendChild(cartItemInfo);
  
      // Append the cart item container to the #cart div
      document.getElementById('cart').appendChild(cartItem);
  // Save the updated cart state to local storage
  saveCartState();
}

function updateCartItemQuantity(itemId, quantity) {
console.log("Item ID:", itemId);
  console.log("Quantity:", quantity);

  const cartItem = $(`.cart-item[data-item-id=${itemId}]`);
 

  const quantityInput = cartItem.find('.quantity_val');
  console.log("Quantity Input:", quantityInput);

  quantityInput.val(quantity);
  saveCartState();
}

// Save cart state to local storage
function saveCartState() {
  const cartState = [];
  
  // Iterate through cart items and save relevant information to cartState array
  $('.cart-item').each(function () {
      const item_id = $(this).data('item-id');
      const quantity = $(this).find('.quantity_val').val();
      const item_title=$(this).find(".product-name").text();
      const price =$(this).find(".product-price").text();
      // Add more details as needed
      cartState.push({ item_id, quantity,item_title,price});
  });
  console.log("cartStateee"+cartState)
  localStorage.setItem('cartState', JSON.stringify(cartState));
}







$('.delete').on('click', function(event) {
  event.preventDefault();
  const productId = $(this).data('product-id');

  // Use AJAX to send a request to delete the item from the cart
  $.ajax({
      url: '/product/cart/delete', // Replace with your server endpoint for deleting from the cart
      method: 'POST',
      data: { productId: productId },
      success: function(response) {
          console.log('Item deleted from cart:', response);

          $(this).closest('tr').remove();
          window.location.href = '/product/cart';
      },
      error: function(error) {
          console.error('Error deleting item from cart:', error);
      }
  });
});

