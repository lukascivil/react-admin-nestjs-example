// Packages
import React, { FC } from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  DateInput,
  CreateProps,
  BooleanInput,
} from "react-admin";

export const TasksCreate: FC<CreateProps> = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput label="Description" source="descriptions" />
      <BooleanInput label="Completed" source="completed" />
    </SimpleForm>
  </Create>
);
