from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('signIn/', views.sign_in_view, name='sign_in'),
    path('check_login/', views.check_login_view, name='check_login'),
    path('update_profile/', views.update_profile_view, name='update_profile'),
]