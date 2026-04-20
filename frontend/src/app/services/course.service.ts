import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Course } from '../models/course.model';
import { catchError, EMPTY } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CourseService {

  constructor(private http: HttpClient) {}

  // signals остаются
  favorites = signal<Set<number>>(new Set());
  toast = signal<string>('');

  // ✅ ТЕПЕРЬ API
  getCourses() {
    return this.http.get<Course[]>('/api/v1/courses/').pipe(
      catchError(err => {
        this.showToast('Ошибка загрузки курсов');
        return EMPTY;
      })
    );
  }

  // ❗ пока убери getCourseById (или оставь если не используешь API для него)

  toggleFavorite(id: number) {
    const favs = new Set(this.favorites());
    if (favs.has(id)) {
      favs.delete(id);
      this.showToast('Удалено из избранного');
    } else {
      favs.add(id);
      this.showToast('Добавлено в избранное ♡');
    }
    this.favorites.set(favs);
  }

  isFavorited(id: number): boolean {
    return this.favorites().has(id);
  }

  showToast(msg: string) {
    this.toast.set(msg);
    setTimeout(() => this.toast.set(''), 2500);
  }
}