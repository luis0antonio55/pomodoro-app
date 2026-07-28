const DAY_FORMAT = new Intl.DateTimeFormat("es-MX", {
  weekday: "short",
  day: "2-digit",
  month: "2-digit",
});
const HOUR_LABELS = [
  "00-05",
  "06-08",
  "09-11",
  "12-14",
  "15-17",
  "18-20",
  "21-23",
];

export class StatsModule {
  constructor(sessionModel, taskModel) {
    this.sessionModel = sessionModel;
    this.taskModel = taskModel;
  }
  getCompletedWorkSessions() {
    return this.sessionModel
      .getHistory()
      .filter((s) => s.completed && s.type === "work");
  }
  calculate() {
    const sessions = this.getCompletedWorkSessions();
    return {
      sessions,
      dailyCounts: this.byDay(sessions),
      categoryDist: this.byCategory(sessions),
      hourMap: this.byHour(sessions),
      heatmap: this.monthHeatmap(sessions),
      totalSeconds: sessions.reduce(
        (sum, s) => sum + Number(s.duration || 0),
        0,
      ),
    };
  }
  byDay(sessions = this.getCompletedWorkSessions(), days = 7) {
    const dates = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      date.setHours(0, 0, 0, 0);
      return date;
    });
    return dates.map((date) => {
      const next = new Date(date);
      next.setDate(next.getDate() + 1);
      const count = sessions.filter(
        (s) => new Date(s.startTime) >= date && new Date(s.startTime) < next,
      ).length;
      return {
        label: DAY_FORMAT.format(date),
        date: date.toISOString().slice(0, 10),
        count,
      };
    });
  }
  byCategory(sessions = this.getCompletedWorkSessions()) {
    const categories = this.taskModel.getAll();
    const map = new Map(
      categories.map((c) => [
        c.id,
        { id: c.id, label: c.name, color: c.color, count: 0 },
      ]),
    );
    sessions.forEach((session) => {
      if (!map.has(session.categoryId))
        map.set(session.categoryId, {
          id: session.categoryId,
          label: "Sin categoría",
          color: "#94a3b8",
          count: 0,
        });
      map.get(session.categoryId).count += 1;
    });
    return [...map.values()].filter((item) => item.count > 0);
  }
  byHour(sessions = this.getCompletedWorkSessions()) {
    const buckets = HOUR_LABELS.map((label) => ({ label, count: 0 }));
    sessions.forEach((session) => {
      const hour = new Date(session.startTime).getHours();
      const index =
        hour <= 5
          ? 0
          : hour <= 8
            ? 1
            : hour <= 11
              ? 2
              : hour <= 14
                ? 3
                : hour <= 17
                  ? 4
                  : hour <= 20
                    ? 5
                    : 6;
      buckets[index].count += 1;
    });
    return buckets;
  }
  monthHeatmap(sessions = this.getCompletedWorkSessions()) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => {
      const day = i + 1;
      const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      return {
        day,
        date: key,
        count: sessions.filter((s) => s.startTime.slice(0, 10) === key).length,
      };
    });
  }
}
