import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Task, TaskStatus } from './task.model';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskById(id: string): Task {
    const task = this.tasks.find((task) => task.id === id);

    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    return task;
  }

  deleteTaskById(id: string) {
    const task = this.tasks.find((task) => task.id === id);

    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    this.tasks = this.tasks.filter((task) => task.id !== id);
    throw new HttpException('', HttpStatus.NO_CONTENT);
  }

  updateTaskById(id: string, title: string, description: string): Task {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);

    if (taskIndex === -1) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    const original = this.tasks[taskIndex];
    const updated = {
      ...this.tasks[taskIndex],
      title: title || original.title,
      description: description || original.description,
    };
    this.tasks[taskIndex] = updated;
    return updated;
  }

  createTask(title: string, description: string): Task {
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }
}
