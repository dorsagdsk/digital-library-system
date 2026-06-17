from django.shortcuts import get_object_or_404
from rest_framework.authentication import TokenAuthentication # Make sure TokenAuthentication is correctly configured in settings.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics # Import generics
from rest_framework import permissions # *** THIS IS THE MISSING IMPORT! ***
from rest_framework.permissions import AllowAny, IsAuthenticated # Ensure IsAuthenticated is also imported if used
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login as django_login, logout as django_logout
from django.http import JsonResponse
from main.models import CustomUser, DiscountCode, Book,Genre,ShoppingCart, CartItem,DiscountUsage,Order, OrderItem, UserLibrary, PurchasedBook,Rating,ReadingProgress
# Assuming these custom permissions are defined correctly in main/permissions.py
from main.permissions import IsCustomerRole, IsAdminUserRole, IsAuthorRole
from pypdf import PdfReader # Ensure pypdf is installed (`pip install pypdf`)
from rest_framework import generics
from rest_framework import generics, status
from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth import get_user_model # Use get_user_model to get your CustomUser
from django.db.models import Q
import os 
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils.timezone import make_aware
from django.utils import timezone
from django.db.models import Sum, F
from datetime import datetime
from dateutil.parser import parse as parse_datetime
from django.db.models import Count
# Import all necessary serializers
from .serializers import (
    CustomUserSerializer,
    DiscountCodeSerializer,
    AuthorSerializer,
    BookCreateSerializer,
    BookListSerializer,
    BookAdminCreateSerializer,  # Make sure this is defined in serializers.py
    BookAdminDetailSerializer,  # Make sure this is defined in serializers.py
    UserManagementSerializer ,   # Make sure this is defined in serializers.py
    BookListMainSerializer,
    DiscountCodeSerializer,
    CartItemSerializer,
    CartSerializer,
    OrderSerializer,
    UserLibrarySerializer,
    ActiveDiscountCodeSerializer
)
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_http_methods
from main.models import Book, Comment 
from .serializers import BookListSerializer
import joblib
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import os
from django.http import HttpResponse
from .utils import clean_text  # این خط را اضافه کنید
import os
from django.conf import settings
import re
from bs4 import BeautifulSoup
import nltk
from nltk.stem import WordNetLemmatizer
from nltk import pos_tag, word_tokenize
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from main.models import UserLibrary
from .serializers import UserLibrarySerializer
from rest_framework import serializers
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from main.models import Book
from .serializers import BookAdminApproveSerializer 
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from main.models import Book, Comment  




# مسیرهای فایل‌های مدل
MODEL_PATH = os.path.join(settings.BASE_DIR, 'main', 'models', 'book_genre_model.pkl')
TFIDF_PATH = os.path.join(settings.BASE_DIR, 'main', 'models', 'tfidf_vectorizer.pkl')
MLB_PATH = os.path.join(settings.BASE_DIR, 'main', 'models', 'label_binarizer.pkl')

def get_wordnet_pos(tag):
    if tag.startswith('J'):
        return 'a'
    elif tag.startswith('V'):
        return 'v'
    elif tag.startswith('N'):
        return 'n'
    elif tag.startswith('R'):
        return 'r'
    else:
        return 'n'

lemmatizer = WordNetLemmatizer()

def clean_text(text):
    # حذف HTML
    text = BeautifulSoup(str(text), "html.parser").get_text()
    
    # حذف هرچیزی جز حروف
    text = re.sub(r"[^a-zA-Z]", " ", text)
    
    # کوچک کردن حروف
    text = text.lower()
    
    # توکنایز کردن و Lemmatization
    tokens = word_tokenize(text)
    
    # lemmatization with POS tag
    lemmatized_tokens = [lemmatizer.lemmatize(w, get_wordnet_pos(pos_tag([w])[0][1])) for w in tokens]
    
    # حذف stop words
    stop_words = set(nltk.corpus.stopwords.words('english'))
    filtered_tokens = [w for w in lemmatized_tokens if w not in stop_words and len(w) > 1]
    
    return " ".join(lemmatized_tokens)




def ai_recommendation(request):
    """
    This is a placeholder for the AI recommendation view.
    """
    # return HttpResponse("This is the AI recommendation endpoint.")

# بارگذاری مدل و ابزارها (فقط یک بار در شروع برنامه)
try:
    model_loaded = joblib.load(MODEL_PATH)
    tfidf_loaded = joblib.load(TFIDF_PATH)
    mlb_loaded = joblib.load(MLB_PATH)
    print("مدل و ابزارها با موفقیت بارگذاری شدند.")
except FileNotFoundError as e:
    print(f"خطا: فایل مدل یافت نشد. مسیر را بررسی کنید: {e}")
    model_loaded, tfidf_loaded, mlb_loaded = None, None, None
# @csrf_exempt
def predict_genre(request):
    if request.method == 'POST':
        if not all([model_loaded, tfidf_loaded, mlb_loaded]):
            return JsonResponse({'error': 'Model files not loaded.'}, status=500)

        try:

            summary = request.body.decode('utf-8')
            


            if not summary or not isinstance(summary, str):
                return JsonResponse({'error': 'Invalid summary provided.'}, status=400)

            vec = tfidf_loaded.transform([summary])
            print(summary)

            # انجام پیش‌بینی و محاسبه احتمالات
            probs = model_loaded.predict_proba(vec)[0]
            top_n = 3
            threshold = 0.3
            top_indices = probs.argsort()[-top_n:][::-1]

            results = []
            for i in top_indices:
                if probs[i] >= threshold:
                    genre = mlb_loaded.classes_[i]
                    probability = round(probs[i] * 100, 2)
                    results.append({'genre': genre, 'probability': probability})

            return JsonResponse({'predictions': results})

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
            
    return JsonResponse({'error': 'Only POST requests are accepted'}, status=405)





class BookListCreateAPIView(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookListSerializer

class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if user is not None:
            django_login(request, user) 
            token, _ = Token.objects.get_or_create(user=user)
            response = JsonResponse({
                'token': token.key,
                'role': user.role,
                'username': user.username
            })
            response.set_cookie(
                key='auth_token',
                value=token.key,
                # httponly=True,
                samesite='Lax',
                max_age=86400
            )
            return response
        else:
            return Response({'detail': 'نام کاربری یا رمز عبور اشتباه است.'}, status=status.HTTP_401_UNAUTHORIZED)



class LogoutAPIView(APIView):

    def post(self, request, *args, **kwargs):
        try:
            # حذف توکن کاربر
            request.user.auth_token.delete()
        except Token.DoesNotExist:
            return Response({"detail": "Token not found."}, status=400)

        # حذف کوکی auth_token (در صورت وجود)
        response = Response({"detail": "Successfully logged out."})
        response.delete_cookie('auth_token')
        return response

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')

        if CustomUser.objects.filter(username=username, role='customer').exists():
            return Response({'detail': 'این نام کاربری قبلاً توسط یک مشتری ثبت شده است. لطفاً نام دیگری انتخاب کنید.'}, status=status.HTTP_400_BAD_REQUEST)

        data = request.data.copy()
        data['role'] = 'customer' # Default role for registration

        serializer = CustomUserSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            response = Response({
                'message': 'ثبت‌نام با موفقیت انجام شد!',
                'token': token.key,
                'role': user.role,
                'username': user.username,
            }, status=status.HTTP_201_CREATED)
            response.set_cookie(
                key='auth_token',
                value=token.key,
                httponly=True,
                samesite='Lax',
                max_age=86400
            )
            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CheckUsernameAvailability(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        username = request.GET.get('username')

        if not username:
            return Response({'error': 'لطفاً نام کاربری را وارد کنید.'}, status=status.HTTP_400_BAD_REQUEST)

        is_taken = CustomUser.objects.filter(username=username, role='customer').exists()
        return Response({'is_available': not is_taken}, status=status.HTTP_200_OK)


# --- Discount Code Management Views ---

class DiscountCodeListCreateAPIView(APIView):
    permission_classes = [IsAdminUserRole]
    authentication_classes = [TokenAuthentication]

    def get(self, request, *args, **kwargs):
        codes = DiscountCode.objects.all()
        for code in codes:
            code.deactivate_if_expired() 
        serializer = DiscountCodeSerializer(codes, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        serializer = DiscountCodeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(is_active=True)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DiscountCodeDeleteAPIView(APIView):
    permission_classes = [IsAdminUserRole]
    authentication_classes = [TokenAuthentication]

    def delete(self, request, pk, *args, **kwargs):
        discount_code = get_object_or_404(DiscountCode, pk=pk)
        discount_code.delete()
        return Response({"message": "کد تخفیف با موفقیت حذف شد."}, status=status.HTTP_200_OK)


# --- Author Management Views ---

class AuthorListAPIView(APIView):
    permission_classes = [IsAdminUserRole]
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        authors = CustomUser.objects.filter(role='author')
        serializer = AuthorSerializer(authors, many=True)
        return Response(serializer.data)


class AddAuthorAPIView(APIView):
    permission_classes = [IsAdminUserRole]
    authentication_classes = [TokenAuthentication]

    def post(self, request, *args, **kwargs):
        serializer = AuthorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AuthorManagementAPIView(APIView):
    permission_classes = [IsAdminUserRole]
    authentication_classes = [TokenAuthentication]

    def get(self, request, pk):
        author = get_object_or_404(CustomUser, pk=pk, role='author')
        serializer = AuthorSerializer(author)
        return Response(serializer.data)

    def delete(self, request, pk):
        author = get_object_or_404(CustomUser, pk=pk, role='author')
        author.delete()
        return Response({'detail': 'نویسنده با موفقیت حذف شد'}, status=status.HTTP_204_NO_CONTENT)

    def patch(self, request, pk):
        author = get_object_or_404(CustomUser, pk=pk, role='author')
        serializer = AuthorSerializer(author, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'detail': 'نویسنده با موفقیت ویرایش شد'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# --- Book Management Views ---

class AdminAddBookView(generics.CreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookAdminCreateSerializer
    permission_classes = [IsAdminUserRole]
    authentication_classes = [TokenAuthentication]

    def perform_create(self, serializer):
       
        serializer.save(status='approved')



class AdminBookManagementView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminUserRole]
    authentication_classes = [TokenAuthentication]
    queryset = Book.objects.all()
    serializer_class = BookAdminDetailSerializer # Ensure this serializer is defined
    lookup_field = 'pk'

# View for Admin to list books (e.g., by status for review)
class AdminBookListView(APIView):
    permission_classes = [IsAdminUserRole]
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        status_filter = request.GET.get('status')
        if status_filter and status_filter not in ['pending', 'approved', 'rejected']:
            return Response({"detail": "پارامتر status نامعتبر است."}, status=400)

        books = Book.objects.all() # Start with all books
        if status_filter:
            books = books.filter(status=status_filter)

        # Allow searching by title or author name (example)
        search_query = request.GET.get('search', '').strip()
        if search_query:
            from django.db.models import Q
            books = books.filter(
                Q(title__icontains=search_query) |
                Q(author__first_name__icontains=search_query) |
                Q(author__last_name__icontains=search_query)
            )

        books = books.order_by('-id')
        serializer = BookListSerializer(books, many=True, context={'request': request})
        return Response(serializer.data)


class UpdateBookStatusView(APIView):
    permission_classes = [IsAdminUserRole]
    authentication_classes = [TokenAuthentication]

    def post(self, request, book_id):
        book = get_object_or_404(Book, id=book_id)

        new_status = request.data.get('status')
        rejection_reason = request.data.get('rejection_reason', '').strip()

        if new_status not in ['approved', 'rejected']:
            return Response({"detail": "وضعیت نامعتبر است."}, status=400)

        if new_status == 'rejected' and not rejection_reason:
            return Response({"detail": "لطفاً دلیل رد شدن را وارد کنید."}, status=400)

        book.status = new_status
        book.rejection_reason = rejection_reason if new_status == 'rejected' else None
        book.save()

        return Response({"detail": f"وضعیت کتاب به '{new_status}' تغییر یافت."})




class AuthorBookUploadView(generics.CreateAPIView):
    permission_classes = [IsAuthorRole]
    authentication_classes = [TokenAuthentication]
    queryset = Book.objects.all()
    serializer_class = BookCreateSerializer


    def perform_create(self, serializer):
        book = serializer.save(status='pending')  # کتاب در انتظار تایید

        full_file = self.request.FILES.get('full_file')
        if full_file and full_file.name.endswith('.pdf'):
            try:
                reader = PdfReader(full_file)
                num_pages = len(reader.pages)
                first_page = reader.pages[0]
                first_page_text = first_page.extract_text()

                print(f":white_check_mark: تعداد صفحات: {num_pages}")
                print(f":memo: متن صفحه اول: {first_page_text[:300]}")


            except Exception as e:
                return Response({'error': f'خطا در خواندن PDF: {str(e)}'},
            status=status.HTTP_400_BAD_REQUEST)


class AuthorBookListView(APIView):
    permission_classes = [IsAuthorRole]
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        status_filter = request.GET.get('status')
        valid_statuses = ['pending', 'approved', 'rejected']

        if status_filter and status_filter not in valid_statuses:
            return Response({"detail": "وضعیت نامعتبر است."}, status=400)

        books = Book.objects.filter(author=request.user)

        if status_filter:
            books = books.filter(status=status_filter)

        books = books.order_by('-id')
        serializer = BookListSerializer(books, many=True, context={'request': request})
        return Response(serializer.data)




class ApprovedBookListView(generics.ListAPIView):
    queryset = Book.objects.filter(status='approved').order_by('-publication_date')
    serializer_class = BookListMainSerializer
    permission_classes = [AllowAny]  # چون صفحه اصلی است و نیازی به لاگین نیست


class BookPreviewView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, book_id):
        try:
            book = Book.objects.get(id=book_id, status='approved')
            if not book.full_file:
                return Response({'detail': 'No full file available.'}, status=404)

            path = book.full_file.path
            reader = PdfReader(path)
            preview_pages = []

            for i in range(min(5, len(reader.pages))):
                text = reader.pages[i].extract_text()
                preview_pages.append(text or "[صفحه بدون متن]")

            return Response({
                'book_id': book.id,
                'title': book.title,
                'preview': preview_pages
            })

        except Book.DoesNotExist:
            return Response({'detail': 'Book not found.'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        
class BookSearchFilterAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        query = request.GET.get('query', '').strip()
        genre_name = request.GET.get('genre', '').strip()
        author_name = request.GET.get('author', '').strip()

        books = Book.objects.filter(status='approved')

        if query:
            books = books.filter(
                Q(title__icontains=query) |
                Q(description__icontains=query)
            )

        if author_name:
            books = books.filter(
                Q(author__username__icontains=author_name) |
                Q(author__first_name__icontains=author_name) |
                Q(author__last_name__icontains=author_name)

            )

        if genre_name:
            genre = Genre.objects.filter(name__iexact=genre_name).first()
            if not genre:
                return Response({'error': 'Genre not found.'}, status=404)
            books = books.filter(genre=genre)

        serializer = BookListSerializer(books.distinct(), many=True, context={'request': request})
        return Response(serializer.data)

    
class BookFilterByGenreAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        genre_name = request.GET.get('genre', None)

        if genre_name:
            try:
                genre = Genre.objects.get(name=genre_name)
                books = Book.objects.filter(status='approved', genre=genre)
            except Genre.DoesNotExist:
                return Response({'error': 'Genre not found.'}, status=status.HTTP_404_NOT_FOUND)
        else:
            books = Book.objects.filter(status='approved')

        serializer = BookListSerializer(books, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class OrderReportView(APIView):
    
    permission_classes = [IsAdminUserRole]
    authentication_classes = [TokenAuthentication]

    def get(self, request, *args, **kwargs):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        if not start_date or not end_date:
            return Response({'error': 'Start date and end date are required.'}, status=400)

        try:
            start_date = parse_datetime(start_date) or datetime.strptime(start_date, '%Y-%m-%d')
            end_date = parse_datetime(end_date) or datetime.strptime(end_date, '%Y-%m-%d')
        except ValueError:
            return Response({'error': 'Invalid date format. Use YYYY-MM-DD or ISO-8601.'}, status=400)

        if timezone.is_naive(start_date):
            start_date = make_aware(start_date)
        if timezone.is_naive(end_date):
            end_date = make_aware(end_date)

        if start_date > end_date:
            return Response({'error': 'Start date cannot be after end date.'}, status=400)

        if end_date > timezone.now():
            return Response({'error': 'End date cannot be in the future.'}, status=400)

        orders_in_range = Order.objects.filter(
            created_at__range=(start_date, end_date)
        )

        total_income = orders_in_range.annotate(
            order_income=F('items__quantity') * F('items__book__price')
        ).aggregate(total_income=Sum('order_income'))['total_income']

        serialized_orders = OrderSerializer(orders_in_range, many=True)

        return Response({
            'total_income': total_income or 0,
            'orders': serialized_orders.data
        })

class ApprovedBookListView(generics.ListAPIView):
    queryset = Book.objects.filter(status='approved').order_by('-publication_date')
    serializer_class = BookListMainSerializer
    permission_classes = [AllowAny]  


class AddToCartView(APIView):
    permission_classes = [IsCustomerRole]
    authentication_classes = [TokenAuthentication]

    def post(self, request, book_id):
        try:
            book = Book.objects.filter(id=book_id).first()
            if not book:
                return Response({'detail': 'کتاب موردنظر یافت نشد.'}, status=status.HTTP_404_NOT_FOUND)

            # بررسی اینکه آیا قبلاً خریداری شده
            if PurchasedBook.objects.filter(customer=request.user, book=book).exists():
                return Response({'detail': 'شما قبلاً این کتاب را خریده‌اید و نمی‌توانید دوباره به سبد خرید اضافه کنید.'},
                                status=status.HTTP_400_BAD_REQUEST)

            cart, _ = ShoppingCart.objects.get_or_create(user=request.user)

            # بررسی اینکه آیا کتاب قبلاً در سبد خرید است
            if CartItem.objects.filter(cart=cart, book=book).exists():
                return Response({'detail': 'این کتاب قبلاً به سبد خرید شما اضافه شده است.'}, status=status.HTTP_400_BAD_REQUEST)

            # ایجاد آیتم سبد خرید
            cart_item = CartItem.objects.create(cart=cart, book=book, quantity=1)

            serializer = CartItemSerializer(cart_item)
            return Response({'message': 'کتاب به سبد خرید اضافه شد.', 'item': serializer.data}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': 'خطای داخلی سرور: ' + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class CartView(APIView):
    permission_classes = [IsCustomerRole]
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        cart, created = ShoppingCart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart, context={'request': request})

        data = serializer.data
        data['total_price'] = cart.total_price()  # اضافه کردن قیمت کل به خروجی

        return Response(data, status=status.HTTP_200_OK)
    
class RemoveFromCartView(APIView):

    permission_classes = [IsCustomerRole]
    authentication_classes = [TokenAuthentication]

    def delete(self, request, item_id):
        cart_item = CartItem.objects.filter(id=item_id, cart__user=request.user).first()
        if not cart_item:
            return Response({'error': 'Item not found in cart'}, status=status.HTTP_404_NOT_FOUND)

        cart_item.delete()
        return Response({'message': 'Item removed from cart'}, status=status.HTTP_200_OK)



class ApplyDiscountCodeView(APIView):

    permission_classes = [IsCustomerRole]
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        user = request.user
        discount_code_input = request.data.get('discount_code')

        if not discount_code_input:
            return Response({'error': 'Discount code not provided.'}, status=status.HTTP_400_BAD_REQUEST)

        discount_code = DiscountCode.objects.filter(code=discount_code_input).first()
        if not discount_code or not discount_code.is_active or discount_code.is_expired():
            return Response({'error': 'Invalid or expired discount code.'}, status=status.HTTP_400_BAD_REQUEST)

        if DiscountUsage.objects.filter(user=user, discount_code=discount_code).exists():
            return Response({'error': 'You have already used this discount code.'}, status=status.HTTP_400_BAD_REQUEST)

        cart = ShoppingCart.objects.filter(user=user).first()
        if not cart or not cart.items.exists():
            return Response({'error': 'Your cart is empty.'}, status=status.HTTP_400_BAD_REQUEST)

        total_price = cart.total_price()

        try:
            discounted_price = discount_code.apply_discount(total_price)
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # (اختیاری) ثبت استفاده از کد تخفیف:
        DiscountUsage.objects.create(user=user, discount_code=discount_code)

        return Response({
            'original_price': total_price,
            'discounted_price': round(discounted_price, 2),
            'discount_percentage': discount_code.percentage,
        }, status=status.HTTP_200_OK)
    

class CheckoutView(APIView):

    permission_classes = [IsCustomerRole]
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        user = request.user

        # دریافت سبد خرید کاربر
        cart = ShoppingCart.objects.filter(user=user).first()
        if not cart or not cart.items.exists():
            return Response({'error': 'سبد خرید شما خالی است.'}, status=status.HTTP_400_BAD_REQUEST)

        # بررسی کد تخفیف اگر وجود دارد
        discount_code = None
        discount_code_str = request.data.get('discount_code')
        if discount_code_str:
            try:
                discount_code = DiscountCode.objects.get(code=discount_code_str, is_active=True)
                if discount_code.is_expired():
                    return Response({'error': 'کد تخفیف منقضی شده است.'}, status=status.HTTP_400_BAD_REQUEST)
                if DiscountUsage.objects.filter(user=user, discount_code=discount_code).exists():
                    return Response({'error': 'شما قبلاً از این کد تخفیف استفاده کرده‌اید.'}, status=status.HTTP_400_BAD_REQUEST)
            except DiscountCode.DoesNotExist:
                return Response({'error': 'کد تخفیف معتبر نیست.'}, status=status.HTTP_400_BAD_REQUEST)

        # ایجاد سفارش جدید
        order = Order.objects.create(user=user, discount_code=discount_code)

        for item in cart.items.all():
            # ثبت در آیتم‌های سفارش
            OrderItem.objects.create(order=order, book=item.book, quantity=item.quantity)

            # افزودن به کتابخانه کاربر
            UserLibrary.objects.get_or_create(user=user, book=item.book)

            # ثبت در کتاب‌های خریداری‌شده
            PurchasedBook.objects.get_or_create(customer=user, book=item.book)

        # ثبت استفاده از کد تخفیف
        if discount_code:
            DiscountUsage.objects.create(user=user, discount_code=discount_code)

        # پاک کردن آیتم‌های سبد خرید
        cart.items.all().delete()

        # بازگشت اطلاعات سفارش ثبت‌شده
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    
class CustomerLibraryView(APIView):
    permission_classes = [IsCustomerRole]
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        entries = UserLibrary.objects.filter(user=request.user).select_related('book__author')
        serializer = UserLibrarySerializer(entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class RateBookView(APIView):

    permission_classes = [IsCustomerRole]
    authentication_classes = [TokenAuthentication]

    def post(self, request, book_id):
        rating_value = request.data.get('rating')
        comment = request.data.get('comment', '')

        if not rating_value:
            return Response({'error': 'امتیاز الزامی است.'}, status=status.HTTP_400_BAD_REQUEST)

        # بررسی اینکه کاربر این کتاب رو در لایبری دارد یا نه
        if not UserLibrary.objects.filter(user=request.user, book_id=book_id).exists():
            return Response({'error': 'شما این کتاب را خریداری نکرده‌اید.'}, status=status.HTTP_403_FORBIDDEN)

        # بررسی اینکه قبلاً امتیاز داده یا نه
        if Rating.objects.filter(user=request.user, book_id=book_id).exists():
            return Response({'error': 'شما قبلاً به این کتاب امتیاز داده‌اید.'}, status=status.HTTP_400_BAD_REQUEST)

        # ثبت امتیاز
        Rating.objects.create(
            user=request.user,
            book_id=book_id,
            rating=rating_value,
            comment=comment
        )

        return Response({'message': 'امتیاز شما با موفقیت ثبت شد.'}, status=status.HTTP_201_CREATED)
    
class ReadPdfBookView(APIView):

    permission_classes = [IsCustomerRole]
    authentication_classes = [TokenAuthentication]

    def get(self, request, book_id, page_number=None):
        user = request.user
        book = get_object_or_404(Book, id=book_id)

        # بررسی اینکه آیا کاربر کتاب را خریده
        if not UserLibrary.objects.filter(user=user, book=book).exists():
            return Response({"error": "شما به این کتاب دسترسی ندارید."}, status=403)

        # استفاده از فیلد full_file
        file_field = book.full_file
        if not file_field:
            return Response({"error": "فایل PDF برای این کتاب وجود ندارد."}, status=400)

        file_path = file_field.path
        if not os.path.exists(file_path):
            return Response({"error": "فایل PDF در سرور پیدا نشد."}, status=500)

        try:
            reader = PdfReader(file_path)
            total_pages = len(reader.pages)
        except Exception as e:
            return Response({"error": f"خواندن فایل PDF ممکن نیست: {str(e)}"}, status=500)

        if page_number is None:
            progress, _ = ReadingProgress.objects.get_or_create(user=user, book=book)
            page_number = progress.last_page
        else:
            page_number = int(page_number)

        if page_number < 1 or page_number > total_pages:
            return Response({"error": "صفحه‌ای با این شماره وجود ندارد."}, status=400)

        try:
            page_content = reader.pages[page_number - 1].extract_text()
        except Exception:
            page_content = "[امکان استخراج متن از این صفحه وجود ندارد.]"

        ReadingProgress.objects.update_or_create(
            user=user,
            book=book,
            defaults={'last_page': page_number}
        )

        return Response({
            "book_title": book.title,
            "author": book.author.username if book.author else None,
            "page_number": page_number,
            "total_pages": total_pages,
            "content": page_content or "[صفحه خالی است یا استخراج‌پذیر نیست.]"
        })




@csrf_exempt  # برای اینکه بتواند درخواست‌های POST را بدون CSRF Token بپذیرد.
@require_http_methods(["GET", "POST"])
def book_comments(request, book_id):
    book = get_object_or_404(Book, pk=book_id)

    if request.method == 'GET':
        # منطق دریافت کامنت‌ها
        comments = Comment.objects.filter(book=book).order_by('-created_at')
        data = [{
            'id': comment.id,
            'text': comment.text,
            'author': comment.author.username,
            'created_at': comment.created_at.strftime("%Y-%m-%d %H:%M")
        } for comment in comments]
        return JsonResponse({'success': True, 'comments': data})

    elif request.method == 'POST':
        # منطق ارسال کامنت جدید
        if not request.user.is_authenticated:
            return JsonResponse({'success': False, 'message': 'You must be logged in to comment.'}, status=401)

        try:
            body = json.loads(request.body)
            comment_text = body.get('text')
            if not comment_text:
                return JsonResponse({'success': False, 'message': 'Comment text is required.'}, status=400)
            
            new_comment = Comment.objects.create(
                book=book,
                author=request.user,
                text=comment_text
            )
            return JsonResponse({
                'success': True,
                'message': 'Comment added successfully.',
                'comment': {
                    'id': new_comment.id,
                    'text': new_comment.text,
                    'author': new_comment.author.username,
                    'created_at': new_comment.created_at.strftime("%Y-%m-%d %H:%M")
                }
            })

        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'message': 'Invalid JSON format.'}, status=400)
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)
        

























    
try:
    model_loaded = joblib.load(MODEL_PATH)
    tfidf_loaded = joblib.load(TFIDF_PATH)
    mlb_loaded = joblib.load(MLB_PATH)
    print("مدل و ابزارها با موفقیت بارگذاری شدند.")
except FileNotFoundError as e:
    print(f"خطا: فایل مدل یافت نشد. مسیر را بررسی کنید: {e}")
    model_loaded, tfidf_loaded, mlb_loaded = None, None, None
except Exception as e:
    print(f"خطا در بارگذاری مدل: {e}")
    model_loaded, tfidf_loaded, mlb_loaded = None, None, None

@csrf_exempt # You need this if you are not using Django's CSRF tokens
def ai_recommendation(request):
    """
    This is the AI recommendation view that handles POST requests.
    """
    if request.method == 'POST':
        if not all([model_loaded, tfidf_loaded, mlb_loaded]):
            return JsonResponse({'error': 'Model files not loaded.'}, status=500)

        try:
            summary = request.body.decode('utf-8')
            
            if not summary or not isinstance(summary, str):
                return JsonResponse({'error': 'Invalid summary provided.'}, status=400)
            
            vec = tfidf_loaded.transform([summary])
            print(summary)
            
            probs = model_loaded.predict_proba(vec)[0]
            top_n = 3
            threshold = 0.3
            top_indices = probs.argsort()[-top_n:][::-1]

            results = []
            for i in top_indices:
                if probs[i] >= threshold:
                    genre = mlb_loaded.classes_[i]
                    probability = round(probs[i] * 100, 2)
                    results.append({'genre': genre, 'probability': probability})

            return JsonResponse({'predictions': results})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
            
    # Always return a response, even for non-POST requests
    return JsonResponse({'error': 'Only POST requests are accepted'}, status=405)














  
# C:\Users\msi\Desktop\Digital-Library-MonDor-main-new8\Digital-Library-MonDor-main\api\views.py

class CheckoutView(APIView):

    # permission_classes = [IsCustomerRole]
    # authentication_classes = [TokenAuthentication]

    def post(self, request):
        user = request.user
        
        # --- ADD THIS CHECK ---
        if not user.is_authenticated:
            return Response({'error': 'برای تسویه حساب، باید وارد شوید.'}, status=status.HTTP_401_UNAUTHORIZED)
        # --- END OF ADDITION ---
        
        # دریافت سبد خرید کاربر
        cart = ShoppingCart.objects.filter(user=user).first()
        if not cart or not cart.items.exists():
            return Response({'error': 'سبد خرید شما خالی است.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # ... the rest of your code ...  
# In your serializers.py file

class BookCreateSerializer(serializers.ModelSerializer):
    # ... (the rest of your serializer code is fine)

    def create(self, validated_data):
        request = self.context['request']
        
        # Pop genres first, as per your original logic
        genres = validated_data.pop('genre', [])
        
        # --- ⚠️ THIS IS THE ONLY LINE YOU NEED TO CHANGE ⚠️ ---
        # Get the Author profile linked to the logged-in user
        try:
            author_profile = Author.objects.get(user=request.user)
        except Author.DoesNotExist:
            raise serializers.ValidationError({"detail": "شما یک نویسنده نیستید و اجازه ثبت کتاب ندارید."})

        # Set the author field of the book to the correct Author object
        validated_data['author'] = author_profile
        
        # Create the book
        book = Book.objects.create(**validated_data)
        
        # Set the genres
        book.genre.set(genres)
        
        return book    


@csrf_exempt
def book_comments(request, book_id):
    if request.method == 'GET':
        comments = Comment.objects.filter(book_id=book_id).order_by('-created_at')
        data = [
            {
                'id': c.id,
                'author_username': c.author.username,
                'text': c.text,
                'created_at': c.created_at
            } for c in comments
        ]
        return JsonResponse(data, safe=False)

    elif request.method == 'POST':
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Unauthorized'}, status=401)
        import json
        data = json.loads(request.body)
        comment_text = data.get('text', '').strip()
        if not comment_text:
            return JsonResponse({'error': 'Empty comment'}, status=400)
        comment = Comment.objects.create(
            book_id=book_id,
            author=request.user,
            text=comment_text
        )
        return JsonResponse({
            'id': comment.id,
            'author_username': comment.author.username,
            'text': comment.text,
            'created_at': comment.created_at
        })
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
@require_http_methods(["GET", "POST"])
def book_comments(request, book_id):
    book = get_object_or_404(Book, pk=book_id)

    if request.method == 'GET':
        comments = Comment.objects.filter(book=book).order_by('-created_at')
        data = [{
            'id': comment.id,
            'text': comment.text,
            'author': comment.author.username,
            'created_at': comment.created_at.strftime("%Y-%m-%d %H:%M")
        } for comment in comments]
        return JsonResponse({'success': True, 'comments': data})
        






        

# api/views.py

 # مطمئن شوید که Comment را import کرده‌اید





    # ... بخش POST      





# views.py
# import joblib
# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt



# The predict_genre function is no longer needed since its logic is now in ai_recommendation.
# You can delete it.






# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.authentication import TokenAuthentication
# from django.db import transaction
# from main.models import (
#     ShoppingCart, CartItem, DiscountCode, DiscountUsage,
#     Order, OrderItem, UserLibrary, PurchasedBook
# )
# from .serializers import OrderSerializer
# from main.permissions import IsCustomerRole


# class CheckoutView(APIView):
#     authentication_classes = [TokenAuthentication]
#     permission_classes = [IsAuthenticated, IsCustomerRole]

#     @transaction.atomic
#     def post(self, request):
#         user = request.user
        
#         cart = ShoppingCart.objects.filter(user=user).first()
#         if not cart or not cart.items.exists():
#             return Response({'error': 'سبد خرید شما خالی است.'}, status=status.HTTP_400_BAD_REQUEST)
        
#         discount_code = None
#         discount_code_str = request.data.get('discount_code')
#         if discount_code_str:
#             try:
#                 discount_code = DiscountCode.objects.get(code=discount_code_str, is_active=True)
#                 if discount_code.is_expired():
#                     return Response({'error': 'کد تخفیف منقضی شده است.'}, status=status.HTTP_400_BAD_REQUEST)
#                 if DiscountUsage.objects.filter(user=user, discount_code=discount_code).exists():
#                     return Response({'error': 'شما قبلاً از این کد تخفیف استفاده کرده‌اید.'}, status=status.HTTP_400_BAD_REQUEST)
#             except DiscountCode.DoesNotExist:
#                 return Response({'error': 'کد تخفیف معتبر نیست.'}, status=status.HTTP_400_BAD_REQUEST)
        
#         order = Order.objects.create(user=user, discount_code=discount_code)
        
#         for item in cart.items.all():
#             OrderItem.objects.create(order=order, book=item.book, quantity=item.quantity)
#             UserLibrary.objects.get_or_create(user=user, book=item.book)
#             PurchasedBook.objects.get_or_create(customer=user, book=item.book)
            
#         if discount_code:
#             DiscountUsage.objects.create(user=user, discount_code=discount_code)
            
#         cart.items.all().delete()
        
#         serializer = OrderSerializer(order)
#         return Response(
#             {
#                 'success': True,
#                 'message': 'تسویه حساب با موفقیت انجام شد.',
#                 'order_details': serializer.data,
#                 'redirect_url': '/customer-dashboard/?tab=my-books' # ✅ این خط را برای هدایت کاربر اضافه کنید
#             },
#             status=status.HTTP_201_CREATED
#         )

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from django.db import transaction
from main.models import (
    ShoppingCart, DiscountCode, DiscountUsage,
    Order, OrderItem, UserLibrary, PurchasedBook
)
from .serializers import OrderSerializer
from main.permissions import IsCustomerRole


class CheckoutView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsCustomerRole]

    @transaction.atomic
    def post(self, request):
        user = request.user

        # 🛒 دریافت سبد خرید
        cart = ShoppingCart.objects.filter(user=user).first()
        if not cart or not cart.items.exists():
            return Response({'error': 'سبد خرید شما خالی است.'},
                            status=status.HTTP_400_BAD_REQUEST)

        # 🎟️ بررسی کد تخفیف
        discount_code = None
        discount_code_str = request.data.get('discount_code')
        if discount_code_str:
            try:
                discount_code = DiscountCode.objects.get(code=discount_code_str, is_active=True)
                if discount_code.is_expired():
                    return Response({'error': 'کد تخفیف منقضی شده است.'},
                                    status=status.HTTP_400_BAD_REQUEST)
                if DiscountUsage.objects.filter(user=user, discount_code=discount_code).exists():
                    return Response({'error': 'شما قبلاً از این کد تخفیف استفاده کرده‌اید.'},
                                    status=status.HTTP_400_BAD_REQUEST)
            except DiscountCode.DoesNotExist:
                return Response({'error': 'کد تخفیف معتبر نیست.'},
                                status=status.HTTP_400_BAD_REQUEST)

        # 📝 ساخت سفارش
        order = Order.objects.create(user=user, discount_code=discount_code)

        # 📚 انتقال کتاب‌ها به کتابخانه کاربر
        for item in cart.items.all():
            OrderItem.objects.create(order=order, book=item.book, quantity=item.quantity)
            UserLibrary.objects.get_or_create(user=user, book=item.book)
            PurchasedBook.objects.get_or_create(customer=user, book=item.book)

        # ثبت استفاده از کد تخفیف
        if discount_code:
            DiscountUsage.objects.create(user=user, discount_code=discount_code)

        # 🗑️ خالی کردن سبد خرید
        cart.items.all().delete()

        serializer = OrderSerializer(order)
        return Response(
            {
                'success': True,
                'message': 'تسویه حساب با موفقیت انجام شد.',
                'order_details': serializer.data,
                'redirect_url': '/customer-dashboard/?tab=my-books'  # ✅ هدایت مستقیم به My Books
            },
            status=status.HTTP_201_CREATED
        )



# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated
# from main.models import UserLibrary
# from .serializers import UserLibrarySerializer

# class MyBooksView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         # گرفتن کتاب‌های کاربر از UserLibrary
#         user_books = UserLibrary.objects.filter(user=request.user).order_by('-added_at')
#         serializer = UserLibrarySerializer(user_books, many=True, context={'request': request})
#         return Response(serializer.data)



# # api/views.py
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from django.shortcuts import get_object_or_404
# from main.models import Book, Comment
# from .serializers import CommentSerializer

# class BookCommentsAPI(APIView):
#     def get(self, request, book_id):
#         book = get_object_or_404(Book, id=book_id)
#         comments = Comment.objects.filter(book=book)
#         serializer = CommentSerializer(comments, many=True)
#         return Response({"success": True, "comments": serializer.data})

#     def post(self, request, book_id):
#         book = get_object_or_404(Book, id=book_id)
#         serializer = CommentSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save(book=book, author=request.user)
#             return Response({"success": True, "id": serializer.instance.id})
#         return Response({"success": False, "message": serializer.errors})

# api/views.py
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from django.shortcuts import get_object_or_404
# from main.models import Book, Comment
# from .serializers import CommentSerializer

# class BookCommentsAPI(APIView):
#     # permission_classes = [IsAuthenticated]
#     permission_classes = [IsAuthenticated]
#     def get(self, request, book_id):
#         book = get_object_or_404(Book, id=book_id)
#         comments = Comment.objects.filter(book=book)
#         serializer = CommentSerializer(comments, many=True)
#         return Response(serializer.data)

#     def post(self, request, book_id):
#         book = get_object_or_404(Book, id=book_id)
#         serializer = CommentSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save(author=request.user, book=book)
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




# class CommentListCreateView(APIView):
#     permission_classes = [IsAuthenticated]  # ← فقط کاربران لاگین می‌توانند GET و POST کنند

#     def get(self, request, book_id):
#         comments = Comment.objects.filter(book_id=book_id)
#         serializer = CommentSerializer(comments, many=True)
#         return Response(serializer.data)

#     def post(self, request, book_id):
#         serializer = CommentSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save(author=request.user, book_id=book_id)
#             return Response(serializer.data, status=201)
#         return Response(serializer.errors, status=400)

class BookAdminViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookAdminApproveSerializer 

    @action(detail=True, methods=['post'])
    def approve_book(self, request, pk=None):
        book = self.get_object()
        if book.status == 'pending':
            book.status = 'approved'
            book.save()
            return Response({'status': 'Book approved successfully'})
        return Response({'status': 'Book is not pending approval'}, status=400)
    

    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_books_api_view(request):
    """
    API endpoint to list books a user has added to their library.
    """
    user_library_items = UserLibrary.objects.filter(user=request.user)
    serializer = UserLibrarySerializer(user_library_items, many=True)
    return Response(serializer.data)
