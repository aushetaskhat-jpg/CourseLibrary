"""
Management command to populate the database with initial data.
Usage: python manage.py seed
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from courses.models import Category, Course


CATEGORIES = [
    {'name': 'Python',     'slug': 'python',  'icon': '🐍'},
    {'name': 'JavaScript', 'slug': 'js',       'icon': '⚡'},
    {'name': 'ML / AI',    'slug': 'ml',       'icon': '🤖'},
    {'name': 'DevOps',     'slug': 'devops',   'icon': '🐳'},
    {'name': 'Mobile',     'slug': 'mobile',   'icon': '📱'},
    {'name': 'Backend',    'slug': 'backend',  'icon': '🔧'},
]

COURSES = [
    {
        'title': 'Python для начинающих', 'author': 'Тимур Машнин',
        'category_slug': 'python', 'platform': 'Stepik',
        'emoji': '🐍', 'bg_color': '#0e2010', 'level': 'beginner', 'price': 0,
        'duration_hours': 40, 'url': 'https://stepik.org/course/58852',
        'students_count': 48000, 'has_certificate': True, 'language': 'ru',
        'avg_rating': 4.8, 'reviews_count': 1240,
        'tags': ['ru', 'certificate'],
        'description': 'Полный курс по Python с нуля. Переменные, циклы, функции, ООП, работа с файлами.',
    },
    {
        'title': 'JavaScript: Полное руководство', 'author': 'Maximilian Schwarzmüller',
        'category_slug': 'js', 'platform': 'Udemy',
        'emoji': '⚡', 'bg_color': '#201a08', 'level': 'beginner', 'price': 14.99,
        'duration_hours': 52, 'url': 'https://udemy.com',
        'students_count': 145000, 'has_certificate': True, 'language': 'en',
        'avg_rating': 4.7, 'reviews_count': 8920,
        'tags': ['certificate', 'project', 'hot'],
        'description': 'Самый полный JS курс. ES6+, DOM, асинхронность, Node.js.',
    },
    {
        'title': 'Machine Learning A-Z', 'author': 'Kirill Eremenko',
        'category_slug': 'ml', 'platform': 'Coursera',
        'emoji': '🤖', 'bg_color': '#0c1a28', 'level': 'intermediate', 'price': 49.99,
        'duration_hours': 44, 'url': 'https://coursera.org',
        'students_count': 62000, 'has_certificate': True, 'language': 'en',
        'avg_rating': 4.6, 'reviews_count': 5430,
        'tags': ['certificate', 'hot'],
        'description': 'Машинное обучение с Python и R. Регрессия, классификация, кластеризация.',
    },
    {
        'title': 'Docker и Kubernetes', 'author': 'Бочкарёв Сергей',
        'category_slug': 'devops', 'platform': 'Stepik',
        'emoji': '🐳', 'bg_color': '#081420', 'level': 'intermediate', 'price': 0,
        'duration_hours': 28, 'url': 'https://stepik.org',
        'students_count': 22000, 'has_certificate': False, 'language': 'ru',
        'avg_rating': 4.9, 'reviews_count': 890,
        'tags': ['ru', 'project', 'hot'],
        'description': 'Контейнеризация с Docker, оркестрация с Kubernetes. От азов до продакшена.',
    },
    {
        'title': 'React — Полное руководство', 'author': 'Academind',
        'category_slug': 'js', 'platform': 'Udemy',
        'emoji': '⚛️', 'bg_color': '#081420', 'level': 'beginner', 'price': 12.99,
        'duration_hours': 49, 'url': 'https://udemy.com',
        'students_count': 198000, 'has_certificate': True, 'language': 'en',
        'avg_rating': 4.8, 'reviews_count': 11200,
        'tags': ['certificate', 'project', 'hot'],
        'description': 'React 18, hooks, Redux, React Router, Next.js.',
    },
    {
        'title': 'Django REST Framework', 'author': 'Dennis Ivy',
        'category_slug': 'backend', 'platform': 'YouTube',
        'emoji': '🔧', 'bg_color': '#180810', 'level': 'intermediate', 'price': 0,
        'duration_hours': 12, 'url': 'https://youtube.com',
        'students_count': 85000, 'has_certificate': False, 'language': 'en',
        'avg_rating': 4.5, 'reviews_count': 3200,
        'tags': ['project', 'new'],
        'description': 'Создание REST API с Django. Сериализаторы, ViewSets, JWT.',
    },
    {
        'title': 'Flutter для начинающих', 'author': 'Maksimilian Klen',
        'category_slug': 'mobile', 'platform': 'Udemy',
        'emoji': '📱', 'bg_color': '#081828', 'level': 'beginner', 'price': 9.99,
        'duration_hours': 35, 'url': 'https://udemy.com',
        'students_count': 73000, 'has_certificate': True, 'language': 'en',
        'avg_rating': 4.7, 'reviews_count': 4100,
        'tags': ['certificate', 'project'],
        'description': 'Кроссплатформенная разработка с Flutter. Dart, виджеты, Firebase.',
    },
    {
        'title': 'Глубокое обучение с TensorFlow', 'author': 'Andrew Ng',
        'category_slug': 'ml', 'platform': 'Coursera',
        'emoji': '🧠', 'bg_color': '#180808', 'level': 'advanced', 'price': 79.99,
        'duration_hours': 68, 'url': 'https://coursera.org',
        'students_count': 310000, 'has_certificate': True, 'language': 'en',
        'avg_rating': 4.9, 'reviews_count': 23000,
        'tags': ['certificate', 'hot'],
        'description': 'Нейронные сети, CNN, RNN, трансформеры. Специализация DeepLearning.AI.',
    },
    {
        'title': 'Angular — от нуля до профи', 'author': 'Maximilian Schwarzmüller',
        'category_slug': 'js', 'platform': 'Udemy',
        'emoji': '🅰️', 'bg_color': '#200808', 'level': 'beginner', 'price': 13.99,
        'duration_hours': 37, 'url': 'https://udemy.com',
        'students_count': 92000, 'has_certificate': True, 'language': 'en',
        'avg_rating': 4.6, 'reviews_count': 6700,
        'tags': ['certificate', 'project', 'new'],
        'description': 'Angular 17, компоненты, сервисы, RxJS, NgRx, HTTP клиент.',
    },
    {
        'title': 'SQL и базы данных', 'author': 'Аскат Уали',
        'category_slug': 'backend', 'platform': 'Stepik',
        'emoji': '🗃️', 'bg_color': '#141020', 'level': 'beginner', 'price': 0,
        'duration_hours': 20, 'url': 'https://stepik.org',
        'students_count': 37000, 'has_certificate': True, 'language': 'ru',
        'avg_rating': 4.7, 'reviews_count': 2100,
        'tags': ['ru', 'certificate'],
        'description': 'PostgreSQL с нуля. SELECT, JOIN, индексы, транзакции.',
    },
    {
        'title': 'iOS разработка с Swift', 'author': 'Angela Yu',
        'category_slug': 'mobile', 'platform': 'Udemy',
        'emoji': '🍎', 'bg_color': '#101010', 'level': 'beginner', 'price': 12.99,
        'duration_hours': 56, 'url': 'https://udemy.com',
        'students_count': 120000, 'has_certificate': True, 'language': 'en',
        'avg_rating': 4.8, 'reviews_count': 9800,
        'tags': ['certificate', 'project'],
        'description': 'Swift, UIKit, SwiftUI, CoreData, ARKit. Создай 15 приложений.',
    },
    {
        'title': 'CI/CD с GitHub Actions', 'author': 'Traversy Media',
        'category_slug': 'devops', 'platform': 'YouTube',
        'emoji': '🔄', 'bg_color': '#080e18', 'level': 'intermediate', 'price': 0,
        'duration_hours': 8, 'url': 'https://youtube.com',
        'students_count': 45000, 'has_certificate': False, 'language': 'en',
        'avg_rating': 4.5, 'reviews_count': 1800,
        'tags': ['project', 'new'],
        'description': 'Настройка CI/CD пайплайнов, автоматическое тестирование и деплой.',
    },
]


class Command(BaseCommand):
    help = 'Seed database with initial categories, courses and a demo admin user'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding categories...')
        cat_map = {}
        for c in CATEGORIES:
            obj, _ = Category.objects.get_or_create(slug=c['slug'], defaults={'name': c['name'], 'icon': c['icon']})
            cat_map[c['slug']] = obj

        self.stdout.write('Seeding courses...')
        for c in COURSES:
            data = dict(c)  # shallow copy — never mutate the module-level list
            category_slug = data.pop('category_slug')
            cat = cat_map.get(category_slug)
            Course.objects.get_or_create(
                title=data['title'],
                defaults={**data, 'category': cat},
            )

        self.stdout.write('Creating superuser (admin / admin123)...')
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@example.com', 'admin123')

        self.stdout.write(self.style.SUCCESS('Done! Database seeded successfully.'))
