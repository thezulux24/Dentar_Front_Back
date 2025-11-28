import { createTheme } from '@mui/material/styles';
import MontserratRegular from '../assets/ttf/Montserrat-Regular.ttf';
import MontserratBold from '../assets/ttf/Montserrat-Bold.ttf';


const montserrat = {
  fontFamily: 'Montserrat',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
};


const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1977CC', // Azul darkblue
      dark: '#0B006A',
    },
    secondary: {
      main: '#E32780', // rosa
    },
    text: {
      primary: '#777777',
      secondary: '#777777',
    },
    /* background: {
      default: '#ffffff', // Fondo general f5f5f5
      paper: '#F3F4F6',   // Fondo de componentes como paper
    }, */
  },
  typography: {
    fontFamily: 'Montserrat, Roboto, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h5: {
      fontWeight: 300,
      fontSize: '2rem',
      color: '#0B006A',
    },
    subtitle1: {
      fontWeight: 400,
      fontSize: '1.2rem',
      color: '#777777',
    },
    body1: {
      fontSize: '1rem',
    },
  },
  components: {
     MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: '${montserrat.fontFamily}';
          src: url(${MontserratRegular}) format('truetype');
          font-weight: 400;
          font-style: ${montserrat.fontStyle};
          font-display: ${montserrat.fontDisplay};
          unicode-range: ${montserrat.unicodeRange};
        }
        @font-face {
          font-family: '${montserrat.fontFamily}';
          src: url(${MontserratBold}) format('truetype');
          font-weight: 700;
          font-style: ${montserrat.fontStyle};
          font-display: ${montserrat.fontDisplay};
          unicode-range: ${montserrat.unicodeRange};
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '8px 24px',
        },
        containedPrimary: { //Estilos para botones variant='contained' y color='primary' **************
          backgroundColor: '#E32780',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#c21875',
          },
        },
        outlinedPrimary: {
          border: '2px solid #E32780',
          color: '#E32780',
          '&:hover': {
            backgroundColor: 'rgba(236, 28, 142, 0.08)',
          },
        },
        /* ************ BOTONES AZULES SECONDARY ************************* */
        containedSecondary: {
          backgroundColor: '#1977CC',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#135794',
          },
        },
        outlinedSecondary: {
          border: '2px solid #1977CC',
          color: '#1977CC',
          '&:hover': {
            backgroundColor: 'rgba(25, 119, 204, 0.08)',
          },
        },
      },
    },
    MuiTextField: { //Textfield formularios
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& input::placeholder': {
            color: '#FFFFFF',
            opacity: 1,
          },
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderColor: '#E0E0E0',
            },
            '&:hover fieldset': {
              borderColor: '#E32780',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#E32780',
            },
          },
        },
      },
    },


    //Color morado en los tabs usado en calendar
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#982DDF',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: '#982DDF',
          },
        },
      },
    },
  },
});

export default theme;
