// Packages
import React, {
  FC,
  Fragment,
  useState,
  useEffect,
  memo,
  ReactNode,
} from "react";
import {
  Datagrid,
  FunctionField,
  List,
  Filter,
  TextInput,
  useInput,
  InputProps,
  ListProps,
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

interface SelectionRowListAsideProps {
  records: Array<any>;
  onRemove: (record: any) => void;
  onClear: () => void;
  primaryText: (record: any) => ReactNode;
  secondaryText: (record: any) => ReactNode;
  tertiaryText: (record: any) => ReactNode;
}

const SelectionRowListAside: FC<SelectionRowListAsideProps> = ({
  records,
  onRemove,
  onClear,
  primaryText,
  secondaryText,
  tertiaryText,
}) => {
  return (
    <Box ml={4} width={500}>
      <Box width={1}>
        <Box pb={1} display="flex">
          <Box flexGrow={1}>
            <Typography component="span" variant="body2" color="textSecondary">
              {records?.length} Tarefas selecionados
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
            {records?.map((record) => (
              <Fragment key={record.id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={primaryText(record)}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="textPrimary"
                        >
                          {secondaryText(record)}
                        </Typography>
                        {tertiaryText(record)}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      size="small"
                      edge="end"
                      onClick={() => onRemove(record)}
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

const TaskListFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Title" source="title" size="small" alwaysOn />
  </Filter>
);

interface Props extends Omit<InputProps, "children"> {
  listProps: ListProps;
  selectedItemProps: {
    primaryText?: (record: any) => ReactNode;
    secondaryText?: (record: any) => ReactNode;
    tertiaryText?: (record: any) => ReactNode;
  };
  children: any;
}

const ListInput: FC<Props> = memo<Props>(
  ({ listProps, selectedItemProps, children, ...rest }) => {
    const {
      input: { name, onChange, value },
      meta: { touched, error },
      isRequired,
    } = useInput(rest as any);
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
      const newSelectedRows = selectedRows.filter(
        (row) => row.id !== record.id
      );

      setSelectedRows(newSelectedRows);
    };

    const handleClearSelectedRows = () => {
      setSelectedRows([]);
    };

    return (
      <List
        syncWithLocation={false}
        actions={false}
        bulkActionButtons={false}
        component="div"
        filters={<TaskListFilter />}
        aside={
          <SelectionRowListAside
            primaryText={selectedItemProps.primaryText || ((value) => value)}
            secondaryText={
              selectedItemProps.secondaryText || ((value) => value)
            }
            tertiaryText={selectedItemProps.tertiaryText || ((value) => value)}
            records={value || []}
            onRemove={handleRemoveRow}
            onClear={handleClearSelectedRows}
          />
        }
        {...listProps}
      >
        <Datagrid size="small">
          {children}
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
  }
);

export default ListInput;
