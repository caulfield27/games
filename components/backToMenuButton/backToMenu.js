class BackToMenu extends HTMLElement{
    constructor(){
        super();
    };

    connectedCallback(){
        const btn = document.createElement("button");
        const goBackIcon = document.createElement("img");
        const span = document.createElement("span");

        goBackIcon.src = "../../assets/back.svg";
        goBackIcon.alt = "Prev icon";
        span.textContent = "Вернуться в меню";

        btn.classList.add("back_to_menu_btn");
        btn.appendChild(goBackIcon);
        btn.appendChild(span);

        btn.addEventListener("click", ()=>{
            window.location.href = "/"
        });
        
        this.insertAdjacentElement("beforeend", btn);
    };
};

customElements.define('back-to-menu', BackToMenu);