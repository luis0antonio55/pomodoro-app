import { DEFAULT_CONFIG, STORAGE_KEYS } from "../config.js";

export class ConfigModel {
  constructor(storage) {
    this.storage = storage;
    this.config = this.load();
  }
  load() {
    return { ...DEFAULT_CONFIG, ...this.storage.load(STORAGE_KEYS.config, {}) };
  }
  get() {
    return { ...this.config };
  }
  update(newConfig) {
    const clean = { ...this.config, ...newConfig };
    clean.workDuration = this.#clamp(clean.workDuration);
    clean.shortBreak = this.#clamp(clean.shortBreak);
    clean.longBreak = this.#clamp(clean.longBreak);
    clean.soundEnabled = Boolean(clean.soundEnabled);
    clean.autoStart = Boolean(clean.autoStart);
    this.config = clean;
    this.storage.save(STORAGE_KEYS.config, this.config);
    return this.get();
  }
  #clamp(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return 25;
    return Math.min(60, Math.max(1, Math.round(numeric)));
  }
}
