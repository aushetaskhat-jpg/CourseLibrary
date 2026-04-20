from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token

from .models import Category, Course, Favorite, Review
from .serializers import (
    LoginSerializer, RegisterSerializer,
    CategorySerializer, CourseSerializer, CourseDetailSerializer,
    FavoriteSerializer, ReviewSerializer,
)


# ════════════════════════════════════════════════════════════════════════════
# Function-Based Views  (FBV)
# ════════════════════════════════════════════════════════════════════════════

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    POST /api/v1/auth/login/
    Body: { username, password }
    Returns: token + user info
    """
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    user  = serializer.validated_data['user']
    token, _ = Token.objects.get_or_create(user=user)

    return Response({
        'token': token.key,
        'user': {
            'id':         user.id,
            'username':   user.username,
            'email':      user.email,
            'first_name': user.first_name,
            'last_name':  user.last_name,
        }
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    POST /api/v1/auth/logout/
    Header: Authorization: Token <token>
    Deletes the auth token.
    """
    request.user.auth_token.delete()
    return Response({'detail': 'Logged out successfully.'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """
    POST /api/v1/auth/register/
    Body: { username, email, password, first_name, last_name }
    Returns: token + user info
    """
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    user  = serializer.save()
    token = Token.objects.create(user=user)

    return Response({
        'token': token.key,
        'user': {
            'id':         user.id,
            'username':   user.username,
            'email':      user.email,
            'first_name': user.first_name,
            'last_name':  user.last_name,
        }
    }, status=status.HTTP_201_CREATED)


@api_view(['GET', 'POST'])
def course_reviews(request, pk):
    """
    GET  /api/v1/courses/{pk}/reviews/  — list reviews for a course
    POST /api/v1/courses/{pk}/reviews/  — add a review (auth required)
    """
    course = get_object_or_404(Course, pk=pk)

    if request.method == 'GET':
        reviews = course.reviews.select_related('user').all()
        return Response(ReviewSerializer(reviews, many=True).data)

    # POST — must be authenticated
    if not request.user.is_authenticated:
        return Response({'detail': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)

    if Review.objects.filter(user=request.user, course=course).exists():
        return Response({'detail': 'You already reviewed this course.'}, status=status.HTTP_400_BAD_REQUEST)

    serializer = ReviewSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    review = serializer.save(user=request.user, course=course)
    course.recalc_rating()

    return Response(ReviewSerializer(review).data, status=status.HTTP_201_CREATED)


# ════════════════════════════════════════════════════════════════════════════
# Class-Based Views  (CBV) — APIView
# ════════════════════════════════════════════════════════════════════════════

class CategoryListView(APIView):
    """
    GET /api/v1/categories/
    Returns all categories with course counts.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        categories = Category.objects.prefetch_related('courses').all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)


class CourseListView(APIView):
    """
    GET  /api/v1/courses/         — list with optional query filters
    POST /api/v1/courses/         — create course (admin only)

    Query params: search, category, platform, price, level, tag, sort
    """
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdminUser()]
        return [AllowAny()]

    def get(self, request):
        qs = Course.objects.select_related('category').all()

        search   = request.query_params.get('search')
        category = request.query_params.get('category')
        platform = request.query_params.get('platform')
        price    = request.query_params.get('price')
        level    = request.query_params.get('level')
        tag      = request.query_params.get('tag')
        sort     = request.query_params.get('sort', 'rating')

        if search:
            from django.db.models import Q
            qs = qs.filter(
                Q(title__icontains=search) |
                Q(author__icontains=search) |
                Q(category__name__icontains=search)
            )
        if category and category != 'all':
            qs = qs.filter(category__slug=category)
        if platform and platform != 'all':
            qs = qs.filter(platform=platform)
        if price == 'free':
            qs = qs.filter(price=0)
        elif price == 'paid':
            qs = qs.filter(price__gt=0)
        if level and level != 'all':
            level_map = {'Начинающий': 'beginner', 'Средний': 'intermediate', 'Продвинутый': 'advanced'}
            qs = qs.filter(level=level_map.get(level, level))
        if tag and tag not in ('all', ''):
            if tag == 'free':
                qs = qs.filter(price=0)
            else:
                qs = qs.filter(tags__contains=tag)

        sort_map = {
            'rating':  '-avg_rating',
            'price':   'price',
            'popular': '-students_count',
            'newest':  '-created_at',
        }
        qs = qs.order_by(sort_map.get(sort, '-avg_rating'))

        serializer = CourseSerializer(qs, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        serializer = CourseSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CourseDetailView(APIView):
    """
    GET    /api/v1/courses/{pk}/  — retrieve course with reviews
    PUT    /api/v1/courses/{pk}/  — full update (admin only)
    PATCH  /api/v1/courses/{pk}/  — partial update (admin only)
    DELETE /api/v1/courses/{pk}/  — delete (admin only)
    """
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdminUser()]

    def get_object(self, pk):
        return get_object_or_404(Course.objects.select_related('category').prefetch_related('reviews__user'), pk=pk)

    def get(self, request, pk):
        course = self.get_object(pk)
        serializer = CourseDetailSerializer(course, context={'request': request})
        return Response(serializer.data)

    def put(self, request, pk):
        course = self.get_object(pk)
        serializer = CourseSerializer(course, data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def patch(self, request, pk):
        course = self.get_object(pk)
        serializer = CourseSerializer(course, data=request.data, partial=True, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        course = self.get_object(pk)
        course.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class FavoriteView(APIView):
    """
    GET  /api/v1/favorites/           — list current user's favorites
    POST /api/v1/favorites/           — add course to favorites
                                        Body: { course_id }
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        favs = Favorite.objects.filter(user=request.user).select_related('course__category')
        serializer = FavoriteSerializer(favs, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        course_id = request.data.get('course_id')
        if not course_id:
            return Response({'detail': 'course_id is required.'}, status=status.HTTP_400_BAD_REQUEST)

        course = get_object_or_404(Course, pk=course_id)
        fav, created = Favorite.objects.get_or_create(user=request.user, course=course)

        if not created:
            return Response({'detail': 'Already in favorites.'}, status=status.HTTP_200_OK)

        return Response(FavoriteSerializer(fav, context={'request': request}).data, status=status.HTTP_201_CREATED)


class FavoriteDetailView(APIView):
    """
    DELETE /api/v1/favorites/{course_id}/  — remove course from favorites
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request, course_id):
        fav = get_object_or_404(Favorite, user=request.user, course_id=course_id)
        fav.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
