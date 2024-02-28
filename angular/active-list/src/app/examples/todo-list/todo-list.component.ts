import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActiveList, ActiveListContent } from '@uiloos/core';
import { Todo } from './types';

@Component({
  selector: 'todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class TodoListComponent {
  public todoList = new ActiveList<Todo>({
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

  private draggedTodoRef: ActiveListContent<Todo> | null = null;

  addTodo(event: Event) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;

    const formData = new FormData(form);
    const todo = formData.get('todo')?.toString() ?? '';

    this.todoList.push({ id: Math.random(), text: todo });

    form.reset();
  }

  onDragStart(event: DragEventInit, content: ActiveListContent<Todo>) {
    if (event.dataTransfer?.effectAllowed) {
      event.dataTransfer.effectAllowed = 'move';
    }
    this.draggedTodoRef = content;
  }

  onDragOver(event: DragEvent, content: ActiveListContent<Todo>) {
    event.preventDefault();
    if (this.draggedTodoRef) {
      this.draggedTodoRef.moveToIndex(content.index);
    }
  }
}
