// src/app/pages/profile/profile.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { CourseService } from '../../services/course.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  auth   = inject(AuthService);
  svc    = inject(CourseService);
  router = inject(Router);

  logout() {
    this.auth.logout();
    this.svc.showToast('Вы вышли из аккаунта');
    this.router.navigate(['/catalog']);
  }
}
