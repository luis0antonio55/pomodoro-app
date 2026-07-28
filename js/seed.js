export function seedDemoData(sessionModel, taskModel) {
  const existing = sessionModel.getHistory();
  if (existing.length) return;

  const categories = taskModel.getAll();
  if (!categories.length) return;

  const now = new Date();
  for (let i = 0; i < 40; i++) {
    const start = new Date(now);
    start.setDate(now.getDate() - Math.floor(Math.random() * 21));
    start.setHours(7 + Math.floor(Math.random() * 12), Math.random() > 0.5 ? 0 : 30, 0, 0);
    const end = new Date(start);
    const duration = 25 * 60 + Math.floor(Math.random() * 300);
    end.setSeconds(end.getSeconds() + duration);
    sessionModel.save({
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      duration,
      categoryId: categories[Math.floor(Math.random() * categories.length)].id,
      type: "work",
      completed: true,
    });
  }
}
