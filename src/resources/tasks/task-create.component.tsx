// Packages
import { RichTextInput } from 'ra-input-rich-text'
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
        <RichTextInput label="Description" source="description" />
        <BooleanInput label="Completed" source="completed" />
        <ReferenceInput label="Users" source="user_id" reference="users">
          <SelectInput optionText="name" />
        </ReferenceInput>
      </SimpleForm>
    </Create>
  )
}
