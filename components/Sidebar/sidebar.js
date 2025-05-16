class Sidebar extends HTMLElement {
    constructor() {
        super();
        this.className = "sidebar_container"
        this.links = [
            {
                href: "/pages/minesweeper/index.html",
                label: "Minesweeper"
            },
            {
                href: "/index.html",
                label: "Home"
            },
            {
                href: "/pages/memoryGame/index.html",
                label: "Memory game"
            },
        ];
    }

    connectedCallback() {
        this.insertAdjacentHTML("beforeend", `
                <nav class="navbar_container">
                    ${this.links.map((link) => `
                        <a class="navLinks" href=${link.href}>${link.label}</a>
                    `).join("")}
                </nav>
            `)
    }
}

customElements.define("my-sidebar", Sidebar);