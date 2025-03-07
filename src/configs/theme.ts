import { createTheme } from "@mui/material";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#7B1FA2", // Deep purple
      light: "#9C27B0", // Lighter purple
      dark: "#4A148C", // Darker purple
    },
    secondary: {
      main: "#FF4081",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    text: {
      primary: "#000000",
      secondary: "#757575",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Arial', sans-serif",
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#FFB74D", // Peach
      light: "#FFCC80", // Lighter peach
      dark: "#F57C00", // Darker peach
    },
    secondary: {
      main: "#FF4081",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#ffffff",
      secondary: "#bdbdbd",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Arial', sans-serif",
  },
});
