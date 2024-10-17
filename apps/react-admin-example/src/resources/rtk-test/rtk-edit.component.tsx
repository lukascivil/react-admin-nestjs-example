// Packages
import { FC } from 'react'
import { TextInput, useNotify, useRedirect, Form, Title, FormDataConsumer } from 'react-admin'
import { Button, Card, CardContent, Container } from '@mui/material'
import { useGetUserQuery, useUpdateUserMutation } from 'store/api/users-api'
import { useParams } from 'react-router-dom'
import { parse } from 'date-fns'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { skipToken } from '@reduxjs/toolkit/query'

const schema = z.object({
  id: z.number({ message: 'Required' }),
  email: z.string().min(1, { message: 'Required' }),
  name: z.string().min(1, { message: 'Required' }),
  password: z.string().min(1, { message: 'Required' }),
  birthdate: z.string().min(10, { message: 'Required' })
})

export const RtkEdit: FC = () => {
  const { id } = useParams()
  const notify = useNotify()
  const redirect = useRedirect()
  const [updateUser] = useUpdateUserMutation()
  const { data: record } = useGetUserQuery(id ?? skipToken, {
    refetchOnMountOrArgChange: true
  })

  const handleSubmit = formValues => {
    const payload = {
      ...formValues,
      birthdate: parse(formValues.birthdate, 'yyyy-MM-dd', new Date())
    }

    updateUser(payload)
      .unwrap()
      .then(() => {
        redirect('/rtk')
        notify('Usuário atualizado com sucesso')
      })
      .catch(() => {
        notify('Erro ao atualizar usuário')
      })
  }

  return (
    <Container>
      <Title title={`RTK edit ${record?.name}`} />
      <Card>
        <CardContent>
          <Form record={record} onSubmit={handleSubmit} resolver={zodResolver(schema)} disabled={!id}>
            <TextInput readOnly source="id" />
            <TextInput readOnly source="email" />
            <TextInput source="name" />
            <TextInput source="password" />
            <TextInput source="birthdate" />
            <FormDataConsumer<z.infer<typeof schema>>>
              {({ formData }) => (
                <Button type="submit" variant="contained" disabled={!formData.id}>
                  Salvar
                </Button>
              )}
            </FormDataConsumer>
          </Form>
        </CardContent>
      </Card>
    </Container>
  )
}
