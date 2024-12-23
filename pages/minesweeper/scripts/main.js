function generateFields(filedsAmount, rowLength){
    let html = "";
    let even = "even_btn";
    let odd = "odd_btn";
    let rowCounter = 0;
    for(let i = 0; i < filedsAmount; i++){
        html+=`<button class=${i % 2 == 0 ? even : odd} id="${i+1}"></button>`
        if(rowCounter == rowLength-1){
            [even, odd] = [odd, even];
            rowCounter=0;
            continue;
        }
        rowCounter++
    }

    return html;
}

function generateMines(minesAmount){
    const container = document.getElementById("container");
    const mines = new Set();
    for(let i = 0; i <= minesAmount; i++){
        
    }
}


function setField(){
    const container = document.getElementById("container");
    container.innerHTML = generateFields(72,8);
}

setField()
generateMines();