class Game {
    constructor(settings, rewards, letterBag, wordList) {
        this.settingsOriginal = settings;
        this.settings = structuredClone(settings);
        this.rewards = rewards;

        this.letterBag = letterBag;
        this.gameLetterBag = structuredClone(letterBag);
        this.currentLetterSelection = [];
        this.currentWord;
        this.wordList = wordList;
        
        this.chips = 0;
        this.mult = 1;
        this.lengthMult = 0;

        this.level = 0;
        this.requiredScore = 0;
        this.score = 0;

        this.hasEnteredWord = false;
        this.isGameOver = false;
        this.checkKeysPressed();
    }
    getRequiredScore(level) {
        return Math.floor(1.5 ** (level + 5));
    }
    nextLevel() {
        this.level++;
        this.currentLetterSelection = [];
        this.currentWord = [];
        this.requiredScore = this.getRequiredScore(this.level);
        this.score = 0;

        this.upgradeRandomLetters();
        this.gameLetterBag = structuredClone(this.letterBag);

        this.setUpLetterBoxes();
        this.setUpLetterBag();

        document.getElementById("remainingHands").textContent = this.settingsOriginal.plays;
        this.settings.plays = this.settingsOriginal.plays;
        document.getElementById("requiredScore").textContent = this.requiredScore;
        document.getElementById("score").textContent = this.score;
        document.getElementById("round").textContent = this.level
    }
    upgradeRandomLetters() {
        let letters = Object.values(this.letterBag);
        let improved = [];

        let randomCount = Math.floor(Math.random() * 3) + 1;
        for (let i = 0 ; i < randomCount ; i++) {
            let randomIndex = Math.floor(Math.random() * letters.length);
            let randomLetter = Object.keys(this.letterBag)[randomIndex];

            let randomIncrease = Math.floor(Math.random() * 5) + 1;
            let chipsIncrease = Math.random() < 0.75 ? true : false;

            if (chipsIncrease) {
                this.letterBag[randomLetter].chips += randomIncrease;
            } else {
                this.letterBag[randomLetter].mult += randomIncrease;
            }
            let improvedArray = [{
                "letter": randomLetter, 
                "increasedBy": randomIncrease, 
                "chip": chipsIncrease,
            }];
            improved.push(improvedArray);
        }
        this.displayInfo(improved);
    }
    setUpLetterBoxes() {
        let maxWordLength = this.settings.maxWordLength;
        let letterBoxContainer = document.getElementById("letterBoxContainerSmall");

        while (letterBoxContainer.firstChild) {
            letterBoxContainer.removeChild(letterBoxContainer.firstChild);
        }

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
        document.addEventListener("keydown", (event) => {
            let keyName = event.key.toUpperCase();

            if (keyName === "BACKSPACE") {
                this.removeLastLetter();
            } if (keyName === "ENTER") {
                this.checkWord();
            } else {
                this.addLetterToWord(keyName, false);
            }
        });
    }
    addLetterToWord(letterToAdd, fromClick) {
        let lettersInBagWrapper = document.querySelectorAll(".letterTile");
        let lettersInWord = document.querySelectorAll(".letterBoxWrapper");

        for (let i = 0 ; i < lettersInBagWrapper.length ; i++) {
            let letterDiv = lettersInBagWrapper[i];
            let bagLetter = letterDiv.name;
            if (this.currentWord.length < this.settings.maxWordLength) {
                if (letterToAdd === bagLetter) {
                    if (!letterDiv.used) {
                        let lettersUsed = this.currentWord.length;
                        lettersInWord[lettersUsed].children[2].textContent = letterToAdd;
                        lettersInWord[lettersUsed].children[2].name = letterToAdd;
                        this.currentWord += letterToAdd;
                        this.addLetterScore(letterToAdd);
                        if (!fromClick) {
                            letterDiv.used = true;
                        }
                        return;
                    }
                }
            }
        }
        document.querySelectorAll(".letterBoxWrapper")[3].children[2];
    }
    displayInfo(upgradedLetters) {
        let text = "";
        for (let i = 0 ; i < upgradedLetters.length ; i++) {
            let letter = upgradedLetters[i][0].letter;
            let increase = upgradedLetters[i][0].increasedBy;
            let chips = upgradedLetters[i][0].chip;

            let variable = chips ? "chips" : "mult";

            text += "The " + variable + " of " + letter.toUpperCase() + " has increased by " + increase + "\n\n";
        }
        alert(text);
    }
    addLetterScore(letter) {
        let currentWordLength = this.currentWord.length - 1;

        let letterDivs = document.querySelectorAll(".letterBoxWrapper")[currentWordLength];
        let scoreDivs = letterDivs.children;

        let letterChips = this.letterBag[letter].chips;
        let letterMult = this.letterBag[letter].mult;
        this.chips += letterChips;
        this.mult += letterMult;
        this.lengthMult = currentWordLength + 1;

        scoreDivs[0].textContent = letterChips;
        scoreDivs[4].textContent = letterMult;

        this.setScoring();
    }
    setScoring() {
        let totalChips = document.getElementById("totalChips");
        let totalMult = document.getElementById("totalMult");
        let finalMult = document.getElementById("finalMult");
        let finalScore = document.getElementById("totalScore");

        totalChips.textContent = this.chips;
        totalMult.textContent = this.mult;
        finalMult.textContent = this.lengthMult;

        let score = this.getScore();
        finalScore.textContent = score;
    }
    getScore() {
        return this.chips * this.mult * this.lengthMult;
    }
    removeLastLetter() {
        let word = this.currentWord;
        let wordLength = word.length;
        if (wordLength === 0) {
            return;
        }

        let lettersInWord = document.querySelectorAll(".letterBoxWrapper");
        let lastLetterBox = lettersInWord[wordLength - 1].children[2];
        let letterToRemove = lastLetterBox.name;

        lastLetterBox.textContent = "";
        this.currentWord = word.substring(0, wordLength - 1);

        lettersInWord[wordLength - 1].children[0].textContent = "";
        lettersInWord[wordLength - 1].children[4].textContent = "";

        let letterToRemoveChips = this.letterBag[letterToRemove].chips;
        let letterToRemoveMult = this.letterBag[letterToRemove].mult;
        this.chips -= letterToRemoveChips;
        this.mult -= letterToRemoveMult;
        this.lengthMult--;

        this.setScoring();

        let lettersInBagWrapper = document.querySelectorAll(".letterTile");
        for (let i = 0 ; i < lettersInBagWrapper.length ; i++) {
            let currentLetter = lettersInBagWrapper[i];
            if (currentLetter.name === letterToRemove) {
                if (currentLetter.used) {
                    currentLetter.used = false;
                    return;
                }
            }
        }
    }
    checkWord() {
        let enteredWord = this.currentWord;
        if (enteredWord.length === 0 || this.isGameOver) {
            return;
        }
        enteredWord = enteredWord.toUpperCase();
        if (!this.canMakeWord(enteredWord) || !this.patternMatchesArray(enteredWord)) {
            alert("NOT A REAL WORD")
            return;
        }
        this.getHighestScoringWord();
        this.updateScore();
    }
    patternMatchesArray(pattern) {
        // Escape regex special characters except for '*'
        pattern = pattern.toLowerCase();
        const escapedPattern = pattern.replace(/[-/\\^$+?.()|[\]{}]/g, '\\$&');
        
        // Replace '*' with '.' (matches exactly one character in regex)
        const regexPattern = '^' + escapedPattern.replace(/\*/g, '.') + '$';
        
        const regex = new RegExp(regexPattern);

        // Check if any word matches the pattern
        return this.wordList.some(word => regex.test(word));
    }
    updateScore() {
        let score = this.getScore();
        this.score += score;
        document.getElementById("score").textContent = this.score;
        this.settings.plays--;
        document.getElementById("remainingHands").textContent = this.settings.plays;

        if (this.settings.plays === 0 && this.score < this.requiredScore) {
            this.gameOver();
            return;
        }

        while (this.currentWord.length > 0) {
            this.removeLastLetter();
        }

        this.chips = 0;
        this.mult = 1;
        this.lengthMult = 0;

        this.setUpLetterBag();
        if (this.score >= this.requiredScore) {
            this.nextLevel();
        }
    }
    gameOver() {
        this.isGameOver = true;
        alert("Game Over");
    }
    getHighestScoringWord() {
        let highestScore = {
            word: "",
            wordFromList: "",
            score: 0,
            chips: [],
        }

        for (let i = 0 ; i < this.wordList.length ; i++) {
            let word = this.wordList[i].toUpperCase();
            let canMakeWord = this.canMakeWord(word);
            if (!canMakeWord || word.length > this.settings.maxWordLength) {
                continue;
            }
            /*
            let letters = word.split("");
            let chips = 0;
            let mult = 1;
            for (let j = 0 ; j < letters.length ; j++) {
                chips += this.letterBag[letters[j]].chips;
                mult += this.letterBag[letters[j]].mult;
            }
            let score = chips * mult * (word.length + 1);
            if (score > highestScore.score) {
                highestScore.score = score;
                highestScore.word = this.wordList[i];
                highestScore.chips = [chips, mult, word.length + 1]
            }*/
           
            let chips = 0;
            let mult = 1;
            for (let j = 0 ; j < canMakeWord.length ; j++) {
                chips += this.letterBag[canMakeWord[j]].chips;
                mult += this.letterBag[canMakeWord[j]].mult;
            }
            let score = chips * mult * word.length;
            if (score > highestScore.score) {
                highestScore.score = score;
                highestScore.word = canMakeWord.join("");
                highestScore.wordFromList = this.wordList[i];
                highestScore.chips = [chips, mult, word.length]
            }
        }
        this.displayBestWord(highestScore);
    }
    displayBestWord(wordScore) {
        let text = "";

        text += "The highest scoring word that round was " + wordScore.word + " or " + wordScore.wordFromList + "\n\n" +
                "This word scored " + wordScore.score;

        alert(text);
    }
    canMakeWord(word) {
        let letters = word.split("");
        let availableLetters = structuredClone(this.currentLetterSelection);
        let usedLetters = [];
        for (let i = 0 ; i < letters.length ; i++) {
            if (!availableLetters.includes(letters[i]) && !availableLetters.includes("*")) {
                return false;
            } else {
                let index = availableLetters.indexOf(letters[i]);

                index = index > -1 ? index : availableLetters.indexOf("*");
                usedLetters.push(availableLetters[index]);
                availableLetters.splice(index, 1);
            }
        }
        return usedLetters;
    }
    setUpLetterBag() {
        let lettersPerHand = this.settings.lettersPerHand;
        let letterBag = document.getElementById("letterBag");

        this.currentLetterSelection = [];

        while (letterBag.firstChild) {
            letterBag.removeChild(letterBag.firstChild);
        }

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
            letterTile.used = false;
            this.currentLetterSelection.push(tileValue[0]);

            letterTile.textContent = letterTile.name;
            letterChips.textContent = letterTile.chips;
            letterMult.textContent = letterTile.mult;

            letterTile.addEventListener("click", (event) => {
                let clickedTile = event.currentTarget;
                if (!clickedTile.used) {
                    this.addLetterToWord(clickedTile.name, true);
                }
                clickedTile.used = true;
            });

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

/*
TO DO

- Discard mechanic
- Display round goal, hands, discards
- Upgrade menu and effects
- Restart mechanic
- View which letters are upgraded
- View entire letter bag
*/