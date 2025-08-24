import { Locker, LockerCasl } from 'core/components'
import React, { FC, ReactElement } from 'react'
import {
  List,
  Datagrid,
  TextField,
  ListProps,
  ShowButton,
  EditButton,
  DateField,
  TopToolbar,
  CreateButton,
  ExportButton
} from 'react-admin'

const ListActions = (): ReactElement => (
  <TopToolbar>
    <LockerCasl source="nameLockerCasl" action="create" subject="users">
      <CreateButton />
    </LockerCasl>
    <LockerCasl source="nameLockerCasl" action="export" subject="users">
      <ExportButton />
    </LockerCasl>
  </TopToolbar>
)

export const UsersList: FC<ListProps> = props => (
  <List actions={<ListActions />} {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <Locker source="nameLocker" unlock={['n4']}>
        <TextField source="name" label="nameLocker" />
      </Locker>
      <LockerCasl source="nameLockerCasl" action="read" subject="users">
        <TextField source="name" label="nameLockerCasl" />
      </LockerCasl>
      <TextField source="password" />
      <TextField source="email" />
      <DateField source="birthdate" showTime />
      <DateField source="updated_at" showTime />
      <DateField source="created_at" showTime />
      <ShowButton />
      <LockerCasl action="read" subject="users">
        <EditButton />
      </LockerCasl>
    </Datagrid>
  </List>
)
