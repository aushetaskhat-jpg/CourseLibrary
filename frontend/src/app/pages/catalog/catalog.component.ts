// src/app/pages/catalog/catalog.component.ts
import { Component, inject, signal, computed } from '@angular/core';
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

  search    = signal('');
  category  = signal('all');
  platform  = signal('all');
  price     = signal('all');
  level     = signal('all');
  tag       = signal('all');
  sort      = signal('rating');

  selectedCourse = signal<Course | null>(null);

  courses = computed(() => this.svc.filter({
    search:   this.search(),
    category: this.category(),
    platform: this.platform(),
    price:    this.price(),
    level:    this.level(),
    tag:      this.tag(),
    sort:     this.sort(),
  }));

  categories = [
    { slug: 'all',     label: 'Все курсы',  icon: '', count: 12 },
    { slug: 'python',  label: 'Python',      icon: '🐍', count: 2 },
    { slug: 'js',      label: 'JavaScript',  icon: '⚡', count: 3 },
    { slug: 'ml',      label: 'ML / AI',     icon: '🤖', count: 2 },
    { slug: 'devops',  label: 'DevOps',      icon: '🐳', count: 2 },
    { slug: 'mobile',  label: 'Mobile',      icon: '📱', count: 2 },
    { slug: 'backend', label: 'Backend',     icon: '🔧', count: 2 },
  ];

  platforms = ['all', 'Coursera', 'Udemy', 'Stepik', 'YouTube', 'freeCodeCamp'];

  tags = [
    { slug: 'all',         label: 'Все' },
    { slug: 'hot',         label: '🔥 Популярное' },
    { slug: 'new',         label: '✨ Новое' },
    { slug: 'free',        label: 'Бесплатно' },
    { slug: 'certificate', label: 'С сертификатом' },
    { slug: 'ru',          label: 'На русском' },
    { slug: 'project',     label: 'С проектами' },
  ];

  setCategory(cat: string) { this.category.set(cat); }
  setPlatform(p: string)   { this.platform.set(p); }
  setPrice(p: string)      { this.price.set(p); }
  setLevel(l: string)      { this.level.set(l); }
  setTag(t: string)        { this.tag.set(t); }
  setSort(s: string)       { this.sort.set(s); }

  openCourse(c: Course) { this.selectedCourse.set(c); }
  closeModal()          { this.selectedCourse.set(null); }
}
