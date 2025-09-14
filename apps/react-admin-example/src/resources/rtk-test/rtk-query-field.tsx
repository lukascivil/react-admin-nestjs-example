import { Typography } from '@mui/material'
import { ReactElement } from 'react'
import { RecordContextProvider, LinearProgress, useRecordContext } from 'react-admin'
import { Error as ErrorIcon } from '@mui/icons-material'
import { usersApi } from 'store/api/users-api'
import { SubscriptionOptions, TypedUseQueryHookResult } from '@reduxjs/toolkit/query/react'

type Endpoints = keyof typeof usersApi.endpoints

type QueryArg<C extends Endpoints> = (typeof usersApi.endpoints)[C]['Types']['QueryArg']

type RtkQueryFieldProps<RecordType extends Record<string, any> = any, C extends Endpoints = Endpoints> = {
  label: string
  record?: RecordType
  children: ReactElement
  endpoint: C
  emptyText?: string
  args: (record?: RecordType) => QueryArg<C> | undefined
  queryOptions?: SubscriptionOptions & {
    skip?: boolean
    refetchOnMountOrArgChange?: boolean | number
  }
}

/**
 * RtkQueryField Component will be used to fetch data from the API and pass it to the children with record context.
 * This component is similar to the ReferenceField from react-admin, but it does not require a request or response body pattern.
 * It does require the arg prop passed to the redux toolkit endpoint to be valid.
 *
 * Example:
 * ```tsx
 *  // Simple use without accessing record
 *  <RtkQueryField label="User name" endpoint="getUsers" args={() => payload2}>
 *     <Datagrid rowClick={false} bulkActionButtons={false}>
 *       <TextField source="name" />
 *     </Datagrid>
 *  </RtkQueryField>
 *
 *  // Use with record, we should pass two generics to the RtkQueryField
 *  <RtkQueryField<'getUsers', Array<User>>
 *    label="RtkQueryField 4"
 *    endpoint="getUsers"
 *    args={record => (record ? [record.id] : undefined)}
 *    queryOptions={{}}
 *  >
 *    <FunctionField<{ data: Array<User>; total: number }>
 *      render={record => {
 *        return record.total
 *      }}
 *    />
 *  </RtkQueryField>
 * ```
 *
 * @param props
 * @returns
 */
const RtkQueryField = <C extends Endpoints, RecordType extends Record<string, any> = any>(
  props: RtkQueryFieldProps<RecordType, C>
) => {
  const { children, emptyText, endpoint, args, queryOptions } = props
  const record = useRecordContext(props)
  const { data: referenceRecord, isError, isLoading }: TypedUseQueryHookResult<RecordType, any, any> =
    /* @ts-ignore */
    usersApi.endpoints[endpoint].useQuery(args(record), {
      skip: !args,
      ...queryOptions
    })

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
