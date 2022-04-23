from rest_framework import viewsets
from rest_framework.request import Request
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import generics
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend
from billing.logic import (
    UpsertBillsException,
    UpsertClientsException,
    UpsertOrganizationsException,
    upload__bills,
    upload__clients_organizations,
)
from billing.logic.selectors import bills__report, clients_organizations__aggregated_report
from billing.api.serializers import (
    BillsReportSerializer,
    ClientAggregatedReportSerializer,
    ClientOrgsUploadSerializer,
    BillsUploadSerializer,
)


def ErrorResponseMsg(*, status: bool = False, error_msg: str = None):
    return {'status': status, 'error_msg': error_msg}


def SuccessUploadResponseMsg(*, status: bool = True, success_msg: str = None):
    return {'status': status, 'success_msg': success_msg}


class ClientOrgsView(viewsets.GenericViewSet):
    permission_classes = (AllowAny,)
    serializers_map = {
        'upload_client_orgs': ClientOrgsUploadSerializer,
        'upload_bills': BillsUploadSerializer,
    }

    def get_serializer_class(self):
        return self.serializers_map.get(self.action)

    def get_serializer_context(self):
        context = super(ClientOrgsView, self).get_serializer_context()
        context.update({"request": self.request})
        return context

    @action(detail=False, methods=['post'])
    def upload_client_orgs(self, request: Request):
        serializer_cls = self.get_serializer_class()
        serializer = serializer_cls(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            upload__clients_organizations(file=serializer.validated_data['file'])
        except (UpsertClientsException, UpsertOrganizationsException) as e:
            return Response(ErrorResponseMsg(error_msg=str(e)), status=status.HTTP_400_BAD_REQUEST)

        return Response(SuccessUploadResponseMsg(), status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def upload_bills(self, request: Request):
        serializer_cls = self.get_serializer_class()
        serializer = serializer_cls(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            upload__bills(file=serializer.validated_data['file'])
        except (UpsertBillsException) as e:
            return Response(ErrorResponseMsg(error_msg=str(e)), status=status.HTTP_400_BAD_REQUEST)

        return Response(SuccessUploadResponseMsg(), status=status.HTTP_200_OK)


class ClientOrgsAggregatedView(generics.ListAPIView):
    permission_classes = (AllowAny,)
    queryset = clients_organizations__aggregated_report()
    serializer_class = ClientAggregatedReportSerializer

    def get_serializer_context(self):
        context = super(ClientOrgsAggregatedView, self).get_serializer_context()
        context.update({"request": self.request})
        return context


class BillsListView(generics.ListAPIView):
    permission_classes = (AllowAny,)
    queryset = bills__report()
    serializer_class = BillsReportSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['organization__name', 'organization__client__name']

    def get_serializer_context(self):
        context = super(BillsListView, self).get_serializer_context()
        context.update({"request": self.request})
        return context
