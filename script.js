const startButton = document.getElementById("startButton");
const pages = document.querySelectorAll(".page");

let wordList = [];
let game;

const URL = "https://raw.githubusercontent.com/dwyl/english-words/refs/heads/master/words_alpha.txt";
async function fetchText(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    let text = await response.text();
    wordList = text.split("\n").map(word => word.trim());

    startButton.disabled = false;
  } catch (e) {
    console.error(e);
  }
}
fetchText(URL);

function newGame() {
    pages[0].style.display = "none";
    pages[1].style.display = "flex";

    game = new Game(settings, rewards, letterBag, wordList);
    game.nextLevel();
}