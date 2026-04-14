// src/app/pages/favorites/favorites.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';
import { CourseCardComponent } from '../../components/course-card/course-card.component';
import { CourseModalComponent } from '../../components/course-modal/course-modal.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, CourseCardComponent, CourseModalComponent],
  template: `
    <div class="page">
      <h2 class="page-title">Избранное</h2>
      <p class="page-sub">Сохранённые курсы</p>

      @if (svc.getFavorites().length > 0) {
        <div class="grid">
          @for (c of svc.getFavorites(); track c.id) {
            <app-course-card [course]="c" (openCourse)="open($event)" />
          }
        </div>
      } @else {
        <div class="empty">
          <div class="ico">🔖</div>
          <p>Вы ещё не добавили ни одного курса в избранное.<br><br>
             Нажмите ♡ на курсе, чтобы сохранить.</p>
        </div>
      }
    </div>

    @if (selected()) {
      <app-course-modal [course]="selected()!" (close)="selected.set(null)" />
    }
  `,
  styles: [`
    .page { padding: 32px 28px; }
    .page-title { font-family: var(--fh); font-size: 26px; font-weight: 700; margin-bottom: 6px; }
    .page-sub   { color: var(--muted); font-size: 13px; margin-bottom: 24px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 14px; }
    .empty { text-align: center; padding: 60px 20px; color: var(--muted); }
    .ico   { font-size: 48px; margin-bottom: 16px; opacity: .4; }
    p      { font-size: 15px; line-height: 1.65; }
  `]
})
export class FavoritesComponent {
  svc      = inject(CourseService);
  selected = signal<Course | null>(null);
  open(c: Course) { this.selected.set(c); }
}
