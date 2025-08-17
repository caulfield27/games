import { pages } from "../../constants/pages.js";
import { handleDocumentLoading } from "../../utils/utils.js"

// GLOBAL VARIABLES
const container = document.getElementById("main_page_container");
let cards;
const tagsSet = new Set();
const tagsContainer = document.getElementById("tags_container");
const search = document.getElementById("main_page_search");
let isPwaModalShown = false;

// INIT UI

handleDocumentLoading(render);


// REGISTR SW
if("serviceWorker" in navigator){
  window.addEventListener("load", ()=>{
    navigator.serviceWorker.register("../../sw.js").then(
      reg => console.log('service worker успешно зарегистрирован: ', reg.scope)
    ).catch(err => console.log(err))
  })
}

window.addEventListener("beforeinstallprompt", (event) =>{
  event.preventDefault();
  
  if(isPwaModalShown){
    return;
  };

  isPwaModalShown = true;
  Swal.fire({
    // icon: "info",
    title: "Установить приложение",
    showCancelButton: true,
    cancelButtonText: "продолжить",
    confirmButtonText: "установить"
  }).then((res)=>{
    if(res?.isConfirmed){
      event.prompt();
    };
  }) 
})

// HANDLE FILTERS

search.addEventListener("focus", (event) => {
  event.target.placeholder = "";
});
search.addEventListener("blur", (event) => {
  event.target.placeholder = "Поиск...";
});
search.addEventListener("input", (event) => {
  const { value } = event.target;
  if (cards) {
    for (const game of cards) {
      const { name } = game.dataset;
      if (tagsSet.size) {
        const tags = JSON.parse(game.dataset.tags);
        const isMatched = !(tags.some(tag => tagsSet.has(tag)) && name.toLowerCase().includes(value.toLowerCase().trim()));
        game.classList.toggle("hidden", isMatched);
      } else {
        game.classList.toggle("hidden", !name.toLowerCase().includes(value.toLowerCase().trim()));
      }
    };
  };
});


// HELPER FUNCTIONS

function displayGames() {
  for (const page of pages) {
    const wrapper = document.createElement("div");
    const card = document.createElement("article");
    const img = document.createElement("img");
    const infoWrapper = document.createElement("div");
    const gameLink = document.createElement("a");
    const tagsWrapper = document.createElement("div");

    img.alt = `${page.name} icon`;
    img.src = page.icon;
    gameLink.href = page.href;
    gameLink.textContent = page.name;
    wrapper.dataset.name = page.name;
    wrapper.dataset.tags = JSON.stringify(page.tags);


    card.classList.add("main_page_article");
    wrapper.classList.add("main_page_card_wrapper");
    infoWrapper.classList.add("main_page_info_wrapper");

    for (const tag of page.tags) {
      const span = document.createElement("span");
      span.textContent = tag;
      span.role = "button";
      const spanClone = span.cloneNode(true);
      const cancelBtn = document.createElement("button");
      cancelBtn.innerHTML = `&#10006`;

      cancelBtn.addEventListener("click", () => {
        if (cards) {
          tagsSet.delete(tag);
          tagsContainer.removeChild(spanClone);
          for (const card of cards) {
            const { tags, name } = card.dataset;
            const parsedTags = JSON.parse(tags);
            const { value } = search;
            const isMatched = parsedTags.some(item => item !== tag && !tagsSet.size);

            if (!value) {
              removeFilters(isMatched, card, parsedTags);
            } else {
              const isSearchMatched = name.toLowerCase().includes(value.toLowerCase().trim());
              if (isSearchMatched) {
                removeFilters(isMatched, card, parsedTags);
              };
            };
          };
        };
      });

      spanClone.appendChild(cancelBtn)
      span.addEventListener("click", () => {
        if (cards) {
          if (!tagsSet.has(tag)) {
            tagsContainer.appendChild(spanClone);
          };
          tagsSet.add(tag);
          for (const card of cards) {
            const { tags, name } = card.dataset;
            const { value } = search;
            const parsedTags = JSON.parse(tags);
            filterGames(parsedTags, value, card, name);
          }
        };
      });

      tagsWrapper.appendChild(span);
    }

    img.addEventListener("click", () => window.location.href = page.href);


    infoWrapper.appendChild(gameLink);
    infoWrapper.appendChild(tagsWrapper);
    card.appendChild(img);
    wrapper.appendChild(card);
    wrapper.appendChild(infoWrapper);
    container.appendChild(wrapper);
  };
  cards = container.children;
}

function removeFilters(isMatched, card, parsedTags) {
  if (isMatched) {
    card.classList.remove("hidden");
  } else {
    if (!parsedTags.some((tag) => tagsSet.has(tag))) {
      card.classList.add("hidden");
    };
  };
}


function filterGames(parsedTags, value, card, name) {
  const isMatched = parsedTags.some((item) => tagsSet.has(item));
  if (!value) {
    card.classList.toggle("hidden", !isMatched);
  } else {
    card.classList.toggle("hidden", !(isMatched && name.toLowerCase().includes(value.toLowerCase().trim())));
  }
};

function render() {
  displayGames();
}