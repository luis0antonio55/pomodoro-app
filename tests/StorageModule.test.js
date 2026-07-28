import { StorageModule } from "../js/modules/StorageModule.js";

describe("StorageModule", () => {
  test("guarda, carga, lista y elimina JSON", () => {
    const storage = new StorageModule(window.localStorage);
    window.localStorage.clear();
    storage.save("pomodoro:test:1", [{ id: 1 }]);
    storage.save("pomodoro:test:2", [{ id: 2 }]);
    expect(storage.load("pomodoro:test:1")).toEqual([{ id: 1 }]);
    expect(storage.list("pomodoro:test:")).toHaveLength(2);
    storage.delete("pomodoro:test:1");
    expect(storage.load("pomodoro:test:1", [])).toEqual([]);
  });
});
