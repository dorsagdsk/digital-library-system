# main/views.py
from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, HttpResponseForbidden, JsonResponse
from rest_framework.authtoken.models import Token
from django.contrib.auth.decorators import login_required, user_passes_test # Recommended for view security

# Ensure these are imported and exist in main/models.py
from main.models import CustomUser, Book, PurchasedBook, Order

# Make sure api.serializers.AuthorSerializer exists in api/serializers.py
# and main.permissions exists in main/permissions.py
from api.serializers import AuthorSerializer
from main.permissions import IsAdminUserRole, IsAuthorRole, IsCustomerRole

# main/views.py
from django.shortcuts import render, redirect # Make sure redirect is imported
# ... other imports

# main/views.py
from django.shortcuts import render, redirect # Make sure redirect is imported

from django.shortcuts import render


# your_app_name/views.py (یا فایل مشابهی که صفحه add_book.html را رندر می‌کند)
from django.shortcuts import render
from django.contrib.auth.decorators import login_required, user_passes_test
# your_app_name/views.py

from django.shortcuts import render
from django.contrib.auth.decorators import login_required, user_passes_test
# main/views.py

from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, JsonResponse
from rest_framework.authtoken.models import Token
from django.contrib.auth.decorators import login_required, user_passes_test
from django.db.models import Avg

from main.models import CustomUser, Book, PurchasedBook, Order, Genre
from api.serializers import AuthorSerializer, BookAdminCreateSerializer 

from django.shortcuts import render
from .models import Book


from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from .models import Book, Order, UserLibrary

from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from .models import Book, ShoppingCart
from django.views.decorators.http import require_POST

from django.shortcuts import render
# main/views.py
from django.shortcuts import render
from django.contrib.auth.decorators import login_required


from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from django.db import transaction
from decimal import Decimal
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import PasswordChangeForm 

# فرض کنید مدل های شما در main.models هستند.
from main.models import Book, Order, OrderItem, ShoppingCart, CartItem, UserLibrary, Genre, DiscountCode # Removed PurchasedBook as per your UserLibrary preference
# from serializers import OrderItemSerializer, BookMiniSerializer, CartSerializer, OrderSerializer

from django.shortcuts import render, get_object_or_404
from .models import Book  # Assuming you have a Book model

from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
import json
from django.utils import timezone
from .models import Book, CustomUser, ShoppingCart, CartItem, Order, OrderItem, DiscountCode
# main/views.py
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import ShoppingCart, CartItem # مطمئن شوید این مدل‌ها import شده‌اند



from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.db import transaction
from .models import ShoppingCart, CartItem, Order, OrderItem, UserLibrary

# در customer/views.py
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.db import transaction
from main.models import ShoppingCart, Order, OrderItem, UserLibrary # Import the models from your main app

# main/views.py

from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Book, Rating, UserLibrary
from django.shortcuts import get_object_or_404
from django.db import IntegrityError


# main/views.py
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db import transaction
from .models import ShoppingCart, CartItem, UserLibrary, Order, OrderItem


# main/views.py

from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import Book, Order


# main/views.py
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
# main/views.py
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import ShoppingCart, CartItem  # از ShoppingCart به جای Cart استفاده کنید

# main/views.py
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import ShoppingCart, CartItem, DiscountCode, Order, OrderItem, UserLibrary
# ... سایر importهای شما

# main/views.py
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db import transaction
from django.db.models import F # Import F for F-expressions
from .models import ShoppingCart, CartItem, Order, OrderItem, UserLibrary, DiscountCode, Book




# ... کدهای import و توابع کمکی clean_text در اینجا ...

# مسیرهای فایل‌های مدل
# این مسیرها باید با ساختار پروژه شما مطابقت داشته باشند
import os
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import joblib

from django.http import JsonResponse
from django.views.decorators.http import require_POST
import joblib
import os

# در فایل api/views.py
import os
from django.conf import settings


from django.shortcuts import render, redirect
from django.contrib import messages
from .models import ShoppingCart, CartItem, Order, OrderItem, UserLibrary
from django.db import transaction


# your_app_name/views.py

from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from main.models import UserLibrary, Rating, Book # Import your models
from django.db.models import Prefetch

# main/views.py

# ... import های موجود در فایل views.py شما
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import UserLibrary
# my_app/views.py
from django.shortcuts import render
from django.contrib.auth.decorators import login_required

from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from django.db.models import F
from django.utils import timezone
import json
from .models import ShoppingCart, DiscountCode  # مطمئن شوید که مدل‌های صحیح را import کرده‌اید





def author_login_page(request):
    return render(request, 'author/login.html')

@login_required(login_url='/author/login/')
def author_dashboard(request):
    # شما می‌توانید داده‌های مورد نیاز را به تمپلیت پاس دهید
    return render(request, 'author/author-dashboard.html')
    
@login_required(login_url='/author/login/')
def upload_book_page(request):
    return render(request, 'author/upload-book.html')

@login_required
def my_books_api_view(request):
    """
    Returns a list of books owned by the current user in JSON format.
    """
    my_books = UserLibrary.objects.filter(user=request.user).select_related('book').order_by('-added_at')
    
    books_data = []
    for ul_item in my_books:
        book_info = {
            'id': ul_item.book.id,
            'title': ul_item.book.title,
            'author': ul_item.book.author.username,
            'cover_image': ul_item.book.cover_image.url if ul_item.book.cover_image else '',
            'full_file': ul_item.book.full_file.url if ul_item.book.full_file else '',
            'added_at': ul_item.added_at.isoformat(),
        }
        books_data.append(book_info)
    
    return JsonResponse(books_data, safe=False)



@login_required
def customer_dashboard(request):
    """
    Renders the customer dashboard with user's library, order history, and all books.
    This view also injects the user's rating for each book in their library.
    """
    
    # Efficiently fetch UserLibrary items and prefetch the related books
    # Also prefetch the user's ratings for the books in their library
    library_items_with_ratings = UserLibrary.objects.filter(
        user=request.user
    ).select_related('book').prefetch_related(
        Prefetch(
            'book__ratings',
            queryset=Rating.objects.filter(user=request.user),
            to_attr='user_rating'
        )
    )

    # Process the library items to add the rating value to each object
    my_books = []
    for item in library_items_with_ratings:
        # Check if the prefetched user_rating list is not empty
        if item.book.user_rating:
            # The rating object is the first and only item in the list
            item.rating = item.book.user_rating[0].rating
        else:
            item.rating = None
        my_books.append(item)
    
    # You can also fetch other data here if needed for other tabs
    all_books = Book.objects.filter(status='approved')
    
    context = {
        'my_books': my_books,
        'all_books': all_books,
        # ... other context variables for order history, etc.
    }
    return render(request, 'customer_dashboard.html', context)



# مسیرهای فایل‌های مدل
MODEL_PATH = os.path.join(settings.BASE_DIR, 'main', 'models', 'book_genre_model.pkl')
TFIDF_PATH = os.path.join(settings.BASE_DIR, 'main', 'models', 'tfidf_vectorizer.pkl')
MLB_PATH = os.path.join(settings.BASE_DIR, 'main', 'models', 'label_binarizer.pkl')

try:
    model_loaded = joblib.load(MODEL_PATH)
    tfidf_loaded = joblib.load(TFIDF_PATH)
    mlb_loaded = joblib.load(MLB_PATH)
    print("مدل و ابزارها با موفقیت بارگذاری شدند.")
except FileNotFoundError:
    print("خطا: یکی از فایل‌های مدل یافت نشد. مسیرها را بررسی کنید.")
    model_loaded, tfidf_loaded, mlb_loaded = None, None, None

@csrf_exempt
def predict_genre(request):
    # منطق API اینجا
    # ...
    if request.method == 'POST':
        if not all([model_loaded, tfidf_loaded, mlb_loaded]):
            return JsonResponse({'error': 'Model files not loaded.'}, status=500)

        try:
            data = json.loads(request.body)
            summary = data.get('summary', '')

            if not summary or not isinstance(summary, str):
                return JsonResponse({'error': 'Invalid summary provided.'}, status=400)
            
            # پیش‌پردازش و پیش‌بینی
            clean_summary = clean_text(summary)
            vec = tfidf_loaded.transform([clean_summary])

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

# ... سایر کدهای موجود در views.py


@login_required
def purchase_cart(request):
    """
    Handles the direct purchase of all items in the cart by creating an Order
    and adding the books to the user's library.
    """
    user = request.user
    cart = get_object_or_404(ShoppingCart, user=user)
    cart_items = cart.items.all()

    if not cart_items:
        messages.warning(request, "سبد خرید شما خالی است.")
        return redirect('view_cart')

    # A simple transaction to ensure all or none of the changes are saved
    try:
        with transaction.atomic():
            # Create a new Order for the user. We will calculate the total later.
            new_order = Order.objects.create(
                user=user,
                discount_code=cart.applied_discount,
            )

            # Move items from the cart to the new order and add to the user's library
            for item in cart_items:
                # Add the book to the user's library (UserLibrary model)
                UserLibrary.objects.create(
                    user=user,
                    book=item.book,
                )

                # Create an OrderItem to record the purchase details
                OrderItem.objects.create(
                    order=new_order,
                    book=item.book,
                    quantity=item.quantity,
                )

                # Decrease the book's stock.
                Book.objects.filter(pk=item.book.pk).update(stock=F('stock') - item.quantity)

                item.delete() # Remove the item from the cart

            # Recalculate the cart total now to apply the discount.
            # Your Order model has a total_price method, so the logic is already there.

            # Clear the discount from the cart
            cart.applied_discount = None
            cart.save()
        
        messages.success(request, "خرید شما با موفقیت انجام شد! کتاب‌ها به کتابخانه شما اضافه شدند.")
        
        # Redirect the user to their dashboard or 'my books' section
        return redirect('customer_dashboard')
    
    except Exception as e:
        messages.error(request, f"An unexpected error occurred during your purchase: {e}")
        return redirect('view_cart')



@login_required
def view_cart(request):
    """
    نمایش محتویات سبد خرید کاربر.
    """
    try:
        cart = ShoppingCart.objects.get(user=request.user)
    except ShoppingCart.DoesNotExist:
        cart = ShoppingCart.objects.create(user=request.user)
        
    cart_items = cart.items.select_related('book').all()
    
    # محاسبه قیمت کل سبد خرید با استفاده از متد total_price در مدل ShoppingCart
    total_price = cart.total_price()
    
    context = {
        'cart': cart,
        'cart_items': cart_items,
        'total_price': total_price,
    }
    
    return render(request, 'cart.html', context)

@login_required
def my_books(request):
    # This view will get all the books purchased by the logged-in user
    user_orders = Order.objects.filter(customer=request.user, is_paid=True)
    purchased_books = []
    for order in user_orders:
        for item in order.orderitem_set.all():
            purchased_books.append(item.book)
    context = {'purchased_books': purchased_books}
    return render(request, 'my_books.html', context)

@login_required
def checkout(request):
    try:
        cart = ShoppingCart.objects.get(user=request.user)
    except ShoppingCart.DoesNotExist:
        messages.error(request, 'Your cart is empty.')
        return redirect('view_cart')

    cart_items = cart.items.all()
    if not cart_items:
        messages.error(request, 'Your cart is empty.')
        return redirect('view_cart')
    
    with transaction.atomic():
        # Create a new order
        order = Order.objects.create(user=request.user)
        
        # Move items from cart to user's library and order items
        for cart_item in cart_items:
            # Add book to user's library if not already there
            UserLibrary.objects.get_or_create(user=request.user, book=cart_item.book)
            
            # Add book to the order
            OrderItem.objects.create(
                order=order,
                book=cart_item.book,
                quantity=cart_item.quantity
            )
            
        # Clear the shopping cart
        cart_items.delete()

    messages.success(request, 'Payment successful! Your books have been added to your library.')
    # Redirect to the customer dashboard, specifically to the 'My Books' tab
    return redirect('customer_dashboard')

@csrf_exempt
@require_POST
def rate_book(request, book_id):
    """
    Handles rating submissions for a specific book.
    """
    # Check if the user is authenticated
    if not request.user.is_authenticated:
        return JsonResponse({'success': False, 'message': 'You must be logged in to rate a book.'}, status=401)
    
    # Check if the request body is valid JSON
    try:
        data = json.loads(request.body.decode('utf-8'))
        score = data.get('score')
    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'message': 'Invalid JSON data.'}, status=400)
    
    # Check for valid score
    if not score or not (1 <= int(score) <= 5):
        return JsonResponse({'success': False, 'message': 'Invalid score. Score must be between 1 and 5.'}, status=400)
        
    # Get the book object
    book = get_object_or_404(Book, pk=book_id)
    
    # Check if the user has this book in their library
    if not UserLibrary.objects.filter(user=request.user, book=book).exists():
        return JsonResponse({'success': False, 'message': 'You can only rate books in your library.'}, status=403)
        
    try:
        # Create or update the rating
        rating, created = Rating.objects.update_or_create(
            user=request.user,
            book=book,
            defaults={'rating': int(score)}
        )
        
        # Manually trigger average rating update on the book
        book.update_average_rating()
        
        if created:
            message = 'Thank you for your rating!'
        else:
            message = 'Your rating has been updated!'
        
        return JsonResponse({'success': True, 'message': message}, status=200)

    except IntegrityError:
        return JsonResponse({'success': False, 'message': 'You have already rated this book.'}, status=409)
    except Exception as e:
        return JsonResponse({'success': False, 'message': f'An unexpected error occurred: {e}'}, status=500)



# @login_required
# def checkout(request):
#     if request.method == 'POST':
#         # استفاده از transaction.atomic برای اطمینان از اجرای کامل یا عدم اجرای هیچ بخشی از فرآیند
#         with transaction.atomic():
#             try:
#                 # 1. پیدا کردن سبد خرید کاربر فعلی
#                 cart = ShoppingCart.objects.get(user=request.user)
#                 cart_items = cart.items.all()

#                 if not cart_items:
#                     messages.error(request, "سبد خرید شما خالی است. لطفا قبل از پرداخت، کتابی را به آن اضافه کنید.")
#                     return redirect('view_cart')

#                 # 2. ایجاد یک سفارش جدید (Order)
#                 # از متد total_price در مدل ShoppingCart برای محاسبه قیمت کل استفاده می‌کنیم
#                 total_price_with_discount = cart.total_price() 
                
#                 # برای کد تخفیف، می‌توانید آن را از سشن یا یک فیلد مخفی در فرم دریافت کنید
#                 discount_code = request.session.get('applied_discount_code')
#                 discount = None
#                 if discount_code:
#                     discount = DiscountCode.objects.get(code=discount_code)

#                 order = Order.objects.create(
#                     user=request.user,
#                     discount_code=discount
#                 )

#                 # 3. ایجاد OrderItem و اضافه کردن کتاب‌ها به کتابخانه کاربر
#                 for cart_item in cart_items:
#                     book = cart_item.book

#                     # ایجاد OrderItem برای ثبت جزئیات سفارش
#                     OrderItem.objects.create(
#                         order=order,
#                         book=book,
#                         quantity=cart_item.quantity
#                     )

#                     # اضافه کردن کتاب به کتابخانه کاربر (My Books)
#                     # از متد get_or_create برای جلوگیری از تکرار استفاده می‌کنیم
#                     UserLibrary.objects.get_or_create(user=request.user, book=book)

#                 # 4. خالی کردن سبد خرید
#                 cart.items.all().delete()
#                 # حذف کد تخفیف از سشن
#                 if 'applied_discount_code' in request.session:
#                     del request.session['applied_discount_code']
                
#                 messages.success(request, "پرداخت با موفقیت انجام شد! کتاب‌های شما به بخش «کتاب‌های من» اضافه شدند.")

#                 # 5. ریدایرکت به بخش "My Books" در داشبورد
#                 # از پارامتر query string برای فعال کردن تب مورد نظر استفاده می‌کنیم
#                 return redirect('customer_dashboard')
            
#             except ShoppingCart.DoesNotExist:
#                 messages.error(request, "سبد خرید شما پیدا نشد.")
#                 return redirect('view_cart')

#             except Exception as e:
#                 # در صورت بروز هرگونه خطای غیرمنتظره، آن را گزارش می‌دهیم
#                 messages.error(request, f"خطایی در هنگام پرداخت رخ داد: {e}")
#                 return redirect('view_cart')

#     # اگر درخواست از نوع POST نباشد، کاربر را به صفحه سبد خرید برمی‌گردانیم
#     messages.error(request, "درخواست نامعتبر.")
#     return redirect('view_cart')

@login_required
@csrf_exempt
@require_POST
def apply_discount_view(request):
    try:
        data = json.loads(request.body)
        code = data.get('code')
        
        if not code:
            return JsonResponse({'success': False, 'message': 'Discount code is required.'}, status=400)

        try:
            discount = DiscountCode.objects.get(code=code, is_active=True, expiration_date__gt=timezone.now())
        except DiscountCode.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Invalid or expired discount code.'}, status=400)

        user = request.user
        cart, created = ShoppingCart.objects.get_or_create(user=user)
        
        subtotal = cart.get_cart_total()
        discount_amount = (subtotal * discount.percentage) / 100
        
        cart.applied_discount = discount
        cart.save()
        
        return JsonResponse({
            'success': True,
            'message': f'Discount of {discount.percentage}% applied successfully!',
            'discount_amount': discount_amount,
            'new_total': subtotal - discount_amount
        })

    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'message': 'Invalid JSON data.'}, status=400)
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)

# ... your other view functions (e.g., customer_dashboard, add_to_cart, etc.)

def book_detail(request, book_id):
    book = get_object_or_404(Book, pk=book_id)
    context = {
        'book': book
    }
    return render(request, 'book_detail.html', context)

CustomUser = get_user_model()


@login_required
def customer_dashboard(request):
    user = request.user
    
    # برای "My Books": کتاب‌هایی که کاربر در UserLibrary خود دارد
    # Note: If a user buys a book, you'll need to add it to UserLibrary in the checkout process.
    my_books = UserLibrary.objects.filter(user=user).select_related('book', 'book__author')
    
    # برای "Order History": تمام سفارشات کاربر
    orders = Order.objects.filter(user=user).order_by('-created_at')

    # برای "Browse Books": تمام کتاب‌های تایید شده
    all_books = Book.objects.filter(status='approved') # Only show approved books for Browse

    context = {
        'user': user,
        'my_books': my_books, # Changed to my_books for UserLibrary
        'orders': orders,
        'all_books': all_books,
    }
    return render(request, 'customer_dashboard.html', context)


@login_required
def update_profile(request):
    if request.method == 'POST':
        user = request.user
        full_name = request.POST.get('full_name')
        contact_number = request.POST.get('contact_number')

        # Update first_name and last_name from full_name
        name_parts = full_name.split(' ', 1)
        user.first_name = name_parts[0] if name_parts else ''
        user.last_name = name_parts[1] if len(name_parts) > 1 else ''

        # Update contact_number
        user.contact_number = contact_number

        try:
            user.save()
            messages.success(request, 'Your profile has been updated successfully!')
        except Exception as e:
            messages.error(request, f'Error updating profile: {e}')
        
        return redirect('customer_dashboard')
    messages.error(request, 'Invalid request method for profile update.')
    return redirect('customer_dashboard')


@login_required
def change_password(request):
    if request.method == 'POST':
        form = PasswordChangeForm(request.user, request.POST)
        if form.is_valid():
            user = form.save()
            from django.contrib.auth import update_session_auth_hash
            update_session_auth_hash(request, user)
            messages.success(request, 'Your password was successfully updated!')
            return redirect('customer_dashboard')
        else:
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f"Password change error in {field}: {error}")
    return redirect('customer_dashboard')


@login_required
def order_details_api(request, order_id):
    order = get_object_or_404(Order, id=order_id, user=request.user)
    
    # Using the serializer to format the output for Order items
    order_serializer = OrderSerializer(order, context={'request': request})
    
    return JsonResponse(order_serializer.data)


# --- Views برای سبد خرید ---

@login_required
def add_to_cart(request):
    if request.method == 'POST':
        book_id = request.POST.get('book_id')
        quantity = int(request.POST.get('quantity', 1))

        if not book_id:
            return JsonResponse({'success': False, 'message': 'Book ID is required.'}, status=400)

        try:
            book = get_object_or_404(Book, id=book_id, status='approved') # Ensure only approved books can be added
            cart, created = ShoppingCart.objects.get_or_create(user=request.user)

            cart_item, item_created = CartItem.objects.get_or_create(cart=cart, book=book)
            if not item_created:
                cart_item.quantity += quantity
            cart_item.save()

            messages.success(request, f"'{book.title}' added to your cart!")
            return JsonResponse({'success': True, 'message': 'Book added to cart.'})
        except Book.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Book not found or not approved.'}, status=404)
        except Exception as e:
            messages.error(request, f"Error adding to cart: {e}")
            return JsonResponse({'success': False, 'message': str(e)}, status=400)
    return JsonResponse({'success': False, 'message': 'Invalid request method.'}, status=405)


@login_required
def view_cart(request):
    cart, created = ShoppingCart.objects.get_or_create(user=request.user)
    cart_items = cart.items.select_related('book').all()
    total_price = cart.total_price() # Call the method from ShoppingCart model

    context = {
        'cart_items': cart_items,
        'total_price': total_price,
    }
    return render(request, 'cart.html', context)


@login_required
def remove_from_cart(request, item_id):
    cart_item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)
    book_title = cart_item.book.title
    cart_item.delete()
    messages.info(request, f"'{book_title}' has been removed from your cart.")
    return redirect('view_cart')


@login_required
@transaction.atomic # تضمین می کند که همه عملیات یا انجام می شوند یا هیچ کدام
def checkout(request):
    cart = get_object_or_404(ShoppingCart, user=request.user)
    cart_items = cart.items.all()

    if not cart_items:
        messages.warning(request, "Your cart is empty. Please add books before checking out.")
        return redirect('view_cart')

    # Calculate total price for the order, considering potential discounts
    # Since Order.total_price is a method, we don't need to save it as a field here.
    # The method will calculate it on demand.
    # If you intend to use discount codes, apply the discount to the 'total' value
    # before creating the order and pass the discount code object.
    # For now, let's assume no discount is applied directly via this form.
    # If you have a discount code in the session or passed via form, apply it here.
    # discount_code_obj = None
    # if 'discount_code_id' in request.session:
    #     try:
    #         discount_code_obj = DiscountCode.objects.get(id=request.session['discount_code_id'])
    #         if discount_code_obj.is_expired() or not discount_code_obj.is_active:
    #             discount_code_obj = None # Don't apply expired/inactive discounts
    #     except DiscountCode.DoesNotExist:
    #         discount_code_obj = None

    try:
        # 1. ایجاد یک سفارش جدید
        order = Order.objects.create(
            user=request.user,
            # total_price is a method in the Order model, so we don't assign it here.
            # status is not in your original Order model, so omitting it.
            # discount_code=discount_code_obj # Assign discount object if used
        )

        # 2. انتقال آیتم های سبد خرید به آیتم های سفارش و اضافه کردن به UserLibrary
        for cart_item in cart_items:
            OrderItem.objects.create(
                order=order,
                book=cart_item.book,
                quantity=cart_item.quantity,
                # The OrderItem.total_price is also a method, it derives from book.price.
                # No need to store 'price' directly in OrderItem based on your original model.
            )
            # Add the book to the user's library (UserLibrary model)
            UserLibrary.objects.get_or_create(
                user=request.user,
                book=cart_item.book
            )
        
        # 3. خالی کردن سبد خرید
        cart_items.delete() # حذف همه آیتم های سبد خرید

        messages.success(request, f"Order #{order.id} placed successfully! You can now download your books from 'My Books'.")
        return redirect('customer_dashboard') # Redirect to dashboard after checkout

    except Exception as e:
        messages.error(request, f"An error occurred during checkout: {e}")
        # Consider logging the full traceback here for debugging
        return redirect('view_cart')

@login_required
def change_password_view(request):
    # منطق تغییر رمز کاربر را اینجا قرار دهید
    return render(request, 'change_password.html')

def update_profile(request):
    # منطق و رندر فرم بروزرسانی پروفایل
    return render(request, 'update_profile.html')


@login_required
def customer_dashboard(request):
    query = request.GET.get('q', '')
    if query:
        books = Book.objects.filter(title__icontains=query)
    else:
        books = Book.objects.all()

    purchased_books = request.user.userlibrary.books.all()
    cart, _ = ShoppingCart.objects.get_or_create(user=request.user)
    cart_items = cart.items.select_related('book')
    total_price = sum(item.book.price for item in cart_items)

    return render(request, 'customer_dashboard.html', {
        'books': books,
        'purchased_books': purchased_books,
        'cart_items': cart_items,
        'total_price': total_price,
        'user': request.user,
        'query': query,
    })


@require_POST
@login_required
def checkout(request):
    cart = ShoppingCart.objects.get(user=request.user)
    items = cart.items.select_related('book')
    books_bought = []

    for item in items:
        request.user.userlibrary.books.add(item.book)
        books_bought.append(item.book)

    cart.items.all().delete()

    send_order_confirmation(request.user, books_bought)

    return redirect('customer_dashboard')


# ایمیل تایید سفارش
from django.core.mail import send_mail
from django.template.loader import render_to_string

def send_order_confirmation(user, books):
    subject = '✅ Your Book Order Confirmation'
    message = render_to_string('email/order_confirmation.html', {
        'user': user,
        'books': books,
    })
    send_mail(subject, message, None, [user.email])


@login_required
def customer_dashboard(request):
    user = request.user

    if user.role != 'customer':
        return redirect('home')  # یا یه صفحه 403

    # کتاب‌هایی که خریده
    purchased_books = UserLibrary.objects.filter(user=user)

    # سفارش‌ها
    orders = Order.objects.filter(user=user).order_by('-created_at')

    # همه‌ی کتاب‌ها برای بخش browse
    all_books = Book.objects.all().order_by('-created_at')

    context = {
        'user': user,
        'purchased_books': purchased_books,
        'orders': orders,
        'all_books': all_books,
    }

    return render(request, 'main/customer_dashboard.html', context)


def homepage_view(request):
    books = Book.objects.filter(status='approved', show_on_homepage=True).order_by('-publication_date')
    return render(request, 'index.html', {'books': books})


def is_admin_or_staff(user):
    return user.is_authenticated and (user.is_staff or user.is_superuser)

def is_admin_role(user):
    return user.is_authenticated and user.role == 'admin'

def is_customer_role(user):
    return user.is_authenticated and user.role == 'customer'

def is_author_role(user):
    return user.is_authenticated and user.role == 'author'



@login_required
@user_passes_test(is_admin_role)
def manage_discount_codes_page(request): # تابع جدید برای مدیریت کد تخفیف
    return render(request, 'manage_discount_codes.html')

def is_admin_or_staff(user):
    return user.is_authenticated and (user.is_staff or user.is_superuser)

@login_required
@user_passes_test(is_admin_or_staff)
def add_book_page(request):
    return render(request, 'add_book.html')

def manage_users(request):
    return render(request, 'manage_users.html')

def manage_authors(request):
    return render(request, 'manage_authors.html')

def manage_books(request):
    return render(request, 'manage_books.html')

def add_author(request):
    return render(request, 'add_author.html')

def add_book(request):
    return render(request, 'add_book.html')

def admin_dashboard(request):
    return render(request, 'admin_dashboard.html')

def add_discount_code(request):
    return render(request, 'add_discount_code.html')

def view_orders(request):
    return render(request, 'view_orders.html')

def view_statistics(request):
    return render(request, 'view_statistics.html')

# You'll also need views for add-book, add-author, manage-books, manage-authors, manage-users
# For example:
# def add_book(request):
#     return render(request, 'add_book.html')
# def manage_books(request):
#     return render(request, 'manage_books.html')
# ... and so on
# ... other imports

def login_view(request):
    # In a real app, you'd handle POST requests here for actual login.
    # For now, simply rendering the template will stop the 404.
    return render(request, 'login.html')

# ... other views

# ... other views


# --- Start of token generation block for testing (Optional - remove for production) ---
# You can uncomment and use this block if you need to quickly generate a token for a user
# for testing purposes. Remember to create the user first using 'python manage.py createsuperuser'
# or ensure the username specified exists in your database.
"""
try:
    user_for_token = CustomUser.objects.get(username='your_test_username') # <<< CHANGE THIS TO AN ACTUAL USERNAME
    token, created = Token.objects.get_or_create(user=user_for_token)
    if created:
        print(f"New token created for {user_for_token.username}: {token.key}")
    else:
        print(f"Token already exists for {user_for_token.username}: {token.key}")
except CustomUser.DoesNotExist:
    print("User 'your_test_username' does not exist. Please create the user first (e.g., 'python manage.py createsuperuser') or update the username in main/views.py.")
except Exception as e:
    print(f"An unexpected error occurred during token setup: {e}")
"""
# --- End of token generation block ---


def index(request):
    token_key = request.COOKIES.get('auth_token')
    if token_key:
        try:
            token = Token.objects.get(key=token_key)
            user = token.user

            if not user.is_active:
                response = render(request, 'index.html')
                response.delete_cookie('auth_token')
                return response

            if user.role == 'admin':
                return redirect('admin_dashboard') # Redirect to named URL
            elif user.role == 'customer':
                return redirect('customer-dashboard') # Redirect to named URL
            elif user.role == 'author':
                return redirect('author-dashboard') # Redirect to named URL

        except Token.DoesNotExist:
            print(f"Warning: Token with key '{token_key}' not found. Clearing cookie and rendering public index.")
            response = render(request, 'index.html')
            response.delete_cookie('auth_token')
            return response
        except Exception as e:
            print(f"An unexpected error occurred in index view: {e}. Clearing cookie and rendering public index.")
            response = render(request, 'index.html')
            response.delete_cookie('auth_token')
            return response

    return render(request, 'index.html')


def login_view(request):
    return render(request, 'login.html')

def register_view(request):
    return render(request, 'register_customer.html')

# Use user_passes_test decorator for role-based access control
def is_admin(user):
    return user.is_authenticated and user.role == 'admin'

def is_customer(user):
    return user.is_authenticated and user.role == 'customer'

def is_author(user):
    return user.is_authenticated and user.role == 'author'

@login_required
@user_passes_test(is_admin)
def admin_dashboard_view(request):
    # This view now ensures the user is logged in and is an admin
    # You might fetch admin-specific data here
    return render(request, 'admin_dashboard.html')

@login_required
@user_passes_test(is_customer)
def customer_dashboard_view(request):
    # This view now ensures the user is logged in and is a customer
    user = request.user
    purchased_books = PurchasedBook.objects.filter(customer=user).select_related('book', 'book__author')
    orders = Order.objects.filter(user=user).order_by('-created_at')
    all_books = Book.objects.all().select_related('author')

    return render(request, 'customer-dashboard.html', {
        'user': user,
        'purchased_books': purchased_books,
        'orders': orders,
        'all_books': all_books,
    })

@login_required
@user_passes_test(is_author)
def author_dashboard_view(request):
    # This view now ensures the user is logged in and is an author
    return render(request, 'author_dashboard.html')

@login_required
@user_passes_test(is_admin)
def manage_authors_view(request):
    # This view ensures the user is logged in and is an admin
    return render(request, 'manage_authors.html') # Assuming this dashboard displays author management options

@login_required
@user_passes_test(is_admin)
def edit_author_view(request, pk):
    # This view ensures the user is logged in and is an admin
    author = get_object_or_404(CustomUser, pk=pk, role='author')
    serializer = AuthorSerializer(author) # Ensure AuthorSerializer is correctly defined
    return render(request, 'edit_author.html', {'authorData': serializer.data})

# @login_required
# def view_cart(request):
#     cart, created = ShoppingCart.objects.get_or_create(user=request.user)
#     cart_items = cart.items.select_related('book').all()
    
#     # Pass the full 'cart' object to the template
#     context = {
#         'cart': cart,
#         'cart_items': cart_items,
#     }
#     return render(request, 'cart.html', context)
# # main/views.py

# main/views.py

# ... other imports

@login_required
@csrf_exempt
@require_POST
def apply_discount_view(request):
    # ... (code to get discount object and cart)

    cart.applied_discount = discount
    cart.save()

    new_total = cart.total_price() # Get the new total after applying the discount

    return JsonResponse({
        'success': True,
        'message': f'Discount of {discount.percentage}% applied successfully!',
        'new_total': new_total
    })
    # ... (error handling)

@login_required
def view_cart(request):
    """
    نمایش محتویات سبد خرید کاربر.
    """
    try:
        cart = ShoppingCart.objects.get(user=request.user)
    except ShoppingCart.DoesNotExist:
        cart = ShoppingCart.objects.create(user=request.user)
        
    cart_items = cart.items.select_related('book').all()
    
    # محاسبه قیمت کل سبد خرید با استفاده از متد total_price در مدل ShoppingCart
    total_price = cart.total_price()
    
    context = {
        'cart': cart,
        'cart_items': cart_items,
        'total_price': total_price,
    }
    
    return render(request, 'cart.html', context)   



@login_required
@csrf_exempt
@require_POST
def apply_discount_view(request):
    try:
        data = json.loads(request.body)
        code = data.get('code')
        
        if not code:
            return JsonResponse({'success': False, 'message': 'Discount code is required.'}, status=400)
        
        # Initialize discount variable
        discount = None
        
        try:
            # Assign the fetched object to the discount variable
            discount = DiscountCode.objects.get(code=code, is_active=True, expiration_date__gt=timezone.now())
        except DiscountCode.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Invalid or expired discount code.'}, status=400)

        user = request.user
        cart, created = ShoppingCart.objects.get_or_create(user=user)
        
        # This line is now safe because 'discount' is guaranteed to be a DiscountCode object
        cart.applied_discount = discount
        cart.save()
        
        # You'll need to define a total_price method on your ShoppingCart model for this to work
        new_total = cart.total_price()
        
        return JsonResponse({
            'success': True,
            'message': f'Discount of {discount.percentage}% applied successfully!',
            'new_total': new_total
        })

    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'message': 'Invalid JSON data.'}, status=400)
    except Exception as e:
        return JsonResponse({'success': False, 'message': f'An unexpected error occurred: {e}'}, status=500)
    





@login_required
@require_POST
def checkout_view(request):
    """
    Handles the checkout process for the user's shopping cart.
    """
    user = request.user
    cart = get_object_or_404(ShoppingCart, user=user)
    cart_items = cart.items.all()

    if not cart_items:
        # Redirect if the cart is empty
        return redirect('view_cart')

    # Add your actual checkout logic here.
    # This might involve creating an Order, processing payment, and clearing the cart.

    # For now, we'll redirect to a placeholder success page.
    return redirect('order_success')



# مسیر کامل مدل هوش مصنوعی خود را مشخص کنید
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'path/to/your/ai_model.joblib')

# مدل را در زمان شروع سرور بارگذاری کنید تا در هر درخواست مجدداً بارگذاری نشود
try:
    model = joblib.load(MODEL_PATH)
except FileNotFoundError:
    print("WARNING: AI model file not found. AI recommendations will not work.")
    model = None

@require_POST
def ai_recommendation(request):
    if not model:
        return JsonResponse({'success': False, 'message': 'AI model is not available.'}, status=500)

    summary = request.POST.get('summary', '')
    if not summary:
        return JsonResponse({'success': False, 'message': 'Summary is required.'}, status=400)

    # در اینجا منطق پیش‌بینی با مدل خود را قرار دهید
    # این یک مثال است، شما باید آن را با کد واقعی خود جایگزین کنید
    try:
        # این خط را با منطق مدل خود جایگزین کنید
        predictions = model.predict([summary])
        # این خط را با تبدیل خروجی مدل به فرمت قابل خواندن جایگزین کنید
        genres = [f"Predicted Genre {i+1}" for i in range(3)] 

        return JsonResponse({'success': True, 'genres': genres})
    except Exception as e:
        return JsonResponse({'success': False, 'message': f'An error occurred: {str(e)}'}, status=500)
    

# این ویو برای نهایی کردن خرید و انتقال کتاب به my books است
def checkout(request):
    if request.method == 'POST':
        user = request.user
        
        try:
            # از یک تراکنش (transaction) برای اطمینان از انجام صحیح همه عملیات استفاده می‌کنیم
            with transaction.atomic():
                # مرحله 1: سبد خرید کاربر را پیدا کنید
                cart = Cart.objects.get(user=user)
                cart_items = CartItem.objects.filter(cart=cart)
                
                if not cart_items.exists():
                    messages.error(request, "Your cart is empty.")
                    return redirect('view_cart')

                # مرحله 2: ایجاد یک سفارش جدید (Order)
                total_price = sum(item.book.price for item in cart_items)
                order = Order.objects.create(user=user, total_price=total_price)

                # مرحله 3: انتقال آیتم‌های سبد خرید به تاریخچه سفارشات و به "My Books"
                for item in cart_items:
                    # ایجاد یک ردیف در تاریخچه سفارشات
                    OrderItem.objects.create(order=order, book=item.book, price=item.book.price)
                    
                    # اضافه کردن کتاب به مجموعه کتاب‌های کاربر (My Books)
                    # اگر کتاب قبلاً اضافه نشده، آن را اضافه کن
                    UserBook.objects.get_or_create(user=user, book=item.book)

                # مرحله 4: پاک کردن سبد خرید پس از اتمام موفقیت‌آمیز عملیات
                cart_items.delete()

                messages.success(request, 'Your purchase was successful! You can now access your books.')
                
                # 🚨 مرحله نهایی: ریدایرکت کاربر به صفحه "My Books"
                return redirect('my_books') # به نام URL مربوط به ویو my_books ریدایرکت می‌شود

        except Cart.DoesNotExist:
            messages.error(request, 'An error occurred. Your cart could not be found.')
            return redirect('view_cart')

    # اگر درخواست POST نبود، به صفحه سبد خرید برگردانید
    return redirect('view_cart')

# این ویو مسئول نمایش کتاب‌های خریداری‌شده است
def my_books(request):
    my_books_list = UserBook.objects.filter(user=request.user).select_related('book')
    context = {'my_books': my_books_list}
    return render(request, 'customer_dashboard.html', context) # یا هر تمپلت دیگری که my books در آن نمایش داده می‌شود



@login_required
def update_profile(request):
    """
    Handles the profile update form submission.
    """
    if request.method == 'POST':
        user = request.user
        full_name = request.POST.get('full_name')
        contact_number = request.POST.get('contact_number')

        try:
            # Update the user's full name
            if full_name:
                name_parts = full_name.split(' ', 1)
                user.first_name = name_parts[0]
                if len(name_parts) > 1:
                    user.last_name = name_parts[1]
                else:
                    user.last_name = ''

            # Update the contact number (assuming it's a custom field)
            if hasattr(user, 'contact_number'):
                user.contact_number = contact_number

            user.save()

            messages.success(request, 'Your profile was updated successfully!')
            
            # This is the corrected line. We build the full URL as a single string.
            return redirect('/customer-dashboard/?tab=profile')

        except Exception as e:
            messages.error(request, f'An error occurred: {e}')
            return redirect('/customer-dashboard/?tab=profile')

    return render(request, 'customer_dashboard.html', {})


@login_required
@require_POST
def apply_discount_view(request):
    """
    Handles the application of a discount code via AJAX.
    """
    try:
        data = json.loads(request.body)
        code = data.get('code')
        
        if not code:
            return JsonResponse({'success': False, 'message': 'لطفاً کد تخفیف را وارد کنید.'}, status=400)

        # 1. اعتبارسنجی کد تخفیف
        # بررسی می‌کنیم که کد وجود داشته باشد، فعال باشد و منقضی نشده باشد.
        try:
            discount = DiscountCode.objects.get(code=code, is_active=True, expiration_date__gte=timezone.now())
        except DiscountCode.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'کد تخفیف نامعتبر یا منقضی شده است.'}, status=400)

        # 2. پیدا کردن سبد خرید کاربر
        cart, created = ShoppingCart.objects.get_or_create(user=request.user)
        
        # 3. محاسبه قیمت‌های سبد خرید
        subtotal = cart.get_cart_total()
        
        # 4. بررسی و اعمال تخفیف
        # اگر در مدل DiscountCode فیلد درصد (percentage) دارید
        if discount.percentage is not None:
            discount_amount = (subtotal * discount.percentage) / 100
            new_total = subtotal - discount_amount
        else:
            # اگر مقدار تخفیف ثابت است
            discount_amount = discount.value
            new_total = subtotal - discount_amount
            
        # اطمینان از اینکه قیمت نهایی منفی نمی‌شود
        if new_total < 0:
            new_total = 0

        # 5. ذخیره کد تخفیف در سبد خرید
        cart.applied_discount = discount
        cart.save()
        
        # 6. بازگرداندن پاسخ JSON
        return JsonResponse({
            'success': True,
            'message': f'کد تخفیف با موفقیت اعمال شد. {discount.percentage}% تخفیف',
            'new_total': new_total
        })

    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'message': 'فرمت داده ارسالی نامعتبر است.'}, status=400)
    except Exception as e:
        # برای خطاهای غیرمنتظره
        return JsonResponse({'success': False, 'message': f'خطای غیرمنتظره: {str(e)}'}, status=500)
    


@login_required 
def checkout_view(request):
    if request.method == 'POST':
        try:
            cart = Cart.objects.get(user=request.user)
            cart_items = cart.cartitem_set.all()

            if not cart_items:
                return JsonResponse({'success': False, 'message': 'Your cart is empty.'})

            with transaction.atomic():
                for item in cart_items:
                    book = item.book
                    if not CustomerBook.objects.filter(customer=request.user.customer, book=book).exists():
                        CustomerBook.objects.create(customer=request.user.customer, book=book)

                cart_items.delete()
                
                cart.applied_discount = None
                cart.save()

            return JsonResponse({
                'success': True,
                'message': 'Checkout completed successfully! Your books are now in My Books.',
                'redirect_url': '/customer-dashboard/?tab=my-books' 
            })

        except Cart.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Cart not found.'}, status=404)
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'An unexpected error occurred: {str(e)}'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Invalid request method.'}, status=405)

