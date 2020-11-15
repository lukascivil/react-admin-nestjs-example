import React, { FC } from "react";
import {
  List,
  Datagrid,
  TextField,
  ListProps,
  BooleanField,
  ShowButton,
  EditButton,
} from "react-admin";

export const TasksList: FC<ListProps> = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="description" />
      <BooleanField source="completed" />
      <ShowButton />
      <EditButton />
    </Datagrid>
  </List>
);
