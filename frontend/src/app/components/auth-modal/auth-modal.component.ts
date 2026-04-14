// src/app/components/auth-modal/auth-modal.component.ts
import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.css',
})
export class AuthModalComponent {
  @Input() mode: 'login' | 'register' = 'login';
  @Output() close = new EventEmitter<void>();
  @Output() switchMode = new EventEmitter<'login' | 'register'>();

  auth = inject(AuthService);
  svc  = inject(CourseService);

  // Login fields
  username = '';
  password = '';

  // Register fields
  firstName = '';
  lastName  = '';
  email     = '';

  submit() {
    if (this.mode === 'login') {
      if (this.auth.login(this.username, this.password)) {
        this.svc.showToast('Вход выполнен успешно!');
        this.close.emit();
      }
    } else {
      if (this.auth.register({
        username: this.username,
        email: this.email,
        password: this.password,
        firstName: this.firstName,
        lastName: this.lastName,
      })) {
        this.svc.showToast('Аккаунт создан!');
        this.close.emit();
      }
    }
  }

  onOverlayClick(e: Event) {
    if ((e.target as HTMLElement).classList.contains('overlay')) {
      this.close.emit();
    }
  }
}
