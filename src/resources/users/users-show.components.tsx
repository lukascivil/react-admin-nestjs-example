import React, { FC } from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  ShowProps,
  BooleanField,
  DateField,
} from "react-admin";

export const UsersShow: FC<ShowProps> = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="password" />
      <TextField source="email" />
      <DateField source="birthdate" showTime />
      <DateField source="updated_at" showTime />
      <DateField source="created_at" showTime />
    </SimpleShowLayout>
  </Show>
);
