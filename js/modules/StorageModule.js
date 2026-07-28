export class StorageModule {
  constructor(storage = window.localStorage) {
    this.storage = storage;
  }
  save(key, data) {
    this.storage.setItem(key, JSON.stringify(data));
  }
  load(key, fallback = null) {
    const raw = this.storage.getItem(key);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }
  delete(key) {
    this.storage.removeItem(key);
  }
  list(prefix) {
    const values = [];
    for (let i = 0; i < this.storage.length; i += 1) {
      const key = this.storage.key(i);
      if (key?.startsWith(prefix)) values.push(...this.load(key, []));
    }
    return values;
  }
  clearPomodoroData() {
    Object.keys(this.storage)
      .filter((key) => key.startsWith("pomodoro:"))
      .forEach((key) => this.storage.removeItem(key));
  }
}
