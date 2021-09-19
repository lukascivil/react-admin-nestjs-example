// Packages
import { Box, Button } from '@material-ui/core'
import { Config } from 'final-form'
import { ReactElement, ReactNode, useEffect } from 'react'
import { ListContextProvider, Pagination, useList, useVersion, SortPayload } from 'react-admin'
import { Form } from 'react-final-form'

interface RaRecord {
  id: string | number
  [key: string]: any
}

interface EssentialParams extends Pick<Config, 'onSubmit'> {
  onRefresh?: () => void
  data?: Array<RaRecord>
  filters?: Array<ReactNode>
  perPage?: 5 | 10 | 25
  sort?: SortPayload
  isLoading?: boolean
}

interface Props extends EssentialParams {
  children: ReactElement
}

const LocalList = (props: Props) => {
  const { children, onRefresh, data, isLoading, filters, onSubmit = () => undefined, perPage = 5, sort } = props
  const version = useVersion()
  const listContext = useList({
    ids: [],
    data: data || [],
    loaded: !isLoading,
    loading: Boolean(isLoading),
    perPage,
    sort
  })

  useEffect(() => {
    if (onRefresh) {
      onRefresh()
    }
  }, [onRefresh, version])

  return (
    <Box>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Box display="flex" alignItems="center">
                <Box>{filters}</Box>
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
      <ListContextProvider value={listContext}>
        {children}
        <Pagination />
      </ListContextProvider>
    </Box>
  )
}

export default LocalList
