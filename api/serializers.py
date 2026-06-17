from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from django.utils import timezone
import os
from main.models import CustomUser, DiscountCode, Book, Genre,CartItem,ShoppingCart,Order,OrderItem,UserLibrary

from rest_framework import serializers
from main.models import Comment

class BookAdminApproveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['status', 'rejection_reason']
        read_only_fields = ['rejection_reason']

    def update(self, instance, validated_data):
        instance.status = 'approved'
        instance.save()
        return instance


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name', 'role', 'contact_number']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        # هش کردن رمز عبور قبل از ذخیره
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)


class DiscountCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiscountCode
        fields = ['id', 'code', 'percentage', 'expiration_date', 'is_active']
        read_only_fields = ['is_active']

    def validate_code(self, value):
        if len(value) != 8:
            raise serializers.ValidationError("کد تخفیف باید 8 کاراکتر باشد.")
        return value

    def validate_expiration_date(self, value):
        if value <= timezone.now():
            raise serializers.ValidationError("تاریخ انقضا باید در آینده باشد.")
        return value

    def validate_percentage(self, value):
        if not (0 < value <= 100):
            raise serializers.ValidationError("درصد تخفیف باید بین 1 تا 100 باشد.")
        return value


class AuthorSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'password', 'first_name', 'last_name', 'role', 'contact_number']
        extra_kwargs = {'role': {'read_only': True}}

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

    # فقط در حالت create این اعتبارسنجی‌ها انجام شوند
        if self.instance is None:
           if CustomUser.objects.filter(username=username, role='author').exists():
              raise serializers.ValidationError({'username': 'این نام کاربری برای نویسنده قبلاً ثبت شده است.'})

           if not username:
              raise serializers.ValidationError("وارد کردن نام کاربری الزامی است.")

           if not data.get('first_name') or not data.get('last_name'):
              raise serializers.ValidationError("نام و نام خانوادگی الزامی هستند.")

        return data



    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUser.objects.create(role='author', **validated_data)
        user.set_password(password) # Use set_password for proper hashing
        user.save()
        return user


class BookCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        exclude = ['average_rating', 'status', 'author'] # 'author' is excluded because it's set by request.user

    def validate(self, attrs):
        request = self.context.get('request') # Use .get to avoid KeyError if 'request' is not in context

        # فقط نویسنده‌ها اجازه ثبت کتاب دارند
        # This validation is for authors uploading their own books
        if not request or not request.user.is_authenticated or request.user.role != 'author':
            raise serializers.ValidationError("فقط نویسندگان می‌توانند کتاب ثبت کنند.")

        # بررسی وجود فایل
        if not attrs.get('full_file'):
            raise serializers.ValidationError("فایل کامل کتاب (full_file) الزامی است.")

        # بررسی فرمت PDF
        file = attrs.get('full_file')
        if file and os.path.splitext(file.name)[1].lower() != '.pdf':
            raise serializers.ValidationError("فرمت فایل باید PDF باشد.")

        # بررسی طول عنوان
        if len(attrs.get('title', '')) < 3:
            raise serializers.ValidationError("عنوان کتاب باید حداقل ۳ کاراکتر داشته باشد.")

        # بررسی طول توضیحات
        if len(attrs.get('description', '')) < 10:
            raise serializers.ValidationError("توضیحات باید حداقل ۱۰ کاراکتر داشته باشد.")

        # بررسی قیمت مثبت
        if attrs.get('price') is not None and attrs['price'] <= 0:
            raise serializers.ValidationError("قیمت کتاب باید عددی مثبت باشد.")

        return attrs

    def create(self, validated_data):
        request = self.context['request']

        # ژانرها را جدا ذخیره می‌کنیم
        genres = validated_data.pop('genre', [])

        # ست کردن نویسنده و ایجاد کتاب
        validated_data['author'] = request.user
        book = Book.objects.create(**validated_data)

        # اتصال ژانرها
        book.genre.set(genres)

        return book

class BookListSerializer(serializers.ModelSerializer):
    # This serializer is for listing books, showing URLs
    full_file_url = serializers.SerializerMethodField()
    cover_image_url = serializers.SerializerMethodField()
    sample_file_url = serializers.SerializerMethodField()
    author = serializers.StringRelatedField() # Display author's username/name

    class Meta:
        model = Book
        fields = [
            'id', 'title', 'author', 'status', 'rejection_reason', 'description', 'price',
            'full_file_url', 'cover_image_url', 'sample_file_url'
        ]

    def get_full_file_url(self, obj):
        request = self.context.get('request')
        if obj.full_file and request:
            return request.build_absolute_uri(obj.full_file.url)
        return None

    def get_cover_image_url(self, obj):
        request = self.context.get('request')
        if obj.cover_image and request:
            return request.build_absolute_uri(obj.cover_image.url)
        return None

    def get_sample_file_url(self, obj):
        request = self.context.get('request')
        if obj.sample_file and request:
            return request.build_absolute_uri(obj.sample_file.url)
        return None



class BookAdminCreateSerializer(serializers.ModelSerializer):
    author = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.filter(role='author'), required=True
    )

    genre = serializers.PrimaryKeyRelatedField(
        queryset=Genre.objects.all(),
        many=True,  # چون ManyToManyField است
        required=True
    )

    class Meta:
        model = Book
        fields = [
            'title',
            'author',
            'genre',
            'publication_date',
            'isbn',
            'price',
            'stock',
            'description',
            'cover_image',
            'book_type',
            'full_file',
            'sample_file',
        ]

    def validate(self, attrs):
        if not attrs.get('full_file'):
            raise serializers.ValidationError("فایل کامل کتاب (full_file) الزامی است.")

        file = attrs.get('full_file')
        if file and os.path.splitext(file.name)[1].lower() != '.pdf':
            raise serializers.ValidationError("فرمت فایل باید PDF باشد.")

        if len(attrs.get('title', '')) < 3:
            raise serializers.ValidationError("عنوان کتاب باید حداقل ۳ کاراکتر داشته باشد.")

        if len(attrs.get('description', '')) < 10:
            raise serializers.ValidationError("توضیحات باید حداقل ۱۰ کاراکتر داشته باشد.")

        if attrs.get('price') is not None and attrs['price'] <= 0:
            raise serializers.ValidationError("قیمت کتاب باید عددی مثبت باشد.")

        return attrs

    def create(self, validated_data):
        genres_data = validated_data.pop('genre', [])
        book = Book.objects.create(**validated_data)
        book.genre.set(genres_data)
        return book


class BookAdminDetailSerializer(serializers.ModelSerializer):

    author = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.filter(role='author'), allow_null=True)

    class Meta:
        model = Book
        fields = '__all__' # Admin can manage all fields
        read_only_fields = ['average_rating'] # Average rating is calculated, not set by admin directly


class UserManagementSerializer(serializers.ModelSerializer):
    # For admin to manage users, including their roles and active status
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'contact_number', 'is_active', 'is_staff', 'date_joined']
        read_only_fields = ['date_joined'] # Date joined is set automatically and shouldn't be editable

    def validate_role(self, value):

        valid_roles = ['customer', 'author', 'admin']
        if value not in valid_roles:
            raise serializers.ValidationError(f"Invalid role. Must be one of: {', '.join(valid_roles)}")
        return value

    def update(self, instance, validated_data):

        return super().update(instance, validated_data)
    
class BookListMainSerializer(serializers.ModelSerializer):
    cover_image_url = serializers.SerializerMethodField()
    sample_file_url = serializers.SerializerMethodField()
    author = serializers.StringRelatedField()

    class Meta:
        model = Book
        fields = [
            'id', 'title', 'author', 'description', 'price', 'genre',
            'cover_image_url', 'sample_file_url'
        ]

    def get_cover_image_url(self, obj):
        request = self.context.get('request')
        if obj.cover_image and request:
            return request.build_absolute_uri(obj.cover_image.url)
        return None

    def get_sample_file_url(self, obj):
        request = self.context.get('request')
        if obj.sample_file and request:
            return request.build_absolute_uri(obj.sample_file.url)
        return None

class CartItemSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source='book.title', read_only=True)
    book_price = serializers.DecimalField(source='book.price', max_digits=10, decimal_places=2, read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'book', 'book_title', 'book_price', 'quantity', 'total_price']

    def get_total_price(self, obj):
        return obj.total_price()

class CartItemSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source='book.title', read_only=True)
    book_price = serializers.DecimalField(source='book.price', max_digits=10, decimal_places=2, read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'book', 'book_title', 'book_price', 'quantity', 'total_price']

    def get_total_price(self, obj):
        return obj.total_price()

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = ShoppingCart
        fields = ['id', 'user', 'items']


class OrderItemSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source='book.title', read_only=True)
    price_per_item = serializers.DecimalField(source='book.price', max_digits=10, decimal_places=2, read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'book', 'book_title', 'quantity', 'price_per_item', 'total_price']

    def get_total_price(self, obj):
        return obj.total_price()

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()
    discount_code = serializers.CharField(source='discount_code.code', read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'created_at', 'updated_at', 'discount_code', 'total_price', 'items']

    def get_total_price(self, obj):
        return obj.total_price()


class BookMiniSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.name', read_only=True)

    class Meta:
        model = Book
        fields = ['id', 'title', 'cover_image', 'author_name']


class UserLibrarySerializer(serializers.ModelSerializer):
    book = BookMiniSerializer()

    class Meta:
        model = UserLibrary
        fields = ['book', 'added_at']

class ActiveDiscountCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiscountCode
        fields = ['code', 'percentage', 'expiration_date'] 
    





class CommentSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'book', 'author', 'author_username', 'text', 'created_at']
        read_only_fields = ['author', 'created_at']
