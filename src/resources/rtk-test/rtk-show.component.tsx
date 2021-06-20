import React, { FC } from "react";
import { TextField, DateField, RecordContextProvider } from "react-admin";
import { Box, Typography } from "@material-ui/core";
import { useGetUserQuery } from "./users-api";
import { useLocation } from "react-router-dom";

export const RtkShow: FC = () => {
  const location = useLocation();
  const id = location.pathname.split("/").reverse()[0];
  const { data: user } = useGetUserQuery(id, {
    refetchOnMountOrArgChange: true,
  });

  return (
    <RecordContextProvider value={user}>
      <Box pt={2}>
        <Typography variant="h6">Cadastro</Typography>
      </Box>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="password" />
      <TextField source="email" />
      <DateField source="birthdate" showTime />
      <DateField source="updated_at" showTime />
      <DateField source="created_at" showTime />
    </RecordContextProvider>
  );
};
