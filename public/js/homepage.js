const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
var currentIndex = 0;

// Ensure the correct height is set on page load
window.addEventListener('load', () => {
    adjustContainerHeight();
});
 // Add a window resize event listener to update image height
 window.addEventListener('resize', () => {
    adjustContainerHeight();
});

// Define nextSlide function
function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlider();
}

// Create buttons for each slide
const btnContainer = document.querySelector('.slider-btns');
slides.forEach((slide, index) => {
    const button = document.createElement('span');
    button.className = 'slider-btn';
    button.onclick = () => goToSlide(index);
    btnContainer.appendChild(button);
});

function goToSlide(index) {
    currentIndex = index;
    updateSlider();
}

function updateSlider() {
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    // Highlight the active button
    const buttons = document.querySelectorAll('.slider-btn');
    buttons.forEach((button, index) => {
        button.classList.toggle('active', index === currentIndex);
    });
}

var intervalId;

function startAutoPlay() {
    intervalId = setInterval(nextSlide, 3000);
}

function stopAutoPlay() {
    clearInterval(intervalId);
}

startAutoPlay(); // Start auto-play by default

// Stop auto-play on mouseover
slider.addEventListener('mouseenter', stopAutoPlay);

// Resume auto-play on mouseleave
slider.addEventListener('mouseleave', startAutoPlay);

// Adjust container height based on the current slide's image
function adjustContainerHeight() {
    const currentSlide = slides[currentIndex];
    const currentImage = currentSlide.querySelector('img');
    if (currentImage) {
        const imgHeight = currentImage.height;
        document.querySelector('.slider-container').style.height = imgHeight + 'px';
    }
}

// Initial adjustment and on slide change
adjustContainerHeight();
slider.addEventListener('transitionend', adjustContainerHeight);

function adjustProductItems() {
    let productItems = document.querySelectorAll('.product_Item');
    let windowWidth = window.innerWidth;
    
    // Loop through each product item and update its left percentage
    if (window.innerWidth >= 1280) {
    productItems.forEach(function(item, index) {
        item.style.position = 'absolute';
        item.style.left = (index * 20) + '%';
    });}else if(window.innerWidth>=1000 && window.innerWidth<=1279){
        productItems.forEach(function(item,index) {
            item.style.position = 'absolute';
            item.style.left = (index * 25) + '%';
        });
    }else{
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
    let currentindex = 0;
    const itemsToSlide = (productSlider.children.length / 3);
    console.log(productSlider.children.length);
    function NextSlide() {
        const maxIndex = productSlider.children.length - itemsToSlide;
        if (currentindex < maxIndex) {
            currentindex += itemsToSlide;
            updateSliderTransform();
        }
        toggleButtons();
    }

    function PrevSlide() {
        if (currentindex > 0) {
            currentindex -= itemsToSlide;
            updateSliderTransform();
        }
        toggleButtons();
    }

     function updateSliderTransform() {
        let windowWidth = window.innerWidth;
        console.log(windowWidth);
        if(windowWidth>=1280){
        const translateValue = (currentindex === 8) ? '-140%' : -currentindex * 100 / itemsToSlide + '%';
        console.log(currentindex);
        console.log(translateValue);
        productSlider.style.transform = 'translateX(' + translateValue + ')';
        }else if(window.innerWidth>=1000 && window.innerWidth<=1279){
            const translateValue = -currentindex * 100 / itemsToSlide + '%';
            productSlider.style.transform = 'translateX(' + translateValue + ')';
        }else{
            productSlider.style.transform = 'none';
        }
    }
window.addEventListener('resize', updateSliderTransform);
    function toggleButtons() {
        const maxIndex = productSlider.children.length - itemsToSlide;
        nextButton.disabled = currentindex >= maxIndex;
        prevButton.disabled = currentindex === 0;
    }