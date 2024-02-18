from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Profile

# Register your models here.

class UserAdmin(BaseUserAdmin):
    list_display = ('intra_id', 'is_active', 'is_staff')  # Displayed fields in the list view
    fieldsets = (
        (None, {'fields': ('intra_id', 'password')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('intra_id', 'password1', 'password2', 'is_active', 'is_staff', 'is_superuser'),
        }),
    )
    search_fields = ('intra_id',)
    ordering = ('intra_id',)

admin.site.register(User, UserAdmin)
admin.site.register(Profile)
