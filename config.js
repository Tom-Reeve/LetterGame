const letterBag = {
    BLANK: {
        count: 2,
        chips: 0,
        mult: 0,
    },
    A: {
        count: 9,
        chips: 1,
        mult: 0
    },
    B: {
        count: 2,
        chips: 3,
        mult: 0
    },
    C: {
        count: 2,
        chips: 3,
        mult: 0
    },
    D: {
        count: 4,
        chips: 2,
        mult: 0
    },
    E: {
        count: 12,
        chips: 1,
        mult: 0
    },
    F: {
        count: 2,
        chips: 4,
        mult: 0
    },
    G: {
        count: 3,
        chips: 2,
        mult: 0
    },
    H: {
        count: 2,
        chips: 4,
        mult: 0
    },
    I: {
        count: 9,
        chips: 1,
        mult: 0
    },
    J: {
        count: 1,
        chips: 8,
        mult: 0
    },
    K: {
        count: 1,
        chips: 5,
        mult: 0
    },
    L: {
        count: 4,
        chips: 1,
        mult: 0
    },
    M: {
        count: 2,
        chips: 3,
        mult: 0
    },
    N: {
        count: 6,
        chips: 1,
        mult: 0
    },
    O: {
        count: 8,
        chips: 1,
        mult: 0
    },
    P: {
        count: 2,
        chips: 3,
        mult: 0,
    },
    Q: {
        count: 1,
        chips: 10,
        mult: 0
    },
    R: {
        count: 6,
        chips: 1,
        mult: 0
    },
    S: {
        count: 4,
        chips: 1,
        mult: 0
    },
    T: {
        count: 6,
        chips: 1,
        mult: 0
    },
    U: {
        count: 4,
        chips: 1,
        mult: 0
    },
    V: {
        count: 2,
        chips: 4,
        mult: 0
    },
    W: {
        count: 2,
        chips: 4,
        mult: 0
    },
    X: {
        count: 1,
        chips: 8,
        mult: 0
    },
    Y: {
        count: 2,
        chips: 4,
        mult: 0
    },
    Z: {
        count: 1,
        chips: 10,
        mult: 0
    }
}

const settings = {
    plays: 5,
    discards: 5,
    lettersPerDiscard: 3,
    lettersPerHand: 16,

    maxWordLength: 7,
    minWordLength: 4,
    multPerLetter: 1,

    finalMultiplier: 1,

    chipIncreaseOnPlay: 0,
}

const rewards = {
    common: {
        chance: 0.6,
        reward: 
            [
                "Max Word Length Increase",
                "Min Word Length Decrease",
                "+1 Chips On Each Played Letter",
                "+5 Chips On 1 of 5 Letters"
            ]
    },
    uncommon: {
        chance: 0.35,
        reward:
            [
                "+5 Chips On Each Played Letter",
                "Add 1 of 5 New Letters",
                "Remove 1 of 5 Letters",
                "Retrigger 1 of 5 Letters One Additional Time",
                "+1 Mult On 1 of 5 Letters",
                "+1 Mult On a Random Board Square"
            ]
    },
    rare: {
        chance: 0.05,
        reward:
            [
                "+1 Play Per Round",
                "+1 Discard Per Round",
                "+1 Letter Per Discard",
                "+1 Final Multiplier",
                "+1 Mult on All Board Squares"
            ]
    },
}