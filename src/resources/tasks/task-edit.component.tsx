// Packages
import { RichTextInput } from 'ra-input-rich-text/dist/cjs/RichTextInput'
import { FC } from 'react'
import { Edit, SimpleForm, TextInput, BooleanInput, EditProps } from 'react-admin'

export const TasksEdit: FC<EditProps> = props => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <TextInput source="title" />
      <RichTextInput label="Description" source="description" />
      <BooleanInput source="completed" />
    </SimpleForm>
  </Edit>
)
