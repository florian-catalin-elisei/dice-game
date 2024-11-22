const listOfAllDice = document.querySelectorAll(".die");
const scoreInputs = document.querySelectorAll("#score-options input");
const scoreSpans = document.querySelectorAll("#score-options span");
const roundElement = document.getElementById("current-round");
const rollsElement = document.getElementById("current-round-rolls");
const totalScoreElement = document.getElementById("total-score");
const scoreHistory = document.getElementById("score-history");
const rollDiceBtn = document.getElementById("roll-dice-btn");
const keepScoreBtn = document.getElementById("keep-score-btn");
const rulesContainer = document.querySelector(".rules-container");
const rulesBtn = document.getElementById("rules-btn");

let diceValuesArr = [];
let isModalShowing = false;
let score = 0;
let round = 1;
let rolls = 0;

rulesBtn.addEventListener("click", () => {
  isModalShowing = !isModalShowing;
  rulesContainer.style.display = isModalShowing ? "block" : "none";
  rulesBtn.textContent = isModalShowing ? "Hide rules" : "Show rules";
});

const rollDice = () => {
  diceValuesArr = [];

  for (let i = 0; i < 5; i++) {
    const randomDice = Math.floor(Math.random() * 6) + 1;

    diceValuesArr.push(randomDice);
  }

  listOfAllDice.forEach((dice, index) => {
    dice.textContent = diceValuesArr[index];
  });
};

const updateStats = () => {
  rollsElement.textContent = rolls;
  roundElement.textContent = round;
};

const getHighestDuplicates = (array) => {
  let duplicates = {};

  array.forEach((number) => {
    duplicates[number] = (duplicates[number] || 0) + 1;
  });

  let maxCount = 0;
  let maxDuplicate;
  let sum = array.reduce((sum, value) => sum + value, 0);

  for (const [duplicate, count] of Object.entries(duplicates)) {
    if (count > maxCount) {
      maxCount = count;
      maxDuplicate = duplicate;
    }
  }

  if (maxCount > 3) {
    updateRadioOptions(1, sum);
  }

  if (maxCount > 2) {
    updateRadioOptions(0, sum);
  }

  updateRadioOptions(5, 0);
};

const resetRadioOptions = () => {
  scoreInputs.forEach((input) => {
    input.disabled = true;
    input.checked = false;
  });

  scoreSpans.forEach((span) => {
    span.textContent = "";
  });
};

rollDiceBtn.addEventListener("click", () => {
  if (rolls === 3) {
    alert("You have made three rolls this round. Please select a score.");
  } else {
    rolls++;

    resetRadioOptions();
    rollDice();
    updateStats();
    getHighestDuplicates(diceValuesArr);
    detectFullHouse(diceValuesArr);
    checkForStraights(diceValuesArr);
  }
});

const updateRadioOptions = (index, score) => {
  scoreInputs[index].disabled = false;
  scoreInputs[index].value = score;
  scoreSpans[index].textContent = `, score = ${score}`;
};

const updateScore = (selectedValue, achieved) => {
  score += parseInt(selectedValue);
  totalScoreElement.textContent = score;
  scoreHistory.innerHTML += `<li>${achieved} : ${selectedValue}</li>`;
};

keepScoreBtn.addEventListener("click", () => {
  let selectedValue;
  let achieved;

  for (const radioButton of scoreInputs) {
    if (radioButton.checked) {
      selectedValue = radioButton.value;
      achieved = radioButton.id;
      break;
    }
  }

  if (selectedValue) {
    rolls = 0;
    round++;

    updateStats();
    resetRadioOptions();
    updateScore(selectedValue, achieved);

    if (round > 6) {
      setTimeout(() => {
        alert(`Game Over! Your total score is ${score}`);

        resetGame();
      }, 500);
    }
  } else {
    alert("Please select an option or roll the dice");
  }
});

const resetGame = () => {
  diceValuesArr = [0, 0, 0, 0, 0];
  score = 0;
  round = 1;
  rolls = 0;

  listOfAllDice.forEach((dice, index) => {
    dice.textContent = diceValuesArr[index];
  });

  totalScoreElement.textContent = score;
  scoreHistory.innerHTML = "";
  rollsElement.textContent = rolls;
  roundElement.textContent = round;

  resetRadioOptions();
};

const detectFullHouse = (arr) => {
  const counts = {};

  for (const num of arr) {
    counts[num] = counts[num] ? counts[num] + 1 : 1;
  }

  const hasThreeOfAKind = Object.values(counts).includes(3);
  const hasPair = Object.values(counts).includes(2);

  if (hasThreeOfAKind && hasPair) {
    updateRadioOptions(2, 25);
  }

  updateRadioOptions(5, 0);
};

const checkForStraights = (arr) => {
  const counts = {};

  for (const num of arr) {
    counts[num] = counts[num] ? counts[num] + 1 : 1;
  }

  const keys = Object.keys(counts).join("");

  if (keys === "12345" || keys === "23456") {
    updateRadioOptions(4, 40);
  }

  if (
    keys.slice(0, 4) === "1234" ||
    keys.slice(0, 4) === "2345" ||
    keys.slice(1, 5) === "2345" ||
    keys.slice(1, 5) == "3456" ||
    keys === "3456"
  ) {
    updateRadioOptions(3, 30);
  }

  updateRadioOptions(5, 0);
};
