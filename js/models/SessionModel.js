import { STORAGE_KEYS } from "../config.js";

export class SessionModel {
  constructor(storage, eventBus) {
    this.storage = storage;
    this.eventBus = eventBus;
  }
  save(sessionData) {
    const session = {
      id: crypto.randomUUID(),
      startTime: sessionData.startTime,
      endTime: sessionData.endTime ?? new Date().toISOString(),
      duration: Number(sessionData.duration),
      categoryId: sessionData.categoryId,
      type: sessionData.type,
      completed: Boolean(sessionData.completed),
    };
    const key = this.#monthKey(session.startTime);
    const sessions = this.storage.load(key, []);
    sessions.push(session);
    this.storage.save(key, sessions);
    this.eventBus.emit("session:saved", { sessionId: session.id, session });
    return session;
  }
  getHistory() {
    return this.storage
      .list(STORAGE_KEYS.sessionsPrefix)
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
  }
  #monthKey(dateIso) {
    const date = new Date(dateIso);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${STORAGE_KEYS.sessionsPrefix}${year}-${month}`;
  }
}
