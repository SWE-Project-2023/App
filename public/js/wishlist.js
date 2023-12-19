function addToWishlist(event) {
  event.preventDefault();

  // Get the item ID and user ID from the data attributes of the closest anchor tag
  const productId = $(event.target).closest("a").data("product-id");
  const userId = $(event.target).closest("a").data("user-id");
  // Use AJAX to send a request to the server
  $.ajax({
    url: '/product/wishlist/add',
    method: 'POST',
    data: { productId: productId, userId: userId },
    success: function(response) {
      console.log("item added successfully:", response);
    },
    error: function(error) {
      console.error('Error adding to Wishlist:', error);
    }
  });
}
$('.remove-button').on('click', function(event) {
  event.preventDefault();
  const productId = $(this).data('product-id');

  // Use AJAX to send a request to delete the item from the cart
  $.ajax({
      url: '/product/wishlist/delete', // Replace with your server endpoint for deleting from the cart
      method: 'POST',
      data: { productId: productId },
      success: function(response) {
          console.log('Item deleted from cart:', response);

          location.reload();
        
      },
      error: function(error) {
          console.error('Error deleting item from cart:', error);
      }
  });
});