// Packages
import { ReactElement } from 'react'
import { useListContext } from 'react-admin'
import { Button, Toolbar, Box, Typography } from '@mui/material'

// Icons
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material'

interface Props {
  page: number
  hasPreviousPage: number
  hasNextPage: number
  onNext: () => void
  onPrevious: () => void
  onPreviousAll: () => void
}

const PaginationWithoutPageNumbers = (props: Props): ReactElement => {
  const { page, hasPreviousPage, hasNextPage, onPreviousAll, onPrevious, onNext } = props
  const { data, isLoading } = useListContext()
  const listLength = data?.length || 0

  return (
    <Toolbar>
      <Box width="100%">
        <Box display="flex" alignItems="center" justifyContent="flex-end">
          <Box pr={3}>
            <Typography variant="body2">{`Resultados por página: ${listLength} `}</Typography>
          </Box>
          <Box pr={3}>
            <Typography variant="body2">{`Página: ${page} `}</Typography>
          </Box>
          {hasPreviousPage && (
            <>
              <Button size="small" color="primary" key="prevAll" disabled={isLoading} onClick={() => onPreviousAll()}>
                <ChevronLeftIcon />
                <ChevronLeftIcon />
              </Button>
              <Button size="small" color="primary" key="prev" disabled={isLoading} onClick={() => onPrevious()}>
                <ChevronLeftIcon />
                Anterior
              </Button>
            </>
          )}
          {hasNextPage && (
            <Box>
              <Button size="small" color="primary" key="next" disabled={isLoading} onClick={() => onNext()}>
                Próximo
                <ChevronRightIcon />
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Toolbar>
  )
}

export default PaginationWithoutPageNumbers
