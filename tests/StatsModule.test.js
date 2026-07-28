import { StatsModule } from "../js/modules/StatsModule.js";

const fakeTaskModel = {
  getAll: () => [
    { id: "cat-estudio", name: "Estudio", color: "#3b82f6" },
    { id: "cat-proyecto", name: "Proyecto", color: "#22c55e" },
  ],
};

describe("StatsModule", () => {
  test("maneja dashboard vacío sin división por cero", () => {
    const stats = new StatsModule(
      { getHistory: () => [] },
      fakeTaskModel,
    ).calculate();
    expect(stats.sessions).toHaveLength(0);
    expect(stats.totalSeconds).toBe(0);
    expect(stats.dailyCounts).toHaveLength(7);
    expect(stats.categoryDist).toHaveLength(0);
  });

  test("calcula distribución por categoría y franjas horarias", () => {
    const sessionModel = {
      getHistory: () => [
        {
          startTime: "2026-04-04T10:00:00.000Z",
          duration: 1500,
          categoryId: "cat-estudio",
          type: "work",
          completed: true,
        },
        {
          startTime: "2026-04-04T18:00:00.000Z",
          duration: 1500,
          categoryId: "cat-proyecto",
          type: "work",
          completed: true,
        },
        {
          startTime: "2026-04-04T18:30:00.000Z",
          duration: 300,
          categoryId: "cat-proyecto",
          type: "short",
          completed: true,
        },
      ],
    };
    const stats = new StatsModule(sessionModel, fakeTaskModel).calculate();
    expect(stats.sessions).toHaveLength(2);
    expect(stats.categoryDist.find((c) => c.id === "cat-proyecto").count).toBe(
      1,
    );
    expect(stats.hourMap.reduce((sum, h) => sum + h.count, 0)).toBe(2);
  });
});
