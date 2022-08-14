// Packages
import React, { FC, useEffect } from 'react'
import {
  Datagrid,
  DateField,
  TextField,
  Link,
  Button,
  FunctionField,
  // useVersion,
  useList,
  ListContextProvider,
  Pagination
} from 'react-admin'
import { useGetUsersCrudQuery, User } from 'store/api/users-crud-api.rtk'

export const RtkCrudList: FC = () => {
  const currentSort = { field: 'created_at', order: 'ASC' }
  // const version = useVersion()
  const { data, refetch, isFetching } = useGetUsersCrudQuery({
    filter: {},
    pagination: { page: 1, perPage: 5 },
    sort: currentSort
  })

  // useEffect(() => {
  //   refetch()
  // }, [refetch, version])

  // console.log({ data })

  const listContext = useList({
    data: data?.data,
    isLoading: isFetching
  })

  return (
    <div>
      <Button label="Criar" component={Link} to="/rtk/create" />
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
              return <Button label="Visualizar" component={Link} to={`/rtk-crud/${record?.id}`} />
            }}
          />
          <FunctionField<User>
            render={record => {
              return <Button label="Editar" component={Link} to={`/rtk-crud/${record?.id}/edit`} />
            }}
          />
        </Datagrid>
        <Pagination />
      </ListContextProvider>
    </div>
  )
}
