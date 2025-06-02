import { digitSegments } from "./data.js";

const firstDigit = document.getElementById("first_num");
const secondDigit = document.getElementById("second_num");
const thirdDigit = document.getElementById("third_num");

export function updateTablo(num = "000", parents) {
  num = num.toString().padStart(3, "0");
  Array.from(num).forEach((digit, ind) => {
    if (!parents[ind]) return;
    const currentSet = new Set(digitSegments[digit]);
    parents[ind].childNodes.forEach((child) => {
      if (
        child?.classList &&
        [...child.classList].some((cls) => currentSet.has(cls.replace("seg-", "")))
      ) {
        child.classList.add("on");
      } else {
        if (child?.classList) {
          child.classList.remove("on");
        }
      }
    });
  });
}

export function displayDigits(mines) {
  [firstDigit, secondDigit, thirdDigit].forEach((digit) => {
    digit.innerHTML = ["a", "b", "c", "d", "e", "f", "g"]
      .map(
        (letter) => `
            <div class="segment seg-${letter}"></div>
        `
      )
      .join("");
  });

  updateTablo(mines, [firstDigit, secondDigit, thirdDigit]);
}

const timerElements = [
    document.getElementById("first_timer"),
    document.getElementById("second_timer"),
    document.getElementById("third_timer"),
];

export function setTimer() {
  timerElements.forEach((digit) => {
    digit.innerHTML = ["a", "b", "c", "d", "e", "f", "g"]
      .map(
        (letter) => `
            <div class="segment seg-${letter}"></div>
        `
      )
      .join("");
  });

  updateTablo(0, timerElements);
}

window.minesweeperSeconds = 0;

export function startTimer(){
    updateTablo(window.minesweeperSeconds,timerElements);
    const interval = setInterval(()=>{
        if(window.minesweeperSeconds === 1000){
          
        }else{
          window.minesweeperSeconds++;
          updateTablo(window.minesweeperSeconds,timerElements);
        }
    },1000);

    return ()=>{
        clearInterval(interval);
    };
}
