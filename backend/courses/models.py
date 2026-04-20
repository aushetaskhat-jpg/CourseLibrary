from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


# ── Custom Model Manager ──────────────────────────────────────────────────────

class CourseManager(models.Manager):
    """Custom manager for Course: convenient filtering shortcuts."""

    def free(self):
        return self.filter(price=0)

    def paid(self):
        return self.filter(price__gt=0)

    def by_category(self, slug):
        return self.filter(category__slug=slug)

    def top_rated(self, limit=10):
        return self.order_by('-avg_rating')[:limit]


# ── Model 1: Category ─────────────────────────────────────────────────────────

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    icon = models.CharField(max_length=10, blank=True)

    class Meta:
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def __str__(self):
        return self.name


# ── Model 2: Course ───────────────────────────────────────────────────────────

LEVEL_CHOICES = [
    ('beginner',     'Начинающий'),
    ('intermediate', 'Средний'),
    ('advanced',     'Продвинутый'),
]

PLATFORM_CHOICES = [
    ('Stepik',       'Stepik'),
    ('Udemy',        'Udemy'),
    ('Coursera',     'Coursera'),
    ('YouTube',      'YouTube'),
    ('freeCodeCamp', 'freeCodeCamp'),
    ('Other',        'Other'),
]

class Course(models.Model):
    # ForeignKey #1: Course → Category
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        related_name='courses',
    )

    title          = models.CharField(max_length=255)
    author         = models.CharField(max_length=255)
    description    = models.TextField(blank=True)
    platform       = models.CharField(max_length=50, choices=PLATFORM_CHOICES, default='Other')
    level          = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='beginner')
    price          = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    duration_hours = models.PositiveIntegerField(default=0)
    url            = models.URLField(max_length=500, blank=True)
    emoji          = models.CharField(max_length=10, blank=True)
    bg_color       = models.CharField(max_length=20, blank=True)
    students_count = models.PositiveIntegerField(default=0)
    has_certificate = models.BooleanField(default=False)
    language       = models.CharField(max_length=10, default='en')
    avg_rating     = models.DecimalField(max_digits=3, decimal_places=1, default=0)
    reviews_count  = models.PositiveIntegerField(default=0)
    tags           = models.JSONField(default=list, blank=True)
    created_at     = models.DateTimeField(auto_now_add=True)

    # Attach custom manager (default manager stays first)
    objects  = CourseManager()

    class Meta:
        verbose_name = 'Course'
        verbose_name_plural = 'Courses'
        ordering = ['-avg_rating']

    def __str__(self):
        return self.title

    def recalc_rating(self):
        """Recalculate avg_rating and reviews_count from related reviews."""
        reviews = self.reviews.all()
        count = reviews.count()
        if count:
            total = sum(r.rating for r in reviews)
            self.avg_rating = round(total / count, 1)
        else:
            self.avg_rating = 0
        self.reviews_count = count
        self.save(update_fields=['avg_rating', 'reviews_count'])


# ── Model 3: Favorite ─────────────────────────────────────────────────────────

class Favorite(models.Model):
    # ForeignKey #2: Favorite → User
    user   = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    # ForeignKey #3: Favorite → Course
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Favorite'
        verbose_name_plural = 'Favorites'
        unique_together = ('user', 'course')

    def __str__(self):
        return f'{self.user.username} → {self.course.title}'


# ── Model 4: Review ───────────────────────────────────────────────────────────

class Review(models.Model):
    # ForeignKey #4: Review → User
    user   = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    # ForeignKey #5: Review → Course
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    text       = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Review'
        verbose_name_plural = 'Reviews'
        unique_together = ('user', 'course')
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.username} — {self.course.title} ({self.rating}★)'
