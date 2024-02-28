<script lang="ts">
  import { createActiveListStore } from '@uiloos/svelte';
  import type { Todo } from './types.ts';
  import type { ActiveListContent } from '@uiloos/core';

  const todoList = createActiveListStore<Todo>({
    contents: [
      { id: 1, text: 'Eggs' },
      { id: 2, text: 'Leeks' },
      { id: 3, text: 'Milk' },
      { id: 4, text: 'Strawberries' },
      { id: 5, text: 'Apples' },
      { id: 6, text: 'Potatoes' },
    ],
    maxActivationLimit: false,
  });

  let draggedTodoRef: ActiveListContent<Todo> | null = null;

  function addTodo(event: SubmitEvent) {
    if (event.target instanceof HTMLFormElement) {
      event.preventDefault();

      const formData = new FormData(event.target);
      const todo = formData.get('todo')?.toString() ?? '';

      $todoList.push({ id: Math.random(), text: todo });

      event.target.reset();
    }
  }
</script>

<div class="todo-example">
  <form class="todo-form" on:submit={addTodo}>
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
    {#each $todoList.contents as content (content.value.id)}
      <div
        class="todo-item"
        class:done={content.isActive}
        draggable={true}
        on:dragstart={(event) => {
          if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = 'move';
          }

          draggedTodoRef = content;
        }}
        on:dragover={(event) => {
          event.preventDefault();

          if (draggedTodoRef) {
            draggedTodoRef.moveToIndex(content.index);
          }
        }}
        on:drop={(event) => event.preventDefault()}
      >
        <label>
          <input
            type="checkbox"
            checked={content.isActive}
            on:change={() => content.toggle()}
          />
          {content.value.text}
        </label>

        <div class="buttons">
          <button on:click={() => content.swapWithPrevious()}>↑</button>
          <button on:click={() => content.swapWithNext()}>↓</button>
        </div>
      </div>
    {/each}
  </div>

  <small>
    {$todoList.active.length} / {$todoList.contents.length} todo's are done
  </small>
</div>

<style>
  .todo-example {
    margin: 0 auto 32px auto;
    width: 320px;
  }

  .todo-example .todo {
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

  .todo-example .todo-form button[type='submit'] {
    padding: 4px;
  }
</style>
