export class EventEmitter {
  constructor() {
    this.events = new Map();
  }
  on(eventName, listener) {
    if (!this.events.has(eventName)) this.events.set(eventName, new Set());
    this.events.get(eventName).add(listener);
    return () => this.off(eventName, listener);
  }
  off(eventName, listener) {
    this.events.get(eventName)?.delete(listener);
  }
  emit(eventName, payload) {
    this.events.get(eventName)?.forEach((listener) => listener(payload));
  }
}
