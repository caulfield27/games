class Timer {
  #minutes;
  #seconds;
  #minutesDOMelement;
  #secondsDOMelement;
  #interval;
  #onTimeout;
  #options;
  constructor(options, onTimeout) {
    this.#options = options;
    this.#minutes = options?.minutes;
    this.#seconds = options?.seconds;
    this.#minutesDOMelement = options?.minutesDOMelement;
    this.#secondsDOMelement = options?.secondsDOMelement;
    this.#interval = null;
    this.#onTimeout = onTimeout;
    this.isTimerActive = false;
  }

  startTimer() {
    this.isTimerActive = true;
    const timer = setInterval(() => {
      if (this.#seconds === 0) {
        if (this.#minutes === 0) {
          this.stopTimer();
          this.#onTimeout();
        } else {
          this.#minutes--;
          this.#seconds = 59;
          this.#minutesDOMelement.textContent =
            this.#minutes < 10 ? `0${this.#minutes}` : this.#minutes;
          this.#secondsDOMelement.textContent = this.#seconds;
        }
      } else {
        this.#seconds--;
        this.#secondsDOMelement.textContent =
          this.#seconds < 10 ? `0${this.#seconds}` : this.#seconds;
      }
    }, 1000);
    this.interval = timer;
  }

  stopTimer() {
    if (this.interval) {
      this.isTimerActive = false;
      clearInterval(this.interval);
    }
  }

  resetTimer() {
    this.#minutes = this.#options.minutes;
    this.#seconds = this.#options.seconds;
    this.#minutesDOMelement.textContent = this.#minutes < 10 ? `0${this.#minutes}` : this.#minutes;
    this.#secondsDOMelement.textContent = this.#seconds < 10 ? `0${this.#seconds}` : this.#seconds;
  }
}
