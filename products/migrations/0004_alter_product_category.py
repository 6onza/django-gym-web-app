# Generated by Django 4.1.4 on 2022-12-23 00:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0003_alter_product_category'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='category',
            field=models.CharField(choices=[('proteinas', 'proteinas'), ('guantes', 'guantes'), ('bebidas', 'bebidas')], default=None, max_length=200),
        ),
    ]