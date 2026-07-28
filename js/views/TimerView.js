import { INTERVAL_TYPES, TIMER_STATES } from "../config.js";

export class TimerView {
  constructor() {
    this.timerValue = document.querySelector("#timerValue");
    this.timerLabel = document.querySelector("#timerLabel");
    this.stateBadge = document.querySelector("#stateBadge");
    this.timerCard = document.querySelector("#timerCard");
    this.progressRing = document.querySelector("#progressRing");
    this.pauseNotice = document.querySelector("#pauseNotice");
    this.startBtn = document.querySelector("#startBtn");
    this.pauseBtn = document.querySelector("#pauseBtn");
    this.cancelBtn = document.querySelector("#cancelBtn");
  }
  render(state) {
    this.timerValue.textContent = this.formatTime(
      state.timeLeft || state.totalSeconds || 0,
    );
    this.timerLabel.textContent = INTERVAL_TYPES[state.type] ?? "Trabajo";
    const progress = state.totalSeconds
      ? Math.round(
          ((state.totalSeconds - state.timeLeft) / state.totalSeconds) * 100,
        )
      : 0;
    this.progressRing.style.setProperty("--progress", `${progress}%`);
    this.stateBadge.textContent =
      state.state === TIMER_STATES.RUNNING
        ? "En ejecución"
        : state.state === TIMER_STATES.PAUSED
          ? "Pausado"
          : "Inactivo";
    this.stateBadge.className = `state-badge ${state.state === TIMER_STATES.RUNNING ? "running" : state.state === TIMER_STATES.PAUSED ? "paused" : "idle"}`;
    this.timerCard.classList.toggle(
      "is-paused",
      state.state === TIMER_STATES.PAUSED,
    );
    this.pauseNotice.hidden = state.state !== TIMER_STATES.PAUSED;
    this.startBtn.textContent =
      state.state === TIMER_STATES.PAUSED ? "Reanudar" : "Iniciar";
    this.pauseBtn.disabled = state.state !== TIMER_STATES.RUNNING;
    this.cancelBtn.disabled = state.state === TIMER_STATES.IDLE;
  }
  formatTime(seconds) {
    const safe = Math.max(0, Math.floor(seconds));
    const minutes = String(Math.floor(safe / 60)).padStart(2, "0");
    const secs = String(safe % 60).padStart(2, "0");
    return `${minutes}:${secs}`;
  }
}
