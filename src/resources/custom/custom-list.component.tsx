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
} from "@material-ui/core";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
} from "@material-ui/icons";
import Locker from "core/components/Locker";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";

const SelectionRowListAside = ({ datas, onRemove, onClear }) => {
  return (
    <Box ml={4} width={500}>
      <Box width={1}>
        <Box pb={1} display="flex">
          <Box flexGrow={1}>
            <Typography component="span" variant="body2" color="textSecondary">
              {datas?.length} Tarefas selecionados
            </Typography>
          </Box>
          <Box>
            <IconButton size="small" edge="end" onClick={onClear}>
              <DeleteIcon fontSize="small" color="error" />
            </IconButton>
          </Box>
        </Box>
      </Box>
      <Box border={1} borderColor="lightgrey" borderRadius={6}>
        <Box height={350} style={{ overflowY: "scroll" }}>
          <MuiList dense>
            {datas.map((row) => (
              <Fragment key={row.id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={row.title}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="textPrimary"
                        >
                          {`${row.id} - `}
                        </Typography>
                        {
                          <DateField
                            record={row}
                            source="created_at"
                            showTime
                          />
                        }
                      </>
                    }
                  />
                  <Locker unlock={["n4"]}>
                    <ListItemSecondaryAction>
                      <IconButton
                        size="small"
                        edge="end"
                        onClick={() => onRemove(row)}
                      >
                        <RemoveIcon fontSize="small" color="error" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </Locker>
                </ListItem>
                <Divider />
              </Fragment>
            ))}
          </MuiList>
        </Box>
      </Box>
    </Box>
  );
};

const TaskListFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Title" source="title" size="small" alwaysOn />
  </Filter>
);

const CustomListBase = () => {
  useAuthenticated();
  const [selectedRows, setSelectedRows] = useState<Array<any>>([]);
  const { authenticated } = useAuthState();
  const { permissions, loaded } = usePermissions();
  const { data, ids, loading, error } = useGetList(
    "users",
    { page: 1, perPage: 10 },
    { field: "created_at", order: "DESC" },
    {}
  );
  const currentSort = { field: "created_at", order: "ASC" };

  const handleAddRow = (record) => {
    setSelectedRows((state) => [...state, record]);
  };

  const handleRemoveRow = (record) => {
    const newSelectedRows = selectedRows.filter((row) => row.id !== record.id);

    setSelectedRows(newSelectedRows);
  };

  const handleClearSelectedRows = () => {
    setSelectedRows([]);
  };

  return (
    <>
      {/* ------------------------------------------ */}
      <Box pt={2}>
        <Typography variant="h6">Definir contestação</Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Escolha as tarefas que deseja enviar para contestação.
        </Typography>
      </Box>
      <Box>
        <List
          resource="tasks"
          basePath="/tasks"
          title=" "
          syncWithLocation={false}
          actions={false}
          bulkActionButtons={false}
          component="div"
          filters={<TaskListFilter />}
          aside={
            <SelectionRowListAside
              datas={selectedRows}
              onRemove={handleRemoveRow}
              onClear={handleClearSelectedRows}
            />
          }
        >
          <Datagrid size="small">
            <Locker unlock={["n4"]} label="id">
              <TextField source="id" label="id" />
            </Locker>
            <TextField source="title" />
            <DateField source="created_at" showTime />
            <FunctionField
              render={(record) => (
                <IconButton
                  size="small"
                  disabled={selectedRows.some((el) => el?.id === record.id)}
                  color="primary"
                  onClick={() => {
                    handleAddRow(record);
                  }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              )}
            />
          </Datagrid>
        </List>
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
        <Typography variant="h6">Roles from authProvider</Typography>
      </Box>
      <Datagrid
        // @ts-ignore
        basePath="/custom"
        currentSort={currentSort}
        data={permissions}
        ids={permissions?.map((_, index) => index) || []}
        selectedIds={[]}
        loaded={loaded}
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
          <Locker unlock={["n1"]} value="2">
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
