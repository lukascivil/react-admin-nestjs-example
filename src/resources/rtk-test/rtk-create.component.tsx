// Packages
import React, { FC } from 'react'
import { DateInput, TextInput, useNotify, useRedirect } from 'react-admin'
import { Box, Button, Card } from '@mui/material'
import { useCreateUserMutation } from 'store/api/users-api'
import { Form } from 'react-final-form'
import { parse } from 'date-fns'

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
    <Card>
      <Box m={2}>
        <Form
          onSubmit={handleSubmit}
          keepDirtyOnReinitialize
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Box>
                <TextInput source="email" />
              </Box>
              <Box>
                <TextInput source="name" />
              </Box>
              <Box>
                <TextInput source="password" />
              </Box>
              <Box>
                <DateInput source="birthdate" />
              </Box>
              <Box>
                <Button type="submit">Salvar</Button>
              </Box>
            </form>
          )}
        />
      </Box>
    </Card>
  )
}
