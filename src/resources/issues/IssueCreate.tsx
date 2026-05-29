import { Create, SimpleForm, TextInput, required } from 'react-admin'

export const IssueCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="fields.summary" label="Summary" validate={required()} fullWidth />
      <TextInput source="fields.description" label="Description" multiline fullWidth />
    </SimpleForm>
  </Create>
)
