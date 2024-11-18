from django.urls import path, include
from . import views
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.home, name='home'),
    path('signIn/', views.sign_in_view, name='sign_in'),
    path('login/', views.login_view, name='login'),
	path('admin/', admin.site.urls),
]
