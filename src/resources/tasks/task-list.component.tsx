import React, { FC } from "react";
import {
  List,
  Datagrid,
  TextField,
  ListProps,
  BooleanField,
  ShowButton,
  EditButton,
  DateField,
  ReferenceField,
} from "react-admin";

export const TasksList: FC<ListProps> = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <ReferenceField label="User" source="user_id" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <TextField source="title" />
      <TextField source="description" />
      <BooleanField source="completed" />
      <DateField source="updated_at" showTime />
      <DateField source="created_at" showTime />
      <ShowButton />
      <EditButton />
    </Datagrid>
  </List>
);
