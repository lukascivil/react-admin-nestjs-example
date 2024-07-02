// Packages
import { FC, useState } from 'react'
import { TextField, Datagrid, TextInput, GetListParams, SortPayload } from 'react-admin'
import { useGetUsersQuery } from 'store/api/users-api'
import LocalList from 'core/components/local-list'

export const ServerSideWithoutTotal: FC = () => {
  // RA GetList Params
  const [filter, setFilter] = useState({ email: '' })
  const [pagination, setPagination] = useState({ page: 1, perPage: 5 })
  const [sort, setSort] = useState<SortPayload>({ field: 'created_at', order: 'ASC' })
  // RTK
  const { isFetching, data } = useGetUsersQuery({
    filter,
    pagination,
    sort
  })

  return (
    <LocalList
      paginationStrategy="server-side-without-total"
      isLoading={isFetching}
      data={data?.data}
      page={pagination.page}
      perPage={pagination.perPage}
      onSubmit={setFilter}
      onSortChange={sort => setSort(sort)}
      onPageChange={page => setPagination(state => ({ ...state, page }))}
      onPerPageChange={perPage => setPagination(state => ({ ...state, perPage }))}
      sort={sort}
      filters={[<TextInput source="name" format={value => value ?? ''} />]}
      hasNextPage
    >
      <Datagrid>
        <TextField source="name" label="Name" />
        <TextField source="id" label="Id" />
        <TextField source="email" label="E-mail" />
      </Datagrid>
    </LocalList>
  )
}
