import { Typography } from '@mui/material'
import { TypedUseQueryHookResult } from '@reduxjs/toolkit/dist/query/react'
import { ReactElement } from 'react'
import { RecordContextProvider, LinearProgress, RaRecord, Identifier, useRecordContext } from 'react-admin'
import { Error as ErrorIcon } from '@mui/icons-material'

interface RtkQueryFieldProps {
  label: string
  record?: RaRecord<Identifier>
  children: ReactElement
  queryHook: (record?: RaRecord<Identifier>) => TypedUseQueryHookResult<any, any, any>
  emptyText?: string
}

const RtkQueryField = (props: RtkQueryFieldProps) => {
  const { children, emptyText, queryHook } = props
  const record = useRecordContext(props)
  const { data: referenceRecord, isError, isLoading } = queryHook(record)

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
