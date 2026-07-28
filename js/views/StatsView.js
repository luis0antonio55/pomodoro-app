export class StatsView {
  constructor() {
    this.dailyChart = null;
    this.categoryChart = null;
    this.hourChart = null;
  }
  render(stats) {
    document.querySelector("#totalSessions").textContent =
      stats.sessions.length;
    document.querySelector("#totalTime").textContent =
      `${(stats.totalSeconds / 3600).toFixed(1)} h`;
    const bestDay = [...stats.dailyCounts].sort((a, b) => b.count - a.count)[0];
    const bestHour = [...stats.hourMap].sort((a, b) => b.count - a.count)[0];
    document.querySelector("#bestDay").textContent = bestDay?.count
      ? bestDay.label
      : "-";
    document.querySelector("#bestHour").textContent = bestHour?.count
      ? `${bestHour.label} hrs`
      : "-";
    document.querySelector("#emptyStats").hidden = stats.sessions.length > 0;
    this.renderCharts(stats);
    this.renderHeatmap(stats.heatmap);
  }
  renderCharts(stats) {
    this.dailyChart = this.#replaceChart(
      this.dailyChart,
      "#dailyChart",
      "bar",
      {
        labels: stats.dailyCounts.map((d) => d.label),
        datasets: [
          {
            label: "Pomodoros",
            data: stats.dailyCounts.map((d) => d.count),
            borderWidth: 1,
          },
        ],
      },
    );
    this.categoryChart = this.#replaceChart(
      this.categoryChart,
      "#categoryChart",
      "doughnut",
      {
        labels: stats.categoryDist.map((c) => c.label),
        datasets: [
          {
            data: stats.categoryDist.map((c) => c.count),
            backgroundColor: stats.categoryDist.map((c) => c.color),
          },
        ],
      },
    );
    this.hourChart = this.#replaceChart(this.hourChart, "#hourChart", "bar", {
      labels: stats.hourMap.map((h) => h.label),
      datasets: [
        {
          label: "Pomodoros",
          data: stats.hourMap.map((h) => h.count),
          borderWidth: 1,
        },
      ],
    });
  }
  renderHeatmap(days) {
    const max = Math.max(1, ...days.map((d) => d.count));
    document.querySelector("#heatmap").innerHTML = days
      .map((d) => {
        const level = Math.ceil((d.count / max) * 4);
        return `<span class="heat-cell level-${level}" title="${d.date}: ${d.count} Pomodoros">${d.day}</span>`;
      })
      .join("");
  }
  #replaceChart(instance, selector, type, data) {
    if (instance) instance.destroy();
    const ctx = document.querySelector(selector);
    return new Chart(ctx, {
      type,
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "bottom" } },
        scales:
          type === "bar"
            ? { y: { beginAtZero: true, ticks: { precision: 0 } } }
            : {},
      },
    });
  }
}
