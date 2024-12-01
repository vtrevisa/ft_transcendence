import json
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
        user_profile = UserProfile.objects.create(user=user, nickname=nickname, avatar=avatar)

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
            user_profile.is_online = True
            user_profile.save()
            return JsonResponse({
                'success': True,
                'username': user.username,
                'email': user.email,
                'nickname': user_profile.nickname,
                'avatar_url': user_profile.avatar.url if user_profile.avatar else '/static/images/default_avatar.png'
            })
        return JsonResponse({'success': False, 'message': 'Invalid credentials'})
    return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
def logout_view(request):
    if request.method == 'POST':
        user_profile = UserProfile.objects.get(user=request.user)
        user_profile.is_online = False
        user_profile.save()
        auth_logout(request)
        return JsonResponse({'success': True})
    return JsonResponse({'error': 'Invalid request method'}, status=400)

@login_required
def check_login_view(request):
    user = request.user
    user_profile = UserProfile.objects.get(user=user)
    avatar_url = user_profile.avatar.url if user_profile.avatar else '/static/images/default_avatar.png'
    return JsonResponse({
        'logged_in': True,
        'username': user.username,
        'email': user.email,
        'nickname': user_profile.nickname,
        'avatar_url': avatar_url
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

@login_required
def get_friends_view(request):
    user_profile = UserProfile.objects.get(user=request.user)
    friends = user_profile.friends.all()
    friends_list = [{'username': friend.user.username, 'nickname': friend.nickname, 'is_online': friend.is_online} for friend in friends]
    return JsonResponse({'friends': friends_list})

@csrf_exempt
@login_required
def add_friend_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        try:
            friend_user = User.objects.get(username=username)
            friend_profile = UserProfile.objects.get(user=friend_user)
        except User.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'User not found'})

        user_profile = UserProfile.objects.get(user=request.user)
        if friend_profile in user_profile.friends.all():
            return JsonResponse({'success': False, 'message': 'User is already a friend'})
        user_profile.friends.add(friend_profile)
        return JsonResponse({'success': True})
    return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
@login_required
def delete_friend_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            print(f"Received request to remove friend with username: {username}")
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'message': 'Invalid JSON'})

        if not username:
            return JsonResponse({'success': False, 'message': 'Username not provided'})

        # Get the UserProfile of the currently logged-in user
        user_profile = UserProfile.objects.get(user=request.user)
        
        # Get the list of friends for the current user
        friends = user_profile.friends.all()
        print(f"Current user's friends before removal: {[friend.user.username for friend in friends]}")
        
        # Try to find the friend to be removed in the current user's friend list
        try:
            friend_profile = friends.get(user__username=username)
        except UserProfile.DoesNotExist:
            print("User not found in friend list")
            return JsonResponse({'success': False, 'message': 'User not found in friend list'})

        # Remove the friend from the current user's friend list
        user_profile.friends.remove(friend_profile)
        print("Friend removed successfully")
        
        # Get the updated list of friends for the current user
        updated_friends = user_profile.friends.all()
        print(f"Current user's friends after removal: {[friend.user.username for friend in updated_friends]}")
        
        return JsonResponse({'success': True})
    
    return JsonResponse({'error': 'Invalid request method'}, status=400)

def home(request):
    return render(request, 'home.html')