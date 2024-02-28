<template>
  <div class="todo-example">
    <form class="todo-form" @submit="addTodo">
      <div>
        <label>
          New todo
          <input name="todo" required />
        </label>
      </div>

      <button type="submit">Add todo</button>
    </form>

    <h1>Todo</h1>

    <div class="todo">
      <div
        v-for="content in todoList.contents"
        :key="content.value.id"
        class="todo-item"
        :class="{ done: content.isActive }"
        draggable="true"
        @dragstart="onDragStart($event, content)"
        @dragover="onDragOver($event, content)"
        @ondrop="($event: Event) => $event.preventDefault()"
      >
        <label>
          <input
            type="checkbox"
            :checked="content.isActive"
            @change="content.toggle()"
          />
          {{ content.value.text }}
        </label>

        <div class="buttons">
          <button @click="content.swapWithPrevious()">↑</button>
          <button @click="content.swapWithNext()">↓</button>
        </div>
      </div>
    </div>

    <small>
      {{ todoList.active.length }} / {{ todoList.contents.length }} todo's are
      done
    </small>
  </div>
</template>

<script setup lang="ts">
import { useActiveList } from "@uiloos/vue";
import type { Todo } from "./types";
import type { ActiveListContent } from "@uiloos/core";

const todoList = useActiveList<Todo>({
  contents: [
    { id: 1, text: "Eggs" },
    { id: 2, text: "Leeks" },
    { id: 3, text: "Milk" },
    { id: 4, text: "Strawberries" },
    { id: 5, text: "Apples" },
    { id: 6, text: "Potatoes" },
  ],
  maxActivationLimit: false,
});

let draggedTodoRef: ActiveListContent<Todo> | null = null;

function addTodo(event: Event) {
  event.preventDefault();

  const form = event.target as HTMLFormElement;

  const formData = new FormData(form);
  const todo = formData.get("todo")?.toString() ?? "";

  todoList.value.push({ id: Math.random(), text: todo });

  form.reset();
}

function onDragStart(event: DragEventInit, content: ActiveListContent<Todo>) {
  if (event.dataTransfer?.effectAllowed) {
    event.dataTransfer.effectAllowed = "move";
  }
  draggedTodoRef = content;
}

function onDragOver(event: DragEvent, content: ActiveListContent<Todo>) {
  event.preventDefault();
  if (draggedTodoRef) {
    draggedTodoRef.moveToIndex(content.index);
  }
}
</script>

<style>
.todo-example {
  margin: 0 auto 32px auto;
  width: 320px;
}

.todo-example .todos {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.todo-example .todo-item {
  padding: 8px;
  border: solid 1px lightgray;
  cursor: grab;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.todo-example .todo-item.done {
  opacity: 0.4;
}

.todo-example .todo-item label {
  display: flex;
  align-items: center;
  gap: 16px;
}

.todo-example .todo-item.done label {
  text-decoration: line-through;
}

.todo-example .todo-item .buttons {
  cursor: pointer;
  background-color: white;
  align-self: flex-end;
  display: flex;
  gap: 8px;
}

.todo-example .todo-form input {
  border: solid 1px black;
  padding: 4px;
}

.todo-example .todo-form {
  margin-bottom: 8px;
}

.todo-example .todo-form,
.todo-example .todo-form label {
  display: grid;
  gap: 8px;
}

.todo-example .todo-form button[type="submit"] {
  padding: 4px;
}
</style>
