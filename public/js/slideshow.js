// Define an array of image URLs
const images = [
	'/images/banner1.png',
	'/images/banner2.png',
	'/images/banner3.png',
	'/images/banner4.png',
	'/images/banner5.png',
];

// Define the time (in milliseconds) between image transitions
const switchTime = 6000;

// Get a reference to the image element
const imageElement = document.getElementById('slideshow-image');

// Get a reference to the parent element of the image
const parentElement = imageElement.parentElement;

// Set the parent element's overflow to hidden
parentElement.style.overflow = 'hidden';

var setInitialImageSource = (function() {
    var executed = false;
    return function() {
        if (!executed) {
            executed = true;
            imageElement.src = images[0];
        }
    };
})();

setInitialImageSource();

// Define a variable to keep track of the current image index
let currentIndex = 0;

// Define a function to switch to the next image
function switchImage() {
	// Increment the current index
	currentIndex++;

	// If we've reached the end of the array, wrap around to the beginning
	if (currentIndex >= images.length) {
		currentIndex = 0;
	}

	// Set the new image source
	imageElement.src = images[currentIndex];

	// Slide the image in from the right
	if (currentIndex > 0) {
		imageElement.style.transform = 'translateX(100%)';
		imageElement.style.visibility = 'hidden';
		imageElement.style.transition = 'transform 1s ease-in';
	}

	// Wait for the transition to complete, then reset the position
	setTimeout(() => {
		imageElement.style.visibility = 'visible';
		imageElement.style.transform = 'translateX(0)';
	}, 1000);
}

// Call the switchImage function every switchTime milliseconds
setInterval(switchImage, switchTime);
