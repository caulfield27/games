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

function launchConfetti() {
  const duration = 2 * 1000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#ff8a4b", "#cb9df0", "#f6dfff", "#ffb86c"]
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#ff8a4b", "#cb9df0", "#f6dfff", "#ffb86c"]
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

export {handleDocumentLoading, removeQueryParams,launchConfetti}