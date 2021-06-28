import React, { FC } from 'react'
import { useGetResourcesQuery } from 'store/api/resources-api'

export const TabResource: FC = () => {
  const { data, isLoading, isSuccess } = useGetResourcesQuery(undefined, { refetchOnMountOrArgChange: 5 })

  return (
    <>
      {isLoading && <div>Loading...</div>}
      {isSuccess && (
        <div>
          {data?.map(el => (
            <p>el</p>
          ))}
        </div>
      )}
    </>
  )
}
