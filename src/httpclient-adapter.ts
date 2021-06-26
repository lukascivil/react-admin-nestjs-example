// Packages
import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { AxiosRequestConfig, AxiosError } from 'axios'
import httpClient from './httpclient'

const getHeaderTotal = (headers: Headers): number => {
  if (!headers.has('content-range')) {
    throw new Error(
      'The Content-Range header is missing in the HTTP Response. The simple REST data provider expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare Content-Range in the Access-Control-Expose-Headers header?'
    )
  }
  const contentRange = headers.get('content-range') || ''
  const content = contentRange.split('/') as [string, string]
  const total = parseInt([...content].pop() as string, 10)

  if (isNaN(total)) {
    throw new Error('The Content-Range header is not valid.')
  }

  return total
}

export const httpClientBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' }
  ): BaseQueryFn<
    {
      url: string
      method: AxiosRequestConfig['method']
      data?: AxiosRequestConfig['data']
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data }) => {
    try {
      const result = await httpClient(`${baseUrl + url}`, {
        method,
        body: data
      })

      return {
        data: result.json,
        meta: {
          contentRange: result.headers.get('content-range') ? getHeaderTotal(result.headers) : ''
        }
      }
    } catch (axiosError) {
      const err = axiosError as AxiosError

      return {
        error: { status: err.response?.status, data: err.response?.data }
      }
    }
  }
