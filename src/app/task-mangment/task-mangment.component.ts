import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  ViewChild,
  inject,
  PLATFORM_ID,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';

@Component({
  selector: 'app-task-mangment',
  templateUrl: './task-mangment.component.html',
  styleUrl: './task-mangment.component.css',
  imports: [],

})
export class TaskMangmentComponent implements AfterViewInit {
  @ViewChild('taskName') taskName!: ElementRef;
  PLATFORM_ID = inject(PLATFORM_ID);
  tasks: string[] = [];
  completedTasks: boolean[] = [];

  isFinish: boolean = true;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    if (!this.taskName) {
      console.error('taskName ViewChild not found!');
      return;
    }
    this.loadTasks();
  }

  /**
   * ✅ جلب المهام من LocalStorage
   */
  loadTasks(): void {
    if (isPlatformBrowser(this.PLATFORM_ID)) {
      const storedTasks = localStorage.getItem('tasks');
      const storedCompleted = localStorage.getItem('completedTasks');

      try {
        this.tasks = storedTasks ? JSON.parse(storedTasks) : [];
        this.completedTasks = storedCompleted
          ? JSON.parse(storedCompleted)
          : new Array(this.tasks.length).fill(false);
      } catch (error) {
        console.error('Error parsing tasks:', error);
        this.tasks = [];
        this.completedTasks = [];
      }
      this.cdr.detectChanges();
    }
  }

  /**
   * ✅ إضافة مهمة جديدة
   */
  addTask(): void {
    if (!this.taskName || !this.taskName.nativeElement) {
      console.error('taskName input not initialized!');
      return;
    }

    const taskInput = this.taskName.nativeElement as HTMLInputElement;
    const newTask = taskInput.value.trim();

    if (!newTask) {
      alert('Please enter a valid task!');
      return;
    }

    this.tasks.push(newTask);
    this.completedTasks.push(false); // المهمة الجديدة غير مكتملة افتراضيًا
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    localStorage.setItem('completedTasks', JSON.stringify(this.completedTasks));

    taskInput.value = '';
    this.cdr.detectChanges();
  }

  /**
   * ✅ حذف مهمة
   */
  deleteTask(index: number): void {
    this.tasks.splice(index, 1);
    this.completedTasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    localStorage.setItem('completedTasks', JSON.stringify(this.completedTasks));
    this.cdr.detectChanges();
  }

  updateTask(index: number, newTask: string): void {
    if (!newTask.trim()) return;
    this.tasks[index] = newTask.trim();
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    this.cdr.detectChanges(); // تحديث القيم في الـ template
  }
  toggleComplete(index: number): void {
    this.completedTasks[index] = !this.completedTasks[index];
    localStorage.setItem('completedTasks', JSON.stringify(this.completedTasks));
    this.cdr.detectChanges();
  }
  editTask(index: number): void {
    const newTask = prompt('Edit your task:', this.tasks[index]);
    if (newTask !== null && newTask.trim() !== '') {
      this.tasks[index] = newTask.trim();
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
      localStorage.setItem(
        'completedTasks',
        JSON.stringify(this.completedTasks)
      );
      this.cdr.detectChanges();
    }
  }
}
