// Packages
import React, { FC, useState, useMemo, SyntheticEvent } from 'react'
import {
  ResourceContextProvider,
  Datagrid,
  TextField,
  ListBase,
  DateField,
  Title,
  ReferenceManyField,
  usePermissions,
  FunctionField,
  useAuthenticated,
  useAuthState,
  BooleanField,
  RecordContextProvider,
  useGetList,
  TextInput,
  required,
  NumberInput,
  DateInput,
  useList,
  ListContextProvider,
  Pagination,
  Form,
  SortPayload
} from 'react-admin'
import { Box, Card, CardContent, Typography, Divider, Tab, AppBar, Button } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { ListInput, Locker } from 'core/components'
import { TabResource } from './tab-resource.component'
import { TabHealth } from './tab-health.component'
import { Whatshot as WhatshotIcon } from '@mui/icons-material'
import { ServerSideWithTotal } from './tab-local-list-server-side-with-total-'
import { ServerSideWithoutTotal } from './tab-local-list-server-side-without-total'

const largeList = [...Array(1500)].map((_, index) => ({ id: index, title: index }))

const LargeDatagrid = () => {
  const listContextInfinite = useList({
    data: largeList,
    isLoading: false,
    perPage: 5
  })

  return (
    <ResourceContextProvider value="large-list">
      <ListContextProvider value={listContextInfinite}>
        <Datagrid>
          <TextField source="id" label="Id" />
          <TextField source="title" label="Título" sortable={false} />
        </Datagrid>
        <Pagination />
      </ListContextProvider>
    </ResourceContextProvider>
  )
}

const CustomListBase = () => {
  useAuthenticated()
  const { authenticated } = useAuthState()
  const { permissions, isLoading: loadingPermissions } = usePermissions()
  const permissionsTest = useMemo(
    () =>
      permissions
        ? [...permissions, ...permissions, ...permissions].map((value, index) => ({ id: index, title: value }))
        : [],
    [permissions]
  )
  const listContext = useList({
    data: permissionsTest,
    isLoading: loadingPermissions,
    perPage: 5
  })

  const { data, isLoading, error } = useGetList('users', {
    pagination: { page: 1, perPage: 10 },
    sort: { field: 'created_at', order: 'DESC' }
  })
  const currentSort: SortPayload = { field: 'created_at', order: 'ASC' }

  const onSubmit = () => {}

  return (
    <>
      {/* ------------------------------------------ */}
      <Box pb={2}>
        <Typography variant="h6">Definir contestação</Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Escolha as tarefas que deseja enviar para contestação.
        </Typography>
      </Box>
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Tarefas
        </Typography>
      </Box>
      <Box>
        <Form
          onSubmit={onSubmit}
          // debug={(values) => {
          //   console.log(values.values);
          // }}
          defaultValues={{
            internal_reason: '',
            external_reason: '',
            tasks: []
          }}
        >
          <ListInput
            source="tasks"
            resource="tasks"
            basePath="/custom"
            validate={required()}
            filters={[
              <NumberInput label="Id" source="id" size="small" alwaysOn />,
              <TextInput label="Title" source="title" size="small" alwaysOn />,
              <DateInput label="Criado em - Início" source="created_at_start" size="small" alwaysOn />,
              <DateInput label="Criado em - Fim" source="created_at_end" size="small" alwaysOn />
            ]}
            primaryText={(record: any) => record.title}
            secondaryText={(record: any) => `${record.id} - `}
            tertiaryText={(record: any) => <DateField record={record} source="created_at" showTime />}
          >
            <Locker unlock={['n4']} label="id" source="id">
              <TextField source="id" />
            </Locker>
            <TextField source="title" />
            <DateField source="created_at" showTime />
          </ListInput>
          <Typography variant="subtitle1" gutterBottom>
            Descrição da Contestação
          </Typography>
          <Box>
            <Box width={0.4}>
              <TextInput source="internal_reason" label="Motivo Interno" validate={[required()]} fullWidth />
            </Box>
            <Box width={0.4}>
              <TextInput source="external_reason" label="Motivo Externo" fullWidth />
            </Box>
          </Box>
          <Button type="submit" color="primary" variant="contained">
            Enviar
          </Button>
        </Form>
      </Box>
      <Box py={3}>
        <Divider />
      </Box>
      {/* ------------------------------------------ */}
      <Box pt={2}>
        <Typography variant="h6">List Base</Typography>
      </Box>
      <ResourceContextProvider value="tasks">
        <ListBase filter={{}}>
          <RecordContextProvider value={data}>
            <Datagrid>
              <TextField source="title" />
              <DateField source="created_at" showTime />
            </Datagrid>
          </RecordContextProvider>
        </ListBase>
      </ResourceContextProvider>
      <Box py={3}>
        <Divider />
      </Box>
      {/* ------------------------------------------ */}
      <ReferenceManyField resource="custom" reference="tasks" target="user_id" label="">
        <Datagrid>
          <TextField source="title" />
          <DateField source="created_at" showTime />
        </Datagrid>
      </ReferenceManyField>
      <Box py={3}>
        <Divider />
      </Box>
      {/* ------------------------------------------ */}
      <Box pt={2}>
        <Typography variant="h6">Roles from authProvider (Stand alone datagrid)</Typography>
      </Box>
      <ResourceContextProvider value="teste4">
        <RecordContextProvider value={permissions || []}>
          <Datagrid sort={currentSort} isLoading={false}>
            <FunctionField render={record => record} />
          </Datagrid>
        </RecordContextProvider>
      </ResourceContextProvider>
      <ResourceContextProvider value="teste3">
        <RecordContextProvider value={permissions || []}>
          <Datagrid sort={currentSort}>
            <FunctionField render={record => record} />
          </Datagrid>
        </RecordContextProvider>
      </ResourceContextProvider>
      <Box py={3}>
        <Divider />
      </Box>
      {/* ------------------------------------------ */}
      <Box pt={2}>
        <Typography variant="h6">
          Roles from authProvider (UseList + ListContextProvider + Datagrid)
          <Box display="inline">
            <WhatshotIcon color="error" />
            <WhatshotIcon color="error" />
            <WhatshotIcon color="error" />
          </Box>
        </Typography>
      </Box>

      <ResourceContextProvider value="teste2">
        <ListContextProvider value={listContext}>
          <Datagrid optimized>
            <TextField source="id" label="Id" />
            <TextField source="title" label="Título" />
          </Datagrid>
          <Pagination />
        </ListContextProvider>
      </ResourceContextProvider>

      <Box py={3}>
        <Divider />
      </Box>
      {/* ------------------------------------------ */}
      <Box pt={2}>
        <Typography variant="h6">
          150K itens with useList + datagrid
          <Box display="inline">
            <WhatshotIcon color="error" />
            <WhatshotIcon color="error" />
          </Box>
        </Typography>
      </Box>

      <LargeDatagrid />

      <Box py={3}>
        <Divider />
      </Box>
      {/* ------------------------------------------ */}
      <Typography variant="h6">RecordContextProvider with GetList </Typography>
      <RecordContextProvider value={{ id: 55, data }}>
        <TextField source="url" label="URL" />
        <Box>
          <Box>
            <Box>
              <TextField source="id" label="id" />
              <Box>
                <TextField source="data.1.email" label="title" />
              </Box>
            </Box>
          </Box>
        </Box>
      </RecordContextProvider>
      <Box py={3}>
        <Divider />
      </Box>
      {/* ------------------------------------------ */}
      <Box pt={2}>
        <Typography variant="h6">Autenticado? </Typography>
        <BooleanField
          label="Autenticado"
          // @ts-ignore
          record={{ authenticated }}
          source="authenticated"
        />
      </Box>
      <Box py={3}>
        <Divider />
      </Box>
      {/* ------------------------------------------ */}
      <RecordContextProvider
        value={{
          id: 123,
          url: 'http://foo.com/bar.jpg',
          title: 'Hello world!'
        }}
      >
        <TextField source="url" label="URL" />
        <Box>
          <Box>
            <Box>
              <TextField source="id" label="id" />
              <Box>
                <TextField source="title" label="title" />
                <Locker unlock={['n4']}>
                  <TextField source="title" label="title" />
                </Locker>
              </Box>
            </Box>
          </Box>
        </Box>
      </RecordContextProvider>
      <Box py={3}>
        <Divider />
      </Box>
      {/* ------------------------------------------ */}
    </>
  )
}

const CustomList: FC<any> = () => {
  const [value, setValue] = useState('1')

  const handleChange = (_event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <TabContext value={value}>
      <AppBar position="static">
        <TabList onChange={handleChange}>
          <Tab label="Examples" value="1" />
          <Locker unlock={['n1', 'n2', 'n3']} value="2">
            <Tab label="RTK Query Api Resources" />
          </Locker>
          <Locker unlock={['n4']} value="3">
            <Tab label="RTK Query Api Health" />
          </Locker>
          <Tab label="Server Side With Total" value="4" />
          <Tab label="Server Side Without Total" value="5" />
        </TabList>
      </AppBar>
      <TabPanel value="1">
        <Card>
          <Title title="Custom" />
          <CardContent>
            <CustomListBase />
          </CardContent>
        </Card>
      </TabPanel>
      <TabPanel value="2">
        <TabResource />
      </TabPanel>
      <TabPanel value="3">
        <TabHealth />
      </TabPanel>
      <TabPanel value="4">
        <ServerSideWithTotal />
      </TabPanel>
      <TabPanel value="5">
        <ServerSideWithoutTotal />
      </TabPanel>
    </TabContext>
  )
}

export default CustomList
