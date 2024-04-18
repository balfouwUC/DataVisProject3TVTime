// Select all character images based on a common class name
const characterImages = document.querySelectorAll('.character img');

// Function to handle the click event
function handleCharacterClick(event) {
  // Get the name of the character from the 'alt' attribute of the image
  const characterName = event.target.alt;
  console.log('Character clicked:', characterName);
}

// Attach the event listener to each image
characterImages.forEach(image => {
  image.addEventListener('click', handleCharacterClick);
});