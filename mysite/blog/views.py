from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from .models import UserProfile
from django.db import IntegrityError
import logging

def home(request):
    return render(request, 'home.html')

logger = logging.getLogger(__name__)

@csrf_exempt
def sign_in_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        email = request.POST.get('email')
        nickname = request.POST.get('nickname')
        avatar = request.FILES.get('avatar')
        try:
            user = User.objects.create_user(username=username, password=password, email=email)
            user_profile = UserProfile.objects.create(user=user, nickname=nickname, avatar=avatar)
            return JsonResponse({'message': 'User created successfully'})
        except IntegrityError as e:
            if 'unique constraint' in str(e):
                return JsonResponse({'detail': 'Username already exists'}, status=400)
            return JsonResponse({'detail': 'An error occurred'}, status=500)
    return JsonResponse({'detail': 'Invalid request method'}, status=405)

def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            user_profile = UserProfile.objects.get(user=user)
            return JsonResponse({
                'success': True,
                'username': user.username,
                'email': user.email,
                'nickname': user_profile.nickname,
                'avatar_url': user_profile.avatar.url,
                'joined_date': user.date_joined.strftime('%Y-%m-%d'),
                'last_login': user.last_login.strftime('%Y-%m-%d %H:%M:%S') if user.last_login else 'Never',
            })
        else:
            return JsonResponse({'success': False, 'message': 'Invalid credentials'})
    return render(request, 'login.html')