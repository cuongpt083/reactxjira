import { createTheme } from '@mui/material/styles'

const linearPalette = {
  primary: {
    main: '#5E6AD2',
    light: '#7B85DC',
    dark: '#4A54C0',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#858699',
    light: '#A0A1B2',
    dark: '#6B6C7E',
    contrastText: '#ffffff',
  },
  background: {
    default: '#FAFAFA',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#0F0F10',
    secondary: '#6B6C7E',
  },
  divider: '#E5E5E7',
  error: { main: '#E5484D' },
  warning: { main: '#F76B15' },
  success: { main: '#30A46C' },
  info: { main: '#0091FF' },
}

const linearPaletteDark = {
  ...linearPalette,
  background: {
    default: '#0F0F10',
    paper: '#1A1A1C',
  },
  text: {
    primary: '#EDEDEF',
    secondary: '#A0A0AB',
  },
  divider: '#2C2C30',
}

export const lightTheme = createTheme({
  palette: { mode: 'light', ...linearPalette },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, Oxygen, sans-serif',
    fontSize: 14,
    h1: { fontSize: '1.5rem', fontWeight: 600 },
    h2: { fontSize: '1.25rem', fontWeight: 600 },
    h3: { fontSize: '1.125rem', fontWeight: 600 },
    h4: { fontSize: '1rem', fontWeight: 600 },
    body1: { fontSize: '0.9375rem' },
    body2: { fontSize: '0.875rem' },
  },
  shape: { borderRadius: 6 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          border: '1px solid #E5E5E7',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: '1px solid #E5E5E7', fontSize: '0.875rem' },
        head: { fontWeight: 600, color: '#6B6C7E', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500, fontSize: '0.75rem' },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid #E5E5E7',
          backgroundColor: '#FFFFFF',
          color: '#0F0F10',
        },
      },
    },
  },
})

export const darkTheme = createTheme({
  palette: { mode: 'dark', ...linearPaletteDark },
  typography: lightTheme.typography,
  shape: lightTheme.shape,
  components: {
    ...lightTheme.components,
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: '1px solid #2C2C30',
          backgroundColor: '#1A1A1C',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: '1px solid #2C2C30', fontSize: '0.875rem' },
        head: { fontWeight: 600, color: '#A0A0AB', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid #2C2C30',
          backgroundColor: '#0F0F10',
          color: '#EDEDEF',
        },
      },
    },
  },
})
