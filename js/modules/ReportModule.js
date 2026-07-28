export class ReportModule {
  constructor(statsModule) {
    this.statsModule = statsModule;
  }
  weekly() {
    const sessions = this.statsModule.getCompletedWorkSessions();
    const now = new Date();
    const weekStart = this.#startOfWeek(now);
    const previousWeekStart = new Date(weekStart);
    previousWeekStart.setDate(previousWeekStart.getDate() - 7);
    const current = sessions.filter((s) => new Date(s.startTime) >= weekStart);
    const previous = sessions.filter(
      (s) =>
        new Date(s.startTime) >= previousWeekStart &&
        new Date(s.startTime) < weekStart,
    );
    const currentMinutes = Math.round(
      current.reduce((sum, s) => sum + s.duration, 0) / 60,
    );
    const previousMinutes = Math.round(
      previous.reduce((sum, s) => sum + s.duration, 0) / 60,
    );
    const diff = current.length - previous.length;
    return {
      currentCount: current.length,
      previousCount: previous.length,
      currentMinutes,
      previousMinutes,
      diff,
      comparison:
        diff > 0
          ? `Subiste ${diff} Pomodoros vs. la semana anterior.`
          : diff < 0
            ? `Bajaste ${Math.abs(diff)} Pomodoros vs. la semana anterior.`
            : "Mantuviste el mismo número de Pomodoros que la semana anterior.",
      insights: this.insights(current, sessions),
    };
  }
  insights(currentWeek, allSessions) {
    const stats = this.statsModule.calculate();
    const category = stats.categoryDist.sort((a, b) => b.count - a.count)[0];
    const hour = stats.hourMap.sort((a, b) => b.count - a.count)[0];
    const days = stats.dailyCounts.filter((d) => d.count > 0).length;
    const insights = [];
    if (currentWeek.length === 0)
      insights.push(
        "Esta semana aún no tienes Pomodoros completados. Empieza con una sesión corta para activar el seguimiento.",
      );
    else
      insights.push(
        `Esta semana completaste ${currentWeek.length} Pomodoros, equivalentes a ${Math.round(currentWeek.reduce((s, p) => s + p.duration, 0) / 60)} minutos productivos.`,
      );
    if (category)
      insights.push(
        `Tu categoría más trabajada es “${category.label}” con ${category.count} Pomodoros registrados.`,
      );
    else
      insights.push(
        "Cuando asignes categorías a tus sesiones, el reporte podrá mostrar en qué áreas inviertes más tiempo.",
      );
    if (hour?.count > 0)
      insights.push(
        `Tu franja más productiva es ${hour.label} hrs. Considera programar ahí tus tareas importantes.`,
      );
    else
      insights.push(
        "Todavía no hay una franja horaria dominante. El sistema la calculará automáticamente con tu historial.",
      );
    if (allSessions.length > 0 && days <= 2)
      insights.push(
        "Tu actividad está concentrada en pocos días. Intenta distribuir sesiones pequeñas durante más días de la semana.",
      );
    return insights.slice(0, 3);
  }
  #startOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay() || 7;
    d.setDate(d.getDate() - day + 1);
    d.setHours(0, 0, 0, 0);
    return d;
  }
}
