// Packages
import { createApi } from '@reduxjs/toolkit/query/react'
import httpClient from 'httpclient'
import { httpClientBaseQuery } from 'httpclient-adapter'
import { FilterPayload, GetListParams, GetManyParams, Identifier, RaRecord } from 'react-admin'

// Models
import { User } from 'models/user.model'

const generateGetManyQuery = (params: GetManyParams, filter?: FilterPayload): string => {
  const defaultQuery = {
    filter: JSON.stringify({
      id: params.ids,
      ...filter
    })
  }

  return new URLSearchParams(defaultQuery).toString()
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

const batch = fn => {
  let capturedArgs: any[] = []
  let timeout: ReturnType<typeof setTimeout> | null = null
  return (arg: any) => {
    capturedArgs.push(arg)
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      timeout = null
      fn([...capturedArgs])
      capturedArgs = []
    }, 0)
  }
}

interface Call {
  resolve: (value: any) => void
  reject: (value: any) => void
  ids: GetManyParams['ids']
  dataProvider: (queryParam: string) => ReturnType<typeof httpClient>
}

const callGetManyQueries = batch(async (calls: Array<Call>) => {
  console.log('chamei 3 callGetManyQueries')

  console.log({ calls })
  const dataProvider = calls[0].dataProvider
  const ids = calls.map(call => call.ids).flat()
  const queryParam = generateGetManyQuery({ ids })

  const response = await dataProvider(queryParam)

  calls.forEach(call => {
    call.resolve(response.json)
  })
})

const result = (dataProvider: any, ids: GetManyParams['ids']): Promise<any> =>
  new Promise((resolve, reject) => {
    console.log('chamei 2 result')

    callGetManyQueries({ reject, resolve, ids, dataProvider })
  })

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
      // To understand how to implement optimistic rendering in details
      // see https://redux-toolkit.js.org/rtk-query/api/created-api/api-slice-utils#upsertqueryentries
      // (1) Using upsertQueryEntries (The correct way)
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const response = await queryFulfilled
        const users = response.data.data
        const actions = users.map(user => ({
          endpointName: 'getUser' as const,
          arg: user.id,
          value: user
        }))

        // Pre-fill the individual user entries with the users list
        await dispatch(usersApi.util.upsertQueryEntries(actions))
      },
      // (2) Using upsertQueryData (Alternative, calling all endpoint stuff)
      // onCacheEntryAdded: async (_, { dispatch, cacheDataLoaded }) => {
      //   try {
      //     ;(await cacheDataLoaded).data.data.forEach(user => {
      //       dispatch(usersApi.util.upsertQueryData('getUser', user.id, user))
      //     })
      //   } catch {
      //     console.error('error')
      //   }
      // },
      keepUnusedDataFor: 3
    }),
    getManyUsers: build.query<Array<RaRecord<Identifier>>, Array<Identifier>>({
      queryFn: async arg => {
        const promise = (queryParam: string) =>
          httpClient(`http://localhost:3000/users?${queryParam}`, {
            method: 'GET'
          })

        console.log('chamei 1 queryFn')
        const result1: Array<RaRecord<Identifier>> = await result(promise, arg)

        return { data: result1 }
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

export const { useCreateUserMutation, useGetUserQuery, useUpdateUserMutation, useGetUsersQuery, useGetManyUsersQuery } =
  usersApi
