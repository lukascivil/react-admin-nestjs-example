import React, { ReactElement, useMemo, useRef, useState } from 'react'
import { HotTable } from '@handsontable/react'
import 'handsontable/dist/handsontable.full.min.css'
import Handsontable, { GridSettings } from 'handsontable'
import { useController, useFormContext } from 'react-hook-form'
import { Box, FormControl, FormHelperText, InputLabel } from '@mui/material'
import { composeValidators, isRequired, useGetValidationErrorMessage, InputHelperText, InputProps } from 'react-admin'

interface RendererBase {
  td: HTMLElement
  row: number
  col: number
  prop: string | number
  value: any
  cellProperties: GridSettings
}

export interface ExcelInputColumnSettings {
  title: string
  type: 'text' | 'numeric' | 'date' | 'checkbox'
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

export const HandsontableInput = <A extends Array<Array<number | string | null>>>(
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
    _instance: Handsontable.plugins.DataManager['hot'],
    td: RendererBase['td'],
    row: RendererBase['row'],
    col: RendererBase['col'],
    prop: RendererBase['prop'],
    value: RendererBase['value'],
    cellProperties: RendererBase['cellProperties']
  ): HTMLElement | undefined =>
    typeof renderer === 'function'
      ? renderer({
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
        />
      </Box>
      <FormHelperText>
        <InputHelperText touched={isTouched || isSubmitted} error={error?.message} helperText={helperText} />
      </FormHelperText>
    </FormControl>
  )
}
