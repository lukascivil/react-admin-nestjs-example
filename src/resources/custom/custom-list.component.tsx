// Packages
import React, { FC, Fragment, useState } from "react";
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
  List,
  Filter,
  TextInput,
  required,
} from "react-admin";
import {
  Box,
  Card,
  CardContent,
  ListItem,
  ListItemText,
  Typography,
  List as MuiList,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Tab,
  AppBar,
  Button,
} from "@material-ui/core";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
} from "@material-ui/icons";
import Locker from "core/components/Locker";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import { Form } from "react-final-form";
import ListInput from "core/components/ListInput";

const CustomListBase = () => {
  useAuthenticated();
  const { authenticated } = useAuthState();
  const { permissions, loaded } = usePermissions();
  const { data, ids, loading, error } = useGetList(
    "users",
    { page: 1, perPage: 10 },
    { field: "created_at", order: "DESC" },
    {}
  );
  const currentSort = { field: "created_at", order: "ASC" };

  const onSubmit = () => {};

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
            internal_reason: "",
            external_reason: "",
            tasks: [],
          }}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <ListInput
                source="tasks"
                resource="tasks"
                basePath="/custom"
                validate={required()}
                filters={
                  <TextInput
                    label="Title"
                    source="title"
                    size="small"
                    alwaysOn
                  />
                }
                primaryText={(record: any) => record.title}
                secondaryText={(record: any) => `${record.id} - `}
                tertiaryText={(record: any) => (
                  <DateField record={record} source="created_at" showTime />
                )}
              >
                <Locker unlock={["n4"]} label="id" source="id">
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
                  <TextInput
                    source="internal_reason"
                    label="Motivo Interno"
                    validate={[required()]}
                    fullWidth
                  />
                </Box>
                <Box width={0.4}>
                  <TextInput
                    source="external_reason"
                    label="Motivo Externo"
                    fullWidth
                  />
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
        <ListBase basePath="/tasks" filter={{}}>
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
      <ReferenceManyField
        basePath="/custom"
        resource="custom"
        reference="tasks"
        target="user_id"
        label=""
      >
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
        <Typography variant="h6">
          Roles from authProvider (Stand alone datagrid)
        </Typography>
      </Box>
      <Datagrid
        basePath="/custom"
        currentSort={currentSort}
        data={permissions}
        ids={permissions?.map((_, index) => index) || []}
        loaded={false}
        total={permissions?.length || 0}
      >
        <FunctionField render={(record) => record} />
      </Datagrid>
      <Datagrid
        basePath="/custom"
        currentSort={currentSort}
        data={permissions}
        ids={permissions?.map((_, index) => index) || []}
        total={permissions?.length || 0}
      >
        <FunctionField render={(record) => record} />
      </Datagrid>
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
          url: "http://foo.com/bar.jpg",
          title: "Hello world!",
        }}
      >
        <TextField source="url" label="URL" />
        <Box>
          <Box>
            <Box>
              <TextField source="id" label="id" />
              <Box>
                <TextField source="title" label="title" />
                <Locker unlock={["n4"]}>
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
  );
};

const CustomList: FC<any> = () => {
  const [value, setValue] = useState("1");

  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setValue(newValue);
  };

  return (
    <TabContext value={value}>
      <AppBar position="static">
        <TabList onChange={handleChange}>
          <Tab label="Item One" value="1" />
          <Locker unlock={["n1", "n2", "n3"]} value="2">
            <Tab label="Item Two" />
          </Locker>
          <Locker unlock={["n4"]} value="3">
            <Tab label="Item Three" />
          </Locker>
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
      <TabPanel value="2">Item Two</TabPanel>
      <TabPanel value="3">Item Three</TabPanel>
    </TabContext>
  );
};

export default CustomList;
