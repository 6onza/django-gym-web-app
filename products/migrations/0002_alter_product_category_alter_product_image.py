# Generated by Django 4.1.4 on 2022-12-23 00:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='category',
            field=models.CharField(choices=[('Proteinas', 'Proteinas'), ('Guantes', 'Guantes'), ('Bebidas', 'Bebidas')], default=None, max_length=200),
        ),
        migrations.AlterField(
            model_name='product',
            name='image',
            field=models.ImageField(upload_to='../frontend/public/products'),
        ),
    ]
