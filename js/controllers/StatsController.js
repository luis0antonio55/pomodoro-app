export class StatsController {
  constructor(statsModule, statsView, reportModule, taskModel, sessionModel) {
    this.statsModule = statsModule;
    this.statsView = statsView;
    this.reportModule = reportModule;
    this.taskModel = taskModel;
    this.sessionModel = sessionModel;
    this._page = 1;
    this._bindPagination();
  }
  _bindPagination() {
    const container = document.querySelector("#historyList");
    if (!container) return;
    container.addEventListener("click", (e) => {
      const btn = e.target.closest(".page-btn");
      if (!btn || btn.disabled) return;
      this.renderHistory(parseInt(btn.dataset.page));
    });
  }
  renderAll() {
    this._page = 1;
    this.renderStats();
    this.renderHistory();
    this.renderReport();
  }
  renderStats() {
    this.statsView.render(this.statsModule.calculate());
  }
  renderHistory(page) {
    this._page = page ?? this._page;
    const categories = new Map(this.taskModel.getAll().map((c) => [c.id, c]));
    const history = this.sessionModel.getHistory();
    const perPage = 10;
    const totalPages = Math.max(1, Math.ceil(history.length / perPage));
    this._page = Math.min(this._page, totalPages);

    const container = document.querySelector("#historyList");

    if (!history.length) {
      container.innerHTML =
        '<div class="empty-state">No hay sesiones guardadas todavía.</div>';
      return;
    }

    const start = (this._page - 1) * perPage;
    const pageItems = history.slice(start, start + perPage);

    const itemsHtml = pageItems
      .map((session) => {
        const category = categories.get(session.categoryId) ?? {
          name: "Sin categoría",
          color: "#94a3b8",
        };
        const s = new Date(session.startTime);
        return `<article class="history-item">
        <span class="category-dot" style="background:${category.color}"></span>
        <div><strong>${category.name}</strong><small>${s.toLocaleDateString("es-MX")} · ${s.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}</small></div>
        <span>${Math.round(session.duration / 60)} min</span>
      </article>`;
      })
      .join("");

    container.innerHTML = itemsHtml + this._buildPagination(totalPages);
  }
  _buildPagination(totalPages) {
    if (totalPages <= 1) return "";

    let html = '<div class="pagination">';
    html += `<button class="page-btn" data-page="${this._page - 1}" ${this._page <= 1 ? "disabled" : ""}>‹ Anterior</button>`;
    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="page-btn${i === this._page ? " page-active" : ""}" data-page="${i}">${i}</button>`;
    }
    html += `<button class="page-btn" data-page="${this._page + 1}" ${this._page >= totalPages ? "disabled" : ""}>Siguiente ›</button>`;
    html += "</div>";
    return html;
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
