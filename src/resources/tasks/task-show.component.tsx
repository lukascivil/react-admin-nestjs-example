import { FC } from 'react'
import { Show, SimpleShowLayout, TextField, ShowProps, BooleanField, DateField, RichTextField } from 'react-admin'

export const TasksShow: FC<ShowProps> = props => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="title" />
      <RichTextField source="description" />
      <BooleanField source="completed" />
      <DateField source="updated_at" showTime />
      <DateField source="created_at" showTime />
    </SimpleShowLayout>
  </Show>
)
