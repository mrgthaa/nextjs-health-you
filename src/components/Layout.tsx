// components/Layout.tsx
'use client';

import { useState, ReactNode } from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import DarkModeToggle from './DarkModeToggle';
import { useRouter } from 'next/navigation'; // Gunakan 'next/router' jika masih pakai pages directory

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <Box sx={{ backgroundColor: darkMode ? '#121212' : '#f4f9fd', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Health & Hydration Tracker
          </Typography>
          <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </Toolbar>
      </AppBar>

      <Box sx={{ padding: 2 }}>{children}</Box>
    </Box>
  );
}
