class Loader extends HTMLElement{
    constructor(){
        super();
    };

    connectedCallback(){
        const container = document.createElement("div");
        const loader = document.createElement("div");
        loader.classList.add("my-loader");
        container.classList.add("my-loader-container");
        container.appendChild(loader)
        this.insertAdjacentElement("beforeend", container);
    }
}

customElements.define("my-loader", Loader);