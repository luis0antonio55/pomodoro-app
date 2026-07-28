import { TIMER_STATES } from "../config.js";

export class TimerModel {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.timeLeft = 0;
    this.totalSeconds = 0;
    this.state = TIMER_STATES.IDLE;
    this.type = "work";
    this.startTime = null;
    this.intervalId = null;
  }
  start(type, minutes) {
    this.cancel(false);
    this.type = type;
    this.totalSeconds = Math.max(1, Number(minutes) * 60);
    this.timeLeft = this.totalSeconds;
    this.startTime = new Date().toISOString();
    this.state = TIMER_STATES.RUNNING;
    this.#emitTick();
    this.intervalId = setInterval(() => this.tick(), 1000);
  }
  pause() {
    if (this.state !== TIMER_STATES.RUNNING) return;
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.state = TIMER_STATES.PAUSED;
    this.eventBus.emit("timer:state", this.getState());
  }
  resume() {
    if (this.state !== TIMER_STATES.PAUSED) return;
    this.state = TIMER_STATES.RUNNING;
    this.intervalId = setInterval(() => this.tick(), 1000);
    this.eventBus.emit("timer:state", this.getState());
  }
  reset(minutes = null) {
    clearInterval(this.intervalId);
    this.intervalId = null;
    if (minutes) this.totalSeconds = Number(minutes) * 60;
    this.timeLeft = this.totalSeconds;
    this.state = TIMER_STATES.IDLE;
    this.startTime = null;
    this.#emitTick();
    this.eventBus.emit("timer:state", this.getState());
  }
  cancel(emit = true) {
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.state = TIMER_STATES.IDLE;
    this.startTime = null;
    if (emit) this.eventBus.emit("timer:cancelled", this.getState());
  }
  tick() {
    if (this.state !== TIMER_STATES.RUNNING) return;
    this.timeLeft -= 1;
    this.#emitTick();
    if (this.timeLeft <= 0) this.complete();
  }
  complete() {
    clearInterval(this.intervalId);
    this.intervalId = null;
    const payload = {
      type: this.type,
      duration: this.totalSeconds,
      startTime: this.startTime,
      endTime: new Date().toISOString(),
    };
    this.state = TIMER_STATES.IDLE;
    this.timeLeft = 0;
    this.startTime = null;
    this.eventBus.emit("timer:complete", payload);
    this.eventBus.emit("timer:state", this.getState());
  }
  getState() {
    return {
      timeLeft: this.timeLeft,
      totalSeconds: this.totalSeconds,
      state: this.state,
      type: this.type,
      startTime: this.startTime,
    };
  }
  #emitTick() {
    this.eventBus.emit("timer:tick", this.getState());
  }
}
