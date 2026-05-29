import { Show, SimpleShowLayout, TextField } from 'react-admin'

export const ProjectShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="key" label="Key" />
      <TextField source="name" label="Project Name" />
      <TextField source="projectTypeKey" label="Type" />
      <TextField source="description" label="Description" />
    </SimpleShowLayout>
  </Show>
)
