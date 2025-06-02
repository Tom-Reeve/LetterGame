class Game {
    constructor(settings, rewards, letterBag, wordList) {
        this.settings = settings;
        this.rewards = rewards;

        this.gameLetterBag = structuredClone(letterBag);
        this.currentLetterSelection = [];
        this.currentWord = [];
        this.wordList = wordList;
        
        this.level = 0;
        this.requiredScore = 0;

        this.hasEnteredWord = false;
    }
    getRequiredScore(level) {
        return 2 ** (level - 1);
    }
    nextLevel() {
        this.level++;
        this.currentLetterSelection = [];
        this.currentWord = [];
        this.requiredScore = this.getRequiredScore(this.level);

        this.setUpLetterBoxes();
        this.setUpLetterBag();
        this.checkKeysPressed();
    }
    setUpLetterBoxes() {
        let maxWordLength = this.settings.maxWordLength;
        let letterBoxContainer = document.getElementById("letterBoxContainerSmall");

        for (let i = 0 ; i < maxWordLength ; i++) {
            let letterBoxWrapper = document.createElement("div");
            letterBoxWrapper.setAttribute("class", "letterBoxWrapper");

            let letterBoxSpacer = document.createElement("div");
            letterBoxSpacer.setAttribute("class", "letterBoxSpacerLarge");

            let scoreSpacerTop = document.createElement("div");
            scoreSpacerTop.setAttribute("class", "spacerSmall");

            let scoreSpacerBottom = document.createElement("div");
            scoreSpacerBottom.setAttribute("class", "spacerSmall");

            let letterBoxChipCounter = document.createElement("div");
            letterBoxChipCounter.setAttribute("class", "chipCounter");

            let letterBoxMultCounter = document.createElement("div");
            letterBoxMultCounter.setAttribute("class", "multCounter");

            let letterBox = document.createElement("div");
            letterBox.setAttribute("class", "letterBox");

            letterBoxContainer.appendChild(letterBoxWrapper);
            letterBoxContainer.appendChild(letterBoxSpacer);

            letterBoxWrapper.appendChild(letterBoxChipCounter);
            letterBoxWrapper.appendChild(scoreSpacerTop);
            letterBoxWrapper.appendChild(letterBox);
            letterBoxWrapper.appendChild(scoreSpacerBottom);
            letterBoxWrapper.appendChild(letterBoxMultCounter);
        }
    }
    checkKeysPressed() {
        document.addEventListener('keydown', (event) => {
            let keyName = event.key.toUpperCase();
        });
    }
    addLetterToWord(letter) {
    }
    removeLastLetter() {
    }
    setUpLetterBag() {
        let lettersPerHand = this.settings.lettersPerHand;
        let letterBag = document.getElementById("letterBag");

        for (let i = 0 ; i < lettersPerHand ; i++) {
            let letterTileWrapper = document.createElement("div");
            letterTileWrapper.setAttribute("class", "letterTileWrapper");

            let letterTile = document.createElement("div");
            letterTile.setAttribute("class", "letterTile");

            let letterChips = document.createElement("div");
            letterChips.setAttribute("class", "letterTileChips letterTileInfo");

            let letterMult = document.createElement("div");
            letterMult.setAttribute("class", "letterTileMult letterTileInfo");

            let tileValue = this.weightedRandomLetter();
            letterTile.name = tileValue[0];
            letterTile.chips = tileValue[1];
            letterTile.mult = tileValue[2];
            this.currentLetterSelection.push(tileValue[0]);

            letterTile.textContent = letterTile.name;
            letterChips.textContent = letterTile.chips;
            letterMult.textContent = letterTile.mult;

            letterBag.appendChild(letterTileWrapper);
            letterTileWrapper.appendChild(letterTile);
            letterTile.appendChild(letterChips);
            letterTile.appendChild(letterMult);
        }
    }
    weightedRandomLetter() {
        const letterBag = this.gameLetterBag;
        
        let letterValues = Object.values(letterBag);
        let countSum = 0;
        for (let i = 0 ; i < letterValues.length ; i++) {
            countSum += letterValues[i].count;
        }

        let random = Math.random() * countSum;
        let cumulativeWeight = 0;
        for (let i = 0 ; i < letterValues.length ; i++) {
            cumulativeWeight += letterValues[i].count;
            if (cumulativeWeight > random) {
                let letters = Object.keys(letterBag);

                let pickedLetter = letters[i];
                letterValues[i].count--;

                let letterChips = letterValues[i].chips;
                let letterMult = letterValues[i].mult;

                return [pickedLetter, letterChips, letterMult];
            }
        }
    }
}