// Packages
import {
  ReactElement,
  cloneElement,
  useEffect,
  useState,
  useCallback,
  useMemo,
  ChangeEvent,
  MouseEvent,
  useRef
} from 'react'
import {
  Box,
  Card,
  Grid,
  LabelDisplayedRowsArgs,
  Toolbar,
  TablePagination,
  MenuItem,
  Menu,
  IconButton
} from '@mui/material'
import {
  Pagination,
  SortPayload,
  FilterPayload,
  useTranslate,
  RaRecord,
  ListContextProvider,
  useList,
  PaginationActions,
  RecordContextProvider,
  Button
} from 'react-admin'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { omit } from 'lodash'
import { LoadingButton } from '@mui/lab'

// Icons
import { FilterList as ContentFilter, HighlightOff as ActionHide, GetApp as DownloadIcon } from '@mui/icons-material'

interface ClientSideParams {
  data?: Array<RaRecord>
  filters?: ReactElement | Array<ReactElement>
  onSubmit?: SubmitHandler<any>
  page?: number
  perPage?: number
  sort: SortPayload
  filter?: FilterPayload
  isLoading?: boolean
  paginationStrategy: 'client-side'
  isDisablePagination?: boolean
  isDisableCardBackground?: boolean
  emptyMessage?: string
  hasFilterButton?: boolean
  exporter?: () => Promise<void>
}

interface ServerSideWithoutTotalParams extends Omit<ClientSideParams, 'paginationStrategy'> {
  paginationStrategy: 'server-side-without-total'
  hasPreviousPage?: boolean
  hasNextPage?: boolean
  onPageChange?: (value: number) => void
  onSortChange?: (value: SortPayload) => void
  onPerPageChange?: (value: number) => void
}

interface ServerSideWithTotalParams extends Omit<ClientSideParams, 'paginationStrategy'> {
  paginationStrategy: 'server-side-with-total'
  onPageChange?: (value: number) => void
  onSortChange?: (value: SortPayload) => void
  onPerPageChange?: (value: number) => void
  total: number | undefined
}

interface Props {
  children: ReactElement
}

type LocalListProps = ClientSideParams | ServerSideWithoutTotalParams | ServerSideWithTotalParams

const rowsPerPageOptions = [5, 10, 25]

const LocalListDatagrid = (
  props: Props & Omit<LocalListProps, 'filters' | 'onSubmit' | 'hasCardBackground'>
): ReactElement => {
  const {
    paginationStrategy = 'client-side',
    children,
    data,
    isLoading,
    page: initialPage = 1,
    perPage = 5,
    sort,
    filter,
    // @ts-ignore
    total,
    // @ts-ignore
    hasPreviousPage,
    // @ts-ignore
    hasNextPage,
    // @ts-ignore
    onPageChange = () => undefined,
    // @ts-ignore
    onSortChange = () => undefined,
    // @ts-ignore
    onPerPageChange = () => undefined,
    isDisablePagination = false,
    emptyMessage
  } = props

  const translate = useTranslate()
  const [page, setPage] = useState(initialPage)
  const memoizedData = useMemo(() => data || [], [data])
  const count = total ? total : memoizedData.length
  const listContext = useList({
    data: memoizedData,
    isFetching: isLoading,
    page: paginationStrategy === 'client-side' ? page : undefined,
    perPage,
    sort,
    filter
  })

  useEffect(() => {
    onPageChange(page)
  }, [page, onPageChange])

  useEffect(() => {
    setPage(initialPage)
  }, [initialPage])

  useEffect(() => {
    if (paginationStrategy === 'client-side' && listContext.page !== page) {
      listContext.setPage(page)
    }
  }, [page, paginationStrategy, listContext])

  useEffect(() => {
    onSortChange(listContext.sort)
  }, [listContext.sort, onSortChange])

  const handleNextPage = (): void => {
    setPage(state => state + 1)
  }

  const handlePreviousAllPage = (): void => {
    setPage(1)
  }

  const handlePreviousPage = (): void => {
    setPage(state => state - 1)
  }

  const totalPages = useMemo(() => Math.ceil(count / perPage) || 1, [perPage, count])

  const handlePageChange = useCallback(
    (event: MouseEvent<HTMLButtonElement> | null, value: number) => {
      event && event.stopPropagation()

      if (value < 0 || value > totalPages - 1) {
        throw new Error(
          translate('ra.navigation.page_out_of_boundaries', {
            page: value + 1
          })
        )
      }

      setPage(value + 1)
    },
    [totalPages, translate]
  )

  const handlePerPageChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      onPerPageChange(event.target.value)
    },
    [onPerPageChange]
  )

  const labelDisplayedRows = useCallback(
    ({ from, to, count }: LabelDisplayedRowsArgs) =>
      translate('ra.navigation.page_range_info', {
        offsetBegin: from,
        offsetEnd: to,
        total: count
      }),
    [translate]
  )

  return (
    <ListContextProvider
      value={{
        ...listContext,
        setPage: (page: number) => {
          setPage(page)
        }
      }}
    >
      {children}
      {!isDisablePagination &&
        (paginationStrategy === 'server-side-without-total' ? (
          memoizedData.length <= 0 || page < 1 ? (
            isLoading ? (
              <Toolbar variant="dense" />
            ) : (
              <div>{emptyMessage}</div>
            )
          ) : (
            <></>
            // <PaginationWithoutPageNumbers
            //   page={page}
            //   hasPreviousPage={hasPreviousPage || page > 1}
            //   hasNextPage={hasNextPage}
            //   onNext={handleNextPage}
            //   onPrevious={handlePreviousPage}
            //   onPreviousAll={handlePreviousAllPage}
            // />
          )
        ) : paginationStrategy === 'server-side-with-total' ? (
          !total || total < 0 || page < 1 || page > totalPages ? (
            isLoading ? (
              <Toolbar variant="dense" />
            ) : (
              <div>{emptyMessage}</div>
            )
          ) : (
            <TablePagination
              count={count}
              rowsPerPage={perPage}
              page={page - 1}
              rowsPerPageOptions={rowsPerPageOptions}
              component="span"
              onPageChange={handlePageChange}
              onRowsPerPageChange={handlePerPageChange}
              labelDisplayedRows={labelDisplayedRows}
              labelRowsPerPage={translate('ra.navigation.page_rows_per_page')}
              // @ts-ignore
              ActionsComponent={PaginationActions}
            />
          )
        ) : (
          <Pagination limit={<div>{emptyMessage}</div>} />
        ))}
    </ListContextProvider>
  )
}

/**
 * The LocalList provides a component as an abstraction layer of list context, datagrid and pagination.
 *
 * @param props
 *
 * Props:
 *  - children: The Datagrid component passed as child.
 *  - paginationStrategy: The pagination strategy to be used. Defaults to 'client-side'.
 *  - total?: The number of total items when using the server-side-with-total pagination strategy.
 *  - data: The array of records returned by a list endpoint.
 *  - isLoading: The state of the the list endpoint request.
 *  - perPage?: The number of items to be rendered per page when using server side pagination. Defaults to 5.
 *  - sort: The initial sort state to be passed to the list context.
 *  - filter?: The initial filter state to be passed to the list context.
 *  - filters?: An array of inputs components to be rendered as filters.
 *  - onSortChange?: A callback function to be executed on sort event when using server-side pagination.
 *  - onPageChange?: A callback function to be executed on page change event when using server-side pagination.
 *  - onPerPageChange?: A callback function to be executed on per page change event when using server-side pagination.
 *  - hasPreviousPage?: A boolean condition to render the previous page button. Flag optionally sent by an API. Can be derived from the conditional expression page > 1.
 *  - hasNextPage?: A boolean condition to render the next page button. The API is responsible for sending a flag so LocalList knows if there are more records to show.
 *  - disableCardBackground?: A boolean to disable the <Card> background. Defaults to false.
 *  - disablePagination?: A boolean to disable the <Pagination> component from local-list footer. Defaults to false.
 *  - emptyMessage?: A custom message can optionally be used when there are no records.
 *
 * @example Usage when pagination strategy is 'client-side':
 *
 * <LocalList
 *    paginationStrategy="client-side"
 *    data={data}
 *    isLoading={isLoading}
 *    sort={{ field: 'id', order: 'ASC' }}
 * />
 *
 * @example Usage when pagination strategy is 'server-side-with-total':
 *
 * <LocalList
 *    paginationStrategy="server-side-with-total"
 *    data={data}
 *    total={total}
 *    isLoading={isLoading}
 *    sort={{ field: 'id', order: 'ASC' }}
 *    perPage={perPage}
 *    onPageChange={setPage}
 *    onPerPageChange={setPerPage}
 * />
 *
 * @example Usage when pagination strategy is 'server-side-without-total':
 *
 * <LocalList
 *     data={data}
 *     isLoading={isLoading}
 *     sort={{ field: 'id', order: 'ASC' }}
 *     hasPreviousPage={hasPreviousPage}
 *     hasNextPage={hasNextPage}
 *     perPage={perPage}
 *     onPageChange={setPage}
 *     onPerPageChange={setPerPage}
 * />
 */
const LocalList = (props: Props & LocalListProps): ReactElement => {
  const { children, filters, onSubmit = () => undefined, isDisableCardBackground = false, ...rest } = props
  const anchorEl = useRef()
  const translate = useTranslate()
  const filtersToRender = useMemo(
    () => (Array.isArray(filters) ? filters : filters === undefined ? [] : [filters]),
    [filters]
  )
  const [isOpenFilterMenu, setIsOpenFilterMenu] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const formMethods = useForm({ defaultValues: props.filter, mode: 'all' })

  const [displayFilters, setDisplayFilters] = useState<Array<ReactElement>>([])

  const filtersNotRendered = useMemo(
    () => filtersToRender.filter(filter => !displayFilters.includes(filter)),
    [displayFilters, filtersToRender]
  )

  const beforeSubmit = useCallback(
    (data: Record<string, string | Array<string> | number>): void => {
      const sanitizedData = Object.fromEntries(Object.entries(data).filter(entry => entry[1] !== ''))

      onSubmit(sanitizedData)
    },
    [onSubmit]
  )

  useEffect(() => {
    if (filtersToRender.length) {
      if (props.hasFilterButton) {
        const filtersAlwaysOn = filtersToRender.filter(filter => filter.props.alwaysOn)

        setDisplayFilters(filters => [...filters, ...filtersAlwaysOn])
      } else {
        setDisplayFilters(filtersToRender)
      }
    }
  }, [filtersToRender, props.hasFilterButton])

  const handleShowFilter = useCallback((event): void => {
    event.preventDefault()
    setIsOpenFilterMenu(true)
    anchorEl.current = event.currentTarget
  }, [])

  const handleRequestClose = useCallback(() => {
    setIsOpenFilterMenu(false)
  }, [])

  const handleAddFilter = useCallback((filter: ReactElement) => {
    setDisplayFilters(filters => [...filters, filter])
    setIsOpenFilterMenu(false)
  }, [])

  const handleRemoveFilter = useCallback(
    (filterInput: ReactElement) => {
      const newFilters = displayFilters.filter(filter => filter.props.source !== filterInput.props.source)

      setDisplayFilters(newFilters)

      const data = formMethods.getValues()

      formMethods.resetField(filterInput.props.source)
      beforeSubmit(omit(data, filterInput.props.source))
    },
    [beforeSubmit, displayFilters, formMethods]
  )

  const handleExporter = async (): Promise<void> => {
    setIsExporting(true)

    if (props.exporter) {
      await props.exporter()
    }

    setIsExporting(false)
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row-reverse',
          marginBottom: 2,
          alignItems: 'center'
        }}
      >
        {/* {Boolean(props.exporter) && (
          <LoadingButton onClick={handleExporter} icon={<DownloadIcon />} isLoading={isExporting}>
            {translate('ra.action.export')}
          </LoadingButton>
        )} */}
        {Boolean(props.hasFilterButton && filtersNotRendered.length) && (
          <>
            <Box>
              <Button
                className="add-filter"
                label="ra.action.add_filter"
                aria-haspopup="true"
                onClick={handleShowFilter}
              >
                <ContentFilter />
              </Button>
            </Box>
            {Boolean(filtersNotRendered.length) && (
              <Menu open={isOpenFilterMenu} anchorEl={anchorEl.current} onClose={handleRequestClose}>
                {filtersNotRendered.map(filter => (
                  <MenuItem key={filter.props.source} onClick={() => handleAddFilter(filter)}>
                    {filter.props.label || filter.props.source}
                  </MenuItem>
                ))}
              </Menu>
            )}
          </>
        )}
      </Box>
      {Boolean(displayFilters.length) && (
        <RecordContextProvider value={undefined}>
          <FormProvider {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(beforeSubmit)}>
              <Box mb={1}>
                <Grid container spacing={1}>
                  {displayFilters.map((component, index) => (
                    <Grid item key={index}>
                      <Box minHeight={64} display="flex" alignItems="center">
                        {Boolean(props.hasFilterButton && !component.props.alwaysOn) && (
                          <IconButton
                            onClick={() => handleRemoveFilter(component)}
                            data-key={component.props.source}
                            title={translate('ra.action.remove_filter')}
                            size="small"
                          >
                            <ActionHide />
                          </IconButton>
                        )}
                        {cloneElement(component, {
                          size: 'small',
                          helperText: false,
                          defaultValue: undefined,
                          margin: 'none'
                        })}
                      </Box>
                    </Grid>
                  ))}
                  <Grid item>
                    <Box my={2}>
                      <LoadingButton
                        type="submit"
                        variant="text"
                        color="primary"
                        size="medium"
                        loading={formMethods.formState.isSubmitting}
                      >
                        Pesquisar
                      </LoadingButton>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </form>
          </FormProvider>
        </RecordContextProvider>
      )}
      {!isDisableCardBackground ? (
        <Card>
          <LocalListDatagrid {...rest}>{children}</LocalListDatagrid>
        </Card>
      ) : (
        <LocalListDatagrid {...rest}>{children}</LocalListDatagrid>
      )}
    </>
  )
}

export default LocalList
