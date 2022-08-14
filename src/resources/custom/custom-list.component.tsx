// Packages
import React, { FC, useState, useMemo } from 'react'
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
  Pagination
} from 'react-admin'
import { Box, Card, CardContent, Typography, Divider, Tab, AppBar, Button } from '@material-ui/core'
import { TabContext, TabList, TabPanel } from '@material-ui/lab'
import { Form } from 'react-final-form'
import { ListInput, Locker } from 'core/components'
import { TabResource } from './tab-resource.component'
import { TabHealth } from './tab-health.component'
import { Whatshot as WhatshotIcon } from '@material-ui/icons'
import { TabLocalList } from './tab-local-list'

const InfinitDatagrid = () => {
  const infiniteList = useMemo(() => {
    const infiniteArray = [...Array(150000)].map((_, index) => ({ id: index, title: index }))

    return infiniteArray
  }, [])

  const listContextInfinite = useList({
    data: infiniteList,
    isLoading: false,
    perPage: 5
  })

  return (
    <ListContextProvider value={{ ...listContextInfinite }}>
      <Datagrid optimized>
        <TextField source="id" label="Id" />
        <TextField source="title" label="Título" sortable={false} />
      </Datagrid>
      <Pagination />
    </ListContextProvider>
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
  const currentSort = { field: 'created_at', order: 'ASC' }

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
          initialValues={{
            internal_reason: '',
            external_reason: '',
            tasks: []
          }}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
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
            </form>
          )}
        />
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
          <Datagrid>
            <TextField source="title" />
            <DateField source="created_at" showTime />
          </Datagrid>
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
      <Datagrid sort={currentSort} data={permissions} isLoading={false} total={permissions?.length || 0}>
        <FunctionField render={record => record} />
      </Datagrid>
      <Datagrid sort={currentSort} data={permissions} total={permissions?.length || 0}>
        <FunctionField render={record => record} />
      </Datagrid>
      <Box py={3}>
        <Divider />
      </Box>
      {/* ------------------------------------------ */}
      <Box pt={2}>
        <Typography variant="h6">
          Roles from authProvider (UseList + ListContextProvider + Datagrid)
          <Box color="error.main" display="inline">
            <WhatshotIcon />
            <WhatshotIcon />
            <WhatshotIcon />
          </Box>
        </Typography>
      </Box>

      <ListContextProvider value={listContext}>
        <Datagrid optimized>
          <TextField source="id" label="Id" />
          <TextField source="title" label="Título" />
        </Datagrid>
        <Pagination />
      </ListContextProvider>

      <Box py={3}>
        <Divider />
      </Box>
      {/* ------------------------------------------ */}
      <Box pt={2}>
        <Typography variant="h6">
          150K itens with useList + datagrid
          <Box color="error.main" display="inline">
            <WhatshotIcon />
            <WhatshotIcon />
          </Box>
        </Typography>
      </Box>

      <InfinitDatagrid />

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

  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
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
          <Tab label="Local List" value="4" />
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
        <TabLocalList />
      </TabPanel>
    </TabContext>
  )
}

export default CustomList
