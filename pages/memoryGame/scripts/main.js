import { images } from "./constants.js"

// document.addEventListener('DOMContentLoaded', handleRouteUpdate);
let container = document.getElementById('cards_container');
let queue = [];
const defaultImage = '/pages/memoryGame/images/others/question.png';
let shuffled = shuffleCards(images[0]["humo"].slice(0, 16));
let winCounter = 0;
let history = [];
let cards = document.getElementsByClassName('content_wrap');

run();

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

function addListenerToCards() {
    for (let i = 0; i < cards.length; i++) {
        cards[i].addEventListener('click', () => {
            if (queue.length === 2 || history.includes(i) ||
                modalActive || cards[i].classList.contains('active')) {
                return;
            } else {
                play(i);
            }
        })
    }
}

function displayCards() {

    container.innerHTML = `
        ${shuffled.map((image) =>
            `<div class="card">
                <div class="content_wrap">
                    <img src="${defaultImage}" class="img front" />
                    <img src="${image.src}" class="img back" />
                </div>
            </div>`
        ).join('')}`;


}


function play(i) {
    cards[i].classList.add('active');

    if (queue.length < 2) {
        queue.push({ src: cards[i].children[1].src, ind: i });
    }

    if (queue.length === 2) {


        if (queue[0].src !== queue[1].src) {
            setTimeout(() => {
                cards[queue[0].ind].classList.remove('active');
                cards[queue[1].ind].classList.remove('active');
                queue = []
            }, 500)
        } else {
            winCounter++;
            history.push(queue[0].ind, queue[1].ind);
            queue = [];
        }

    }

    if (winCounter === (shuffled.length / 2)) {
        winCounter = 0;
        setTimeout(() => {
            let isConfirmed = confirm('Поздравляю! вы выиграли, хотите сыграть ещё?');
            if (isConfirmed) {
                restart();
            }

        }, 500);
    }
}


export function restart() {
    shuffled = shuffleCards(images[0]["humo"].slice(0, 16));
    run();
}



function setContainer(array) {
    let appContainter = document.getElementById('app_container');
    let cards;
    let images;

    if (array.length > 16) {
        container.style.gridTemplateColumns = "repeat(10, 120px)";
        container.style.gap = "20px"
        appContainter.style.maxWidth = 'none';
        appContainter.style.padding = '35px'
        setTimeout(() => {
            cards = document.getElementsByClassName('card');
            images = document.getElementsByClassName('img');

            for (let i = 0; i < cards.length; i++) {
                cards[i].style.width = '120px';
                cards[i].style.height = '120px';
            }

            for (let i = 0; i < images.length; i++) {
                images[i].style.top = '8px';
                images[i].style.left = '0';
            }

        }, 0)
    } else {
        appContainter.style.maxWidth = '1000px';
        container.style.gridTemplateColumns = "repeat(5,135px)";
        container.style.gap = "20px";
        setTimeout(() => {
            cards = document.getElementsByClassName('card');
            images = document.getElementsByClassName('img');

            for (let i = 0; i < cards.length; i++) {
                cards[i].style.width = '135px';
                cards[i].style.height = '125px';
            }

            for (let i = 0; i < images.length; i++) {
                images[i].style.top = '10px';
                images[i].style.left = '5px';
            }

        }, 0)


    }
}

function run() {
    displayCards();
    addListenerToCards();
    setContainer(shuffled);
}
