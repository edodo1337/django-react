from django.core.files.uploadedfile import InMemoryUploadedFile
import pandas as pd
from billing.logic.exceptions import (
    InvalidSheetsException,
    UpsertBillsException,
    UpsertClientsException,
    UpsertOrganizationsException,
)
from billing.logic.application import upsert__clients, upsert__organization, upsert_bills


def upload__bills(*, file: InMemoryUploadedFile):
    xl = pd.ExcelFile(file)

    try:
        upsert_bills(file=xl)
    except Exception as e:
        raise UpsertBillsException(e)


def upload__clients_organizations(*, file: InMemoryUploadedFile):
    sheet_names = {'client', 'organization'}

    xl = pd.ExcelFile(file)
    if set(xl.sheet_names) != sheet_names:
        raise InvalidSheetsException(f'Expected: {sheet_names}, got: {xl.sheet_names}')

    try:
        upsert__clients(file=xl)
    except Exception as e:
        raise UpsertClientsException(e)

    try:
        upsert__organization(file=xl)
    except Exception as e:
        raise UpsertOrganizationsException(e)
