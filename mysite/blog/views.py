from django.contrib.auth import login as auth_login, authenticate, logout as auth_logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from .models import UserProfile

User = get_user_model()

@csrf_exempt
def sign_in_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        email = request.POST.get('email')
        nickname = request.POST.get('nickname')
        avatar = request.FILES.get('avatar')
        
        if User.objects.filter(username=username).exists():
            return JsonResponse({'success': False, 'message': 'Username already exists'})
        
        user = User.objects.create_user(username=username, password=password, email=email)
        user_profile = UserProfile(user=user, nickname=nickname, avatar=avatar)
        user_profile.save()
        
        return JsonResponse({'success': True})
    return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            auth_login(request, user)
            user_profile = UserProfile.objects.get(user=user)
            return JsonResponse({
                'success': True,
                'username': user.username,
                'email': user.email,
                'nickname': user_profile.nickname,
                'avatar_url': user_profile.avatar.url if user_profile.avatar else ''
            })
        return JsonResponse({'success': False, 'message': 'Invalid credentials'})
    return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
def logout_view(request):
    if request.method == 'POST':
        auth_logout(request)
        return JsonResponse({'success': True})
    return JsonResponse({'error': 'Invalid request method'}, status=400)

@login_required
def check_login_view(request):
    user = request.user
    user_profile = UserProfile.objects.get(user=user)
    return JsonResponse({
        'logged_in': True,
        'username': user.username,
        'email': user.email,
        'nickname': user_profile.nickname,
        'avatar_url': user_profile.avatar.url if user_profile.avatar else ''
    })

@csrf_exempt
@login_required
def update_profile_view(request):
    if request.method == 'POST':
        user = request.user
        user_profile = UserProfile.objects.get(user=user)
        
        email = request.POST.get('email')
        nickname = request.POST.get('nickname')
        avatar = request.FILES.get('avatar')
        
        if email:
            user.email = email
            user.save()
        
        if nickname:
            user_profile.nickname = nickname
        
        if avatar:
            user_profile.avatar = avatar
        
        user_profile.save()
        
        return JsonResponse({'success': True})
    return JsonResponse({'error': 'Invalid request method'}, status=400)

def home(request):
    return render(request, 'home.html')