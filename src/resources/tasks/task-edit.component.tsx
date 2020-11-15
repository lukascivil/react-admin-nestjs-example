// Packages
import React, { FC } from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  BooleanInput,
  EditProps,
} from "react-admin";

export const TasksEdit: FC<EditProps> = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <TextInput source="description" />
      <BooleanInput source="completed" />
    </SimpleForm>
  </Edit>
);
