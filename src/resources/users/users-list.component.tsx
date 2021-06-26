import React, { FC } from 'react'
import { List, Datagrid, TextField, ListProps, ShowButton, EditButton, DateField } from 'react-admin'

export const UsersList: FC<ListProps> = props => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="password" />
      <TextField source="email" />
      <DateField source="birthdate" showTime />
      <DateField source="updated_at" showTime />
      <DateField source="created_at" showTime />
      <ShowButton />
      <EditButton />
    </Datagrid>
  </List>
)
