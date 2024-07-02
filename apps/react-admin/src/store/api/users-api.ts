// Packages
import { createApi } from '@reduxjs/toolkit/query/react'
import { httpClientBaseQuery } from 'httpclient-adapter'
import { FilterPayload, GetListParams, Identifier } from 'react-admin'

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
  const { page, perPage } = params.pagination!
  const { field, order } = params.sort!
  const defaultQuery = {
    sort: JSON.stringify([field, order]),
    range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
    filter: JSON.stringify({
      ...(filter || params.filter)
    })
  }

  return new URLSearchParams(defaultQuery).toString()
}

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: httpClientBaseQuery({
    baseUrl: 'http://localhost:3000/'
  }),
  tagTypes: ['users'],
  endpoints: build => ({
    getUsers: build.query<{ data: Array<User>; total: number }, GetListParams>({
      query: getListParams => ({
        url: `users?${generateListQuery(getListParams)}`,
        method: 'GET'
      }),
      providesTags: (result, _error) => (result ? [{ type: 'users', id: 'list' }] : []),
      transformResponse: (response: Array<User>, meta: { contentRange?: number }) => {
        return { data: response, total: meta?.contentRange || 0 }
      },
      onCacheEntryAdded: async (_, { dispatch, cacheDataLoaded }) => {
        try {
          ;(await cacheDataLoaded).data.data.forEach(user => {
            dispatch(usersApi.util.upsertQueryData('getUser', user.id, user))
          })
        } catch {
          console.error('error')
        }
      },
      keepUnusedDataFor: 3
    }),
    getUser: build.query<User, Identifier>({
      query: id => ({
        url: `users/${id}`,
        method: 'GET'
      }),
      providesTags: (_result, _error, id) => [{ type: 'users', id }]
    }),
    createUser: build.mutation<User, User>({
      query: user => ({
        url: `users`,
        method: 'POST',
        data: { ...user }
      }),
      invalidatesTags: () => [{ type: 'users', id: 'list' }]
    }),
    updateUser: build.mutation<User, User>({
      query: user => ({
        url: `users/${user.id}`,
        method: 'PUT',
        data: { ...user }
      }),
      onQueryStarted: async (user, { dispatch, queryFulfilled }) => {
        // Optimistic Update getOne
        const patchResultGetUser = dispatch(
          usersApi.util.updateQueryData('getUser', 5, draft => {
            Object.assign(draft, { ...user, name: 'getOne() alterado' })
          })
        )

        // Optimistic Update getList
        const patchResultGetUsers = dispatch(
          usersApi.util.updateQueryData(
            'getUsers',
            {
              filter: {},
              pagination: { page: 1, perPage: 50 },
              sort: { field: 'created_at', order: 'ASC' }
            },
            draft => {
              const newdraft = draft.data.map(draftUser => {
                if (draftUser.id === user.id) {
                  return { ...draftUser, name: 'getList() alterado' }
                }

                return draftUser
              })

              draft.data = newdraft
            }
          )
        )

        try {
          await queryFulfilled
        } catch {
          patchResultGetUser.undo()
          patchResultGetUsers.undo()
        }
      }
    })
  })
})

export const { useCreateUserMutation, useGetUserQuery, useUpdateUserMutation, useGetUsersQuery } = usersApi
