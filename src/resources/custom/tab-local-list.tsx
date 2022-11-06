// Packages
import { FC, useState } from 'react'
import { TextField, Datagrid, TextInput } from 'react-admin'
import { useGetUsersQuery } from 'store/api/users-api'
import LocalList from 'core/components/local-list'

export const TabLocalList: FC = () => {
  const [filter, setFilter] = useState({ email: '' })
  const [pagination, setPagination] = useState({ page: 1, perPage: 5 })
  const [sort, setSort] = useState({ field: 'created_at', order: 'ASC' })
  const { isFetching, data } = useGetUsersQuery({
    filter,
    pagination,
    sort
  })

  return (
    <LocalList
      paginationStrategy="server-side-with-total"
      isLoading={isFetching}
      data={data?.data}
      page={pagination.page}
      perPage={pagination.perPage}
      onSubmit={setFilter}
      onSortChange={setSort}
      onPageChange={page => setPagination(state => ({ ...state, page }))}
      onPerPageChange={perPage => setPagination(state => ({ ...state, perPage }))}
      total={data?.total}
      sort={sort}
      filters={[<TextInput source="name" format={value => value ?? ''} />]}
    >
      <Datagrid>
        <TextField source="name" label="Name" />
        <TextField source="id" label="Id" />
        <TextField source="email" label="E-mail" />
      </Datagrid>
    </LocalList>
  )
}
