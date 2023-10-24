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