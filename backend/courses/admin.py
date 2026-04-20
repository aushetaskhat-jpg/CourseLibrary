from django.contrib import admin
from .models import Category, Course, Favorite, Review


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display  = ['name', 'slug', 'icon']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display  = ['title', 'author', 'category', 'platform', 'level', 'price', 'avg_rating']
    list_filter   = ['category', 'platform', 'level', 'has_certificate', 'language']
    search_fields = ['title', 'author']


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ['user', 'course', 'created_at']


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['user', 'course', 'rating', 'created_at']
