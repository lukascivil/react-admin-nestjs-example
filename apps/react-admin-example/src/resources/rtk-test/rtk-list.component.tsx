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
  ResourceContextProvider,
  ReferenceField,
  ChipField,
  SingleFieldList
} from 'react-admin'
import { useGetManyUsersQuery, useGetUsersQuery, useLazyGetManyUsersQuery, User } from 'store/api/users-api'
import { Stack, Box, Button } from '@mui/material'
import { useForm, FormProvider } from 'react-hook-form'
import RtkReferenceField from './rtk-reference-field'
import RtkQueryField from './rtk-query-field'
import { cloneDeep } from 'lodash'

type FormValues = GetListParams

const defaultValues: GetListParams = {
  filter: {},
  pagination: { page: 1, perPage: 5 },
  sort: { field: 'created_at', order: 'ASC' }
}

const RtkList: FC = () => {
  const methods = useForm<FormValues>({
    mode: 'all',
    defaultValues
  })
  const { watch } = methods
  const payload = watch()
  const payload2 = useMemo(() => cloneDeep(payload), [payload])
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
              <Datagrid rowClick={false}>
                <TextField source="id" />
                <TextField source="name" />
                <TextField source="password" />
                <TextField source="email" />
                <DateField source="birthdate" showTime />
                <DateField source="updated_at" showTime />
                <DateField source="created_at" showTime />
                {/* RtkQueryField example 1 */}
                <RtkQueryField label="query" endpoint="getUsers" args={() => payload2}>
                  <Datagrid rowClick={false} bulkActionButtons={false}>
                    <TextField source="name" />
                  </Datagrid>
                </RtkQueryField>
                {/* RtkQueryField example 2 */}
                <RtkQueryField<User>
                  label="RtkQueryField"
                  endpoint="getManyUsers"
                  args={record => [record.id]}
                  emptyText="cafe"
                  queryOptions={{}}
                >
                  <SingleFieldList>
                    <ChipField source="name" />
                  </SingleFieldList>
                </RtkQueryField>
                {/* RtkQueryField example 3 */}
                <RtkQueryField<User>
                  label="RtkQueryField"
                  endpoint="getManyUsers"
                  args={record => [record.id]}
                  queryOptions={{}}
                >
                  <SingleFieldList>
                    <ChipField source="name" />
                  </SingleFieldList>
                </RtkQueryField>
                {/* RtkReferenceField example 1 */}
                <RtkReferenceField
                  label="RtkReferenceField"
                  source="id"
                  reference="getManyUsers"
                  rtkQuery={useGetManyUsersQuery}
                  emptyText="Sem referência"
                  queryOptions={{}}
                >
                  <TextField source="name" />
                </RtkReferenceField>
                {/* ReferenceField example 1 */}
                <ReferenceField
                  label="RaReferenceField"
                  source="id"
                  reference="users"
                  emptyText="Sem referência"
                  queryOptions={{}}
                >
                  <TextField source="name" />
                </ReferenceField>
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
