# Generated by Django 5.1.2 on 2024-12-03 19:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0009_match_userprofile_match_history'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='friends',
            field=models.ManyToManyField(blank=True, related_name='friends_with', to='blog.userprofile'),
        ),
    ]
