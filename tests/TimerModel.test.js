import { TimerModel } from "../js/models/TimerModel.js";
import { EventEmitter } from "../js/modules/EventEmitter.js";
import { TIMER_STATES } from "../js/config.js";

describe("TimerModel", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  test("inicia, pausa y reanuda sin perder el estado", () => {
    const timer = new TimerModel(new EventEmitter());
    timer.start("work", 1);
    jest.advanceTimersByTime(2000);
    timer.pause();
    const paused = timer.getState().timeLeft;
    jest.advanceTimersByTime(5000);
    expect(timer.getState().timeLeft).toBe(paused);
    expect(timer.getState().state).toBe(TIMER_STATES.PAUSED);
    timer.resume();
    jest.advanceTimersByTime(1000);
    expect(timer.getState().timeLeft).toBe(paused - 1);
  });

  test("emite timer:complete al finalizar", () => {
    const eventBus = new EventEmitter();
    const timer = new TimerModel(eventBus);
    const completed = jest.fn();
    eventBus.on("timer:complete", completed);
    timer.start("work", 1 / 60);
    jest.advanceTimersByTime(1000);
    expect(completed).toHaveBeenCalledTimes(1);
  });
});
