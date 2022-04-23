from decimal import Decimal
from billing.models import Bill, Client, Organization
from django.db.models.query import QuerySet
from django.db.models import Sum
from django.db.models.functions import Coalesce


def clients__by_names(*, names: list[str]) -> QuerySet[Client]:
    return Client.objects.filter(name__in=names)


def organizations__by_names(*, names: list[str]) -> QuerySet[Client]:
    return Organization.objects.filter(name__in=names)


def clients_organizations__aggregated_report() -> QuerySet[Client]:
    report = Client.objects.annotate(
        bill_sum=Coalesce(Sum('organizations__bills__sum'), Decimal(0))
    ).cache()

    return report


def bills__report() -> QuerySet[Client]:
    report = Bill.objects.select_related('organization', 'organization__client')

    return report
