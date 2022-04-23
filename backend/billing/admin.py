from django.contrib import admin
from billing.models import Bill, Client, Organization


class OrganizationInline(admin.TabularInline):
    model = Organization
    extra = 0


class BillInline(admin.TabularInline):
    model = Bill
    extra = 0


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    list_filter = ('name', 'created_at', 'id')
    fields = ('name',)
    inlines = [OrganizationInline]


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    list_filter = ('name', 'created_at', 'id')
    fields = ('name', 'client')
    inlines = [BillInline]


@admin.register(Bill)
class BillAdmin(admin.ModelAdmin):
    list_display = ('get_org_name', 'sum', 'date', 'created_at')
    list_filter = ('sum', 'number', 'date', 'created_at')
    fields = ('organization', 'sum', 'number', 'date')

    def get_org_name(self, obj: Bill):
        return obj.organization.name
