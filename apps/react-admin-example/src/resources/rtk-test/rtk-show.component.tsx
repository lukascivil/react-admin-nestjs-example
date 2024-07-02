// Packages
import { FC } from 'react'
import { TextField, DateField, RecordContextProvider, SimpleShowLayout } from 'react-admin'
import { Box, Card, Typography } from '@mui/material'
import { useGetUserQuery } from 'store/api/users-api'
import { useLocation } from 'react-router-dom'

export const RtkShow: FC = () => {
  const location = useLocation()
  const id = parseInt(location.pathname.split('/').reverse()[0], 10)
  const { data: user } = useGetUserQuery(id)

  return (
    <Card>
      <Box m={2}>
        <RecordContextProvider value={user}>
          <Box pt={2}>
            <Typography variant="h6">Cadastro</Typography>
          </Box>
          <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="password" />
            <TextField source="email" />
            <DateField source="birthdate" showTime />
            <DateField source="updated_at" showTime />
            <DateField source="created_at" showTime />
          </SimpleShowLayout>
        </RecordContextProvider>
      </Box>
    </Card>
  )
}
