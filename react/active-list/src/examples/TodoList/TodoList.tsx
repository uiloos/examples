import { useActiveList } from "@uiloos/react";
import "./TodoList.css";
import classNames from "classnames";
import { FormEvent, useRef } from "react";
import { ActiveListContent } from "@uiloos/core";
import { Todo } from "./types";

export function TodoList() {
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

  const draggedTodoRef = useRef<ActiveListContent<Todo> | null>(null);

  function addTodo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const todo = formData.get("todo")?.toString() ?? "";

    todoList.push({ id: Math.random(), text: todo });

    event.currentTarget.reset();
  }

  return (
    <div className="todo-example">
      <form className="todo-form" onSubmit={addTodo}>
        <div>
          <label>
            New todo
            <input name="todo" required />
          </label>
        </div>

        <button type="submit">Add todo</button>
      </form>

      <h1>Todo</h1>

      <div className="todo">
        {todoList.contents.map((content) => (
          <div
            key={content.value.id}
            className={classNames("todo-item", { done: content.isActive })}
            draggable
            onDragStart={(event) => {
              event.dataTransfer.effectAllowed = "move";

              draggedTodoRef.current = content;
            }}
            onDragOver={(event) => {
              event.preventDefault();

              if (draggedTodoRef.current) {
                draggedTodoRef.current.moveToIndex(content.index);
              }
            }}
            onDrop={(event) => event.preventDefault()}
          >
            <label>
              <input
                type="checkbox"
                checked={content.isActive}
                onChange={() => content.toggle()}
              />
              {content.value.text}
            </label>

            <div className="buttons">
              <button onClick={() => content.swapWithPrevious()}>↑</button>
              <button onClick={() => content.swapWithNext()}>↓</button>
            </div>
          </div>
        ))}
      </div>

      <small>
        {" "}
        {todoList.active.length} / {todoList.contents.length} todo's are done{" "}
      </small>
    </div>
  );
}
