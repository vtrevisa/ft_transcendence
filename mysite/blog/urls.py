from django.urls import path
from . import views
from django.contrib import admin

urlpatterns = [
    path('', views.home, name='home'),
    path('signIn/', views.sign_in_view, name='sign_in'),
    path('login/', views.login_view, name='login'),
]
