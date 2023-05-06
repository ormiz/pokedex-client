import * as React from 'react';
import { useState, useMemo } from 'react';
import { BrowserRouter } from "react-router-dom";
import { createTheme } from '@mui/material/styles';
import HomePage from "./components/HomePage";
import { ColorModeContext } from './contexts/ColorModeContext';
import { ThemeProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';


function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  return (
      <BrowserRouter>
          <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <HomePage/>
            </ThemeProvider>
          </ColorModeContext.Provider>
      </BrowserRouter>
  );
}

export default App;
