// Packages
import React, { FC, Fragment, useState, useEffect, memo, ReactNode } from 'react'
import { shallowEqual } from 'react-redux'
import {
  Datagrid,
  FunctionField,
  List,
  Filter,
  useInput,
  InputProps,
  Validator,
  useTranslate,
  FieldTitle
} from 'react-admin'
import {
  Box,
  ListItem,
  ListItemText,
  Typography,
  List as MuiList,
  ListItemSecondaryAction,
  IconButton,
  Divider
} from '@mui/material'
import { Add as AddIcon, Remove as RemoveIcon, Delete as DeleteIcon } from '@mui/icons-material'

interface SelectionRowListAsideProps {
  records: Array<any>
  touched: boolean
  errorMessage: string
  isRequired: boolean
  onRemove: (record: any) => void
  onClear: () => void
  primaryText: (record: any) => ReactNode
  secondaryText: (record: any) => ReactNode
  tertiaryText: (record: any) => ReactNode
  resource?: string
  source: string
}

const SelectionRowListAside: FC<SelectionRowListAsideProps> = ({
  records,
  onRemove,
  onClear,
  primaryText,
  touched,
  isRequired,
  errorMessage,
  secondaryText,
  tertiaryText,
  resource,
  source
}) => {
  const translate = useTranslate()

  return (
    <Box ml={4} width={500}>
      <Box width={1}>
        <Box pb={1} display="flex">
          <Box flexGrow={1}>
            <Typography component="span" variant="body2" color={touched && errorMessage ? 'error' : 'textSecondary'}>
              {touched && errorMessage ? (
                translate(errorMessage)
              ) : (
                <FieldTitle
                  label={`${records?.length} Itens selecionados`}
                  source={source}
                  resource={resource}
                  isRequired={isRequired}
                />
              )}
            </Typography>
          </Box>
          <Box>
            <IconButton size="small" edge="end" onClick={onClear}>
              <DeleteIcon fontSize="small" color="error" />
            </IconButton>
          </Box>
        </Box>
      </Box>
      <Box border={1} borderColor={touched && errorMessage ? 'red' : 'lightgrey'} borderRadius={6} bgcolor="grey.100">
        <Box height={350} style={{ overflowY: 'scroll' }}>
          <MuiList dense>
            {records?.map(record => (
              <Fragment key={record.id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={primaryText(record)}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="textPrimary">
                          {secondaryText(record)}
                        </Typography>
                        {tertiaryText(record)}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton size="small" edge="end" onClick={() => onRemove(record)}>
                      <RemoveIcon fontSize="small" color="error" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </Fragment>
            ))}
          </MuiList>
        </Box>
      </Box>
    </Box>
  )
}

interface Props extends Omit<InputProps, 'children'> {
  resource: 'tasks'
  basePath: '/custom'
  filters: Array<ReactNode>
  validate?: Validator | Array<Validator>
  primaryText?: (record: any) => ReactNode
  secondaryText?: (record: any) => ReactNode
  tertiaryText?: (record: any) => ReactNode
  children: any
}

const isEqual = (prevProps, nextProps) => {
  const {
    children: prevChildren,
    filters: prevFilters,
    validate: prevValidate,
    primaryText: prevPrimaryText,
    secondaryText: prevSecondaryText,
    tertiaryText: prevTertiaryText,
    ...restOfPrevProps
  } = prevProps
  const {
    children: nextChildren,
    filters: nextFilters,
    validate: nextValidate,
    primaryText: nextPrimaryText,
    secondaryText: nextSecondaryText,
    tertiaryText: nextTertiaryText,
    ...restOfNextProps
  } = nextProps

  return shallowEqual(restOfPrevProps, restOfNextProps)
}

const ListInput: FC<Props> = memo<Props>(
  ({ resource, basePath, filters, children, primaryText, secondaryText, tertiaryText, source, ...rest }) => {
    const {
      field: { onChange, value },
      fieldState: { isTouched, error },
      isRequired
    } = useInput({ ...rest, source } as any)
    const [selectedRows, setSelectedRows] = useState<Array<any>>([])

    useEffect(() => {
      if (selectedRows) {
        onChange(selectedRows)
      }
    }, [onChange, selectedRows])

    const handleAddRow = record => {
      setSelectedRows(state => [...state, record])
    }

    const handleRemoveRow = record => {
      const newSelectedRows = selectedRows.filter(row => row.id !== record.id)

      setSelectedRows(newSelectedRows)
    }

    const handleClearSelectedRows = () => {
      setSelectedRows([])
    }

    return (
      <List
        resource={resource}
        disableSyncWithLocation
        empty={false}
        actions={false}
        bulkActionButtons={false}
        component="div"
        filters={<Filter>{filters?.map(input => input)}</Filter>}
        aside={
          <SelectionRowListAside
            primaryText={primaryText || (value => value)}
            secondaryText={secondaryText || (value => value)}
            tertiaryText={tertiaryText || (value => value)}
            touched={isTouched || false}
            isRequired={isRequired}
            resource={resource}
            errorMessage={error?.message || ''}
            records={value || []}
            onRemove={handleRemoveRow}
            onClear={handleClearSelectedRows}
            source={source}
          />
        }
      >
        <Datagrid size="small">
          {children}
          <FunctionField
            render={record => (
              <IconButton
                size="small"
                disabled={selectedRows.some(el => el?.id === record.id)}
                color="primary"
                onClick={() => {
                  handleAddRow(record)
                }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            )}
          />
        </Datagrid>
      </List>
    )
  },
  isEqual
)

export default ListInput
