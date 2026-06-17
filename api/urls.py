from django.urls import path
from .views import (RegisterView, CheckUsernameAvailability, LoginAPIView, LogoutAPIView, DiscountCodeDeleteAPIView,
DiscountCodeListCreateAPIView,AddAuthorAPIView ,AuthorListAPIView,AuthorManagementAPIView,AuthorBookUploadView,
UpdateBookStatusView,AdminBookListView,AuthorBookListView,AdminAddBookView,AdminBookManagementView,  DiscountCodeListCreateAPIView,
ApprovedBookListView,BookPreviewView,BookSearchFilterAPIView, BookFilterByGenreAPIView,AddToCartView,CartView, RemoveFromCartView,
ApplyDiscountCodeView,CheckoutView,CustomerLibraryView, RateBookView,ReadPdfBookView,OrderReportView, RecommendedBooksView,ActiveUnusedDiscountCodesView,
 BookPreviewView, BookListCreateAPIView, BookPreviewView
)
from . import views # خط اصلاح شده
from .views import BookAdminViewSet
from .views import book_comments  # اگر این همان view مورد نظرتان است



urlpatterns = [
   
    path('register/', RegisterView.as_view(), name='register'),
    path('check-username/', CheckUsernameAvailability.as_view(), name='check-username'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('logout/', LogoutAPIView.as_view(), name='logout'),
    path('discounts/<int:pk>/', DiscountCodeDeleteAPIView.as_view(), name='discount_code_delete'),
    path('authors/add/', AddAuthorAPIView.as_view(), name='add_author'),
    path('authors/', AuthorListAPIView.as_view(), name='list_authors'),
    path('authors/<int:pk>/', AuthorManagementAPIView.as_view(), name='manage_author'),
    path('author/upload-book/', AuthorBookUploadView.as_view(), name='author-upload-book'),
    path('admin/books/', AdminBookListView.as_view(), name='admin-book-list'),
    path('admin/books/<int:book_id>/change-status/', UpdateBookStatusView.as_view(), name='change-book-status'),
    path('author/books/', AuthorBookListView.as_view(), name='author-book-list'),
    path('admin/books/add/', AdminAddBookView.as_view(), name='admin_add_book'),
    path('admin/books/<int:pk>/', AdminBookManagementView.as_view(), name='admin_manage_book'),
    path('discounts/', DiscountCodeListCreateAPIView.as_view(), name='discount-list-create'),
    path('books/approved/', ApprovedBookListView.as_view(), name='approved-book-list'),
    path('books/<int:book_id>/preview/', BookPreviewView.as_view(), name='book-preview'),
    path('books/search/', BookSearchFilterAPIView.as_view(), name='book-search'),
    path('books/filter/', BookFilterByGenreAPIView.as_view(), name='book-filter'),
    path('cart/add/<int:book_id>/', AddToCartView.as_view(), name='cart-add'),
    path('cart/', CartView.as_view(), name='cart-detail'),
    path('cart/remove/<int:item_id>/', RemoveFromCartView.as_view(), name='cart-remove'),
    path('cart/apply-discount/', ApplyDiscountCodeView.as_view(), name='apply-discount'),
    path('cart/checkout/', CheckoutView.as_view(), name='checkout'),
    path('my-library/', CustomerLibraryView.as_view(), name='customer-library'),
    path('books/<int:book_id>/rate/', RateBookView.as_view(), name='rate-book'),
    path('library/book/<int:book_id>/read/', ReadPdfBookView.as_view()),  # آخرین صفحه
    path('library/book/<int:book_id>/read/<int:page_number>/', ReadPdfBookView.as_view(),name='read-pdf-book'),  # صفحه خاص
    path('orders/report/',OrderReportView.as_view(),name='orders-report')  ,
    path('recommended/', RecommendedBooksView.as_view(), name='recommended-books'),
    path('discounts/active-unused/', ActiveUnusedDiscountCodesView.as_view(), name='active-unused-discounts'),
    path('books/', BookListCreateAPIView.as_view(), name='book-list'),
    path('books/<int:book_id>/preview/', BookPreviewView.as_view(), name='book-preview'),
    path('api/ai-recommendation/', views.ai_recommendation, name='ai_recommendation'),
    path('api/my-books/', views.my_books_api_view, name='my_books_api'),
    path('api/admin/books/<int:pk>/approve/', BookAdminViewSet.as_view({'post': 'approve_book'}), name='book-approve'),
    path('api/books/<int:book_id>/comments/', views.book_comments, name='book_comments'),
    path('api/ai-recommendation/', views.predict_genre, name='ai_recommendation'),
    path('books/<int:book_id>/comments/', book_comments, name='book-comments'),
    path('books/<int:book_id>/comments/', book_comments, name='book_comments'),



 ]
