import { images } from "./constants.js";
import { handleDocumentLoading } from "../../../utils/handleDocumentLoading.js";

// SETTINGS

let settings = localStorage.getItem("settings")
  ? JSON.parse(localStorage.getItem("settings"))
  : {
      timer: {
        minutes: 1,
        seconds: 0,
      },
      quantity: "12",
      category: "humo",
    };

let shuffled = shuffleCards(images[0][[settings["category"]]].slice(0, settings["quantity"]));
let container = document.getElementById("cards_container");
let cards = document.getElementsByClassName("content_wrap");
const defaultImage = "./images/others/question.png";
let queue = [];
let winCounter = 0;
let history = [];
const domMinutes = document.getElementById("minutes");
const domSeconds = document.getElementById("seconds");
const timer = new Timer(
  {
    minutes: settings?.timer?.minutes ?? 1,
    seconds: settings?.timer?.seconds ?? 0,
    minutesDOMelement: domMinutes,
    secondsDOMelement: domSeconds,
  },
  () =>
    Swal.fire({
      title: "Вы проиграли",
      text: "Вы не успели найти все пары во время ):",
      icon: "error",
      confirmButtonText: "Попробовать ещё",
    }).then((res) => {
      if (res.isConfirmed) {
        restart();
      }
    })
);
timer.resetTimer();

function shuffleCards(data) {
  let shuffledArr = [];
  let randomChecker = [];
  while (shuffledArr.length !== data.length) {
    let randomInd = Math.floor(Math.random() * data.length);
    if (!randomChecker.includes(randomInd)) {
      shuffledArr.push(data[randomInd]);
    }
    randomChecker.push(randomInd);
  }

  return shuffledArr;
}

document.getElementById("settings").addEventListener("click", () => {
  Swal.fire({
    title: "Settings",
    html: `
    <div class="settings_container">  
         <div class="setting_wrap">
            <span>time</span>
            <div class="timer_inputs">
              <label for="min">m</label>
              <input id="min" type="number" min="0" max="10"/>
              <label for="sec">s</label>
              <input id="sec" type="number" min="0" max="59"/>
            </div>
        </div>
        <div class="setting_wrap">
            <span>quantity</span>
            <select name="quantity" id="quantity">
                <option value="10">10</option>
                <option value="16">16</option>
                <option value="20">20</option>
                <option value="32">32</option>
            </select>
        </div>
        <div class="setting_wrap">
            <span>category</span>
            <select name="category" id="category">
                <option value="humo">humo</option>
                <option value="cars">cars</option>
            </select>
        </div>
    </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Save",
    preConfirm: () => {
      const [minutes, seconds, quantity, category] = [
        document.getElementById("min").value,
        document.getElementById("sec").value,
        document.getElementById("quantity").value,
        document.getElementById("category").value,
      ];
      const validMinutes = +minutes;
      const validSeconds = +seconds;
      settings = {
        timer: {
          minutes: validMinutes < 0 ? 0 : validMinutes,
          seconds: validSeconds < 0 ? 30 : validSeconds,
        },
        quantity,
        category,
      };
    },
  }).then((res) => {
    if (res?.isConfirmed) {
      localStorage.setItem("settings", JSON.stringify(settings));
      restart();
    }
  });
  document.getElementById("quantity").value = settings["quantity"];
  document.getElementById("category").value = settings["category"];
  document.getElementById("min").value = settings["timer"]["minutes"];
  document.getElementById("sec").value = settings["timer"]["seconds"];
});

// VIEW

function displayCards() {
  const { quantity } = settings;
  container.classList.add("cards_container_active");
  container.style.maxWidth =
    quantity === "10" || quantity === "16" ? "600px" : quantity === "20" ? "700px" : "1000px";
  container.innerHTML = `
        ${shuffled
          .map(
            (image) =>
              `<div class="card">
                <div class="content_wrap">
                    <img src="${defaultImage}" class="img front" />
                    <img src="${image.src}" class="img back" />
                </div>
            </div>`
          )
          .join("")}`;
}

function onLoad() {
  displayCards();
  addListenerToCards();
}

handleDocumentLoading(onLoad);

// GAME LOGIC

function addListenerToCards() {
  for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener("click", () => {
      if (queue.length === 2 || history.includes(i) || cards[i].classList.contains("active")) {
        return;
      } else {
        play(i);
      }
    });
  }
}

function play(i) {
  if (!timer.isTimerActive) {
    timer.startTimer();
  }
  cards[i].classList.add("active");

  if (queue.length < 2) {
    queue.push({ src: cards[i].children[1].src, ind: i });
  }

  if (queue.length === 2) {
    if (queue[0].src !== queue[1].src) {
      setTimeout(() => {
        cards[queue[0].ind].classList.remove("active");
        cards[queue[1].ind].classList.remove("active");
        queue = [];
      }, 500);
    } else {
      winCounter++;
      history.push(queue[0].ind, queue[1].ind);
      queue = [];
    }
  }

  if (winCounter === shuffled.length / 2) {
    timer.stopTimer();
    setTimeout(() => {
      Swal.fire({
        title: "Поздравляю, вы выиграли!",
        icon: "success",
        showCancelButton: false,
        confirmButtonText: "Сыграть ещё",
      }).then(() => {
        restart();
      });
    }, 500);
  }
}

document.getElementById("restart").addEventListener("click", restart);

function restart() {
  queue = [];
  winCounter = 0;
  history = [];
  shuffled = shuffleCards(images[0][[settings["category"]]].slice(0, settings["quantity"]));
  displayCards();
  addListenerToCards();
  timer.resetTimer();
  if (timer.isTimerActive) {
    timer.stopTimer();
  }
}
