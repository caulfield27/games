import { restart } from "./main.js"

document.getElementById('restart').addEventListener('click', restart)

let modalActive = false

document.getElementById('settings').addEventListener('click', ()=>{
    modalActive = !modalActive
    const modal = document.getElementById('modal')
    modal.classList.add(modalActive ? 'settings_modal' : 'display_none')
    modal.classList.remove(modalActive ? 'display_none' : 'settings_modal')

})



