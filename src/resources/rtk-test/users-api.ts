// Packages
import { createApi } from '@reduxjs/toolkit/query/react'
import { httpClientBaseQuery } from 'httpclient-adapter'
import { stringify } from 'querystring'
import { fetchEnd, fetchStart, FilterPayload, GetListParams, Identifier } from 'react-admin'
import { selectRtkCachedItem } from 'utils/create-api-utils'

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

  return stringify(defaultQuery)
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
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          dispatch(fetchStart())
          await queryFulfilled
          dispatch(fetchEnd())
        } catch {
          dispatch(fetchEnd())
        }
      }
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
    }),
    getLoadedUser: build.query<boolean, { id: number; target?: string }>({
      queryFn: ({ id, target }, api) => {
        const state = api.getState()
        const cachedItem = selectRtkCachedItem<User>(state, usersApi.reducerPath, {
          id,
          target
        })

        return cachedItem
      }
    })
  })
})

export const {
  useCreateUserMutation,
  useGetUserQuery,
  useUpdateUserMutation,
  useGetUsersQuery,
  useGetLoadedUserQuery
} = usersApi
