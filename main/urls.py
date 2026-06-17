# from django.contrib.auth.views import LogoutView
# from django.urls import path
# from django.conf import settings
# from django.conf.urls.static import static
# from main import views

# urlpatterns = [
#     path('', views.index, name='index'),
#     path('login/', views.login_view, name='login'),
#     path('register_customer/', views.register_view, name='register_customer'),
#     path('admin-dashboard/', views.admin_dashboard_view, name='admin_dashboard'),
#     path('customer-dashboard/', views.customer_dashboard_view, name='customer_dashboard'),
# ]
# urlpatterns+= static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)





# main/urls.pyر
from django.urls import path
from . import views # Correct way to import views from the same app
from django.urls import path
from .views import homepage_view
from django.conf.urls.static import static
from django.conf import settings


from django.urls import path
from .views import customer_dashboard, checkout

urlpatterns = [
    path('dashboard/', customer_dashboard, name='customer_dashboard'),
    path('checkout/', checkout, name='checkout'),
    path('', homepage_view, name='homepage'),
    path('', views.index, name='index'),
    path('login/', views.login_view, name='login'),
    path('login/', views.login_view, name='login'),
    path('register_customer/', views.register_view, name='register_customer'),
    path('admin-dashboard/', views.admin_dashboard_view, name='admin_dashboard'),
    path('customer-dashboard/', views.customer_dashboard_view, name='customer_dashboard'),
    path('author-dashboard/', views.author_dashboard_view, name='author_dashboard'),
    path('manage_authors/', views.manage_authors_view, name='manage_authors'),
    path('edit-author/<int:pk>/', views.edit_author_view, name='edit_author'),
    path('admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('add-discount-code/', views.add_discount_code, name='add_discount_code'),
    path('view-orders/', views.view_orders, name='view_orders'),
    path('view-statistics/', views.view_statistics, name='view_statistics'),
    path('add-book/', views.add_book, name='add_book'),
    path('add-author/', views.add_author, name='add_author'),
    path('manage-books/', views.manage_books, name='manage_books'),
    path('manage-authors/', views.manage_authors, name='manage_authors'),
    path('manage-users/', views.manage_users, name='manage_users'),
    path('manage-discount-codes/', views.manage_discount_codes_page, name='manage_discount_codes_page'), # این رو هم اضافه کنید
    path('profile/update/', views.update_profile, name='update_profile'),
    path('change-password/', views.change_password_view, name='change_password'),
    path('cart/add/', views.add_to_cart, name='add_to_cart'),
    path('cart/', views.view_cart, name='view_cart'),
    path('cart/remove/<int:item_id>/', views.remove_from_cart, name='remove_from_cart'),
    path('cart/checkout/', views.checkout, name='checkout'),
    path('books/<int:book_id>/', views.book_detail, name='book_detail'),
    path('cart/apply-discount/', views.apply_discount_view, name='apply_discount'),
    # path('cart/checkout/', views.checkout, name='checkout'),
    path('api/books/<int:book_id>/rate/', views.rate_book, name='rate_book'),
    path('my-books/', views.my_books, name='my_books'),
    path('checkout/', views.checkout_view, name='checkout'),
    path('cart/purchase/', views.purchase_cart, name='purchase_cart'),

    path('predict/', views.predict_genre, name='predict_genre'),
    
    path('', views.index, name='home'), 
    path('profile/update/', views.update_profile, name='update_profile'),
    


    



]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)