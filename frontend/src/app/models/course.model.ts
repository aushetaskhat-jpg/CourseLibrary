// src/app/models/course.model.ts

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
}

export interface Review {
  id: number;
  user: { id: number; username: string; first_name: string };
  rating: number;
  text: string;
  created_at: string;
}

export interface Course {
  id: number;
  title: string;
  author: string;
  description: string;
  category: string;       // slug: 'python', 'js', 'ml'...
  categoryName: string;   // display: 'Python', 'JavaScript'...
  platform: string;       // 'Stepik', 'Udemy', 'Coursera'...
  level: string;          // 'Начинающий', 'Средний', 'Продвинутый'
  price: number;
  durationHours: number;
  url: string;
  emoji: string;
  bgColor: string;
  studentsCount: number;
  hasCertificate: boolean;
  language: string;
  avgRating: number;
  reviewsCount: number;
  tags: string[];
  isFavorited?: boolean;
  reviews?: Review[];
}
