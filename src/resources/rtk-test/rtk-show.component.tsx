import React, { FC, useEffect } from "react";
import {
  TextField,
  DateField,
  RecordContextProvider,
  SimpleShowLayout,
  useVersion,
} from "react-admin";
import { Box, Card, Typography } from "@material-ui/core";
import { useGetUserQuery } from "./users-api";
import { useLocation } from "react-router-dom";

export const RtkShow: FC = () => {
  const location = useLocation();
  const version = useVersion();
  const id = location.pathname.split("/").reverse()[0];
  const { data: user, refetch } = useGetUserQuery(id, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    refetch();
  }, [refetch, version]);

  return (
    <Card>
      <Box m={2}>
        <RecordContextProvider value={user}>
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
