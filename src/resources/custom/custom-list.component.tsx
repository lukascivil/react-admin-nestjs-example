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
} from "@material-ui/core";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
} from "@material-ui/icons";

const SelectionRowListAside = ({ datas, onRemove, onClear }) => {
  return (
    <Box ml={4} width={500}>
      <Box width={1}>
        <Box pb={1} display="flex">
          <Box flexGrow={1}>
            <Typography component="span" variant="body2" color="textSecondary">
              {datas?.length} Itens selecionados
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
                  <ListItemSecondaryAction>
                    <IconButton
                      size="small"
                      edge="end"
                      onClick={() => onRemove(row)}
                    >
                      <RemoveIcon fontSize="small" color="error" />
                    </IconButton>
                  </ListItemSecondaryAction>
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
        <Typography variant="h6">List Way</Typography>
      </Box>
      <Box>
        <List
          resource="tasks"
          basePath="/tasks"
          syncWithLocation={false}
          actions={false}
          bulkActionButtons={false}
          component="div"
          aside={
            <SelectionRowListAside
              datas={selectedRows}
              onRemove={handleRemoveRow}
              onClear={handleClearSelectedRows}
            />
          }
        >
          <Datagrid size="small">
            <TextField source="id" label="id" />
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
  return (
    <Card>
      <Title title="My Page" />
      <CardContent>
        <CustomListBase />
      </CardContent>
    </Card>
  );
};

export default CustomList;
