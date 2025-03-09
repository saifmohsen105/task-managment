import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskMangmentComponent } from "./task-mangment/task-mangment.component";

@Component({
  selector: 'app-root',
  imports: [ TaskMangmentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'managment-app';
}
