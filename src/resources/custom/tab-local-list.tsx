// Packages
import React, { FC, useState } from 'react'
import { TextField, Datagrid, TextInput, required } from 'react-admin'
import { useGetUsersQuery } from 'store/api/users-api'
import LocalList from 'core/components/local-list'

export const TabLocalList: FC = () => {
  const [filter, setFilter] = useState({ email: '' })
  const currentSort = { field: 'created_at', order: 'ASC' }
  const { isFetching, data, refetch } = useGetUsersQuery({
    filter,
    pagination: { page: 1, perPage: 50 },
    sort: currentSort
  })

  return (
    <LocalList
      isLoading={isFetching}
      data={data?.data}
      onRefresh={refetch}
      onSubmit={values => {
        // Bug around here, when setFilter changes state with a new filter.
        // This filter must contain the same key, otherwise it will imply
        // an error in the API causing the RTK hook to loop.
        setFilter(values as any)
      }}
      sort={currentSort}
      filters={[<TextInput source="email" validate={required()} />]}
    >
      <Datagrid>
        <TextField source="id" label="Id" />
        <TextField source="email" label="E-mail" />
      </Datagrid>
    </LocalList>
  )
}
