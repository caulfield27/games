import { pages } from "./constants/pages.js";
const container = document.getElementById("main_page_container");

for (const page of pages) {
  const card = document.createElement("article");
  const img = document.createElement("img");
  img.alt = `${page.name} icon`;
  img.src = page.icon;
  const span = document.createElement("span");
  span.textContent = page.name;
  const btn = document.createElement("button");
  btn.textContent = "Играть";
  btn.addEventListener("click", () => {
    window.location.href = page.href;
  });
  card.classList.add("main_page_article");
  card.appendChild(img);
  card.appendChild(span);
  card.appendChild(btn);
  container.appendChild(card);
}
