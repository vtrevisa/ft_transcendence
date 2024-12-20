import json
import logging
import requests
from django.contrib.auth import login as auth_login, authenticate, logout as auth_logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from .models import UserProfile, Match
from django.shortcuts import render, redirect
from django.conf import settings
from django.contrib.auth import login

User = get_user_model()
logger = logging.getLogger(__name__)

@csrf_exempt
def sign_in_view(request):
    logger.debug("sign_in_view called")
    if request.method == 'POST':
        logger.debug("Request method is POST")
        username = request.POST.get('username')
        password = request.POST.get('password')
        email = request.POST.get('email')
        nickname = request.POST.get('nickname')
        avatar = request.FILES.get('avatar')
        
        logger.debug(f"Received data - Username: {username}, Password: {password}, Email: {email}, Nickname: {nickname}, Avatar: {avatar}")
        
        if User.objects.filter(username=username).exists():
            logger.debug("Username already exists")
            return JsonResponse({'success': False, 'message': 'Username already exists'})
        
        user = User.objects.create_user(username=username, password=password, email=email)
        logger.debug(f"User {username} created successfully")
        
        # Check if UserProfile already exists
        user_profile, created = UserProfile.objects.get_or_create(user=user)
        user_profile.nickname = nickname
        user_profile.avatar = avatar
        user_profile.save()
        
        logger.debug(f"UserProfile for {username} created/updated successfully")
        
        return JsonResponse({'success': True})
    
    logger.debug("Invalid request method")
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
                'avatar_url': user_profile.avatar.url if user_profile.avatar else '/static/default_avatar.png'
            })
        return JsonResponse({'success': False, 'message': 'Invalid credentials'})
    return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
@login_required
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
    try:
        user_profile = UserProfile.objects.get(user=user)
        return JsonResponse({
            'logged_in': True,
            'username': user.username,
            'email': user.email,
            'nickname': user_profile.nickname,
            'avatar_url': user_profile.avatar.url if user_profile.avatar else '/static/default_avatar.png'
        })
    except UserProfile.DoesNotExist:
        return JsonResponse({'logged_in': False})

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
    try:
        user_profile = UserProfile.objects.get(user=request.user)
        friends = user_profile.friends.all()
        friends_list = [{'username': friend.user.username, 'nickname': friend.nickname, 'is_online': friend.is_online} for friend in friends]
        return JsonResponse({'friends': friends_list})
    except UserProfile.DoesNotExist:
        logger.error("User profile not found for user: %s", request.user.username)
        return JsonResponse({'success': False, 'message': 'User profile not found'}, status=404)
    except Exception as e:
        logger.error("Error fetching friends for user: %s, error: %s", request.user.username, str(e))
        return JsonResponse({'success': False, 'message': str(e)}, status=500)
    
@csrf_exempt
@login_required
def add_friend_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            if not username:
                return JsonResponse({'success': False, 'message': 'Username not provided'}, status=400)
            try:
                friend_user = User.objects.get(username=username)
                friend_profile = UserProfile.objects.get(user=friend_user)
            except User.DoesNotExist:
                return JsonResponse({'success': False, 'message': 'User not found'}, status=404)
            user_profile = UserProfile.objects.get(user=request.user)
            if friend_profile in user_profile.friends.all():
                return JsonResponse({'success': False, 'message': 'User is already a friend'}, status=400)
            user_profile.friends.add(friend_profile)
            return JsonResponse({'success': True})
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'message': 'Invalid JSON'}, status=400)
        except UserProfile.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'User profile not found'}, status=404)
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
@login_required
def delete_friend_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            friend_username = data.get('username')
            logger.debug(f"Received request to delete friend: {friend_username}")

            friend_user = User.objects.get(username=friend_username)
            user_profile = UserProfile.objects.get(user=request.user)
            friend_profile = UserProfile.objects.get(user=friend_user)

            user_profile.friends.remove(friend_profile)
            logger.debug(f"Friend {friend_username} removed successfully")
            return JsonResponse({'success': True})
        except json.JSONDecodeError:
            logger.error("Invalid JSON")
            return JsonResponse({'success': False, 'message': 'Invalid JSON'}, status=400)
        except User.DoesNotExist:
            logger.error(f"User not found: {friend_username}")
            return JsonResponse({'success': False, 'message': 'User not found'}, status=404)
        except UserProfile.DoesNotExist:
            logger.error(f"User profile not found for user: {friend_username}")
            return JsonResponse({'success': False, 'message': 'User profile not found'}, status=404)
        except Exception as e:
            logger.error(f"Error deleting friend: {str(e)}")
            return JsonResponse({'success': False, 'message': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid request method'}, status=400)

@login_required
def status_view(request):
    user_profile = UserProfile.objects.get(user=request.user)
    matches = user_profile.matches
    wins = user_profile.wins
    losses = user_profile.losses
    winrate = (wins / matches * 100) if matches > 0 else 0
    return JsonResponse({
        'matches': matches,
        'wins': wins,
        'losses': losses,
        'winrate': f'{winrate:.2f}%'
    })

@login_required
def match_history_view(request):
    user_profile = UserProfile.objects.get(user=request.user)
    matches = Match.objects.filter(player1=user_profile.user).order_by('-date')
    match_list = [{
        'player1': match.player1.username,
        'player2': match.player2.username if match.player2 else 'N/A',
        'winner': match.winner.username,
        'date': match.date.strftime('%Y-%m-%d %H:%M:%S'),
        'details': match.details
    } for match in matches]
    return JsonResponse({'matches': match_list})

def get_username_by_nickname(request):
    nickname = request.GET.get('nickname')
    try:
        user_profile = UserProfile.objects.get(nickname=nickname)
        username = user_profile.user.username
        return JsonResponse({'username': username})
    except UserProfile.DoesNotExist:
        return JsonResponse({'username': None}, status=404)

@csrf_exempt
def update_status_counter(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        result = data.get('result')

        try:
            user = User.objects.get(username=username)
            user_profile = UserProfile.objects.get(user=user)

            if result == 'won':
                user_profile.wins += 1
            elif result == 'lost':
                user_profile.losses += 1

            user_profile.matches += 1
            user_profile.save()

            return JsonResponse({'message': 'Status counter updated successfully'})
        except User.DoesNotExist:
            return JsonResponse({'message': 'User not found'}, status=404)
        except UserProfile.DoesNotExist:
            return JsonResponse({'message': 'User profile not found'}, status=404)

    return JsonResponse({'message': 'Invalid request method'}, status=400)

@csrf_exempt
def record_game_history(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            player1_username = data.get('player1Username')
            player2_nickname = data.get('player2Nickname', 'N/A')
            winner = data.get('winner')
            match_time = data.get('matchTime')
            match_score = data.get('matchScore')

            try:
                player1 = User.objects.get(username=player1_username)
            except User.DoesNotExist:
                logger.error(f"User with username {player1_username} not found")
                return JsonResponse({'message': f'User with username {player1_username} not found'}, status=404)

            # Handle Player 2 as a non-registered user
            player2 = None
            if player2_nickname != 'N/A':
                try:
                    player2_profile = UserProfile.objects.get(nickname=player2_nickname)
                    player2 = player2_profile.user
                except UserProfile.DoesNotExist:
                    logger.warning(f"User profile with nickname {player2_nickname} not found, treating as non-registered user")

            # Determine the winner user object
            winner_user = player1 if winner == player1_username else player2

            Match.objects.create(
                player1=player1,
                player2=player2,
                winner=winner_user,
                date=match_time,
                details=match_score
            )

            return JsonResponse({'message': 'Game history recorded successfully'})
        except json.JSONDecodeError:
            logger.error("Invalid JSON in request body")
            return JsonResponse({'message': 'Invalid JSON'}, status=400)
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return JsonResponse({'message': f'Unexpected error: {str(e)}'}, status=500)

    logger.error("Invalid request method")
    return JsonResponse({'message': 'Invalid request method'}, status=400)

def login_view42(request):
    # Redireciona o usuário para a página de login da 42
    authorize_url = (
        f"https://api.intra.42.fr/oauth/authorize?client_id={settings.CLIENT_ID}"
        f"&redirect_uri={settings.REDIRECT_URI}&response_type=code&scope=public"
    )
    return redirect(authorize_url)


def logout42(request):
    auth_logout(request)
    return redirect('/')

def callback_view(request):
    # Obtém o código de autorização da URL de redirecionamento
    code = request.GET.get('code')
    token_url = "https://api.intra.42.fr/oauth/token"
    token_data = {
        'grant_type': 'authorization_code',
        'client_id': settings.CLIENT_ID,
        'client_secret': settings.CLIENT_SECRET,
        'code': code,
        'redirect_uri': settings.REDIRECT_URI,
    }
    
    # Solicita o token de acesso usando o código de autorização
    token_response = requests.post(token_url, data=token_data)
    token_json = token_response.json()
    access_token = token_json.get('access_token')

    # Usa o token de acesso para obter informações do usuário
    user_info_url = "https://api.intra.42.fr/v2/me"
    user_info_response = requests.get(
        user_info_url, headers={'Authorization': f'Bearer {access_token}'}
    )
    user_info = user_info_response.json()

    # Verifica se o usuário já existe no banco de dados
    try:
        user = User.objects.get(username=user_info['login'])
    except User.DoesNotExist:
        # Cria um novo usuário se ele não existir
        user = User.objects.create_user(
            username=user_info['login'],
            email=user_info['email'],
            password=User.objects.make_random_password()
        )
        user_profile = UserProfile.objects.create(user=user, nickname=user_info['login'])
    else:
        user_profile = UserProfile.objects.get(user=user)

    # Set the user profile as online
    user_profile.is_online = True
    user_profile.save()

    # Faz o login do usuário
    auth_login(request, user)

    # Renderiza um template que fecha o pop-up e redireciona a página principal
    return render(request, 'close_popup.html')
    
def home(request):
    return render(request, 'home.html')