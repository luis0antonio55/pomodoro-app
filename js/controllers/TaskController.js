export class TaskController {
  constructor(taskModel, onChange) {
    this.taskModel = taskModel;
    this.onChange = onChange;
    this.bindEvents();
  }
  bindEvents() {
    document
      .querySelector("#categoryForm")
      .addEventListener("submit", (event) => {
        event.preventDefault();
        const name = document.querySelector("#categoryName");
        const color = document.querySelector("#categoryColor");
        this.taskModel.create(name.value, color.value);
        name.value = "";
        this.render();
        this.onChange();
      });
  }
  render() {
    const categories = this.taskModel.getAll();
    const select = document.querySelector("#activeCategorySelect");
    const current = select.value;
    select.innerHTML = categories
      .map(
        (category) =>
          `<option value="${category.id}">${category.name}</option>`,
      )
      .join("");
    if (categories.some((c) => c.id === current)) select.value = current;
    document.querySelector("#categoryList").innerHTML = categories
      .map(
        (category) => `
      <article class="category-item">
        <span class="category-dot" style="background:${category.color}"></span>
        <input aria-label="Nombre de categoría" value="${category.name}" data-edit-name="${category.id}" />
        <input aria-label="Color de categoría" type="color" value="${category.color}" data-edit-color="${category.id}" />
        <button class="ghost-btn" data-delete-category="${category.id}">Eliminar</button>
      </article>
    `,
      )
      .join("");
    document.querySelectorAll("[data-edit-name]").forEach((input) =>
      input.addEventListener("change", () => {
        this.taskModel.update(input.dataset.editName, {
          name: input.value.trim() || "Sin nombre",
        });
        this.render();
        this.onChange();
      }),
    );
    document.querySelectorAll("[data-edit-color]").forEach((input) =>
      input.addEventListener("change", () => {
        this.taskModel.update(input.dataset.editColor, { color: input.value });
        this.render();
        this.onChange();
      }),
    );
    document.querySelectorAll("[data-delete-category]").forEach((button) =>
      button.addEventListener("click", () => {
        try {
          this.taskModel.delete(button.dataset.deleteCategory);
          this.render();
          this.onChange();
        } catch (error) {
          alert(error.message);
        }
      }),
    );
  }
}
