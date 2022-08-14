// Packages
import React, { FC, useEffect } from 'react'
import { TextField, DateField, RecordContextProvider, SimpleShowLayout } from 'react-admin'
import { Box, Card, Typography } from '@mui/material'
import { useLocation } from 'react-router-dom'
import { useGetUserCrudQuery } from 'store/api/users-crud-api.rtk'

export const RtkCrudShow: FC = () => {
  const location = useLocation()
  // const version = useVersion()
  const id = location.pathname.split('/').reverse()[0]
  const { data: user, refetch, isFetching } = useGetUserCrudQuery(id)
  const { data: user2 } = useGetUserCrudQuery('55')

  console.log({ user, isFetching })

  // useEffect(() => {
  //   refetch()
  // }, [refetch, version])

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
