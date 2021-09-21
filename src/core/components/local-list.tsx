// Packages
import React, { ReactElement, cloneElement, useEffect, useState, useCallback } from 'react'
import { Box, Button, TablePagination } from '@material-ui/core'
import { Config } from 'final-form'
import {
  ListContextProvider,
  Pagination,
  useList,
  useVersion,
  SortPayload,
  FilterPayload,
  useTranslate
} from 'react-admin'
import { Form } from 'react-final-form'
import PaginationWithoutNumber from './Pagination-without-number'

interface RaRecord {
  id: string | number
  [key: string]: any
}

interface EssentialParams extends Pick<Config, 'onSubmit'> {
  onRefresh?: () => void
  data?: Array<RaRecord>
  filters?: ReactElement | Array<ReactElement>
  perPage?: number
  sort: SortPayload
  filter?: FilterPayload
  isLoading?: boolean
  paginationStrategy?: 'local-numbered'
}

interface EssentialParams2 extends Omit<EssentialParams, 'paginationStrategy'> {
  paginationStrategy?: 'api-without-total'
  onPageChange?: (value: number) => void
  onSortChange?: (value: SortPayload) => void
  onPerPageChange?: (value: SortPayload) => void
}

interface EssentialParams3 extends Omit<EssentialParams, 'paginationStrategy'> {
  paginationStrategy?: 'api-with-total'
  onPageChange?: (value: number) => void
  onSortChange?: (value: SortPayload) => void
  onPerPageChange?: (value: number) => void
  total: number
}

interface Props {
  children: ReactElement
}

const LocalList = (props: (Props & EssentialParams) | (Props & EssentialParams2) | (Props & EssentialParams3)) => {
  const {
    children,
    onRefresh,
    data,
    isLoading,
    filters,
    onSubmit = () => undefined,
    perPage = 5,
    sort,
    filter,
    paginationStrategy = 'local-numbered',
    // @ts-ignore
    total,
    // @ts-ignore
    onPageChange = () => undefined,
    // @ts-ignore
    onSortChange = () => undefined,
    // @ts-ignore
    onPerPageChange = () => undefined
  } = props
  const translate = useTranslate()
  const filtersToRender = Array.isArray(filters) ? filters : filters === undefined ? [] : [filters]
  const [page, setPage] = useState(1)
  const version = useVersion()
  const listContext = useList({
    ids: [],
    data: data || [],
    loaded: !isLoading,
    loading: Boolean(isLoading),
    perPage,
    sort,
    filter
  })

  useEffect(() => {
    onPageChange(page)
  }, [page, onPageChange])

  useEffect(() => {
    onSortChange(listContext.currentSort)
  }, [listContext.currentSort, onSortChange])

  const handleNextPage = () => {
    setPage(state => state + 1)
  }

  const handleBackAllPage = () => {
    setPage(1)
  }

  const handleBackPage = () => {
    setPage(state => state - 1)
  }

  useEffect(() => {
    if (onRefresh) {
      onRefresh()
    }
  }, [onRefresh, version])

  const handlePageChange = useCallback(
    (_, page) => {
      setPage(page + 1)
    },
    [setPage]
  )

  const labelDisplayedRows = useCallback(
    ({ from, to, count }) =>
      translate('ra.navigation.page_range_info', {
        offsetBegin: from,
        offsetEnd: to,
        total: count
      }),
    [translate]
  )

  const handlePerPageChange = useCallback(
    event => {
      onPerPageChange(event.target.value)
    },
    [onPerPageChange]
  )

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
        {paginationStrategy === 'api-without-total' ? (
          <PaginationWithoutNumber
            page={page}
            next={handleNextPage}
            back={handleBackPage}
            backAll={handleBackAllPage}
          />
        ) : paginationStrategy === 'api-with-total' ? (
          <TablePagination
            count={total}
            rowsPerPage={perPage}
            page={page - 1}
            rowsPerPageOptions={[5, 10, 25]}
            component="span"
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handlePerPageChange}
            labelDisplayedRows={labelDisplayedRows}
          />
        ) : (
          <Pagination />
        )}
      </ListContextProvider>
    </Box>
  )
}

export default LocalList
