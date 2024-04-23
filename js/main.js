document.addEventListener('DOMContentLoaded', function() {
  const characterImages = document.querySelectorAll('.character img');
  characterImages.forEach(image => {
    image.addEventListener('click', function(event) {
      document.querySelectorAll('.character-link').forEach(link => {
        link.classList.remove('selected');
      });

      const characterName = event.target.alt;
      const charData = getCharacterDataForSeasonRange(1, 11, characterName);
      renderWordCloud(charData);
      const charData2 = getPhraseDataForSeasonRange(1, 11, characterName);
      renderPhraseCloud(charData2);
      document.querySelectorAll('.character').forEach(character => {
        character.classList.remove('selected');
      });
      const characterElement = event.target.closest('.character');
      characterElement.classList.add('selected');
    });
  });

  const characterLinks = document.querySelectorAll('.character-link');
  characterLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      document.querySelectorAll('.character img').forEach(img => {
        img.closest('.character').classList.remove('selected');
      });

      const characterName = this.textContent.split(' ')[0];
      const char = getCharacterDataForSeasonRange(1, 11, characterName);
      renderWordCloud(char);
      const char1 = getPhraseDataForSeasonRange(1, 11, characterName);
      renderPhraseCloud(char1);

      document.querySelectorAll('.character-link').forEach(link => {
        link.classList.remove('selected');
      });
      this.classList.add('selected');
    });
  });
const resetButton = document.getElementById('reset-button'); 
  resetButton.onclick = function() {
    resetSeasonSelection(); 
  }; 
  const select = document.getElementById('season-select');
  select.addEventListener('change', updateSeasonSelection);
  
  resetSeasonSelection();  // Initialize the word cloud with default selection
});

function handleCharacterClick(event) {
  const characterName = event.target.alt;
  const char = getCharacterDataForSeasonRange(1, 11, characterName); 
  renderWordCloud(char); 
  const char1 = getPhraseDataForSeasonRange(1, 11, characterName); 
  renderPhraseCloud(char1); 
  document.querySelectorAll('.character').forEach(character => {
    character.classList.remove('selected');
  });
  const characterElement = event.target.closest('.character');
  characterElement.classList.add('selected');
}

function resetSeasonSelection(event) {
  const selectElement = document.getElementById('season-select');
  const options = selectElement.options;
  for (let i = 0; i < options.length; i++) {
    options[i].selected = false;
  } 
  const characterElement = document.querySelector('.character.selected img');
  if (characterElement) {
    const characterName = characterElement.alt;
    const charData = getCharacterDataForSeasonRange(1, 11, characterName);
      renderWordCloud(charData);
    const charData2 = getPhraseDataForSeasonRange(1, 11, characterName); 
    renderPhraseCloud(charData2); 
  }
  const sideCharacterElement = document.querySelector('.character-link'); 
  if (sideCharacterElement) {
    const fullName = sideCharacterElement.textContent;
    const firstName = fullName.split(' ')[0]; // Assuming you want to display only the first name
    const charData = getCharacterDataForSeasonRange(1, 11, firstName);
    renderWordCloud(charData);
    const charData2 = getPhraseDataForSeasonRange(1, 11, firstName); 
    renderPhraseCloud(charData2);
  }
  return [1, 11]; 
}

document.addEventListener('DOMContentLoaded', function() {
  const select = document.getElementById('season-select');
  select.addEventListener('change', updateSeasonSelection);
}); 
document.addEventListener('DOMContentLoaded', function() {
  resetSeasonSelection();  // Initialize the word cloud with default selection
}); 
function updateSeasonSelection() {
  const select = document.getElementById('season-select');
  const selectedOptions = select.querySelectorAll('option:checked');
  
  if (selectedOptions.length === 0) {
    console.warn('No seasons selected.');
    return [];
  }
  const selectedSeasons = Array.from(selectedOptions).map(opt => parseInt(opt.value));
  const minSeason = Math.min(...selectedSeasons);
  const maxSeason = Math.max(...selectedSeasons);

  if (!Number.isInteger(minSeason) || !Number.isInteger(maxSeason)) {
    console.error('Invalid season range:', minSeason, 'to', maxSeason);
    return [minSeason, maxSeason];
  }

  updateCharacterData('.character.selected img', minSeason, maxSeason); // Main character
  updateCharacterData('.character-link', minSeason, maxSeason); // Side character

  return [minSeason, maxSeason];
}

function updateCharacterData(selector, minSeason, maxSeason) {
  const characterElements = document.querySelectorAll(selector);
  
  characterElements.forEach(characterElement => {
    const characterName = characterElement.alt || characterElement.textContent.split(' ')[0]; 
    if (characterName) {
      const charData = getCharacterDataForSeasonRange(minSeason, maxSeason, characterName);
      renderWordCloud(charData);
      const charData2 = getPhraseDataForSeasonRange(minSeason, maxSeason, characterName); 
      renderPhraseCloud(charData2); 
    } else {
      console.warn('No character selected or incorrect selector.');
    }
  });
}
let processedData = {};
let processedPhrases = {}; 
function cleanText(text) {
  return text.toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()'\[\]""?]/g, "") // Extended to include [] ' "
    .replace(/\s{2,}/g, " "); // Collapse multiple spaces to a single space
}

function processDialogues(data) {
  let wordsCount = {};
  const stopwords = [
    'and', 'the', 'to', 'of', 'a', 'in', 'that', 'it', 'is', 'i',
    'you', 'for', 'on', 'with', 'as', 'this', 'by', 'are', 'was', 'be', 'an', 'my', 'your', 'all', 'no','he', 'her', 'me', 'them','they','up','do','have','im','at', 'go','its', 'if', 'us'
,'his', 'ill','so','not','dont', 'do','ive','yes','am','she','but','we','him','you','your', 'youre', 'dr', 'did', 'of', 'off', 'then', 'can', 'our', 'see','id','has', 'right', 'about','what', 'how',
'get','like', 'or','just', 'well','thats','from','ii'
  ];
  for (let character in data) {
      wordsCount[character] = {};
      for (let season in data[character]) {
          let dialogues = data[character][season].join(' '); 
          let words = cleanText(dialogues).split(/\s+/);
          words = words.filter(word => !stopwords.includes(word) && word.length > 1);
          wordsCount[character][season] = words.reduce((acc, word) => {
              acc[word] = (acc[word] || 0) + 1;
              return acc;
          }, {});
      }
  }
  return wordsCount;
}

function getCharacterDataForSeasonRange(firstSeason, lastSeason, characterName) {
  let allWords = {};
  let totalWordCount = 0;
  for (let season = firstSeason; season <= lastSeason; season++) {
    let seasonKey = "season_" + season;
    if (processedData[seasonKey] && processedData[seasonKey][characterName]) {
      let seasonWords = processedData[seasonKey][characterName];
      Object.keys(seasonWords).forEach(word => {
        if (allWords.hasOwnProperty(word)) {
          allWords[word] += seasonWords[word];
        } else {
          allWords[word] = seasonWords[word];
        }
        totalWordCount += seasonWords[word];
      });
    }
  }
  return {
    words: allWords,
    totalWordCount: totalWordCount
  };
}

function renderWordCloud(characterData) {
  if (!characterData || !Object.keys(characterData.words).length) {
    d3.select('word-cloud-word').append("p")
            .style("text-align", "center")
            .style("margin-top", "50px")
            .text("Select a character to view the word cloud.");
    return; 
  }
  let wordsArray = Object.keys(characterData.words)
  .map(word => ({
    text: word,
    size: characterData.words[word],
    fontSize: characterData.words[word] 
  }))
  .sort((a, b) => b.size - a.size) 
  .slice(0, 100); 
  const width = 500;
  const height = 500;
  const cloudDiv = d3.select("#word-cloud-word");
const randomColors = ["#000000", "#36454F", "#023020", "#301934", "#1A1D94", "#349cba", "#43a29e", "#fd88d4", "#d5758c", "#26711b", "#8deca6", "#3df62c"]
randomColors.sort(() => Math.random() - 0.5);
const colorScale = d3.scaleOrdinal()
    .range(randomColors); 
let minSize = d3.min(wordsArray, d => d.fontSize);
let maxSize = d3.max(wordsArray, d => d.fontSize);
const frequencyScale = d3.scaleLinear()
  .domain([minSize, maxSize])
  .range([10, 50]);

  d3.layout.cloud()
    .size([width, height])
    .words(wordsArray)
    .padding(10)
    .rotate(0)
    .fontSize (d => {
      let fsize = frequencyScale(d.fontSize);
      return `${fsize}`;
    }).on("end", draw)
    .start();
    function draw(words) {
      const cloudDiv = d3.select("#word-cloud-word");
      cloudDiv.selectAll("*").remove();  
      const spans = cloudDiv.selectAll("span")
          .data(wordsArray, d => d.text, d=>d.size); 
      const wordElements = spans.enter().append("span")
          .merge(spans)
          .style("position", "absolute")
          .style("font-size", d => {
            const minSize = d3.min(wordsArray, d => d.fontSize);
            const maxSize = d3.max(wordsArray, d => d.fontSize);
            const frequencyScale = d3.scaleLinear()
                .domain([minSize, maxSize])
                .range([10, 50]); 
            const fsize = frequencyScale(d.fontSize);
            return `${fsize}px`; 
        })
          .style("font-family", "Impact")
          .style("color", () => randomColors[Math.floor(Math.random() * randomColors.length)])
          .style("transform", d => `translate(${d.x + width / 2}px, ${d.y + height / 2}px) rotate(${d.rotate}deg)`)
          .text(d => d.text)
          .on("mouseover", function(event, d) { handleMouseOver.call(this, d.text, d.fontSize); })
          .on("mouseleave", handleMouseLeave);
    
          function handleMouseOver(text, size) {
            const tooltip = d3.select("body").append("div") 
                .attr("class", "tooltip")
                .style("position", "absolute")
                .style("left", `${event.pageX + 10}px`) 
                .style("top", `${event.pageY + 10}px`)
                .style("padding", "5px")
                .style("background-color", "black")
                .style("color", "white")
                .style("border-radius", "8px")
                .style("opacity", 0.9)
                .html(`<strong>Word:</strong> ${text}<br><strong>Frequency:</strong> ${size}`);
          }
        
          function handleMouseLeave() {
            d3.select(".tooltip").remove(); 
          }
    
      spans.exit().remove();  
    }
}
function processPhrases(data) {
  let phraseCount = {};
  for (let character in data) {
    phraseCount[character] = {};
    for (let season in data[character]) {
      let dialogues = data[character][season].join(' ');
      let phrases = extractPhrases(dialogues);
      phraseCount[character][season] = phrases.reduce((acc, phrase) => {
        acc[phrase] = (acc[phrase] || 0) + 1;
        return acc;
      }, {});
    }
  }
  return phraseCount;
}
function extractPhrases(text) {
  return text.replace(/[\r\n]+/g, ' ') 
    .split(/(?<=[.?!])\s+/)
    .map(phrase => phrase.replace(/[^\w\s]|_/g, '').trim().toLowerCase()) 
    .filter(phrase => {
      const wordCount = phrase.split(/\s+/).length; 
      return wordCount >= 2 && wordCount <= 5; 
    });
}
function getPhraseDataForSeasonRange(firstSeason, lastSeason, characterName) {
  let allPhrases = {};
  let totalPhraseCount = 0;
  for (let season = firstSeason; season <= lastSeason; season++) {
    let seasonKey = "season_" + season;
    if (processedPhrases[seasonKey] && processedPhrases[seasonKey][characterName]) {
      let seasonPhrases = processedPhrases[seasonKey][characterName];
      Object.keys(seasonPhrases).forEach(phrase => {
        if (allPhrases.hasOwnProperty(phrase)) {
          allPhrases[phrase] += seasonPhrases[phrase];
        } else {
          allPhrases[phrase] = seasonPhrases[phrase];
        }
        totalPhraseCount += seasonPhrases[phrase];
      });
    }
  }
  return {
    phrases: allPhrases,
    totalPhraseCount: totalPhraseCount
  };
}
function renderPhraseCloud(phraseData) {
  let phrasesArray = Object.keys(phraseData["phrases"]).map(phrase => ({
    text: phrase,
    size: phraseData["phrases"][phrase],
    fontSize: phraseData["phrases"][phrase] 
  })).sort((a, b) => b.size - a.size)
  .slice(0, 100); 
const randomColors = ["#000000", "#36454F", "#023020", "#301934", "#1A1D94", "#349cba", "#43a29e", "#fd88d4", "#d5758c", "#26711b", "#8deca6", "#3df62c"]
randomColors.sort(() => Math.random() - 0.5);
const colorScale = d3.scaleOrdinal().range(randomColors); 
let minSize = d3.min(phrasesArray, d => d.fontSize);
let maxSize = d3.max(phrasesArray, d => d.fontSize);
const frequencyScale = d3.scaleLinear()
  .domain([minSize, maxSize])
  .range([10, 50]);
  const width = 500;
  const height = 500;
  d3.layout.cloud()
    .size([width, height])
    .words(phrasesArray)
    .padding(10)
    .rotate(0)
    .fontSize(d => Math.max(10, Math.min(d.size * 2, 50))) // Scale fontSize
    .on("end", draw)
    .start();

  function draw(words) {
    const cloudDiv = d3.select("#word-cloud-phrase");
    cloudDiv.selectAll("span").remove(); 
    cloudDiv.selectAll("span")
      .data(words)
      .enter().append("span")
        .style("position", "absolute")
        .style("font-size", d => `${d.size}px`)
        .style("font-family", "Impact")
        .style("color", () => randomColors[Math.floor(Math.random() * randomColors.length)])
        .style("transform", d => `translate(${d.x + width / 2}px, ${d.y + height / 2}px) rotate(${d.rotate}deg)`)
        .text(d => d.text)
        .on("mouseover", function(event, d) { handleMouseOver.call(this, d.text, d.fontSize); })
        .on("mouseleave", handleMouseLeave);
  
        function handleMouseOver(text, size) {
          const tooltip = d3.select("body").append("div") 
              .attr("class", "tooltip")
              .style("position", "absolute")
              .style("left", `${event.pageX + 10}px`)
              .style("top", `${event.pageY + 10}px`)
              .style("padding", "5px")
              .style("background-color", "black")
              .style("color", "white")
              .style("border-radius", "8px")
              .style("opacity", 0.9)
              .html(`<strong>Word:</strong> ${text}<br><strong>Frequency:</strong> ${size}`);
        }
      
        function handleMouseLeave() {
          d3.select(".tooltip").remove(); 
        }
    }
}


d3.json("data/frasier_transcripts/character_data_whole_season.json").then(function(data) {
  const barchart = new Barchart(
    {parentElement: "#barchart"}, 
    data
    );
}).catch(function(error) {
  console.error("Error loading the JSON file:", error);
});

document.addEventListener('DOMContentLoaded', function () {
d3.json("data/frasier_transcripts/characters_by_season.json").then(function(data) {
  processedData = processDialogues(data); 
  processedPhrases = processPhrases(data); 
  const barchart = new StackedBarchart(
    {parentElement: "#stacked-barchart"}, 
    data
    );
}).catch(function(error) {
  console.error("Error loading the JSON file:", error);
});
})