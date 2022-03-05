// Packages
import { createEntityAdapter } from '@reduxjs/toolkit'
import { createApi } from '@reduxjs/toolkit/query/react'
import { httpClientBaseQuery } from 'httpclient-adapter'
import { stringify } from 'querystring'
import { fetchEnd, fetchStart, FilterPayload, GetListParams, Identifier } from 'react-admin'
import { selectRtkCachedItem } from 'utils/create-api-utils'
import { resourcesApi } from './resources-api'

export interface User {
  id: Identifier
  name: string
  birthdate: string
  email: string
  password: string
  created_at: string
  updated_at: string
}

const generateListQuery = (params: GetListParams, filter?: FilterPayload): string => {
  const { page, perPage } = params.pagination
  const { field, order } = params.sort
  const defaultQuery = {
    sort: JSON.stringify([field, order]),
    range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
    filter: JSON.stringify({
      ...(filter || params.filter)
    })
  }

  return new URLSearchParams(defaultQuery).toString()
}

const usersAdapter = createEntityAdapter<User>()

export const usersCrudApi = createApi({
  reducerPath: 'usersCrudApi',
  baseQuery: httpClientBaseQuery({
    baseUrl: 'http://localhost:3000/'
  }),
  tagTypes: ['users'],
  endpoints: build => ({
    getUsersCrud: build.query<{ data: Array<User>; total: number }, GetListParams>({
      query: getListParams => ({
        url: `users?${generateListQuery(getListParams)}`,
        method: 'GET'
      }),
      providesTags: (result, _error) => (result ? [{ type: 'users', id: 'list' }] : []),
      transformResponse: (response: Array<User>, meta: { contentRange?: number }) => {
        const userEntity = usersAdapter.addMany(usersAdapter.getInitialState(), response)
        const data = (userEntity.ids.map(id => userEntity.entities[id]).filter(el => el) as Array<User>) || []

        return { data, total: meta?.contentRange || 0 }
      },
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const useQueryResult = await dispatch(
          resourcesApi.endpoints.getResources.initiate(undefined, { forceRefetch: true })
        )

        console.log({ useQueryResult })

        try {
          dispatch(fetchStart())
          await queryFulfilled
          dispatch(fetchEnd())
        } catch {
          dispatch(fetchEnd())
        }
      }
    }),
    getUserCrud: build.query<User, Identifier>({
      query: id => ({
        url: `users/${id}`,
        method: 'GET'
      }),
      transformResponse: (response: User) => {
        usersAdapter.addOne(usersAdapter.getInitialState(), response)
        const data = response

        return data
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        const userEntity = usersAdapter.getInitialState().entities[id]

        console.log({ cafe: userEntity })
        dispatch(
          usersCrudApi.util.updateQueryData('getUserCrud', id, draft => {
            Object.assign(draft, { id, cafe: 55 })
          })
        )

        await queryFulfilled
      }
    })
  })
})

export const { useGetUsersCrudQuery, useGetUserCrudQuery } = usersCrudApi
