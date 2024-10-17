// Packages
import { FC } from 'react'
import { TextField, DateField, SimpleShowLayout, Title } from 'react-admin'
import { Box, Card, CardContent, Container, Typography } from '@mui/material'
import { useGetUserQuery } from 'store/api/users-api'
import { useParams } from 'react-router-dom'
import { skipToken } from '@reduxjs/toolkit/query'

export const RtkShow: FC = () => {
  const { id } = useParams()
  const { data: record } = useGetUserQuery(id ?? skipToken)

  return (
    <Container>
      <Title title={`RTK show ${record?.name}`} />
      <Card>
        <CardContent>
          <Box pt={2}>
            <Typography variant="h6">Cadastro</Typography>
          </Box>
          <SimpleShowLayout record={record}>
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="password" />
            <TextField source="email" />
            <DateField source="birthdate" showTime />
            <DateField source="updated_at" showTime />
            <DateField source="created_at" showTime />
          </SimpleShowLayout>
        </CardContent>
      </Card>
    </Container>
  )
}
