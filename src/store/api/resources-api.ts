// Packages
import { createApi } from '@reduxjs/toolkit/query/react'
import { httpClientBaseQuery } from 'httpclient-adapter'
import { Resource } from 'models/resource.model'

export const resourcesApi = createApi({
  reducerPath: 'resourcesApi',
  baseQuery: httpClientBaseQuery({
    baseUrl: 'http://localhost:3000/'
  }),
  tagTypes: ['resources'],
  refetchOnReconnect: true,
  endpoints: build => ({
    getResources: build.query<Array<Resource>, void>({
      query: () => ({
        url: '',
        method: 'GET'
      }),
      providesTags: (result, _error) => (result ? [{ type: 'resources', id: 'list' }] : []),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          // dispatch(fetchStart())
          await queryFulfilled
        } finally {
          // dispatch(fetchEnd())
        }
      }
    })
  })
})

export const { useGetResourcesQuery } = resourcesApi
