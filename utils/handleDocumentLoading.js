export function handleDocumentLoading(onLoad) {
  const loader = document.createElement("my-loader");
  document.body.appendChild(loader);
  document.body.style.overflow = "hidden";
  window.addEventListener("load", () => {
    loader.remove();
    document.body.style.overflow = "auto";
    onLoad();
  });
}
