import React, { ReactElement, useMemo, useRef, useState } from 'react'
import { HotTable } from '@handsontable/react'
import 'handsontable/dist/handsontable.full.min.css'
import Handsontable, { GridSettings } from 'handsontable'
import { useController, useFormContext } from 'react-hook-form'
import { Box, FormControl, FormHelperText, InputLabel } from '@mui/material'
import { composeValidators, isRequired, useGetValidationErrorMessage, InputHelperText, InputProps } from 'react-admin'

type ExcelInputProps = Omit<InputProps, 'alwaysOn' | 'resource'> & {
  source: string
  defaultValue?: Array<Record<string, number | string>>
  onChange?: <T extends Array<Record<string, number | string>>>(value: T) => void
  disabled?: boolean
  columns?: GridSettings['columns']
  rows?: number
  fullWidth?: boolean
  helperText?: string
  isRequired?: boolean
  label?: string
}

export const HandsontableInput = (props: ExcelInputProps): ReactElement => {
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
    validate = []
  } = props
  const columnsRef = useRef(columns)
  const memoizedDefaultValue = useMemo(
    () => defaultValue || Handsontable.helper.createEmptySpreadsheetData(rows, columns?.length || 3),
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

  const handleAfterChange = (): void => {
    field.onChange(hotTableData)

    if (onChange) {
      onChange(hotTableData.current)
    }
  }

  const handleCellBlur = () => {
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
          colHeaders
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
          columns={columnsRef.current}
          afterBeginEditing={handleCellFocus}
          afterDeselect={handleCellBlur}
        />
      </Box>
      <FormHelperText>
        <InputHelperText touched={isTouched || isSubmitted} error={error?.message} helperText={helperText} />
      </FormHelperText>
    </FormControl>
  )
}
