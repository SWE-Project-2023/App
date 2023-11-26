
function updateDivHeight() {
    const dynamicDiv = document.getElementById('dynamicDiv');
    const windowHeight = window.innerWidth;
  
    // You can adjust this calculation based on your needs371.2px
   if(windowHeight<=1000){
      const newHeight = windowHeight * 0.99; 

      dynamicDiv.style.height = `${newHeight}px`;
   }else{
      const newHeight = windowHeight * 0.34; 

      dynamicDiv.style.height = `${newHeight}px`;
   }
  }

  // Initial update on page load
  updateDivHeight();

  // Update on window resize
  window.addEventListener('resize', updateDivHeight);


  function changeImage(index) {
  const imgSlider = document.querySelector('.imgslider');
  imgSlider.style.transform = `translateX(-${index * 100}%)`;

  const allLinks = document.querySelectorAll('.item');
  allLinks.forEach(link => {
      link.style.border = 'none';
  });

  const selectedLink = document.querySelector(` .item:nth-child(${index + 1})`);
  selectedLink.style.border = '2px solid black';
}
  
function adjustProductItems() {
let productItems = document.querySelectorAll('.product_Item');
let windowWidth = window.innerWidth;

// Loop through each product item and update its left percentage
if (window.innerWidth >= 1000) {
productItems.forEach(function(item, index) {
  item.style.position = 'absolute';
  item.style.left = (index * 20) + '%';
});}else{
  productItems.forEach(function(item) {
      item.style.position = '';
      item.style.left = '';
  });
}
}


// Add a resize event listener to reapply adjustments when the window is resized
window.addEventListener('resize', adjustProductItems);
adjustProductItems();


const productSlider = document.getElementById('productSlider');
let currentIndex = 0;
const itemsToSlide = (productSlider.children.length / 2);
function nextSlide() {
  const maxIndex = productSlider.children.length - itemsToSlide;
  if (currentIndex < maxIndex) {
      currentIndex += itemsToSlide;
      updateSliderTransform();
  }
  toggleButtons();
}

function prevSlide() {
  if (currentIndex > 0) {
      currentIndex -= itemsToSlide;
      updateSliderTransform();
  }
  toggleButtons();
}

function updateSliderTransform() {
  let windowWidth = window.innerWidth;
  console.log(windowWidth);
  if(windowWidth>=1000){
  const translateValue = -currentIndex * 100 / itemsToSlide + '%';
  productSlider.style.transform = 'translateX(' + translateValue + ')';
  }else{
      productSlider.style.transform = 'none';
  }
}
window.addEventListener('resize', updateSliderTransform);
function toggleButtons() {
  const maxIndex = productSlider.children.length - itemsToSlide;
  nextButton.disabled = currentIndex >= maxIndex;
  prevButton.disabled = currentIndex === 0;
}

function increment() {
const quantityInput = document.getElementById('quantity_value');
let currentValue = parseInt(quantityInput.value, 10);

if (!isNaN(currentValue)) {
  currentValue++;
  quantityInput.value = currentValue;
}
}

function decrement() {
const quantityInput = document.getElementById('quantity_value');
let currentValue = parseInt(quantityInput.value, 10);

if (!isNaN(currentValue) && currentValue > 1) {
  currentValue--;
  quantityInput.value = currentValue;
}
}

document.addEventListener('DOMContentLoaded', function () {
const productInfoAccordion = document.querySelector('.product_descrption .card');
const deliveryAccordion = document.querySelector('.product_item_delivery .contextbox');

productInfoAccordion.addEventListener('click', function (event) {
  this.classList.toggle('active');

  const detailsBlock = this.querySelector('.details_block');
  if (this.classList.contains('active')) {
      detailsBlock.style.height = detailsBlock.scrollHeight + 'px';
      this.querySelector("i").classList.replace("fa-plus","fa-minus");
  } else {
      detailsBlock.style.height = '0';
      this.querySelector("i").classList.replace("fa-minus","fa-plus");
  }
});

deliveryAccordion.addEventListener('click', function (event) {
  this.classList.toggle('active');

  const detailsBlock = this.querySelector('.details_block');
  if (this.classList.contains('active')) {
      detailsBlock.style.height = detailsBlock.scrollHeight + 'px';
      this.querySelector("i").classList.replace("fa-plus","fa-minus");

  } else {
      detailsBlock.style.height = '0';
      this.querySelector("i").classList.replace("fa-minus","fa-plus");

  }
});
});