import React, { FC } from 'react'
import 'handsontable/dist/handsontable.full.min.css'
import { FormProvider, useForm } from 'react-hook-form'
import { ExcelInputProps, HandsontableInput } from 'core/components/handsontable-input'
import { Box } from '@mui/material'

const resultRenderer: ExcelInputProps<any>['renderer'] = ({ td, value, col }) => {
  if (value && col === 2) {
    if (value && value.includes('error')) {
      td.style.background = 'rgb(255, 76, 66)'
      td.style.color = '#000000'
    }

    if (value && value.includes('success')) {
      td.style.background = 'rgba(76, 175, 80, 0.7)'
      td.style.color = '#000000'
    }
  }

  td.innerText = value

  return td
}

export const ExcelInputValidation: FC = () => {
  const formMethods = useForm()

  // useEffect(() => {
  //   formMethods.setError('cafe', { type: 'required', message: 'Campo obrigatório' })
  // }, [formMethods])

  return (
    <Box pt={3}>
      <FormProvider {...formMethods}>
        <HandsontableInput
          source="cafe"
          colHeaders={['Id do contrato', 'Motivo de inclusão', '<strong>Resultado</strong>']}
          renderer={resultRenderer}
          rows={100}
        />
      </FormProvider>
    </Box>
  )
}
