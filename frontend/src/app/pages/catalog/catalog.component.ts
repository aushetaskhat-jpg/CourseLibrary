import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';
import { CourseCardComponent } from '../../components/course-card/course-card.component';
import { CourseModalComponent } from '../../components/course-modal/course-modal.component';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, CourseCardComponent, CourseModalComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css',
})
export class CatalogComponent {
  svc = inject(CourseService);

  // фильтры
  search    = signal('');
  category  = signal('all');
  platform  = signal('all');
  price     = signal('all');
  level     = signal('all');
  tag       = signal('all');
  sort      = signal('rating');

  // выбранный курс
  selectedCourse = signal<Course | null>(null);

  // список курсов (с API)
  courses = signal<Course[]>([]);

  // загрузка данных
  constructor() {
    this.loadCourses();
  }

  loadCourses() {
    this.svc.getCourses().subscribe(data => {
      this.courses.set(data);
    });
  }

  // фильтрация (теперь вручную)
  getFilteredCourses(): Course[] {
    let list = [...this.courses()];

    if (this.search()) {
      const q = this.search().toLowerCase();
      list = list.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.author.toLowerCase().includes(q)
      );
    }

    if (this.category() !== 'all') {
      list = list.filter(c => c.category === this.category());
    }

    if (this.platform() !== 'all') {
      list = list.filter(c => c.platform === this.platform());
    }

    if (this.price() === 'free') list = list.filter(c => c.price === 0);
    if (this.price() === 'paid') list = list.filter(c => c.price > 0);

    if (this.level() !== 'all') {
      list = list.filter(c => c.level === this.level());
    }

    if (this.sort() === 'rating') {
      list.sort((a, b) => b.avgRating - a.avgRating);
    }

    return list;
  }

  // категории
  categories = [
    { slug: 'all',     label: 'Все курсы',  icon: '', count: 12 },
    { slug: 'python',  label: 'Python',      icon: '🐍', count: 2 },
    { slug: 'js',      label: 'JavaScript',  icon: '⚡', count: 3 },
    { slug: 'ml',      label: 'ML / AI',     icon: '🤖', count: 2 },
    { slug: 'devops',  label: 'DevOps',      icon: '🐳', count: 2 },
    { slug: 'mobile',  label: 'Mobile',      icon: '📱', count: 2 },
    { slug: 'backend', label: 'Backend',     icon: '🔧', count: 2 },
  ];

  platforms = ['all', 'Coursera', 'Udemy', 'Stepik', 'YouTube'];

  // события
  setCategory(cat: string) { this.category.set(cat); }
  setPlatform(p: string)   { this.platform.set(p); }
  setPrice(p: string)      { this.price.set(p); }
  setLevel(l: string)      { this.level.set(l); }
  setSort(s: string)       { this.sort.set(s); }

  openCourse(c: Course) { this.selectedCourse.set(c); }
  closeModal()          { this.selectedCourse.set(null); }
}