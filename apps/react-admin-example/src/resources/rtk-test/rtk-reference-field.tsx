import { Typography } from '@mui/material'
import { SubscriptionOptions } from '@reduxjs/toolkit/query'
import { TypedUseQuery } from '@reduxjs/toolkit/query/react'
import { ReactElement, useMemo, useState } from 'react'
import { useFieldValue, RecordContextProvider, LinearProgress, RaRecord, Identifier } from 'react-admin'
import { useDispatch } from 'react-redux'
// import { useGetManyQuery, usersApi } from 'store/api/users-api'
import { Error as ErrorIcon } from '@mui/icons-material'

interface RtkReferenceFieldProps {
  source: string
  label: string
  reference: string
  children: ReactElement
  rtkQuery?: TypedUseQuery<Array<RaRecord<Identifier>>, Array<Identifier>, any>
  emptyText?: string
  queryOptions?: SubscriptionOptions
}

const RtkReferenceField = (props: RtkReferenceFieldProps) => {
  const { children, reference, emptyText, rtkQuery, source, queryOptions } = props
  const id = useFieldValue({ source })

  // const cafe: TypedUseQueryHookResult<
  //   RaRecord<Identifier> | undefined,
  //   Array<Identifier>,
  //   any
  // > = usersApi.endpoints.getMany.useQuery([id])

  // 1 way (Build the hook) -> Good way without conditionals
  // const { data, isError, isLoading } = usersApi.endpoints[reference]
  //   ? usersApi.endpoints[reference].useQuery([id], queryOptions)
  //   : { data: null, isError: true, isLoading: false }

  // 2 way (comes from above)
  const { data, isError, isLoading } = rtkQuery!([id])

  // 3 way (very specific) -> Bad way
  // const { data } = useGetManyQuery([id])

  // 4 way (manual calls) -> Good way
  // const dispatch = useDispatch()
  // const [first, setfirst] = useState()
  //
  // useEffect(() => {
  //   const getMany = async () => {
  //     dispatch(usersApi.util.prefetch(rtkQueryReference, [id], { force: true }))

  //     const result = await dispatch(usersApi.util.getRunningQueryThunk(rtkQueryReference, [id]))

  //     setfirst(result?.data)

  //     console.log('Dados do usuário:', result.data)
  //   }

  //   getMany()
  // }, [])

  const aggregatedResult = data || []

  const record = useMemo(() => aggregatedResult.find((record: any) => record[source] === id), [aggregatedResult, id])

  console.log({ data, aggregatedResult })

  if (isError) {
    return <ErrorIcon role="presentation" color="error" fontSize="small" />
  }

  if (isLoading) {
    return <LinearProgress />
  }

  if (!record) {
    return emptyText ? (
      <Typography component="span" variant="body2">
        {emptyText}
      </Typography>
    ) : null
  }

  return <RecordContextProvider value={record}>{children}</RecordContextProvider>
}

export default RtkReferenceField
