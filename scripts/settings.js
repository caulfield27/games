import { restart } from "./main.js"

export const settings = localStorage.getItem('settings') ? 
                        JSON.parse(localStorage.getItem('settings')) :
                        {
                            level: 'easy',
                            amount: '12',
                            category: 'humo'
                        }

let modal = document.getElementById('modal');

window.modalActive = false;

export function setSettings(){
    let newSettinsg = {};
    for(let key in settings){
        newSettinsg[key] = document.getElementById(key).value;
    }    
    return newSettinsg;
}

setSettings();

document.getElementById('restart').addEventListener('click', restart);

document.getElementById('settings').addEventListener('click', ()=>{
    let storageSettings = JSON.parse(localStorage.getItem('settings'));
    for(let key in storageSettings){
        document.getElementById(key).value = storageSettings[key]
    }
    modalActive = !modalActive;
    modal.classList.add(modalActive ? 'settings_modal' : 'display_none');
    modal.classList.remove(modalActive ? 'display_none' : 'settings_modal');

})

export function closeSettingsModal(){
    modalActive = false;
    modal.classList.remove('settings_modal');
    modal.classList.add('display_none');

}


document.getElementById('close-btn').addEventListener('click', closeSettingsModal)
