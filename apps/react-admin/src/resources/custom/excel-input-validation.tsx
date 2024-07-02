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

const data = [
  {
    title:
      "<a href='http://www.amazon.com/Professional-JavaScript-Developers-Nicholas-Zakas/dp/1118026691'>Professional JavaScript for Web Developers</a>",
    description:
      "This <a href='http://bit.ly/sM1bDf'>book</a> provides a developer-level introduction along with more advanced and useful features of <b>JavaScript</b>.",
    comments: 'I would rate it &#x2605;&#x2605;&#x2605;&#x2605;&#x2606;',
    cover: 'https://handsontable.com/docs/images/examples/professional-javascript-developers-nicholas-zakas.jpg'
  },
  {
    title: "<a href='http://shop.oreilly.com/product/9780596517748.do'>JavaScript: The Good Parts</a>",
    description:
      'This book provides a developer-level introduction along with <b>more advanced</b> and useful features of JavaScript.',
    comments: 'This is the book about JavaScript',
    cover: 'https://handsontable.com/docs/images/examples/javascript-the-good-parts.jpg'
  },
  {
    title: "<a href='http://shop.oreilly.com/product/9780596805531.do'>JavaScript: The Definitive Guide</a>",
    description:
      '<em>JavaScript: The Definitive Guide</em> provides a thorough description of the core <b>JavaScript</b> language and both the legacy and standard DOMs implemented in web browsers.',
    comments:
      "I've never actually read it, but the <a href='http://shop.oreilly.com/product/9780596805531.do'>comments</a> are highly <strong>positive</strong>.",
    cover: 'https://handsontable.com/docs/images/examples/javascript-the-definitive-guide.jpg'
  }
]

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
          columns={[{ data: 'cover' }, { data: 'description' }, { data: 'title' }]}
          defaultValue={data}
          renderer={resultRenderer}
          onChange={value => console.log(value)}
          rows={100}
        />
      </FormProvider>
    </Box>
  )
}
