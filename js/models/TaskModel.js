import { DEFAULT_CATEGORIES, STORAGE_KEYS } from "../config.js";

export class TaskModel {
  constructor(storage) {
    this.storage = storage;
    this.categories =
      this.storage.load(STORAGE_KEYS.categories, null) ?? DEFAULT_CATEGORIES;
    this.persist();
  }
  getAll() {
    return [...this.categories];
  }
  getById(id) {
    return this.categories.find((category) => category.id === id) ?? null;
  }
  create(name, color) {
    const category = {
      id: crypto.randomUUID(),
      name: name.trim(),
      color,
      createdAt: new Date().toISOString(),
    };
    if (!category.name)
      throw new Error("El nombre de la categoría es obligatorio.");
    this.categories.push(category);
    this.persist();
    return category;
  }
  update(id, data) {
    this.categories = this.categories.map((category) =>
      category.id === id ? { ...category, ...data } : category,
    );
    this.persist();
  }
  delete(id) {
    if (this.categories.length <= 1)
      throw new Error("Debe existir al menos una categoría.");
    this.categories = this.categories.filter((category) => category.id !== id);
    this.persist();
  }
  persist() {
    this.storage.save(STORAGE_KEYS.categories, this.categories);
  }
}
