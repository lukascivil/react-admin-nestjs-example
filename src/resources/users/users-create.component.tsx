// Packages
import React, { FC } from 'react'
import { Create, SimpleForm, TextInput, CreateProps, DateInput } from 'react-admin'
import { parse } from 'date-fns'

export const UsersCreate: FC<CreateProps> = props => {
  const initialValues = {
    description: '',
    completed: false
  }

  const transform = data => {
    return {
      ...data,
      birthdate: parse(data.birthdate, 'yyyy-MM-dd', new Date())
    }
  }

  return (
    <Create {...props} transform={transform}>
      <SimpleForm initialValues={initialValues}>
        <TextInput source="email" />
        <TextInput source="name" />
        <TextInput source="password" />
        <DateInput source="birthdate" />
      </SimpleForm>
    </Create>
  )
}
