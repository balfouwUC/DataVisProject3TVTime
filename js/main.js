// Select all character images based on a common class name
const characterImages = document.querySelectorAll(".character img");

let characterBox = [
  "frasier_appearances",
  "daphne_appearances",
  "niles_appearances",
  "roz_appearances",
  "martin_appearances",
  "eddie_appearances",
  "bob_appearances",
];

let appearanceList = {
  Frasier: {},
  Daphne: {},
  Niles: {},
  Roz: {},
  Martin: {},
  Eddie: {},
  Bob: {},
};

// Function to handle the click event
function handleCharacterClick(event) {
  // Get the name of the character from the 'alt' attribute of the image
  let characterName = event.target.alt;
  console.log("Character clicked:", characterName);
  let characterBtn = characterName + "_btn";
  characterName = characterName.split("_")[0] + "_appearances";
  console.log(characterBtn);
  let dropDownTitle =
    document.getElementById(characterBtn).innerText + "'s List of Appearances";
  document.getElementById("dropdown_title").innerText = dropDownTitle;
  let selectBox = document.getElementById(characterName);
  // characterBox.innerText = characterName;
  if (selectBox.style.display == "flex") {
    selectBox.style.display = "none";
  } else selectBox.style.display = "flex";
  for (let i = 0; i < characterBox.length; i++) {
    if (characterBox[i] != characterName) {
      document.getElementById(characterBox[i]).style.display = "none";
    }
  }
  let counter = 0;
  for (let i = 0; i < characterBox.length; i++) {
    if (document.getElementById(characterBox[i]).style.display == "none") {
      counter += 1;
    }
  }
  if (counter == characterBox.length) {
    document.getElementById("character_appearances").style.display = "none";
  } else
    document.getElementById("character_appearances").style.display = "flex";
}

// Attach the event listener to each image
characterImages.forEach((image) => {
  image.addEventListener("click", handleCharacterClick);
});

// load the file for character importance for whole - barchart
d3.json("data/frasier_transcripts/character_data_whole_season.json")
  .then(function (data) {
    // console.log(data);
    // const barchart = new Barchart(
    //   { parentElement: "#barchart" }, // The selector for the container to hold the bar chart
    //   data
    // );
  })
  .catch(function (error) {
    // Handle any errors that occur during loading
    console.error("Error loading the JSON file:", error);
  });

d3.json("data/frasier_transcripts/characters_by_episode.json")
  .then(function (data) {
    console.log(data);
    for (let season in data) {
      for (let episode in data[season]) {
        for (let character in data[season][episode]) {
          if (character in appearanceList) {
            if (!(season in appearanceList[character])) {
              appearanceList[character][season] = {};
            }
            if (!(episode in appearanceList[character][season])) {
              appearanceList[character][season][episode] = {};
            }
            appearanceList[character][season][episode] =
              data[season][episode][character].length;
          }
        }
      }
    }
    console.log(appearanceList);
    for (let character in appearanceList) {
      let characterName = character.toLowerCase() + "_appearances";
      let selectBox = document.getElementById(characterName);
      let seasonsNames = "";
      let sig10 = false;
      let sig11 = false;
      for (let season in appearanceList[character]) {
        if (season == "season_10") {
          sig10 = true;
        } else if (season == "season_11") {
          sig11 = true;
        } else {
          let seasonName = season.split("_");
          seasonName[0] =
            seasonName[0].charAt(0).toUpperCase() + seasonName[0].slice(1);
          for (let word in seasonName) {
            seasonsNames = seasonsNames + seasonName[word] + " ";
          }
          seasonsNames = seasonsNames.slice(0, -1);
          seasonsNames = seasonsNames + ",";
        }
      }
      if (sig10) {
        seasonsNames = seasonsNames + "Season 10,";
      }
      if (sig11) {
        seasonsNames = seasonsNames + "Season 11,";
      }
      seasonsNames = seasonsNames.slice(0, -1);
      seasonsNames = seasonsNames.split(",");

      function sortEpisodes(obj) {
        // Custom sorting function
        function customSort(a, b) {
          // Extract the second word of each key and parse it as a number
          let numA = parseInt(a.split("_")[1]);
          let numB = parseInt(b.split("_")[1]);
          // Compare the numbers
          return numA - numB;
        }

        // Sort the keys of the object using the custom sorting function
        let sortedKeys = Object.keys(obj).sort(customSort);

        // Create a new object with sorted keys
        let sortedObj = {};
        sortedKeys.forEach(function (key) {
          sortedObj[key] = obj[key];
        });
        return sortedObj;
      }
      for (let character in appearanceList) {
        for (let season in appearanceList[character]) {
          appearanceList[character][season] = sortEpisodes(
            appearanceList[character][season]
          );
        }
      }

      // selectBox.innerText =
      //   character + " appears in the following seasons: " + seasonsNames;

      // Create a table element
      let table = document.createElement("table");
      table.style.borderCollapse = "collapse"; // Collapse borders

      // Create header row for seasons
      let headerRow = document.createElement("tr");
      seasonsNames.forEach(function (season) {
        let seasonHeaderCell = document.createElement("th");
        seasonHeaderCell.textContent = season;
        seasonHeaderCell.colSpan = 2; // Each season has two columns
        seasonHeaderCell.style.border = "1px solid black"; // Add border
        headerRow.appendChild(seasonHeaderCell);
      });
      table.appendChild(headerRow);

      // Create subheading row for episode name and length
      let subheaderRow = document.createElement("tr");
      seasonsNames.forEach(function (season) {
        let episodeNameHeaderCell = document.createElement("th");
        episodeNameHeaderCell.textContent = "Episode Name";
        episodeNameHeaderCell.style.border = "1px solid black"; // Add border
        subheaderRow.appendChild(episodeNameHeaderCell);
        let episodeLengthHeaderCell = document.createElement("th");
        episodeLengthHeaderCell.textContent = "Length";
        episodeLengthHeaderCell.style.border = "1px solid black"; // Add border
        subheaderRow.appendChild(episodeLengthHeaderCell);
      });
      table.appendChild(subheaderRow);

      // Add episodes and lengths
      let numSeasons = Object.keys(appearanceList[character]).length;
      let maxEpisodes = 0;
      let numEpisodes = [];
      for (let season in appearanceList[character]) {
        // console.log(season);
        if (
          maxEpisodes < Object.keys(appearanceList[character][season]).length
        ) {
          maxEpisodes = Object.keys(appearanceList[character][season]).length;
        }
        numEpisodes.push(Object.keys(appearanceList[character][season]).length);
      }
      // console.log(numSeasons);
      // console.log(maxEpisodes);
      // console.log(numEpisodes);
      for (let j = 0; j < maxEpisodes; j++) {
        let row = document.createElement("tr");
        for (let i = 0; i < numSeasons; i++) {
          if (j < numEpisodes[i]) {
            let numLines =
              appearanceList[character][
                Object.keys(appearanceList[character])[i]
              ][
                Object.keys(
                  appearanceList[character][
                    Object.keys(appearanceList[character])[i]
                  ]
                )[j]
              ];
            let episodeName = Object.keys(
              appearanceList[character][
                Object.keys(appearanceList[character])[i]
              ]
            )[j];
            let episodeNameCell = document.createElement("td");
            episodeNameCell.textContent = episodeName.replace(/_/g, " ");
            episodeNameCell.style.border = "1px solid black"; // Add border
            row.appendChild(episodeNameCell);
            let episodeLengthCell = document.createElement("td");
            episodeLengthCell.textContent = numLines + " lines";
            episodeLengthCell.style.border = "1px solid black"; // Add border
            row.appendChild(episodeLengthCell);
          } else {
            let episodeNameCell = document.createElement("td");
            episodeNameCell.textContent = null;
            episodeNameCell.style.border = "1px solid black"; // Add border
            row.appendChild(episodeNameCell);
            let episodeLengthCell = document.createElement("td");
            episodeLengthCell.textContent = null;
            episodeLengthCell.style.border = "1px solid black"; // Add border
            row.appendChild(episodeLengthCell);
          }
        }
        table.appendChild(row);
      }
      // seasonsNames.forEach(function (season) {
      //   let episodes =
      //     appearanceList[character][season.toLowerCase().replace(" ", "_")];
      //   for (let episodeName in episodes) {
      //     let row = document.createElement("tr");
      //     let episodeNameCell = document.createElement("td");
      //     episodeNameCell.textContent = episodeName.replace("_", " ");
      //     episodeNameCell.style.border = "1px solid black"; // Add border
      //     row.appendChild(episodeNameCell);
      //     let episodeLengthCell = document.createElement("td");
      //     episodeLengthCell.textContent = episodes[episodeName] + " lines";
      //     episodeLengthCell.style.border = "1px solid black"; // Add border
      //     row.appendChild(episodeLengthCell);
      //     table.appendChild(row);
      //   }
      // });

      // Append the table to the <p> element
      selectBox.appendChild(table);
    }
  })
  .catch(function (error) {
    // Handle any errors that occur during loading
    console.error("Error loading the JSON file:", error);
  });
=======
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


d3.json("data/frasier_transcripts/full_conversation_data.json").then(function(data){
  const conversationHistogram = new WordLengthHisto(
    {parentElement: "#word-length-histo"},
    data
  );
}).catch(function(error){
  console.error("Error loading the JSON file:", error);
});