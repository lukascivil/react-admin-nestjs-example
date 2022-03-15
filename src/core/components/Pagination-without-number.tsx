// Packages
import React from 'react'
import { useListContext } from 'react-admin'
import { Button, Toolbar, Box, Typography } from '@material-ui/core'

// Icons
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from '@material-ui/icons'

interface Props {
  next: () => void
  back: () => void
  backAll: () => void
  page: number
}

const PaginationWithoutNumber = (props: Props) => {
  const { page, perPage, setPage, ids, loading, total } = useListContext()
  const isLastPage = page * perPage >= total
  const listLength = ids.length

  // console.log({ ids })

  return (
    <Toolbar>
      <Box width="100%">
        <Box display="flex" alignItems="center" justifyContent="flex-end">
          <Box pr={3}>
            <Typography variant="body2">{`Resultados por página: ${listLength} `}</Typography>
          </Box>
          <Box pr={3}>
            <Typography variant="body2">{`Página: ${props.page} `}</Typography>
          </Box>
          {props.page > 1 && (
            <>
              <Button size="small" color="primary" key="prevAll" disabled={loading} onClick={() => props.backAll()}>
                <ChevronLeftIcon />
                <ChevronLeftIcon />
              </Button>
              <Button size="small" color="primary" key="prev" disabled={loading} onClick={() => props.back()}>
                <ChevronLeftIcon />
                Anterior
              </Button>
            </>
          )}
          {total > perPage && !isLastPage && (
            <Box>
              <Button size="small" color="primary" key="next" disabled={loading} onClick={() => props.next()}>
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

export default PaginationWithoutNumber
