import React, { FC } from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  ShowProps,
  BooleanField,
} from "react-admin";

export const TasksShow: FC<ShowProps> = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="description" />
      <BooleanField source="completed" />
    </SimpleShowLayout>
  </Show>
);
