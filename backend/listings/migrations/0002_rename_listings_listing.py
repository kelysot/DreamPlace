# Generated by Django 4.1.4 on 2023-01-15 15:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('listings', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Listings',
            new_name='Listing',
        ),
    ]
