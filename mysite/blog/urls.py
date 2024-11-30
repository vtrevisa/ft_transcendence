# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('signIn/', views.sign_in_view, name='sign_in'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('check_login/', views.check_login_view, name='check_login'),
    path('update_profile/', views.update_profile_view, name='update_profile'),
    path('get_friends/', views.get_friends_view, name='get_friends'),
    path('add_friend/', views.add_friend_view, name='add_friend'),
    path('delete_friend/', views.delete_friend_view, name='delete_friend'),
    path('', views.home, name='home'),
]