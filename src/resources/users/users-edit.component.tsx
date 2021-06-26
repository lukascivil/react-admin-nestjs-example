// Packages
import React, { FC } from 'react'
import { Edit, SimpleForm, TextInput, EditProps } from 'react-admin'

export const UsersEdit: FC<EditProps> = props => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <TextInput disabled source="email" />
      <TextInput source="name" />
      <TextInput source="password" />
      <TextInput source="birthdate" />
    </SimpleForm>
  </Edit>
)
