// Packages
import React, { ReactElement, cloneElement, useEffect } from 'react'
import { Box, Button } from '@material-ui/core'
import { Config } from 'final-form'
import { ListContextProvider, Pagination, useList, SortPayload, FilterPayload } from 'react-admin'
import { Form } from 'react-final-form'

interface RaRecord {
  id: string | number
  [key: string]: any
}

interface EssentialParams extends Pick<Config, 'onSubmit'> {
  onRefresh?: () => void
  data?: Array<RaRecord>
  filters?: ReactElement | Array<ReactElement>
  perPage?: 5 | 10 | 25
  sort?: SortPayload
  filter?: FilterPayload
  isLoading?: boolean
}

interface Props extends EssentialParams {
  children: ReactElement
}

const LocalList = (props: Props) => {
  const { children, onRefresh, data, isLoading, filters, onSubmit = () => undefined, perPage = 5, sort, filter } = props
  const filtersToRender = Array.isArray(filters) ? filters : filters === undefined ? [] : [filters]
  // const version = useVersion()
  const listContext = useList({
    data: data || [],
    isLoading: Boolean(isLoading),
    perPage,
    sort,
    filter
  })

  // useEffect(() => {
  //   if (onRefresh) {
  //     onRefresh()
  //   }
  // }, [onRefresh, version])

  return (
    <Box>
      {filtersToRender && (
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit }) => {
            return (
              <form onSubmit={handleSubmit}>
                <Box display="flex" alignItems="center">
                  <Box>{filtersToRender.map((component, index) => cloneElement(component, { key: index }))}</Box>
                  <Box pl={1}>
                    <Button type="submit" variant="text" color="primary">
                      Pesquisar
                    </Button>
                  </Box>
                </Box>
              </form>
            )
          }}
        />
      )}
      <ListContextProvider value={listContext}>
        {children}
        <Pagination />
      </ListContextProvider>
    </Box>
  )
}

export default LocalList
