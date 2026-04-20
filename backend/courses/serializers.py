from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import serializers

from .models import Category, Course, Favorite, Review


# ════════════════════════════════════════════════════════════════════════════
# serializers.Serializer  (plain, non-model)
# ════════════════════════════════════════════════════════════════════════════

class LoginSerializer(serializers.Serializer):
    """Validates login credentials and authenticates the user."""
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if not user:
            raise serializers.ValidationError('Invalid username or password.')
        if not user.is_active:
            raise serializers.ValidationError('User account is disabled.')
        data['user'] = user
        return data


class RegisterSerializer(serializers.Serializer):
    """Validates registration data and creates a new user."""
    username   = serializers.CharField(max_length=150)
    email      = serializers.EmailField()
    password   = serializers.CharField(min_length=6, write_only=True, style={'input_type': 'password'})
    first_name = serializers.CharField(max_length=150, required=False, default='')
    last_name  = serializers.CharField(max_length=150, required=False, default='')

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('Username already taken.')
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('Email already registered.')
        return value

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )


# ════════════════════════════════════════════════════════════════════════════
# serializers.ModelSerializer
# ════════════════════════════════════════════════════════════════════════════

class CategorySerializer(serializers.ModelSerializer):
    course_count = serializers.IntegerField(source='courses.count', read_only=True)

    class Meta:
        model  = Category
        fields = ['id', 'name', 'slug', 'icon', 'course_count']


class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model  = Review
        fields = ['id', 'user', 'rating', 'text', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

    def get_user(self, obj):
        return {
            'id':         obj.user.id,
            'username':   obj.user.username,
            'first_name': obj.user.first_name,
        }


class CourseSerializer(serializers.ModelSerializer):
    """Compact serializer for list views."""
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    is_favorited  = serializers.SerializerMethodField()

    class Meta:
        model  = Course
        fields = [
            'id', 'title', 'author', 'description',
            'category', 'category_name', 'category_slug',
            'platform', 'level', 'price', 'duration_hours',
            'url', 'emoji', 'bg_color',
            'students_count', 'has_certificate', 'language',
            'avg_rating', 'reviews_count', 'tags',
            'is_favorited', 'created_at',
        ]

    def get_is_favorited(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Favorite.objects.filter(user=request.user, course=obj).exists()
        return False


class CourseDetailSerializer(CourseSerializer):
    """Extended serializer for detail views — includes reviews."""
    reviews = ReviewSerializer(many=True, read_only=True)

    class Meta(CourseSerializer.Meta):
        fields = CourseSerializer.Meta.fields + ['reviews']


class FavoriteSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)

    class Meta:
        model  = Favorite
        fields = ['id', 'course', 'created_at']
        read_only_fields = ['id', 'created_at']
