# # from django.contrib import admin
# # from django.contrib.auth.admin import UserAdmin
# # from .models import (
# #    CustomUser, Genre, Book, Rating,
# #     DiscountCode, DiscountUsage,
# #     ShoppingCart, CartItem, Order, OrderItem, UserLibrary
# # )

# # @admin.register(CustomUser)
# # class CustomUserAdmin(UserAdmin):
# #     list_display = ('username', 'email', 'role', 'is_active', 'is_staff')
# #     list_filter = ('role', 'is_active', 'is_staff')
# #     fieldsets = UserAdmin.fieldsets + (
# #         ('اطلاعات بیشتر', {
# #             'fields': ('role', 'contact_number', 'default_address'),
# #         }),
# #     )
# #     add_fieldsets = UserAdmin.add_fieldsets + (
# #         ('اطلاعات بیشتر', {
# #             'fields': ('role', 'contact_number', 'default_address'),
# #         }),
# #     )

# # @admin.register(Genre)
# # class GenreAdmin(admin.ModelAdmin):
# #     list_display = ('name',)

# # @admin.register(Book)
# # class BookAdmin(admin.ModelAdmin):
# #     list_display = ('title', 'author', 'book_type', 'price', 'average_rating')
# #     list_filter = ('book_type', 'genre')
# #     search_fields = ('title', 'author__username')

# # @admin.register(Rating)
# # class RatingAdmin(admin.ModelAdmin):
# #     list_display = ('book', 'user', 'rating')
# #     list_filter = ('rating',)

# # @admin.register(DiscountCode)
# # class DiscountCodeAdmin(admin.ModelAdmin):
# #     list_display = ('code', 'percentage', 'expiration_date', 'is_active')
# #     list_filter = ('is_active',)

# # @admin.register(DiscountUsage)
# # class DiscountUsageAdmin(admin.ModelAdmin):
# #     list_display = ('user', 'discount_code', 'used_at')

# # @admin.register(ShoppingCart)
# # class ShoppingCartAdmin(admin.ModelAdmin):
# #     list_display = ('user', 'created_at')

# # @admin.register(CartItem)
# # class CartItemAdmin(admin.ModelAdmin):
# #     list_display = ('cart', 'book', 'quantity')

# # @admin.register(Order)
# # class OrderAdmin(admin.ModelAdmin):
# #     list_display = ('id', 'user', 'status', 'created_at', 'updated_at')
# #     list_filter = ('status',)

# # @admin.register(OrderItem)
# # class OrderItemAdmin(admin.ModelAdmin):
# #     list_display = ('order', 'book', 'quantity')

# # @admin.register(UserLibrary)
# # class UserLibraryAdmin(admin.ModelAdmin):
# #     list_display = ('user', 'book', 'added_at')


# from django.contrib import admin
# from django.contrib.auth.admin import UserAdmin
# from .models import (
#     CustomUser, Genre, Book, Rating,
#     DiscountCode, DiscountUsage,
#     ShoppingCart, CartItem, Order, OrderItem, PurchasedBook, UserLibrary # Added PurchasedBook, UserLibrary
# )
# # main/admin.py
# # ... (imports and other admin classes)
# # main/admin.py
# # ... (other imports and admin classes)

# @admin.register(Order)
# class OrderAdmin(admin.ModelAdmin):
#     list_display = ('id', 'user', 'status', 'created_at', 'updated_at', 'get_total_price') # Ensure this line is correct
#     list_filter = ('status',)

#     def get_total_price(self, obj):
#         return obj.total_price() # Calls the total_price method on the Order instance
#     get_total_price.short_description = 'Total Price' # Column header in admin

# @admin.register(OrderItem)
# class OrderItemAdmin(admin.ModelAdmin):
#     list_display = ('order', 'book', 'quantity')

# # ... (rest of your admin.py)
# @admin.register(CustomUser)
# class CustomUserAdmin(UserAdmin):
#     list_display = ('username', 'email', 'role', 'is_active', 'is_staff')
#     list_filter = ('role', 'is_active', 'is_staff')
#     fieldsets = UserAdmin.fieldsets + (
#         ('اطلاعات بیشتر', {
#             'fields': ('role', 'contact_number', ), # Removed 'default_address' if you don't have an Address model
#         }),
#     )
#     add_fieldsets = UserAdmin.add_fieldsets + (
#         ('اطلاعات بیشتر', {
#             'fields': ('role', 'contact_number', ), # Removed 'default_address'
#         }),
#     )

# @admin.register(Genre)
# class GenreAdmin(admin.ModelAdmin):
#     list_display = ('name',)

# @admin.register(Book)
# class BookAdmin(admin.ModelAdmin):
#     list_display = ('title', 'author', 'book_type', 'price', 'average_rating', 'status') # Added status
#     list_filter = ('book_type', 'genre', 'status') # Added status
#     search_fields = ('title', 'author__username')

# @admin.register(Rating)
# class RatingAdmin(admin.ModelAdmin):
#     list_display = ('book', 'user', 'rating')
#     list_filter = ('rating',)

# @admin.register(DiscountCode)
# class DiscountCodeAdmin(admin.ModelAdmin):
#     list_display = ('code', 'percentage', 'expiration_date', 'is_active')
#     list_filter = ('is_active',)

# @admin.register(DiscountUsage)
# class DiscountUsageAdmin(admin.ModelAdmin):
#     list_display = ('user', 'discount_code', 'used_at')

# @admin.register(ShoppingCart)
# class ShoppingCartAdmin(admin.ModelAdmin):
#     list_display = ('user', 'created_at')

# @admin.register(CartItem)
# class CartItemAdmin(admin.ModelAdmin):
#     list_display = ('cart', 'book', 'quantity')

# @admin.register(Order)
# class OrderAdmin(admin.ModelAdmin):
#     list_display = ('id', 'user', 'status', 'created_at', 'updated_at', 'total_amount') # Added total_amount to list_display
#     list_filter = ('status',)

# @admin.register(OrderItem)
# class OrderItemAdmin(admin.ModelAdmin):
#     list_display = ('order', 'book', 'quantity')

# @admin.register(PurchasedBook) # Register PurchasedBook
# class PurchasedBookAdmin(admin.ModelAdmin):
#     list_display = ('customer', 'book', 'purchase_date')
#     list_filter = ('purchase_date',)

# @admin.register(UserLibrary)
# class UserLibraryAdmin(admin.ModelAdmin):
#     list_display = ('user', 'book', 'added_at')

# # If you have an Address model, register it here
# # @admin.register(Address)
# # class AddressAdmin(admin.ModelAdmin):
# #     list_display = ('user', 'city', 'neighborhood', 'country')
# main/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    CustomUser, Genre, Book, Rating,
    DiscountCode, DiscountUsage,
    ShoppingCart, CartItem, Order, OrderItem,
    PurchasedBook, UserLibrary
    # If you create an Address model, uncomment it here:
    # , Address
)

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'is_active', 'is_staff')
    list_filter = ('role', 'is_active', 'is_staff')
    fieldsets = UserAdmin.fieldsets + (
        ('اطلاعات بیشتر', {
            'fields': ('role', 'contact_number',), # Removed 'default_address' - add if you create an Address model
        }),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('اطلاعات بیشتر', {
            'fields': ('role', 'contact_number',), # Removed 'default_address' - add if you create an Address model
        }),
    )

@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'book_type', 'price', 'average_rating', 'status')
    list_filter = ('book_type', 'genre', 'status')
    search_fields = ('title', 'author__username')

@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = ('book', 'user', 'rating')
    list_filter = ('rating',)

@admin.register(DiscountCode)
class DiscountCodeAdmin(admin.ModelAdmin):
    list_display = ('code', 'percentage', 'expiration_date', 'is_active')
    list_filter = ('is_active',)

@admin.register(DiscountUsage)
class DiscountUsageAdmin(admin.ModelAdmin):
    list_display = ('user', 'discount_code', 'used_at')

@admin.register(ShoppingCart)
class ShoppingCartAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at')

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('cart', 'book', 'quantity')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'created_at', 'updated_at', 'get_total_price') # Changed to get_total_price
   

    def get_total_price(self, obj):
        return obj.total_price() # Calls the total_price method on the Order instance
    get_total_price.short_description = 'Total Price' # Column header in admin

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'book', 'quantity')

@admin.register(PurchasedBook)
class PurchasedBookAdmin(admin.ModelAdmin):
    list_display = ('customer', 'book', 'purchase_date')
    list_filter = ('purchase_date',)

@admin.register(UserLibrary)
class UserLibraryAdmin(admin.ModelAdmin):
    list_display = ('user', 'book', 'added_at')

# If you have an Address model, uncomment and register it here:
# @admin.register(Address)
# class AddressAdmin(admin.ModelAdmin):
#     list_display = ('user', 'city', 'neighborhood', 'country')