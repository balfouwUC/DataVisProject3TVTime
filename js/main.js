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

// load the file for character importance for whole - barchart
d3.json("data/frasier_transcripts/character_data_whole_season.json").then(function(data) {
  const barchart = new Barchart(
    {parentElement: "#barchart"}, // The selector for the container to hold the bar chart
    data
    );

}).catch(function(error) {
  // Handle any errors that occur during loading
  console.error("Error loading the JSON file:", error);
});

d3.json("data/frasier_transcripts/characters_by_season.json").then(function(data) {
  console.log(data); 
  const barchart = new StackedBarchart(
    {parentElement: "#stacked-barchart"}, // The selector for the container to hold the bar chart
    data
    );

}).catch(function(error) {
  // Handle any errors that occur during loading
  console.error("Error loading the JSON file:", error);
});