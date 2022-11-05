// Packages
import { FC, useState } from 'react'
import { TextField, Datagrid, TextInput, required } from 'react-admin'
import { useGetUsersQuery } from 'store/api/users-api'
import LocalList from 'core/components/local-list'

export const TabLocalList: FC = () => {
  const [filter, setFilter] = useState({ email: '' })
  const currentSort = { field: 'created_at', order: 'ASC' }
  const { isFetching, data } = useGetUsersQuery({
    filter,
    pagination: { page: 1, perPage: 50 },
    sort: currentSort
  })

  return (
    <LocalList
      paginationStrategy="client-side"
      isLoading={isFetching}
      data={data?.data}
      onSubmit={values => {
        setFilter(values)
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
