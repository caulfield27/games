class Timer {
  #minutes;
  #seconds;
  #minutesTextContent;
  #secondsTextContent;
  #interval;
  #reset;
  #timerDOMelement;
  constructor(options, resetCb) {
    this.#minutes = options?.minutes;
    this.#seconds = options?.seconds;
    this.#minutesTextContent = options?.minutesTextContent;
    this.#secondsTextContent = options?.secondsTextContent;
    this.#interval = null;
    this.#reset = resetCb;
    this.#timerDOMelement = options?.timerDOMelement;
  }

  startTimer() {
    const timer = setInterval(() => {
      if (this.#seconds === 0) {
        if (this.#minutes === 0) {
          Swal.fire({
            title: "Вы проиграли",
            text: "Вы не успели найти все пары во время ):",
            icon: "error",
            confirmButtonText: "Попробовать ещё",
          }).then((res) => {
            if (res?.isConfirmed) {
              this.#reset();
            }
            clearInterval(timer);
          });
        } else {
          this.#minutes--;
          this.#seconds = 59;
          this.#minutesTextContent = this.#minutes < 10 ? `0${this.#minutes}` : this.#minutes;
          this.#secondsTextContent = this.#seconds;
        }
      } else {
        this.#seconds--;
        this.#secondsTextContent = this.#seconds < 10 ? `0${this.#seconds}` : this.#seconds;
      }

      if(this.#minutes === 0 && this.#seconds < 10){
        this.#timerDOMelement.style.color = "red";
      }
    }, 1000);
    this.interval = timer;
  }

  stopTimer() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
