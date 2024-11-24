import { Typography } from '@mui/material'
import { SubscriptionOptions, TypedUseQueryHookResult } from '@reduxjs/toolkit/dist/query/react'
import { ReactElement } from 'react'
import { RecordContextProvider, LinearProgress, useRecordContext } from 'react-admin'
import { Error as ErrorIcon } from '@mui/icons-material'
import { usersApi } from 'store/api/users-api'

type Endpoints = keyof typeof usersApi.endpoints

type QueryArg<C extends Endpoints> = (typeof usersApi.endpoints)[C]['Types']['QueryArg']

type RtkQueryFieldProps<RecordType extends Record<string, any> = any, C extends Endpoints = Endpoints> = {
  label: string
  record?: RecordType
  children: ReactElement
  endpoint: C
  emptyText?: string
  args: (record?: RecordType) => QueryArg<C>
  queryOptions?: SubscriptionOptions & {
    skip?: boolean
    refetchOnMountOrArgChange?: boolean | number
  }
}

/**
 * RtkQueryField Component will be used to fetch data from the API and pass it to the children with record context.
 * This component is similar to ReferenceField from react-admin, but not requires response pattern.
 *
 * @param props
 * @returns
 */
const RtkQueryField = <
  RecordType extends Record<string, any> = any,
  C extends keyof typeof usersApi.endpoints = keyof typeof usersApi.endpoints
>(
  props: RtkQueryFieldProps
) => {
  const { children, emptyText, endpoint, args, queryOptions } = props
  const record = useRecordContext(props)
  const {
    data: referenceRecord,
    isError,
    isLoading
  }: TypedUseQueryHookResult<RecordType, any, any> = usersApi.endpoints[endpoint as C].useQuery(
    args(record) as QueryArg<C>,
    {
      skip: !args,
      ...queryOptions
    }
  )

  // const cafe: typeof usersApi.endpoints.getUsers.Types.QueryArg
  // const cafe: Pick<typeof usersApi.endpoints, 'getUsers'>['getUsers']['Types']['QueryArg']
  // const cafe: QueryArg<'getUsers'>

  console.log({ referenceRecord })

  if (isError) {
    return <ErrorIcon role="presentation" color="error" fontSize="small" />
  }

  if (isLoading) {
    return <LinearProgress />
  }

  if (!referenceRecord) {
    return emptyText ? (
      <Typography component="span" variant="body2">
        {emptyText}
      </Typography>
    ) : null
  }

  return <RecordContextProvider value={referenceRecord}>{children}</RecordContextProvider>
}

export default RtkQueryField
