// Packages
import React, { FC, useEffect } from 'react'
import { Datagrid, DateField, TextField, Link, Button, FunctionField } from 'react-admin'
import { useGetUsersQuery, User } from 'store/api/users-api'

export const RtkList: FC = () => {
  const currentSort = { field: 'created_at', order: 'ASC' }
  // const version = useVersion()
  const { data, refetch, isFetching } = useGetUsersQuery(
    {
      filter: {},
      pagination: { page: 1, perPage: 5 },
      sort: currentSort
    },
    { refetchOnMountOrArgChange: 2, pollingInterval: 10000 }
  )
  const { data: cafe } = useGetUsersQuery({
    filter: {},
    pagination: { page: 2, perPage: 5 },
    sort: currentSort
  })
  const users = data?.data.reduce((prev, curr, index) => {
    prev[index] = curr

    return prev
  }, {})

  // useEffect(() => {
  //   refetch()
  // }, [refetch, version])

  return (
    <div>
      <Button label="Criar" component={Link} to="/rtk/create" />
      <Datagrid sort={currentSort} data={users} isLoading={Boolean(users) || !isFetching} total={data?.total || 0}>
        <TextField source="id" />
        <TextField source="name" />
        <TextField source="password" />
        <TextField source="email" />
        <DateField source="birthdate" showTime />
        <DateField source="updated_at" showTime />
        <DateField source="created_at" showTime />
        <FunctionField<User>
          render={record => {
            return <Button label="Visualizar" component={Link} to={`/rtk/${record?.id}`} />
          }}
        />
        <FunctionField<User>
          render={record => {
            return <Button label="Editar" component={Link} to={`/rtk/${record?.id}/edit`} />
          }}
        />
      </Datagrid>
    </div>
  )
}
