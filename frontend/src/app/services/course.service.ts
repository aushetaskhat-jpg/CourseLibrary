// src/app/services/course.service.ts
import { Injectable, signal } from '@angular/core';
import { Course } from '../models/course.model';

@Injectable({ providedIn: 'root' })
export class CourseService {

  private readonly ALL_COURSES: Course[] = [
    {
      id: 1, title: 'Python для начинающих', author: 'Тимур Машнин',
      category: 'python', categoryName: 'Python', platform: 'Stepik',
      emoji: '🐍', bgColor: '#0e2010', level: 'Начинающий', price: 0,
      durationHours: 40, url: 'https://stepik.org/course/58852',
      studentsCount: 48000, hasCertificate: true, language: 'ru',
      avgRating: 4.8, reviewsCount: 1240, tags: ['ru', 'certificate'],
      description: 'Полный курс по Python с нуля. Переменные, циклы, функции, ООП, работа с файлами и многое другое.',
    },
    {
      id: 2, title: 'JavaScript: Полное руководство', author: 'Maximilian Schwarzmüller',
      category: 'js', categoryName: 'JavaScript', platform: 'Udemy',
      emoji: '⚡', bgColor: '#201a08', level: 'Начинающий', price: 14.99,
      durationHours: 52, url: 'https://udemy.com',
      studentsCount: 145000, hasCertificate: true, language: 'en',
      avgRating: 4.7, reviewsCount: 8920, tags: ['certificate', 'project', 'hot'],
      description: 'Самый полный JS курс. ES6+, DOM, асинхронность, Node.js, базы данных.',
    },
    {
      id: 3, title: 'Machine Learning A-Z', author: 'Kirill Eremenko',
      category: 'ml', categoryName: 'ML / AI', platform: 'Coursera',
      emoji: '🤖', bgColor: '#0c1a28', level: 'Средний', price: 49.99,
      durationHours: 44, url: 'https://coursera.org',
      studentsCount: 62000, hasCertificate: true, language: 'en',
      avgRating: 4.6, reviewsCount: 5430, tags: ['certificate', 'hot'],
      description: 'Машинное обучение с Python и R. Регрессия, классификация, кластеризация, глубокое обучение.',
    },
    {
      id: 4, title: 'Docker и Kubernetes', author: 'Бочкарёв Сергей',
      category: 'devops', categoryName: 'DevOps', platform: 'Stepik',
      emoji: '🐳', bgColor: '#081420', level: 'Средний', price: 0,
      durationHours: 28, url: 'https://stepik.org',
      studentsCount: 22000, hasCertificate: false, language: 'ru',
      avgRating: 4.9, reviewsCount: 890, tags: ['ru', 'project', 'hot'],
      description: 'Контейнеризация с Docker, оркестрация с Kubernetes. От азов до продакшена.',
    },
    {
      id: 5, title: 'React — Полное руководство', author: 'Academind',
      category: 'js', categoryName: 'JavaScript', platform: 'Udemy',
      emoji: '⚛️', bgColor: '#081420', level: 'Начинающий', price: 12.99,
      durationHours: 49, url: 'https://udemy.com',
      studentsCount: 198000, hasCertificate: true, language: 'en',
      avgRating: 4.8, reviewsCount: 11200, tags: ['certificate', 'project', 'hot'],
      description: 'React 18, hooks, Redux, React Router, Next.js. Создайте несколько полноценных приложений.',
    },
    {
      id: 6, title: 'Django REST Framework', author: 'Dennis Ivy',
      category: 'backend', categoryName: 'Backend', platform: 'YouTube',
      emoji: '🔧', bgColor: '#180810', level: 'Средний', price: 0,
      durationHours: 12, url: 'https://youtube.com',
      studentsCount: 85000, hasCertificate: false, language: 'en',
      avgRating: 4.5, reviewsCount: 3200, tags: ['project', 'new'],
      description: 'Создание REST API с Django. Сериализаторы, ViewSets, JWT-аутентификация, деплой.',
    },
    {
      id: 7, title: 'Flutter для начинающих', author: 'Maksimilian Klen',
      category: 'mobile', categoryName: 'Mobile', platform: 'Udemy',
      emoji: '📱', bgColor: '#081828', level: 'Начинающий', price: 9.99,
      durationHours: 35, url: 'https://udemy.com',
      studentsCount: 73000, hasCertificate: true, language: 'en',
      avgRating: 4.7, reviewsCount: 4100, tags: ['certificate', 'project'],
      description: 'Кроссплатформенная разработка с Flutter. Dart, виджеты, навигация, Firebase.',
    },
    {
      id: 8, title: 'Глубокое обучение с TensorFlow', author: 'Andrew Ng',
      category: 'ml', categoryName: 'ML / AI', platform: 'Coursera',
      emoji: '🧠', bgColor: '#180808', level: 'Продвинутый', price: 79.99,
      durationHours: 68, url: 'https://coursera.org',
      studentsCount: 310000, hasCertificate: true, language: 'en',
      avgRating: 4.9, reviewsCount: 23000, tags: ['certificate', 'hot'],
      description: 'Нейронные сети, CNN, RNN, трансформеры. Специализация DeepLearning.AI.',
    },
    {
      id: 9, title: 'Angular — от нуля до профи', author: 'Maximilian Schwarzmüller',
      category: 'js', categoryName: 'JavaScript', platform: 'Udemy',
      emoji: '🅰️', bgColor: '#200808', level: 'Начинающий', price: 13.99,
      durationHours: 37, url: 'https://udemy.com',
      studentsCount: 92000, hasCertificate: true, language: 'en',
      avgRating: 4.6, reviewsCount: 6700, tags: ['certificate', 'project', 'new'],
      description: 'Angular 17, компоненты, сервисы, RxJS, NgRx, HTTP клиент, деплой на Firebase.',
    },
    {
      id: 10, title: 'SQL и базы данных', author: 'Аскат Уали',
      category: 'backend', categoryName: 'Backend', platform: 'Stepik',
      emoji: '🗃️', bgColor: '#141020', level: 'Начинающий', price: 0,
      durationHours: 20, url: 'https://stepik.org',
      studentsCount: 37000, hasCertificate: true, language: 'ru',
      avgRating: 4.7, reviewsCount: 2100, tags: ['ru', 'certificate'],
      description: 'PostgreSQL с нуля. SELECT, JOIN, индексы, транзакции, хранимые процедуры.',
    },
    {
      id: 11, title: 'iOS разработка с Swift', author: 'Angela Yu',
      category: 'mobile', categoryName: 'Mobile', platform: 'Udemy',
      emoji: '🍎', bgColor: '#101010', level: 'Начинающий', price: 12.99,
      durationHours: 56, url: 'https://udemy.com',
      studentsCount: 120000, hasCertificate: true, language: 'en',
      avgRating: 4.8, reviewsCount: 9800, tags: ['certificate', 'project'],
      description: 'Swift, UIKit, SwiftUI, CoreData, ARKit. Создай 15 приложений и опубликуй в App Store.',
    },
    {
      id: 12, title: 'CI/CD с GitHub Actions', author: 'Traversy Media',
      category: 'devops', categoryName: 'DevOps', platform: 'YouTube',
      emoji: '🔄', bgColor: '#080e18', level: 'Средний', price: 0,
      durationHours: 8, url: 'https://youtube.com',
      studentsCount: 45000, hasCertificate: false, language: 'en',
      avgRating: 4.5, reviewsCount: 1800, tags: ['project', 'new'],
      description: 'Настройка CI/CD пайплайнов, автоматическое тестирование и деплой с GitHub Actions.',
    },
  ];

  // Reactive signals
  favorites = signal<Set<number>>(new Set());
  toast = signal<string>('');

  getCourses(): Course[] {
    return this.ALL_COURSES;
  }

  getCourseById(id: number): Course | undefined {
    return this.ALL_COURSES.find(c => c.id === id);
  }

  filter(params: {
    search?: string;
    category?: string;
    platform?: string;
    price?: string;
    level?: string;
    tag?: string;
    sort?: string;
  }): Course[] {
    let list = [...this.ALL_COURSES];

    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.author.toLowerCase().includes(q) ||
        c.categoryName.toLowerCase().includes(q)
      );
    }
    if (params.category && params.category !== 'all') {
      list = list.filter(c => c.category === params.category);
    }
    if (params.platform && params.platform !== 'all') {
      list = list.filter(c => c.platform === params.platform);
    }
    if (params.price === 'free')  list = list.filter(c => c.price === 0);
    if (params.price === 'paid')  list = list.filter(c => c.price > 0);
    if (params.level && params.level !== 'all') {
      list = list.filter(c => c.level === params.level);
    }
    if (params.tag && params.tag !== 'all') {
      if (params.tag === 'free') list = list.filter(c => c.price === 0);
      else list = list.filter(c => c.tags.includes(params.tag!));
    }

    if (params.sort === 'rating')   list.sort((a, b) => b.avgRating - a.avgRating);
    if (params.sort === 'price')    list.sort((a, b) => a.price - b.price);
    if (params.sort === 'popular')  list.sort((a, b) => b.studentsCount - a.studentsCount);
    if (params.sort === 'newest')   list.sort((a, b) => b.id - a.id);

    return list;
  }

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

  getFavorites(): Course[] {
    return this.ALL_COURSES.filter(c => this.favorites().has(c.id));
  }

  showToast(msg: string) {
    this.toast.set(msg);
    setTimeout(() => this.toast.set(''), 2500);
  }
}
