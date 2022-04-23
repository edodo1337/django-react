from rest_framework import serializers
from django.core.files.uploadedfile import InMemoryUploadedFile
from rest_framework.serializers import ValidationError, SerializerMethodField
from billing.models import Bill, Client


def validate_file_type(file: InMemoryUploadedFile):
    allowed_extensions = ('xlsx',)

    if file.name.split('.')[-1] not in allowed_extensions:
        raise ValidationError(
            f"File format is not allowed. Choose one of these: {allowed_extensions}"
        )


class ClientOrgsUploadSerializer(serializers.Serializer):
    file = serializers.FileField(validators=[validate_file_type])


class BillsUploadSerializer(serializers.Serializer):
    file = serializers.FileField(validators=[validate_file_type])


class ClientAggregatedReportSerializer(serializers.ModelSerializer):
    def get_orgs_count(self, obj):
        return obj.organizations_count

    def get_bills_sum(self, obj):
        return obj.bill_sum

    orgs_count = SerializerMethodField()
    bills_sum = SerializerMethodField()

    class Meta:
        model = Client
        fields = ('name', 'orgs_count', 'bills_sum')


class BillsReportSerializer(serializers.ModelSerializer):
    def get_organization_name(self, obj):
        return obj.organization.name

    def get_client_name(self, obj):
        return obj.organization.client.name

    organization_name = SerializerMethodField()
    client_name = SerializerMethodField()

    class Meta:
        model = Bill
        fields = ('pk', 'organization_name', 'client_name', 'number', 'sum', 'date')
