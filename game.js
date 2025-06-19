class Game {
    constructor(settings, rewards, letterBag, wordList) {
        this.settings = settings;
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

        let score = this.chips * this.mult * this.lengthMult;
        finalScore.textContent = score;
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
        let enteredWord = this.currentWord.toLowerCase();
        if (!this.matchPattern(enteredWord)) {
            alert("NOT A REAL WORD")
            return;
        }
        let lowerCase = [];
        for (let i = 0 ; i < this.currentLetterSelection.length ; i++) {
            lowerCase.push(this.currentLetterSelection[i].toLowerCase());
        }
        let longest = this.getLongestWord(this.wordList, lowerCase);
        alert(longest);
    }
    matchPattern(pattern) {
        const regexPattern = '^' + pattern.replace(/\*/g, '.') + '$';
        const regex = new RegExp(regexPattern);

        return this.wordList.filter(word => regex.test(word));
    }

    getLetterCounts(str) {
        const count = {};
        for (const char of str) {
            count[char] = (count[char] || 0) + 1;
        }
        return count;
    }
    canMakeWord(word, letterCounts) {
        const wordCounts = this.getLetterCounts(word);
        for (const char in wordCounts) {
            if (!letterCounts[char] || wordCounts[char] > letterCounts[char]) {
                return false;
            }
        }
        return true;
    }
    getLongestWord(words, letters) {
        const available = this.getLetterCounts(letters);
        let maxLength = this.settings.maxWordLength;

        let validWords = [];
        for (const word of words) {
            if (this.canMakeWord(word, available) && word.length === maxLength) {
                validWords.push(word);
            }
        }
        return validWords[Math.floor(Math.random() * validWords.length)];
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

- Display chips and mult for entered word, if valid
- Calcuate final score of word
- Discard mechanic
- Display round goal, hands, discards
- Check if round goal passed
- Upgrade menu and effects
- Restart mechanic
*/