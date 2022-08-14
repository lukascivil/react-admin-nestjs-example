import React, { FC } from 'react'
import {
  Show,
  SimpleShowLayout,
  TextField,
  ShowProps,
  BooleanField,
  DateField,
  ResourceContextProvider,
  ListBase,
  Datagrid,
  ReferenceManyField,
  useGetList,
  Button,
  Link
} from 'react-admin'
import { Box, Typography } from '@material-ui/core'

export const UsersShow: FC<ShowProps> = props => {
  const currentSort = { field: 'created_at', order: 'ASC' }
  const { data, total, isLoading } = useGetList('tasks', { pagination: { page: 1, perPage: 10 }, sort: currentSort })

  return (
    <Show {...props}>
      <SimpleShowLayout>
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
        <Box pt={2}>
          <Typography variant="h6">Tarefas do usuário - List</Typography>
        </Box>
        {/* The reference field makes more sense for this case, however the List component was used for testing, getList with filter */}
        <ResourceContextProvider value="tasks">
          <ListBase filter={{ user_id: 'props.id' }}>
            <Datagrid>
              <TextField source="title" />
              <DateField source="created_at" showTime />
            </Datagrid>
          </ListBase>
        </ResourceContextProvider>
        <Box pt={2}>
          <Typography variant="h6">Tarefas do usuário - Reference Many Field</Typography>
        </Box>
        {/* Reference Many Field, getManyReference with filter of known Ids */}
        <ReferenceManyField reference="tasks" target="user_id" label="">
          <Datagrid>
            <TextField source="title" />
            <DateField source="created_at" showTime />
          </Datagrid>
        </ReferenceManyField>
        <Box pt={2}>
          <Typography variant="h6">Tarefas do usuário - Only Datagrid</Typography>
        </Box>
        {/* Use datagrid and call programmatically any dataprovider method*/}
        <Datagrid
          // @ts-ignore
          basePath=""
          currentSort={currentSort}
          data={data}
          selectedIds={[]}
          loaded={isLoading}
          total={total}
        >
          <TextField source="title" />
          <DateField source="created_at" showTime />
        </Datagrid>
        <Box pt={2}>
          <Typography variant="h6">Custom Area</Typography>
          <Button label="abrir Custom Area" component={Link} to="/custom" />
        </Box>
      </SimpleShowLayout>
    </Show>
  )
}
