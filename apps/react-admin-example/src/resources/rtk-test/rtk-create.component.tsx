// Packages
import React, { FC } from 'react'
import { DateInput, TextInput, useNotify, useRedirect, Form, Title } from 'react-admin'
import { Card, CardContent, Container, Button } from '@mui/material'
import { useCreateUserMutation } from 'store/api/users-api'
import { parse } from 'date-fns'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  email: z.string().min(1, { message: 'Required' }),
  name: z.string().min(1, { message: 'Required' }),
  password: z.string().min(1, { message: 'Required' }),
  birthdate: z.string().min(10, { message: 'Required' })
})

export const RtkCreate: FC = () => {
  const notify = useNotify()
  const [createUser] = useCreateUserMutation()
  const redirect = useRedirect()

  const handleSubmit = formValues => {
    const payload = {
      ...formValues,
      birthdate: parse(formValues.birthdate, 'yyyy-MM-dd', new Date())
    }

    createUser(payload)
      .unwrap()
      .then(() => {
        redirect('/rtk')
        notify('Usuário criado com sucesso')
      })
      .catch(() => {
        notify('Erro ao criar usuário')
      })
  }

  return (
    <Container>
      <Title title="RTK create" />
      <Card>
        <CardContent>
          <Form onSubmit={handleSubmit} resolver={zodResolver(schema)}>
            <TextInput source="email" />
            <TextInput source="name" />
            <TextInput source="password" />
            <DateInput source="birthdate" />
            <Button type="submit">Salvar</Button>
          </Form>
        </CardContent>
      </Card>
    </Container>
  )
}
