export const STORAGE_KEYS = {
  config: "pomodoro:config",
  categories: "pomodoro:categories",
  sessionsPrefix: "pomodoro:sessions:",
};

export const DEFAULT_CONFIG = {
  workDuration: 25,
  shortBreak: 5,
  longBreak: 15,
  soundEnabled: true,
  autoStart: false,
};

export const TIMER_STATES = {
  IDLE: "INACTIVO",
  RUNNING: "EN_EJECUCION",
  PAUSED: "PAUSADO",
};

export const INTERVAL_TYPES = {
  work: "Trabajo",
  short: "Descanso corto",
  long: "Descanso largo",
};

export const DEFAULT_CATEGORIES = [
  {
    id: "cat-estudio",
    name: "Estudio",
    color: "#3b82f6",
    createdAt: new Date().toISOString(),
  },
  {
    id: "cat-proyecto",
    name: "Proyecto",
    color: "#22c55e",
    createdAt: new Date().toISOString(),
  },
  {
    id: "cat-personal",
    name: "Personal",
    color: "#f59e0b",
    createdAt: new Date().toISOString(),
  },
];
