// src/app/components/navbar/navbar.component.ts
import { Component, signal, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { AuthModalComponent } from '../auth-modal/auth-modal.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, AuthModalComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  auth = inject(AuthService);
  showAuth = signal(false);
  authMode = signal<'login' | 'register'>('login');

  openLogin()    { this.authMode.set('login');    this.showAuth.set(true); }
  openRegister() { this.authMode.set('register'); this.showAuth.set(true); }
  closeAuth()    { this.showAuth.set(false); }
}
