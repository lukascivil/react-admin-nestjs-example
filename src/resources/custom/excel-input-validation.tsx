import React, { FC } from 'react'
import 'handsontable/dist/handsontable.full.min.css'
import { FormProvider, useForm } from 'react-hook-form'
import { HandsontableInput } from 'core/components/handsontable-input'
import { Box } from '@mui/material'

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
          columns={[
            { title: 'Id do contrato', type: 'text' },
            { title: 'Motivo de inclusão', type: 'text' },
            { title: '<strong>Resultado</strong>', type: 'text' }
          ]}
          onChange={cafe => {
            console.log(cafe)
            console.log(formMethods.getValues())
          }}
          rows={100}
        />
      </FormProvider>
    </Box>
  )
}
