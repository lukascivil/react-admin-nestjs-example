import React, { FC } from 'react'
import { useGetHealthQuery } from 'store/api/health-api'

export const TabHealth: FC = () => {
  const { data, isLoading, isSuccess } = useGetHealthQuery(undefined, { refetchOnMountOrArgChange: 5 })

  return (
    <>
      {isLoading && <div>Loading...</div>}
      {isSuccess && <div>{JSON.stringify(data)}</div>}
    </>
  )
}
