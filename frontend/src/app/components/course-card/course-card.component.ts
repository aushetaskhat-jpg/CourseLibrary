// src/app/components/course-card/course-card.component.ts
import { Component, Input, Output, EventEmitter, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course } from '../../models/course.model';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-card.component.html',
  styleUrl: './course-card.component.css',
})
export class CourseCardComponent {
  @Input() course!: Course;
  @Output() openCourse = new EventEmitter<Course>();

  svc = inject(CourseService);

  get isFav() { return this.svc.isFavorited(this.course.id); }

  get stars() {
    const n = Math.round(this.course.avgRating);
    return '★'.repeat(n) + '☆'.repeat(5 - n);
  }

  toggleFav(e: Event) {
    e.stopPropagation();
    this.svc.toggleFavorite(this.course.id);
  }

  open() { this.openCourse.emit(this.course); }

  formatStudents(n: number): string {
    return n >= 1000 ? (n / 1000).toFixed(0) + 'K' : String(n);
  }
}
