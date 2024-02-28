const todoExampleEl = document.querySelector(".todo-example");
const todosEl = todoExampleEl.querySelector(".todos");
const todoItemsEl = Array.from(todoExampleEl.querySelectorAll(".todo-item"));
const noFinishedEl = todoExampleEl.querySelector("#no-finished");
const noTotalEl = todoExampleEl.querySelector("#no-total");
const todoFormEl = todoExampleEl.querySelector("form");
const newTodoInputEl = todoExampleEl.querySelector("#new-todo-input");
const newTodoTemplateEl = todoExampleEl.querySelector("#new-todo-template");

const todoList = new window.uiloosActiveList.ActiveList(
  {
    contents: todoItemsEl,
    maxActivationLimit: false
  },

  window.uiloosActiveList.createActiveListSubscriber({
    onInserted(event) {
      noTotalEl.textContent = todoList.contents.length;

      todosEl.append(event.value);
    },

    onActivated(event) {
      event.value.classList.add("done");

      noFinishedEl.textContent = todoList.activeContents.length;
    },

    onDeactivated(event) {
      event.value.classList.remove("done");

      noFinishedEl.textContent = todoList.activeContents.length;
    },

    onMoved(event) {
      // Special case for when moving over the last element
      if (event.index.to === todosEl.children.length - 1) {
        // When moved over last simply append it to the list.
        // When `append` happens to append a node which is already
        // a child of the element it is moved! Therefore there is no need to
        // remove the event.value first.
        todosEl.append(event.value);
      } else {
        // When `insertBefore` happens to insert a node which is already
        // a child of the element it is moved! Therefore there is no need to
        // remove the event.value first.
        todosEl.insertBefore(event.value, todosEl.children[event.index.to]);
      }
    },

    onSwapped(event) {
      // In order for a swap to work we need temporary
      // elements, otherwise a will be swapped with b,
      // but then b is removed and cannot be swapped
      // with a.
      const tempA = document.createElement("div");
      const tempB = document.createElement("div");

      // First insert replace the actual elements we
      // want to swap with the temporary elements.
      todosEl.replaceChild(tempA, event.value.a);
      todosEl.replaceChild(tempB, event.value.b);

      // Now do the actual swap, this also gets rid
      // of the tempA and tempB elements.
      todosEl.replaceChild(event.value.b, tempA);
      todosEl.replaceChild(event.value.a, tempB);
    }
  })
);

let draggedElement = null;

todoItemsEl.forEach((todoEl) => {
  initTodoElement(todoEl);
});

function initTodoElement(todoEl) {
  todoEl.draggable = true;

  todoEl.ondragstart = (event) => {
    event.dataTransfer.effectAllowed = "move";

    draggedElement = todoEl;
  };

  todoEl.ondragover = (event) => {
    event.preventDefault();

    const toIndex = todoList.getIndex(todoEl);
    todoList.move(draggedElement, toIndex);
  };

  todoEl.ondrop = (event) => {
    event.preventDefault();
  };

  // Make reorder buttons work
  const [upEl, downEl] = todoEl.querySelectorAll("button");

  upEl.onclick = () => {
    const index = todoList.getIndex(todoEl);

    todoList.contents[index].swapWithPrevious();
  };

  downEl.onclick = () => {
    const index = todoList.getIndex(todoEl);

    todoList.contents[index].swapWithNext();
  };

  // Handle the checked logic
  const inputEl = todoEl.querySelector("input");
  inputEl.onchange = () => {
    todoList.toggle(todoEl);
  };
}

todoFormEl.onsubmit = (event) => {
  event.preventDefault();

  const text = newTodoInputEl.value;

  // Create a new todo
  const newTodo = newTodoTemplateEl.content.cloneNode(true).children[0];

  // Set the text of the todo
  newTodo.querySelector("#todo-text").textContent = text;

  // Add it to the ActiveList
  todoList.push(newTodo);

  initTodoElement(newTodo);

  // Reset the input element
  newTodoInputEl.value = "";
};
