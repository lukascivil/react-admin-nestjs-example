// Packages
import React, { FC } from 'react'
import { Create, SimpleForm, TextInput, CreateProps, BooleanInput, ReferenceInput, SelectInput } from 'react-admin'

export const TasksCreate: FC<CreateProps> = props => {
  const initialValues = {
    description: '',
    completed: false
  }

  return (
    <Create {...props}>
      <SimpleForm defaultValues={initialValues}>
        <TextInput label="Title" source="title" />
        <TextInput label="Description" source="descriptions" />
        <BooleanInput label="Completed" source="completed" />
        <ReferenceInput label="Users" source="user_id" reference="users">
          <SelectInput optionText="name" />
        </ReferenceInput>
      </SimpleForm>
    </Create>
  )
}
