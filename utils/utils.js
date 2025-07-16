function handleDocumentLoading(onLoad) {
  const loader = document.createElement("my-loader");
  document.body.appendChild(loader);
  document.body.style.overflow = "hidden";
  window.addEventListener("DOMContentLoaded", () => {
    loader.remove();
    document.body.style.overflow = "auto";
    onLoad();
  });
}

function removeQueryParams(key){
    const url = new URL(window.location.href);
    url.searchParams.delete(key);
    history.replaceState(null,"",url);
}

export {handleDocumentLoading, removeQueryParams}