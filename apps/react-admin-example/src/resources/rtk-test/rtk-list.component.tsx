// Packages
import { FC, useMemo } from 'react'
import {
  Datagrid,
  DateField,
  TextField,
  Link,
  FunctionField,
  ListContextProvider,
  useList,
  Pagination,
  TextInput,
  GetListParams,
  RecordContextProvider,
  ResourceContextProvider
} from 'react-admin'
import { useGetUsersQuery, User } from 'store/api/users-api'
import { Stack, Box, Button } from '@mui/material'
import { useForm, FormProvider } from 'react-hook-form'

type FormValues = GetListParams

const RtkList: FC = () => {
  const methods = useForm<FormValues>({
    mode: 'all',
    defaultValues: {
      filter: { name: '' },
      pagination: { page: 1, perPage: 5 },
      sort: { field: 'created_at', order: 'ASC' }
    }
  })
  const { watch } = methods
  const payload = watch()
  const payload2 = useMemo(() => JSON.parse(JSON.stringify(payload)), [payload])
  const { data, isLoading } = useGetUsersQuery(payload2)
  const listContext = useList({ data: data?.data, isLoading })

  return (
    <Box sx={{ pt: 2 }}>
      <Stack direction="row" justifyContent="flex-end" alignItems="center">
        <Button component={Link} to="/rtk/create">
          Criar
        </Button>
      </Stack>
      <Box sx={{ pt: 1 }}>
        <FormProvider {...methods}>
          <TextInput source="filter.name" format={value => value ?? ''} />
        </FormProvider>
        <ResourceContextProvider value="postss">
          <RecordContextProvider value={data}>
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
              <Pagination rowsPerPageOptions={[10, 25, 50, 100]} />
            </ListContextProvider>
          </RecordContextProvider>
        </ResourceContextProvider>
      </Box>
    </Box>
  )
}

export default RtkList
