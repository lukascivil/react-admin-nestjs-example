// Packages
import React, { FC, useState } from 'react'
import { TextField, Datagrid, TextInput, required } from 'react-admin'
import { useGetUsersQuery } from 'store/api/users-api'
import LocalList from 'core/components/local-list'

export const TabLocalListWithApiPagination: FC = () => {
  const [page, setPage] = useState({})
  const [perPage, setPerPage] = useState(6)
  const [sort, setSort] = useState({ field: 'created_at', order: 'ASC' })
  const { isFetching, data, refetch } = useGetUsersQuery({
    filter: {},
    pagination: { page, perPage },
    sort: sort
  })

  return (
    <LocalList
      perPage={perPage}
      isLoading={isFetching}
      data={data?.data}
      onRefresh={refetch}
      onPageChange={value => {
        setPage(value)
      }}
      onSortChange={value => {
        setSort(value)
      }}
      onPerPageChange={value => {
        setPerPage(value)
      }}
      total={data?.total || 0}
      sort={sort}
      onSubmit={() => {}}
      paginationStrategy="api-with-total"
      filters={[<TextInput source="email" validate={required()} />]}
    >
      <Datagrid>
        <TextField source="id" label="Id" />
        <TextField source="email" label="E-mail" />
      </Datagrid>
    </LocalList>
  )
}
