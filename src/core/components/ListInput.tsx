// Packages
import React, { FC, Fragment, useState, useEffect, memo } from "react";
import {
  Datagrid,
  TextField,
  DateField,
  FunctionField,
  List,
  Filter,
  TextInput,
  useInput,
  InputProps,
} from "react-admin";
import {
  Box,
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
import Locker from "core/components/Locker";

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
      <Box
        border={1}
        borderColor="lightgrey"
        borderRadius={6}
        bgcolor="grey.100"
      >
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

const ListInput: FC<InputProps> = memo<InputProps>((props) => {
  const {
    input: { name, onChange, ...rest },
    meta: { touched, error },
    isRequired,
  } = useInput(props);
  const [selectedRows, setSelectedRows] = useState<Array<any>>([]);

  useEffect(() => {
    if (selectedRows) {
      onChange(selectedRows);
    }
  }, [onChange, selectedRows]);

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
        <Locker unlock={["n4"]} label="id" source="id">
          <TextField source="id" />
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
  );
});

export default ListInput;
