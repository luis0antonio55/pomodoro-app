import { TIMER_STATES } from "../config.js";

export class TimerController {
  constructor({
    timerModel,
    sessionModel,
    configModel,
    taskModel,
    notificationModule,
    timerView,
    refresh,
  }) {
    this.timerModel = timerModel;
    this.sessionModel = sessionModel;
    this.configModel = configModel;
    this.taskModel = taskModel;
    this.notificationModule = notificationModule;
    this.timerView = timerView;
    this.refresh = refresh;
    this.currentMode = "work";
    this.bindEvents();
  }
  bindEvents() {
    document.querySelectorAll(".mode-tab").forEach((button) => {
      button.addEventListener("click", () => this.setMode(button.dataset.mode));
    });
    document
      .querySelector("#startBtn")
      .addEventListener("click", () => this.startOrResume());
    document
      .querySelector("#pauseBtn")
      .addEventListener("click", () => this.timerModel.pause());
    document
      .querySelector("#resetBtn")
      .addEventListener("click", () => this.reset());
    document
      .querySelector("#cancelBtn")
      .addEventListener("click", () => this.cancel());
    this.timerModel.eventBus.on("timer:tick", (state) =>
      this.timerView.render(state),
    );
    this.timerModel.eventBus.on("timer:state", (state) =>
      this.timerView.render(state),
    );
    this.timerModel.eventBus.on("timer:complete", (payload) =>
      this.onComplete(payload),
    );
  }
  setMode(mode) {
    if (this.timerModel.getState().state !== TIMER_STATES.IDLE) return;
    this.currentMode = mode;
    document
      .querySelectorAll(".mode-tab")
      .forEach((button) =>
        button.classList.toggle("active", button.dataset.mode === mode),
      );
    this.timerModel.totalSeconds = this.getMinutesForMode(mode) * 60;
    this.timerModel.timeLeft = this.timerModel.totalSeconds;
    this.timerModel.type = mode;
    this.timerView.render(this.timerModel.getState());
  }
  startOrResume() {
    const state = this.timerModel.getState();
    if (state.state === TIMER_STATES.PAUSED) this.timerModel.resume();
    else
      this.timerModel.start(
        this.currentMode,
        this.getMinutesForMode(this.currentMode),
      );
  }
  reset() {
    this.timerModel.reset(this.getMinutesForMode(this.currentMode));
  }
  cancel() {
    this.timerModel.cancel(true);
    this.reset();
    this.toast("Sesión cancelada. No se guardó en el historial.");
  }
  onComplete(payload) {
    const categoryId =
      document.querySelector("#activeCategorySelect").value ||
      this.taskModel.getAll()[0]?.id;
    this.sessionModel.save({ ...payload, categoryId, completed: true });
    this.notificationModule.notify(
      "Pomodoro finalizado",
      "La sesión se guardó automáticamente y las estadísticas fueron actualizadas.",
    );
    this.toast("Sesión completada y guardada automáticamente.");
    this.refresh();
    if (this.configModel.get().autoStart) this.startOrResume();
    else this.reset();
  }
  getMinutesForMode(mode) {
    const config = this.configModel.get();
    if (mode === "short") return config.shortBreak;
    if (mode === "long") return config.longBreak;
    return config.workDuration;
  }
  toast(message) {
    const toast = document.querySelector("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2800);
  }
}
