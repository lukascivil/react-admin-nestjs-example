import React, { ReactElement, useEffect, useMemo, useRef, useState } from 'react'
import { HotTable } from '@handsontable/react'
import 'handsontable/dist/handsontable.full.min.css'
import Handsontable, { GridSettings } from 'handsontable'
import { useController, useFormContext } from 'react-hook-form'
import { Box, FormControl, FormHelperText, InputLabel } from '@mui/material'
import { composeValidators, isRequired, useGetValidationErrorMessage, InputHelperText, InputProps } from 'react-admin'

interface RendererBase {
  instance: Handsontable.plugins.DataManager['hot']
  td: HTMLElement
  row: number
  col: number
  prop: string | number
  value: any
  cellProperties: GridSettings
}

export interface ExcelInputColumnSettings {
  data: string
}

export type ExcelInputProps<A> = Pick<
  InputProps,
  'label' | 'validate' | 'isRequired' | 'helperText' | 'disabled' | 'source'
> & {
  defaultValue?: A
  onChange?: <T extends A>(value: T) => void
  columns?: Array<ExcelInputColumnSettings>
  colHeaders?: Handsontable.GridSettings['colHeaders']
  rows?: number
  fullWidth?: boolean
  renderer?: (RendererBase: RendererBase) => HTMLElement
}

/**
 * HandsontableInput is a component handles large lists of data in a table format. It's based on Handsontable library.
 *
 * Props:
 *  - columns: Array of objects with data property to fill cell with a value from fieldState. Only use this property if your fieldState is an Array<object>.
 *  - rows: Number of rows to be rendered.
 *  - renderer: Function invoked every time a cell is rendered. It will be useful to customize cell style or add some behavior.
 *
 * @example Use HandsontableInput in a complex example
 *  const formMethods = useForm({ defaultValues: { content: '{ "cafe": "cafe" }' }, mode: 'all' })
 *
 * const renderer: ExcelInputProps<any>['renderer'] = ({ td, value, col, cellProperties }) => {
 *  if (value && col === 3) {
 *    cellProperties.readOnly = true
 *  }
 *
 *  if (value && col === 2) {
 *     if (value && value.includes('error')) {
 *       td.style.background = 'rgb(255, 76, 66)'
 *       td.style.color = '#000000'
 *     }
 *
 *     if (value && value.includes('success')) {
 *       td.style.background = 'rgba(76, 175, 80, 0.7)'
 *       td.style.color = '#000000'
 *     }
 *  }
 *
 *   td.innerText = value
 *
 *   return td
 * }
 *
 * <HandsontableInput
 *    source="example"
 *    colHeaders={['A', 'B', '<strong>C</strong>']}
 *    renderer={renderer}
 *    rows={100}
 * />
 */
export const HandsontableInput = <
  A extends Array<Array<number | string | null> | Record<string, number | string | null>>
>(
  props: ExcelInputProps<A>
): ReactElement => {
  const {
    source,
    disabled = false,
    defaultValue,
    rows = 100,
    columns,
    fullWidth: isFullWidth,
    onChange,
    helperText,
    isRequired: isRequiredOption,
    label,
    validate = [],
    colHeaders = [],
    renderer
  } = props
  const memoizedDefaultValue = useMemo(
    () => defaultValue || (Handsontable.helper.createEmptySpreadsheetData(rows, columns?.length || 3) as A),
    [columns?.length, defaultValue, rows]
  )
  const sanitizedValidate = Array.isArray(validate) ? composeValidators(validate) : validate
  const hotTableData = useRef(memoizedDefaultValue)
  const hotTableRef = useRef<HotTable>(null)
  const getValidationErrorMessage = useGetValidationErrorMessage()
  const [isFocused, setIsFocused] = useState(false)
  const { getValues } = useFormContext()
  const {
    field,
    fieldState: { isTouched, error, invalid },
    formState: { isSubmitted }
  } = useController({
    name: source,
    disabled,
    rules: {
      validate: async value => {
        if (!sanitizedValidate) {
          return true
        }

        const error = await sanitizedValidate(value, getValues(), props)

        if (!error) {
          return true
        }

        return getValidationErrorMessage(error)
      }
    }
  })

  const preparedRenderer = (
    instance: RendererBase['instance'],
    td: RendererBase['td'],
    row: RendererBase['row'],
    col: RendererBase['col'],
    prop: RendererBase['prop'],
    value: RendererBase['value'],
    cellProperties: RendererBase['cellProperties']
  ): HTMLElement | undefined =>
    typeof renderer === 'function'
      ? renderer({
          instance,
          td,
          row,
          col,
          prop,
          value,
          cellProperties
        })
      : undefined

  const handleAfterChange = (): void => {
    field.onChange(hotTableData.current)

    if (onChange) {
      onChange(hotTableData.current)
    }
  }

  const handleCellBlur = (): void => {
    field.onBlur()
    setIsFocused(false)
  }

  const handleCellFocus = () => {
    setIsFocused(true)
  }

  useEffect(() => {
    const isColumnsArrayOfObjects = columns && columns.every(column => typeof column === 'object')
    const isFieldValueArrayOfObjects =
      Array.isArray(memoizedDefaultValue) && memoizedDefaultValue.every(value => typeof value === 'object')

    if (isColumnsArrayOfObjects && !isFieldValueArrayOfObjects) {
      throw new Error(
        `For the handsontable-input to work properly, "columns" must be an array of objects
        with "data" property to fill cell with a value from fieldState.
        If your fieldState is not an Array<object>, you should not use "columns" property`
      )
    }
  }, [columns, memoizedDefaultValue])

  return (
    <FormControl
      required={isRequiredOption || isRequired(validate)}
      focused={isFocused}
      error={(isTouched || isSubmitted) && invalid}
      fullWidth={isFullWidth}
    >
      <InputLabel shrink>{label || source}</InputLabel>
      <Box pt={4} pl={2}>
        <HotTable
          ref={hotTableRef}
          data={hotTableData.current}
          colHeaders={colHeaders}
          rowHeaders
          width={isFullWidth ? undefined : 500}
          height={300}
          afterChangesObserved={handleAfterChange}
          disableVisualSelection={Boolean(field.disabled)}
          readOnly={field.disabled}
          stretchH="all"
          contextMenu
          colWidths={100}
          minRows={rows}
          maxRows={rows}
          observeChanges
          manualColumnResize
          afterBeginEditing={handleCellFocus}
          afterDeselect={handleCellBlur}
          renderer={preparedRenderer as any}
          columns={columns}
        />
      </Box>
      <FormHelperText>
        <InputHelperText error={error?.message} helperText={helperText} />
      </FormHelperText>
    </FormControl>
  )
}
