import { useState } from 'react'
import { useLogin, useNotify } from 'react-admin'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

export const LoginPage = () => {
  const login = useLogin()
  const notify = useNotify()
  const [jiraUrl, setJiraUrl] = useState('')
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login({ jiraUrl: jiraUrl.trim(), token: token.trim() })
    } catch {
      notify('Invalid Jira URL or token', { type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 420 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={700} mb={0.5}>
            ReactxJira
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Connect to your Jira Datacenter instance
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Jira Base URL"
              placeholder="https://jira.yourcompany.com"
              value={jiraUrl}
              onChange={(e) => setJiraUrl(e.target.value)}
              fullWidth
              required
              size="small"
              sx={{ mb: 2 }}
              autoComplete="url"
            />
            <TextField
              label="Personal Access Token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              fullWidth
              required
              size="small"
              sx={{ mb: 3 }}
              autoComplete="current-password"
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading || !jiraUrl.trim() || !token.trim()}
            >
              {loading ? 'Connecting…' : 'Connect'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
