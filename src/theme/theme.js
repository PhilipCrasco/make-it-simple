import { createTheme } from "@mui/material";
import { purple, red } from "@mui/material/colors";

const black = {
  100: "#d1d2d5",
  200: "#a3a6ab",
  300: "#767980",
  400: "#484d56",
  500: "#243448",
  600: "#151a23",
  700: "#10131a",
  800: "#0a0d12",
  900: "#050609",
  1000: "#0E1320",
};

// const purple = {
//   100: "#ece4fb",
//   200: "#d8c9f8",
//   300: "#c5adf4",
//   400: "#b192f1",
//   500: "#9e77ed",
//   600: "#7e5fbe",
//   700: "#5f478e",
//   800: "#3f305f",
//   900: "#20182f",
// };

// const green = {
//   100: "#daf1e4",
//   200: "#b6e4c9",
//   300: "#91d6ae",
//   400: "#6dc993",
//   500: "#48bb78",
//   600: "#3a9660",
//   700: "#2b7048",
//   800: "#1d4b30",
//   900: "#0e2518",
// };

const theme = createTheme({
  palette: {
    bgForm: {
      black1: "#0E1320",
      black2: "#1C2536",
      black3: "#111927",
    },
    text: {
      main: "#EDF2F7",
      secondary: "#A0AEC0",
      accent: "#9e77ed",
    },
    primary: {
      main: "#9e77ed",
    },
    secondary: {
      main: "#3f305f",
    },
    success: {
      main: "#48BB78",
    },
    warning: {
      main: "#ff9800",
    },
    error: {
      main: "#ef5350",
    },
  },
  typography: {
    fontFamily: "Plus Jakarta Sans",
    h6: {
      display: "block",
      marginBlockStart: "2.33rem",
      marginBlockEnd: "2.33rem",
      marginInlineStart: "0px",
      marginInlineEnd: "0px",
    },
    h4: {
      fontWeight: "700",
    },
    h1: {
      display: "block",
      marginBlockStart: "1rem",
      marginBlockEnd: "1rem",
      marginInlineStart: "0px",
      marginInlineEnd: "0px",
    },
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: "#fff",
          "& .MuiOutlinedInput-notchedOutline": {
            color: "#EDF2F7",
            borderColor: "#2D3748",
          },
          "& .MuiOutlinedInput-input": {
            color: "#fff",
          },
          "& input::placeholder": {
            color: "#EDF2F7",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#9e77ed",
          },

          "&:active .MuiOutlinedInput-notchedOutline": {
            borderColor: "#9e77ed",
          },
          // "& input::placeholder": {
          //   color: "green",
          // },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: black[400],
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          padding: "8px 20px",
          fontSize: "0.875rem",
          fontWeight: "600px",
          borderRadius: "12px",
          textTransform: "capitalize",
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 1px 2px",
          boxSizing: "border-box",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#111927",
          color: "#EDF2F7",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#1A222F",
            color: "#9e77ed", // Change the text color when hovering
          },
        },
      },
    },
    MuiListItemButton: {
      defaultProps: {
        disableTouchRipple: true,
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#A0AEC0",
          "&:hover": {
            color: "#9e77ed",
          },
        },
      },
    },
    MuiMenuList: {
      root: {
        color: "#A0AEC0",
        paddingTop: 0,
        paddingBottom: 0,
        "&:hover": {
          color: "#9e77ed",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          color: "#A0AEC0",
          borderRadius: "12px",
          "&:hover": {
            backgroundColor: "#252E3E",
            // transform: "scale(1.1)",
          },
          "&:focus": {
            backgroundColor: "#252E3E",
            color: "#EDF2F7",
          },
          fontSize: "15px",
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: "#A0AEC0",
          minWidth: "37px",
          padding: "0px",
          "&:hover": {
            color: "#9e77ed",
          },
          "&:focus": {
            color: "#9e77ed",
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          borderColor: "#2D3748",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #2D3748",
          "&:hover": {
            backgroundColor: "#1A222F",
            color: "#9e77ed",
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#1A222F",
            color: "#9e77ed",
          },
        },
      },
    },
    // MuiTextField: {
    //   styleOverrides: {
    //     root: {
    //       "& input::placeholder": {
    //         color: "green",
    //       },
    //     },
    //   },
    // },
  },
});

export { theme };
