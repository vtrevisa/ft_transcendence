# models.py
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    nickname = models.CharField(max_length=100)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True, default='avatars/default_avatar.png')
    friends = models.ManyToManyField('self', blank=True, symmetrical=False)
    is_online = models.BooleanField(default=False)

    def __str__(self):
        return self.nickname

@receiver(post_delete, sender=User)
def delete_user_profile(sender, instance, **kwargs):
    try:
        instance.userprofile.delete()
    except UserProfile.DoesNotExist:
        pass

@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
    instance.userprofile.save()