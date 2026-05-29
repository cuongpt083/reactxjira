import { List, Datagrid, TextField } from 'react-admin'

export const ProjectList = () => (
  <List perPage={25} sort={{ field: 'name', order: 'ASC' }}>
    <Datagrid rowClick="show" bulkActionButtons={false}>
      <TextField source="key" label="Key" />
      <TextField source="name" label="Project Name" />
      <TextField source="projectTypeKey" label="Type" />
    </Datagrid>
  </List>
)
