import React, { FC } from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  ShowProps,
  BooleanField,
  DateField,
} from "react-admin";

export const TasksShow: FC<ShowProps> = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="description" />
      <BooleanField source="completed" />
      <DateField source="updated_at" showTime />
      <DateField source="created_at" showTime />
    </SimpleShowLayout>
  </Show>
);
