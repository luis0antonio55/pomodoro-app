export class StatsController {
  constructor(statsModule, statsView, reportModule, taskModel, sessionModel) {
    this.statsModule = statsModule;
    this.statsView = statsView;
    this.reportModule = reportModule;
    this.taskModel = taskModel;
    this.sessionModel = sessionModel;
  }
  renderAll() {
    this.renderStats();
    this.renderHistory();
    this.renderReport();
  }
  renderStats() {
    this.statsView.render(this.statsModule.calculate());
  }
  renderHistory() {
    const categories = new Map(this.taskModel.getAll().map((c) => [c.id, c]));
    const history = this.sessionModel.getHistory();
    document.querySelector("#historyList").innerHTML = history.length
      ? history
          .slice(0, 50)
          .map((session) => {
            const category = categories.get(session.categoryId) ?? {
              name: "Sin categoría",
              color: "#94a3b8",
            };
            const start = new Date(session.startTime);
            return `<article class="history-item">
        <span class="category-dot" style="background:${category.color}"></span>
        <div><strong>${category.name}</strong><small>${start.toLocaleDateString("es-MX")} · ${start.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}</small></div>
        <span>${Math.round(session.duration / 60)} min</span>
      </article>`;
          })
          .join("")
      : '<div class="empty-state">No hay sesiones guardadas todavía.</div>';
  }
  renderReport() {
    const report = this.reportModule.weekly();
    document.querySelector("#weeklyReport").innerHTML = `
      <article class="report-card"><span>Pomodoros esta semana</span><strong>${report.currentCount}</strong><small>${report.currentMinutes} minutos</small></article>
      <article class="report-card"><span>Semana anterior</span><strong>${report.previousCount}</strong><small>${report.previousMinutes} minutos</small></article>
      <article class="report-card wide-report"><span>Comparativa</span><p>${report.comparison}</p></article>
      <article class="report-card insight-card"><span>Insights personalizados</span><ol>${report.insights.map((insight) => `<li>${insight}</li>`).join("")}</ol></article>
    `;
  }
}
