import React, { FC, useEffect } from "react";
import {
  TextField,
  DateField,
  RecordContextProvider,
  SimpleShowLayout,
  useVersion,
} from "react-admin";
import { Box, Card, Typography } from "@material-ui/core";
import { useGetUserQuery, usersApi } from "./users-api";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export const RtkShow: FC = () => {
  const location = useLocation();
  const version = useVersion();
  const id = location.pathname.split("/").reverse()[0];
  const { data: user, refetch } = useGetUserQuery(id, {
    refetchOnMountOrArgChange: true,
  });
  const currentSort = { field: "created_at", order: "ASC" };
  // Simulating optimistic rendering, we dont have to wait for the query
  // React-admin does it out of the box using its ids as keys
  const { data: cachedUsers } = usersApi.endpoints.getUsers.useQueryState({
    filter: {},
    pagination: { page: 1, perPage: 5 },
    sort: currentSort,
  });

  // Another Example
  // const mapState = (state: RootState) => ({
  //   users: api.endpoints.getUsers.select(3)(state)
  // });
  // const getUsersState = useSelector((state) =>
  //   usersApi.endpoints.getUsers.select({
  //     filter: {},
  //     pagination: { page: 1, perPage: 5 },
  //     sort: currentSort,
  //   })(state)
  // );
  // console.log({ getUsersState });

  useEffect(() => {
    refetch();
  }, [refetch, version]);

  return (
    <Card>
      <Box m={2}>
        <RecordContextProvider value={user || cachedUsers}>
          <Box pt={2}>
            <Typography variant="h6">Cadastro</Typography>
          </Box>
          <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="password" />
            <TextField source="email" />
            <DateField source="birthdate" showTime />
            <DateField source="updated_at" showTime />
            <DateField source="created_at" showTime />
          </SimpleShowLayout>
        </RecordContextProvider>
      </Box>
    </Card>
  );
};
