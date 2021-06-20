import React, { FC } from "react";
import { TextInput, useNotify } from "react-admin";
import { Box, Button, Card } from "@material-ui/core";
import { useGetUserQuery, useUpdateUserMutation } from "./users-api";
import { useLocation } from "react-router-dom";
import { Form } from "react-final-form";

export const RtkEdit: FC = () => {
  const location = useLocation();
  const id = location.pathname.split("/").reverse()[1];
  const notify = useNotify();
  const [updateUser] = useUpdateUserMutation();
  const { data: record } = useGetUserQuery(id, {
    refetchOnMountOrArgChange: true,
  });

  const handleSubmit = (formValues) => {
    updateUser(formValues)
      .then(() => {
        notify("Usuário atualizado com sucesso");
      })
      .catch(() => {
        notify("Erro ao atualizar usuário");
      });
  };

  return (
    <Card>
      <Box m={2}>
        <Form
          initialValues={record}
          onSubmit={handleSubmit}
          keepDirtyOnReinitialize
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Box>
                <TextInput disabled source="id" />
              </Box>
              <Box>
                <TextInput disabled source="email" />
              </Box>
              <Box>
                <TextInput source="name" />
              </Box>
              <Box>
                <TextInput source="password" />
              </Box>
              <Box>
                <TextInput source="birthdate" />
              </Box>
              <Box>
                <Button type="submit">Salvar</Button>
              </Box>
            </form>
          )}
        />
      </Box>
    </Card>
  );
};
