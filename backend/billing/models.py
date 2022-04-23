from datetime import datetime
from django.db import models


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(verbose_name="Row created at", auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name="Row updated at", auto_now=True)

    class Meta:
        abstract = True


class Client(TimeStampedModel):
    name = models.CharField(
        verbose_name="Client name", unique=True, null=False, blank=False, max_length=1024
    )

    def __str__(self):
        return f'Client: name={self.name}'

    def __repr__(self):
        return f'<Client: name={self.name}>'

    @property
    def organizations_count(self):
        return self.organizations.count()

    class Meta:
        verbose_name = "Client"
        verbose_name_plural = "Clients"


class Organization(TimeStampedModel):
    name = models.CharField(
        verbose_name="Organization name", null=False, blank=False, max_length=1024, unique=True
    )
    client = models.ForeignKey(
        "Client",
        verbose_name="Client",
        related_name="organizations",
        blank=False,
        null=True,
        on_delete=models.SET_NULL,
    )

    def __str__(self):
        return f'Organization: name={self.name}'

    def __repr__(self):
        return f'<Organization: name={self.name}>'

    class Meta:
        verbose_name = "Organization"
        verbose_name_plural = "Organization"


class Bill(TimeStampedModel):
    organization = models.ForeignKey(
        "Organization",
        verbose_name="Organization",
        related_name="bills",
        blank=False,
        null=True,
        on_delete=models.SET_NULL,
    )
    number = models.PositiveBigIntegerField(verbose_name="Bills number", null=False, blank=False)
    sum = models.DecimalField(
        verbose_name="Sum", null=False, blank=False, max_digits=10, decimal_places=2
    )
    date = models.DateField(verbose_name="Bill date", blank=False, null=False, default=datetime.now)

    def __str__(self):
        return f'Bill: pk={self.pk} sum={self.sum}'

    def __repr__(self):
        return f'<Bill: pk={self.pk} sum={self.sum}>'

    class Meta:
        verbose_name = "Bill"
        verbose_name_plural = "Bills"
        unique_together = ('organization', 'number')
