import { createTheme } from '@mui/material'

const colors = {
  primary: '#ffd000',
  secondary: '#000000',
  disabled: '#686868',
  background: '#ffffff'
}

const appTheme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: colors.secondary,
          'input': {
            color: colors.secondary,
            '-webkit-text-fill-color': `${colors.secondary} !important`
          },
          'svg': { 
            '&.MuiSelect-iconOpen': { color: colors.primary }
          },
          'fieldset': {
            borderColor: colors.secondary,
            color: 'white'
          },
          '&.Mui-focused': {
            'fieldset': {
              borderColor: `${colors.primary} !important`,
              color: 'white'
            },
          },
          '&.Mui-disabled': {
            'input': {
              color: colors.secondary,
              '-webkit-text-fill-color': `${colors.secondary} !important`
            },
            'fieldset': {
              borderColor: `${colors.secondary} !important`
            }
          },
          '.MuiOutlinedInput-notchedOutline': {
            borderColor: `${colors.secondary} !important`
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '.MuiInputLabel-root': { 
            color: colors.secondary
          },
          root: {
            'fieldset': {
              borderColor: colors.secondary,
            },
            'input': {
              color: colors.secondary
            },
          }, 
          '& .MuiOutlinedInput-root:hover': { 
            '& > fieldset': {
              borderColor: colors.secondary
            }
          },
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        iconOutlined: {
          color: colors.secondary
        },
      }
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          'label': { 
            color: colors.secondary,
            '&.Mui-focused': { color: colors.primary, fontWeight: 'bold' },
            '&.Mui-disabled': { color: colors.secondary }
          }
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: { 
          '&:hover': { background: '#e7e7e7' },
          '&.Mui-selected': { background: '#e7e7e7' }
        }
      }
    }
  },
  palette: {
    primary: {
      main: colors.primary,
    },
    secondary: { 
      main: colors.secondary 
    },
    //action: {
      //hover: colors.secondary
    //},
    background: {
      default: colors.background
    }
  }
})

export default appTheme
