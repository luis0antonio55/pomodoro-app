import { EventEmitter } from "./modules/EventEmitter.js";
import { StorageModule } from "./modules/StorageModule.js";
import { NotificationModule } from "./modules/NotificationModule.js";
import { StatsModule } from "./modules/StatsModule.js";
import { ReportModule } from "./modules/ReportModule.js";
import { TimerModel } from "./models/TimerModel.js";
import { SessionModel } from "./models/SessionModel.js";
import { TaskModel } from "./models/TaskModel.js";
import { ConfigModel } from "./models/ConfigModel.js";
import { TimerView } from "./views/TimerView.js";
import { StatsView } from "./views/StatsView.js";
import { TimerController } from "./controllers/TimerController.js";
import { TaskController } from "./controllers/TaskController.js";
import { StatsController } from "./controllers/StatsController.js";


const loadChart = async () => {
  if (window.Chart) return;
  const module = await import("chart.js/auto");
  window.Chart = module.default;
};

const eventBus = new EventEmitter();
const storage = new StorageModule();
const configModel = new ConfigModel(storage);
const taskModel = new TaskModel(storage);
const sessionModel = new SessionModel(storage, eventBus);
const timerModel = new TimerModel(eventBus);
const notificationModule = new NotificationModule(configModel);

await loadChart();

const timerView = new TimerView();
const statsView = new StatsView();
const statsModule = new StatsModule(sessionModel, taskModel);
const reportModule = new ReportModule(statsModule);
const statsController = new StatsController(
  statsModule,
  statsView,
  reportModule,
  taskModel,
  sessionModel,
);
const taskController = new TaskController(taskModel, () =>
  statsController.renderAll(),
);

const refresh = () => statsController.renderAll();
new TimerController({
  timerModel,
  sessionModel,
  configModel,
  taskModel,
  notificationModule,
  timerView,
  refresh,
});

function bindSettings() {
  const config = configModel.get();
  const fields = ["workDuration", "shortBreak", "longBreak"];
  fields.forEach((field) => {
    const input = document.querySelector(`#${field}`);
    const label = document.querySelector(`#${field}Label`);
    input.value = config[field];
    label.textContent = config[field];
    input.addEventListener("input", () => {
      label.textContent = input.value;
    });
  });
  document.querySelector("#soundEnabled").checked = config.soundEnabled;
  document.querySelector("#autoStart").checked = config.autoStart;
  document
    .querySelector("#settingsForm")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const updated = configModel.update({
        workDuration: document.querySelector("#workDuration").value,
        shortBreak: document.querySelector("#shortBreak").value,
        longBreak: document.querySelector("#longBreak").value,
        soundEnabled: document.querySelector("#soundEnabled").checked,
        autoStart: document.querySelector("#autoStart").checked,
      });
      timerModel.totalSeconds = updated.workDuration * 60;
      timerModel.timeLeft = updated.workDuration * 60;
      timerModel.type = "work";
      timerView.render(timerModel.getState());
      showToast("Configuración guardada.");
    });
  document.querySelector("#clearDataBtn").addEventListener("click", async () => {
    const ok = await showConfirmModal(
      "Se eliminarán todas las sesiones, categorías y configuración. Esta acción no se puede deshacer.",
    );
    if (!ok) return;
    storage.clearPomodoroData();
    location.reload();
  });
}

function bindClearHistory() {
  const btn = document.querySelector("#clearHistoryBtn");
  if (!btn) return;
  btn.addEventListener("click", async () => {
    const history = sessionModel.getHistory();
    if (!history.length) {
      showToast("No hay datos que eliminar.");
      return;
    }
    const ok = await showConfirmModal(
      `Se eliminarán ${history.length} sesión${history.length !== 1 ? "es" : ""} guardada${history.length !== 1 ? "s" : ""}. Esta acción no se puede deshacer.`,
    );
    if (!ok) return;
    const keys = Object.keys(localStorage).filter((k) =>
      k.startsWith("pomodoro:sessions:"),
    );
    keys.forEach((k) => storage.delete(k));
    statsController.renderAll();
    showToast(`Se eliminaron ${history.length} sesiones.`);
  });
}

function bindDemoData() {
  document.querySelector("#demoDataBtn").addEventListener("click", () => {
    const categories = taskModel.getAll();
    const now = new Date();
    for (let i = 0; i < 18; i += 1) {
      const start = new Date(now);
      start.setDate(now.getDate() - Math.floor(Math.random() * 14));
      start.setHours(
        8 + Math.floor(Math.random() * 12),
        Math.random() > 0.5 ? 0 : 30,
        0,
        0,
      );
      const end = new Date(start);
      end.setMinutes(end.getMinutes() + 25);
      sessionModel.save({
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        duration: 1500,
        categoryId:
          categories[Math.floor(Math.random() * categories.length)].id,
        type: "work",
        completed: true,
      });
    }
    statsController.renderAll();
    showToast("Datos demo cargados para probar estadísticas y reporte.");
  });
}

function showConfirmModal(message) {
  return new Promise((resolve) => {
    const overlay = document.querySelector("#confirmModal");
    const msgEl = document.querySelector("#modalMessage");
    msgEl.textContent = message;
    overlay.hidden = false;

    document.querySelector("#modalConfirmBtn").onclick = () => {
      overlay.hidden = true;
      resolve(true);
    };
    document.querySelector("#modalCancelBtn").onclick = () => {
      overlay.hidden = true;
      resolve(false);
    };
  });
}
function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2800);
}

bindSettings();
bindDemoData();
bindClearHistory();
taskController.render();
statsController.renderAll();
timerModel.totalSeconds = configModel.get().workDuration * 60;
timerModel.timeLeft = timerModel.totalSeconds;
timerView.render(timerModel.getState());
