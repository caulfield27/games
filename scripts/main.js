import { images } from "./constants.js"

let container = document.getElementById('cards_container')
let queue = []
const defaultImage = './images/question.png'
let cards = document.getElementsByClassName('content_wrap')
let shuffled = shuffleCards(images)
let winCounter = 0
let history = []

run()

function shuffleCards(data){
    let shuffledArr = []
    let randomChecker = []
    while(shuffledArr.length !== data.length){
        
        let randomInd = Math.floor(Math.random() * data.length)
        if(!randomChecker.includes(randomInd)){
            shuffledArr.push(data[randomInd])
        }

        randomChecker.push(randomInd)
        
               
    }

    return shuffledArr
}

function addListenerToCards() {
    for (let i = 0; i < cards.length; i++) {
        cards[i].addEventListener('click', () => {
            if(queue.length === 2 || history.includes(i)){
                return
            }else{
                play(i)
            }
        })
    }
}

function play(i) {
    cards[i].classList.add('active');
    
    if(queue.length < 2){
        queue.push({ src: cards[i].children[1].src, ind: i });
    }

    if (queue.length === 2) {

        
        if (queue[0].src !== queue[1].src) {
            setTimeout(() => {
                cards[queue[0].ind].classList.remove('active')
                cards[queue[1].ind].classList.remove('active')
                queue = []
            }, 500)
        } else {            
            winCounter++
            history.push(queue[0].ind,queue[1].ind)
            queue = []
        }

    }

    if(winCounter === (shuffled.length / 2)){
        setTimeout(()=>{
            let isConfirmed = confirm('Поздравляю! вы выиграли, хотите сыграть ещё?')
            if(isConfirmed){
                restart()
            }
            
        },500)  
    }
    


}

function displayCards() {
    container.innerHTML = shuffled.map((image) =>
        `<div class="card">
            <div class="content_wrap">
                <img src="${defaultImage}" class="front"/>
                <img src="${image.src}" class="back"/>
            </div>       
        </div>    
        `
    ).join('')
}

export function restart(){
    window.location.reload()
}


function run() {
    displayCards()
    addListenerToCards()
}
