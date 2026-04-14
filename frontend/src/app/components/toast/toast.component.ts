// src/app/components/toast/toast.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (svc.toast()) {
      <div class="toast">{{ svc.toast() }}</div>
    }
  `,
  styles: [`
    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: var(--card);
      border: 1px solid var(--bdr);
      border-radius: 10px;
      padding: 12px 20px;
      font-size: 13px;
      color: var(--text);
      z-index: 9999;
      animation: up .25s ease;
      box-shadow: 0 4px 20px rgba(0,0,0,.4);
    }
    @keyframes up {
      from { transform: translateY(16px); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
  `]
})
export class ToastComponent {
  svc = inject(CourseService);
}
