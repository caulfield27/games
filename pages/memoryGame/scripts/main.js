import { images } from "./constants.js";

// SETTINGS

let settings = localStorage.getItem("settings")
  ? JSON.parse(localStorage.getItem("settings"))
  : {
      level: "easy",
      quantity: "12",
      category: "humo",
    };
let shuffled = shuffleCards(images[0][[settings["category"]]].slice(0, settings["quantity"]));

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
            <span>level</span>
            <select name="level" id="level">
                <option value="easy">easy</option>
                <option value="medium">medium</option>
                <option value="hard">hard</option>
            </select>
        </div>
        <div class="setting_wrap">
            <span>quantity</span>
            <select name="quantity" id="quantity">
                <option value="12">10</option>
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
      const [level, quantity, category] = [
        document.getElementById("level").value,
        document.getElementById("quantity").value,
        document.getElementById("category").value,
      ];
      settings = {
        level,
        quantity,
        category,
      };
    },
  }).then((res) => {
    if (res?.isConfirmed) {
      localStorage.setItem("settings", JSON.stringify(settings));
      shuffled = shuffleCards(images[0][settings["category"]].slice(0, settings["quantity"]));
      displayCards();
      addListenerToCards();
      setContainer(shuffled);
    }
  });
  document.getElementById("level").value = settings["level"];
  document.getElementById("quantity").value = settings["quantity"];
  document.getElementById("category").value = settings["category"];
});

// VIEW

let container = document.getElementById("cards_container");
let cards = document.getElementsByClassName("content_wrap");
const defaultImage = "./images/others/question.png";

function displayCards() {
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

function setContainer(array) {
  let appContainter = document.getElementById("app_container");
  let cards;
  let images;

  if (array.length > 16) {
    container.style.gridTemplateColumns = "repeat(10, 120px)";
    container.style.gap = "20px";
    appContainter.style.maxWidth = "none";
    appContainter.style.padding = "35px";
    setTimeout(() => {
      cards = document.getElementsByClassName("card");
      images = document.getElementsByClassName("img");

      for (let i = 0; i < cards.length; i++) {
        cards[i].style.width = "120px";
        cards[i].style.height = "120px";
      }

      for (let i = 0; i < images.length; i++) {
        images[i].style.top = "8px";
        images[i].style.left = "4px";
      }
    }, 0);
  } else {
    appContainter.style.maxWidth = "1000px";
    container.style.gridTemplateColumns = "repeat(5,135px)";
    container.style.gap = "20px";
    setTimeout(() => {
      cards = document.getElementsByClassName("card");
      images = document.getElementsByClassName("img");

      for (let i = 0; i < cards.length; i++) {
        cards[i].style.width = "135px";
        cards[i].style.height = "125px";
      }

      for (let i = 0; i < images.length; i++) {
        images[i].style.top = "10px";
        images[i].style.left = "5px";
      }
    }, 0);
  }
}

function run() {
  displayCards();
  addListenerToCards();
  setContainer(shuffled);
}

run();

// GAME LOGIC

let queue = [];
let winCounter = 0;
let history = [];
let clearTimer = null;

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
  if (!clearTimer) {
    clearTimer = startTimer();
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
    winCounter = 0;
    setTimeout(() => {
      Swal.fire({
        title: "Поздравляю, вы выиграли!",
        icon: "success",
        showCancelButton: false,
        confirmButtonText: "Сыграть ещё",
      }).then((res) => {
        if (res?.isConfirmed) {
          restart();
        }
      });
    }, 500);
  }
}

document.getElementById("restart").addEventListener("click", restart);

function restart() {
  window.location.reload();
}

// TIMER
const timer = new Timer({
  minutes: 1,
  seconds: 0,
  minutesTextContent: document.getElementById("minutes").textContent,
  secondsTextContent: document.getElementById("seconds").textContent,
  timerDOMelement: document.getElementsByClassName("timer_wrapper")
},restart)

console.log(timer);


// const timer = {
//   minutes: localStorage.getItem("settings")?.timer ?? 1,
//   seconds: 0,
// };

// const domMinutes = document.getElementById("minutes");
// domMinutes.textContent = timer.minutes < 10 ? `0${timer.minutes}` : timer.minutes;
// const domSeconds = document.getElementById("seconds");
// domSeconds.textContent = timer.seconds < 10 ? `0${timer.seconds}` : timer.seconds;

// function startTimer() {
//   const interval = setInterval(() => {
//     if (timer.seconds === 0) {
//       if (timer.minutes === 0) {
//         clearInterval(timer);
//         console.log('test');
//         Swal.fire({
//           title: "Вы проиграли",
//           text: "Вы не успели найти все пары во время ):",
//           icon: "error",
//         }).then(() => clearInterval(interval));
//       } else {
//         timer.minutes--;
//         timer.seconds = 59;
//         domMinutes.textContent = timer.minutes < 10 ? `0${timer.minutes}` : timer.minutes;
//         domSeconds.textContent = timer.seconds;
//       }
//     } else {
//       timer.seconds--;
//       domSeconds.textContent = timer.seconds < 10 ? `0${timer.seconds}` : timer.seconds;
//     }
//   }, [1000]);

//   return () => {
//     clearInterval(interval);
//   };
// }
