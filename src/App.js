import { Box, Button, CssBaseline, Stack, TextField, ThemeProvider, Typography } from "@mui/material";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { theme } from "./theme/theme";
import useSignalRConnection from "./hooks/useSignalRConnection";
import { useEffect } from "react";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
