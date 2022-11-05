// Packages
import { FC } from 'react'
import { Datagrid, DateField, TextField, Link, FunctionField, ListContextProvider, useList } from 'react-admin'
import { useGetUsersQuery, User } from 'store/api/users-api'
import { Stack, Box, Button } from '@mui/material'

export const RtkList: FC = () => {
  const currentSort = { field: 'created_at', order: 'ASC' }
  const { data, isLoading } = useGetUsersQuery(
    {
      filter: {},
      pagination: { page: 1, perPage: 5 },
      sort: currentSort
    },
    { refetchOnMountOrArgChange: 2, pollingInterval: 10000 }
  )
  const listContext = useList({ data: data?.data, isLoading, sort: currentSort })

  return (
    <Box sx={{ pt: 2 }}>
      <Stack direction="row" justifyContent="flex-end" alignItems="center">
        <Button component={Link} to="/rtk/create">
          Criar
        </Button>
      </Stack>
      <Box sx={{ pt: 1 }}>
        <ListContextProvider value={listContext}>
          <Datagrid>
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="password" />
            <TextField source="email" />
            <DateField source="birthdate" showTime />
            <DateField source="updated_at" showTime />
            <DateField source="created_at" showTime />
            <FunctionField<User>
              render={record => {
                return (
                  <Button component={Link} to={`/rtk/${record?.id}`}>
                    Visualizar
                  </Button>
                )
              }}
            />
            <FunctionField<User>
              render={record => {
                return (
                  <Button component={Link} to={`/rtk/${record?.id}/edit`}>
                    Editar
                  </Button>
                )
              }}
            />
          </Datagrid>
        </ListContextProvider>
      </Box>
    </Box>
  )
}
