import { digitSegments, level } from "./data.js";

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

export function displayDigits() {
  [firstDigit, secondDigit, thirdDigit].forEach((digit) => {
    digit.innerHTML = ["a", "b", "c", "d", "e", "f", "g"]
      .map(
        (letter) => `
            <div class="segment seg-${letter}"></div>
        `
      )
      .join("");
  });

  updateTablo(level.mines, [firstDigit, secondDigit, thirdDigit]);
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

export function startTimer(){
    let seconds = 1;
    updateTablo(seconds,timerElements);
    const interval = setInterval(()=>{
        seconds+=1;
        updateTablo(seconds,timerElements);
    },1000);

    return ()=>{
        clearInterval(interval);
    };
}
