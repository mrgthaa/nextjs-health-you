'use client';

import { useEffect } from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import {
  Box,
  Typography,
  Button,
  ButtonProps,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled, keyframes } from '@mui/system';
import { useDarkMode } from '@/context/DarkModeContext';

/* ─── Animasi ─── */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ─── Styled helpers ─── */
const BackgroundContainer = styled(Box, {
  shouldForwardProp: (p) => p !== 'darkMode',
})<{ darkMode: boolean }>(({ theme, darkMode }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  padding: theme.spacing(6, 2, 4),
  background: darkMode
    ? 'linear-gradient(135deg,#0f2027,#203a43,#2c5364)'
    : 'linear-gradient(135deg,#4682A9,#749BC2)',
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  animation: `${fadeIn} 1s ease-out`,
  maxWidth: 720,
  width: '100%',
}));

const Title = styled(Typography, {
  shouldForwardProp: (p) => p !== 'darkMode',
})<{ darkMode: boolean }>(({ theme, darkMode }) => ({
  fontWeight: 800,
  fontSize: 'clamp(2.2rem,7vw,3.6rem)',
  marginBottom: theme.spacing(2),
  color: darkMode ? '#fafafa' : '#fff',
}));

const Subtitle = styled(Typography, {
  shouldForwardProp: (p) => p !== 'darkMode',
})<{ darkMode: boolean }>(({ theme, darkMode }) => ({
  fontSize: '1.1rem',
  marginBottom: theme.spacing(4),
  maxWidth: 520,
  color: darkMode ? '#e0e0e0' : '#f4f4f4',
}));

// ✅ StyledButton: auto width sesuai teks
const StyledButton = styled((props: ButtonProps) => (
  <Button disableElevation {...props} />
))(({ theme }) => ({
  width: 'fit-content',
  padding: theme.spacing(1, 3),
  margin: theme.spacing(1),
  fontWeight: 600,
  borderRadius: 30,
  textTransform: 'none',
  color: '#fff',
  backgroundColor: '#f0c420',
  '&:hover': { backgroundColor: '#e6b800' },
}));

const FooterText = styled(Typography, {
  shouldForwardProp: (p) => p !== 'darkMode',
})<{ darkMode: boolean }>(({ theme, darkMode }) => ({
  position: 'fixed',
  bottom: theme.spacing(1.5),
  left: 0,
  right: 0,
  fontSize: '0.82rem',
  color: darkMode ? '#eee' : '#fff',
  textAlign: 'center',
}));

/* ─── Komponen ─── */
export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { darkMode } = useDarkMode();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, []);

  return (
    <BackgroundContainer darkMode={darkMode}>
      <ContentWrapper>
        {/* logo */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Box
            sx={{
              width: isMobile ? 96 : 120,
              height: isMobile ? 96 : 120,
              borderRadius: '50%',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            }}
          >
            <Image
              src="/images/logo.png"
              alt="Logo HealthYou"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </Box>
        </Box>

        {/* heading */}
        <Title variant="h1" darkMode={darkMode}>
          Selamat Datang 👋
        </Title>
        <Subtitle variant="h6" darkMode={darkMode}>
          di <strong>HealthYou</strong>, sahabat Anda dalam hidup sehat dan
          terhidrasi 🌿
        </Subtitle>

        {/* CTA */}
        <Box display="flex" justifyContent="center">
          <StyledButton
            component={NextLink}
            href="/dashboard"
            variant="contained"
          >
            Masuk
          </StyledButton>
        </Box>
      </ContentWrapper>

      <FooterText darkMode={darkMode}>
        © 2025 — HealthYou. Tetap sehat, tetap terhidrasi.
      </FooterText>
    </BackgroundContainer>
  );
}
