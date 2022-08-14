// Packages
import { createApi } from '@reduxjs/toolkit/query/react'
import { httpClientBaseQuery } from 'httpclient-adapter'
import { Health } from 'models/health.model'

export const healthApi = createApi({
  reducerPath: 'healthApi',
  baseQuery: httpClientBaseQuery({
    baseUrl: 'http://localhost:3000/'
  }),
  tagTypes: ['health'],
  refetchOnReconnect: true,
  endpoints: build => ({
    getHealth: build.query<Health, void>({
      query: () => ({
        url: 'health',
        method: 'GET'
      }),
      providesTags: (result, _error) => (result ? [{ type: 'health', id: 'list' }] : []),
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

export const { useGetHealthQuery } = healthApi
