from django.contrib import admin
from .models import Category, Product

# Register your models here.

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'stock', 'is_available', 'featured', 'created_at')
    list_filter = ('category', 'is_available', 'featured', 'created_at')
    search_fields = ('name', 'description')
    list_editable = ('price', 'stock', 'is_available', 'featured')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Informations générales', {
            'fields': ('name', 'description', 'category')
        }),
        ('Prix et stock', {
            'fields': ('price', 'stock', 'is_available')
        }),
        ('Media', {
            'fields': ('image',)
        }),
        ('Options', {
            'fields': ('featured',)
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
