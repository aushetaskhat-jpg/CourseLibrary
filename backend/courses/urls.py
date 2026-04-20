from django.urls import path
from . import views

urlpatterns = [
    # Auth (FBV)
    path('auth/login/',    views.login_view,    name='auth-login'),
    path('auth/logout/',   views.logout_view,   name='auth-logout'),
    path('auth/register/', views.register_view, name='auth-register'),

    # Categories (CBV)
    path('categories/', views.CategoryListView.as_view(), name='category-list'),

    # Courses (CBV) — full CRUD
    path('courses/',       views.CourseListView.as_view(),   name='course-list'),
    path('courses/<int:pk>/', views.CourseDetailView.as_view(), name='course-detail'),

    # Reviews (FBV)
    path('courses/<int:pk>/reviews/', views.course_reviews, name='course-reviews'),

    # Favorites (CBV)
    path('favorites/',                    views.FavoriteView.as_view(),       name='favorite-list'),
    path('favorites/<int:course_id>/',    views.FavoriteDetailView.as_view(), name='favorite-detail'),
]
