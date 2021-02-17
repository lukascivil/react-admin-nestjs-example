// Packages
import React, { FC } from "react";
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
} from "react-admin";
import { Box, Card, CardContent, Typography } from "@material-ui/core";

const CustomListBase = () => {
  useAuthenticated();
  const { authenticated } = useAuthState();
  const { permissions, loaded } = usePermissions();
  const currentSort = { field: "created_at", order: "ASC" };

  return (
    <>
      <ResourceContextProvider value="tasks">
        <ListBase basePath="/tasks" filter={{}}>
          <Datagrid>
            <TextField source="title" />
            <DateField source="created_at" showTime />
          </Datagrid>
        </ListBase>
      </ResourceContextProvider>
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
      <Box pt={2}>
        <Typography variant="h6">Autenticado? </Typography>
        <BooleanField
          label="Autenticado"
          // @ts-ignore
          record={{ authenticated }}
          source="authenticated"
        />
      </Box>
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
