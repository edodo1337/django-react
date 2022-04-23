from decimal import Decimal
import pandas as pd
import numpy as np
from billing.models import Bill, Client, Organization
from billing.logic.selectors import clients__by_names, organizations__by_names


def upsert__clients(*, file: pd.ExcelFile):
    client_cols = ('name',)
    chunksize = 50

    df = pd.read_excel(file, names=client_cols, sheet_name='client')
    chunksize = len(df) > chunksize and len(df) // chunksize or len(df)

    for chunk in np.split(df, chunksize):
        clients_to_insert: list[Client] = []

        for _, row in chunk.iterrows():
            client = Client(name=row['name'])
            clients_to_insert.append(client)
        Client.objects.bulk_create(clients_to_insert, ignore_conflicts=True)


def upsert__organization(*, file: pd.ExcelFile):
    organization_cols = ('client_name', 'name')
    chunksize = 50

    df = pd.read_excel(file, names=organization_cols, sheet_name='organization')
    chunksize = len(df) > chunksize and len(df) // chunksize or len(df)

    for chunk in np.split(df, chunksize):
        organizations_to_insert: list[Organization] = []

        client_names: list[str] = chunk['client_name'].tolist()
        clients_map = {client.name: client for client in clients__by_names(names=client_names)}

        for _, row in chunk.iterrows():
            client = clients_map.get(row['client_name'])
            if client:
                organization = Organization(name=row['name'], client=client)
                organizations_to_insert.append(organization)
        Organization.objects.bulk_create(organizations_to_insert, ignore_conflicts=True)


def upsert_bills(*, file: pd.ExcelFile):
    bills_cols = ('client_org', '№', 'sum', 'date')
    chunksize = 50

    df = pd.read_excel(file, names=bills_cols)
    chunksize = len(df) > chunksize and len(df) // chunksize or len(df)

    for chunk in np.split(df, chunksize):
        bills_to_insert: list[Bill] = []

        organization_names: list[str] = chunk['client_org'].tolist()
        organizations_map = {
            org.name: org for org in organizations__by_names(names=organization_names)
        }

        for _, row in chunk.iterrows():
            org = organizations_map.get(row['client_org'])
            if org:
                bill = Bill(
                    organization=org, number=row['№'], sum=Decimal(row['sum']), date=row['date']
                )
                bills_to_insert.append(bill)
        Bill.objects.bulk_create(bills_to_insert, ignore_conflicts=True)
