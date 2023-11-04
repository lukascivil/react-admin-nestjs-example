// Packages
import { FC, useState } from 'react'
import { TextField, Datagrid, TextInput, GetListParams, SortPayload } from 'react-admin'
import { useGetUsersQuery } from 'store/api/users-api'
import LocalList from 'core/components/local-list'

export const ServerSideWithTotal: FC = () => {
  // RA GetList Params
  const [getListParams, setGetListParams] = useState<GetListParams>({
    filter: { email: '' },
    pagination: { page: 1, perPage: 5 },
    sort: { field: 'created_at', order: 'ASC' }
  })
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
    <>
      {JSON.stringify(getListParams)}
      <LocalList
        paginationStrategy="server-side-with-total"
        isLoading={isFetching}
        data={data?.data}
        page={pagination.page}
        perPage={pagination.perPage}
        onSubmit={setFilter}
        onGetListParamsChange={setGetListParams}
        onSortChange={sort => setSort(sort)}
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
    </>
  )
}
