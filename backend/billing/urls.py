from django.urls import include, path
from billing.api.views import BillsListView, ClientOrgsAggregatedView, ClientOrgsView
from rest_framework import routers


client_orgs_router = routers.DefaultRouter()
client_orgs_router.register(r'', ClientOrgsView, basename='client_orgs')


client_orgs_urlpatterns = [
    path('', include(client_orgs_router.urls)),
    path('clients/report/', ClientOrgsAggregatedView.as_view(), name="clients_report"),
    path('bills/report/', BillsListView.as_view(), name="bills_report"),
]
