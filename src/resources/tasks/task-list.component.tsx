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
} from "react-admin";

export const TasksList: FC<ListProps> = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="description" />
      <BooleanField source="completed" />
      <DateField source="updated_at" />
      <DateField source="created_at" />
      <ShowButton />
      <EditButton />
    </Datagrid>
  </List>
);
