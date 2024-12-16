"use client";

// src/components/ThemeProvider.tsx
import React, { createContext, useContext, useState, ReactNode, useMemo } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

interface ColorModeContextType {
  toggleColorMode: () => void;
  mode: "light" | "dark";
}

const ColorModeContext = createContext<ColorModeContextType>({
  toggleColorMode: () => {},
  mode: "light",
});

export const useColorMode = () => useContext(ColorModeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<"light" | "dark">("light");

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      background: {
        default: mode === "light" ? '#ffffff' : '#303030', // Lighter background in dark mode
        paper: mode === "light" ? '#ffffff' : '#424242', // Lighter paper background in dark mode
      },
      primary: {
        main: mode === "light" ? '#7e6a9a' : '#b39ddb', // Muted violet colors
      },
      secondary: {
        main: mode === "light" ? '#5d4a7d' : '#9f8db4', // Muted violet colors
      },
      text: {
        primary: mode === "light" ? '#000000' : '#ffffff',
        secondary: mode === "light" ? '#5d4a7d' : '#d6cde5', // Muted violet colors
      },
      action: {
        active: mode === "light" ? '#7e6a9a' : '#b39ddb', // Muted violet colors
      },
    },
    components: {
      MuiBottomNavigation: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "light" ? '#d8d2e3' : '#424242', // Violet in light mode, gray in dark mode
          },
        },
      },
      MuiBottomNavigationAction: {
        styleOverrides: {
          root: {
            '&.Mui-selected': {
              color: mode === "light" ? '#7e6a9a' : '#b39ddb', // Muted violet colors
            },
            '&:hover': {
              color: mode === "light" ? '#7e6a9a' : '#b39ddb', // Muted violet colors
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            ...(mode === 'light' && {
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Black box shadow in light mode
            }),
            ...(mode === 'dark' && {
              boxShadow: '0 4px 8px rgba(255, 255, 255, 0.2)', // White box shadow in dark mode
            }),
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            color: mode === "light" ? '#ff8c00' : '#ffdab9', // Darker orange in light mode, peach in dark mode
            '&:hover': {
              color: mode === "light" ? '#ff8c00' : '#ffdab9', // Darker orange in light mode, peach in dark mode
            },
            '&:visited': {
              color: mode === "light" ? '#ff8c00' : '#ffdab9', // Ensure visited links have the same color
            },
          },
        },
      },
    },
    typography: {
      allVariants: {
        color: mode === "light" ? '#000000' : '#ffffff',
      },
    },
  }), [mode]);

  return (
    <ColorModeContext.Provider value={{ toggleColorMode, mode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default ThemeProvider;
