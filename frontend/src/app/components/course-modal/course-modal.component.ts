// src/app/components/course-modal/course-modal.component.ts
import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Course } from '../../models/course.model';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-course-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-modal.component.html',
  styleUrl: './course-modal.component.css',
})
export class CourseModalComponent {
  @Input() course!: Course;
  @Output() close = new EventEmitter<void>();

  svc = inject(CourseService);
  reviewText = '';
  selectedRating = 0;
  hoverRating = 0;

  get isFav() { return this.svc.isFavorited(this.course.id); }

  get stars() {
    const n = Math.round(this.course.avgRating);
    return '★'.repeat(n) + '☆'.repeat(5 - n);
  }

  toggleFav() { this.svc.toggleFavorite(this.course.id); }

  starClass(i: number): string {
    return (this.hoverRating || this.selectedRating) >= i ? 'sp on' : 'sp';
  }

  pickStar(n: number)  { this.selectedRating = n; }
  hoverStar(n: number) { this.hoverRating = n; }
  leaveStar()          { this.hoverRating = 0; }

  submitReview() {
    if (!this.reviewText.trim() || !this.selectedRating) {
      this.svc.showToast('Выберите оценку и напишите отзыв');
      return;
    }
    this.svc.showToast('Отзыв отправлен! Спасибо.');
    this.reviewText = '';
    this.selectedRating = 0;
    this.close.emit();
  }

  onOverlayClick(e: Event) {
    if ((e.target as HTMLElement).classList.contains('overlay')) {
      this.close.emit();
    }
  }

  mockReviews = [
    { initials: 'AA', color: '#4F8EF7', name: 'Aushet Askhat', rating: 5, text: 'Отличный курс! Объяснения чёткие, много практики. Рекомендую всем начинающим.' },
    { initials: 'BM', color: '#7C5EF7', name: 'Bazarbayev Mereke', rating: 4, text: 'Хороший материал, но местами нужно больше примеров. В целом — советую.' },
  ];

  starRow(n: number) { return '★'.repeat(n) + '☆'.repeat(5 - n); }
}
