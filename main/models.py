# main/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.db.models import Avg
from decimal import Decimal
from django.contrib.auth.models import User 
from django.conf import settings

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('customer', 'Customer'),
        ('author', 'Author'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='customer')
    contact_number = models.CharField(max_length=11, blank=True, null=True)
    # If you intend to have a default_address, you need an Address model first.
    # Otherwise, remove 'default_address' from CustomUserAdmin fieldsets.
    # default_address = models.ForeignKey('Address', on_delete=models.SET_NULL, null=True, blank=True, related_name='users_with_default')

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_set',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customuser_set',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    def __str__(self):
        return self.username

class Genre(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class Book(models.Model):
    BOOK_TYPE_CHOICES = [
        ('ebook', 'E-Book'),
        ('audiobook', 'Audio Book'),
        ('magazine', 'Magazine'),
    ]

    STATUS_CHOICES = [
        ('pending', 'در انتظار تایید'),
        ('approved', 'تایید شده'),
        ('rejected', 'رد شده'),
    ]

    title = models.CharField(max_length=255)
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'author'}, related_name='authored_books')
    description = models.TextField()
    genre = models.ManyToManyField(Genre, related_name='books')
    cover_image = models.ImageField(upload_to='book_covers/', blank=True, null=True)
    book_type = models.CharField(max_length=20, choices=BOOK_TYPE_CHOICES)
    sample_file = models.FileField(upload_to='samples/', blank=True, null=True)
    full_file = models.FileField(upload_to='books/', blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
    rejection_reason = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    publication_date = models.DateField(null=True, blank=True)
    isbn = models.CharField(max_length=20, null=True, blank=True)
    stock = models.PositiveIntegerField(default=0)
    show_on_homepage = models.BooleanField(default=False)
    title = models.CharField(max_length=100)
    cover = models.ImageField(upload_to='book_covers/', null=True, blank=True)

    def update_average_rating(self):
        avg_rating = self.ratings.aggregate(Avg('rating'))['rating__avg']
        self.average_rating = avg_rating if avg_rating is not None else 0.0
        self.save()

    def __str__(self):
        return self.title

class Rating(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='ratings')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField(blank=True, null=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.book.update_average_rating()
    
    class Meta:
        unique_together = ('book', 'user')  # هر کاربر فقط یک امتیاز برای هر کتاب


    def __str__(self):
        return f"{self.rating} by {self.user.username}"

class DiscountCode(models.Model):
    code = models.CharField(max_length=10, unique=True)
    percentage = models.DecimalField(max_digits=5, decimal_places=2)
    expiration_date = models.DateTimeField()
    is_active = models.BooleanField(default=True)

    def is_expired(self):
        return timezone.now() > self.expiration_date

    def deactivate_if_expired(self):
        if self.is_expired():
            self.is_active = False
            self.save()

    def apply_discount(self, total_price):
        if self.is_expired() or not self.is_active:
            raise ValueError("Discount code is expired or inactive.")
        return total_price * (Decimal('1') - self.percentage/Decimal('100'))

    def __str__(self):
        return self.code

class DiscountUsage(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    discount_code = models.ForeignKey(DiscountCode, on_delete=models.CASCADE)
    used_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} used {self.discount_code.code}"

class ShoppingCart(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)

    def total_price(self):
        return sum(item.total_price() for item in self.items.all())

    def __str__(self):
        return f"Cart of {self.user.username}"

class CartItem(models.Model):
    cart = models.ForeignKey(ShoppingCart, on_delete=models.CASCADE, related_name='items')
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def total_price(self):
        return self.book.price * self.quantity

    def __str__(self):
        return f"{self.book.title} x{self.quantity}"

class Order(models.Model):

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='orders')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    discount_code = models.ForeignKey(DiscountCode, on_delete=models.SET_NULL, null=True, blank=True)

    def total_price(self):
        total = sum(item.total_price() for item in self.items.all())
        if self.discount_code:
            try:
                total = self.discount_code.apply_discount(total)
            except ValueError as e:
                # Handle expired/inactive discount gracefully if needed, e.g., log it
                print(f"Discount code {self.discount_code.code} not applied: {e}")
        return total

    def __str__(self):
        return f"Order {self.id} - {self.user.username}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def total_price(self):
        return self.book.price * self.quantity

    def __str__(self):
        return f"{self.book.title} x{self.quantity}"

class PurchasedBook(models.Model):
    customer = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='purchases', limit_choices_to={'role': 'customer'})
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    purchase_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('customer', 'book')

    def __str__(self):
        return f"{self.customer.username} purchased {self.book.title}"

class UserLibrary(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='library')
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} owns {self.book.title}"


class ReadingProgress(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='reading_progress')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='reading_progress')
    last_page = models.PositiveIntegerField(default=1)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'book')

    def str(self):
        return f"{self.user.username} is at page {self.last_page} of {self.book.title}"
    
class Comment(models.Model):
    # This is the line that needs to exist and be correct
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='comments', null=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)
    text = models.TextField(default='Default text')

    created_at = models.DateTimeField(auto_now_add=True, null=True)
    
    def __str__(self):
        return f"Comment by {self.author.username} on {self.book.title}"

