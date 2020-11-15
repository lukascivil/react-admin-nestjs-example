// Packages
import React, { FC } from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  CreateProps,
  BooleanInput,
} from "react-admin";

export const TasksCreate: FC<CreateProps> = (props) => {
  const initialValues = {
    description: "",
    completed: false,
  };

  return (
    <Create {...props}>
      <SimpleForm initialValues={initialValues}>
        <TextInput label="Title" source="title" />
        <TextInput label="Description" source="descriptions" />
        <BooleanInput label="Completed" source="completed" />
      </SimpleForm>
    </Create>
  );
};
