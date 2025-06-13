class Dropdown extends HTMLElement {
  #prevChoose;
  constructor() {
    super();
    this.options = this.getAttribute("options");
    this.value = this.getAttribute("value") ?? "Выбрать";
    this.#prevChoose = null;
  }

  connectedCallback() {
    if (this.options) {
      const parsedOptions = JSON.parse(this.options);

      const btn = document.createElement("button");
      const span = document.createElement("span");
      const ul = document.createElement("ul");

      const handleClickOutside = (event) => {
        if (!this.contains(event.target)) {
          ul.classList.toggle("not_active");
          document.removeEventListener("click", handleClickOutside);
        }
      };

      btn.appendChild(span);
      span.textContent = this.value;

      btn.classList.add("my_dropdown_btn");
      ul.classList.add("my_dropdown_ul", "not_active");

      btn.addEventListener("click", () => {
        if (ul.classList.contains("not_active")) {
          setTimeout(() => {
            document.addEventListener("click", handleClickOutside);
          }, 0);
        }
        ul.classList.toggle("not_active");
      });

      parsedOptions.forEach((option) => {
        const {value, title} = option
        const list = document.createElement("li");
        list.value = value;
        list.textContent = title;
        list.classList.add("my_dropdown_list_item");
        list.addEventListener("click", (e) => {
          e.stopPropagation();
          this.dispatchEvent(
            new CustomEvent("change", {
              detail: { value },
            })
          );
          list.classList.add("active_li");
          ul.classList.add("not_active");
          span.textContent = title;
          if (!this.#prevChoose) {
            this.#prevChoose = list;
          } else {
            this.#prevChoose.classList.remove("active_li");
            this.#prevChoose = list;
          }
          document.removeEventListener("click", handleClickOutside);
        });
        ul.appendChild(list);
      });

      btn.appendChild(ul);
      this.insertAdjacentElement("beforeend", btn);
    }
  }
}

customElements.define("my-dropdown", Dropdown);
