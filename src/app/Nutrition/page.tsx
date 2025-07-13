'use client';

import {
  Typography,
  Box,
  Menu,
  MenuItem,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { styled, keyframes } from '@mui/system';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDarkMode } from '@/context/DarkModeContext';
import DarkModeToggle from '@/components/DarkModeToggle';
import NutritionCard from '@/components/NutritionCard';

/* ────── Animasi & Style ────── */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const glass = {
  background: 'rgba(255,255,255,0.15)',
  backdropFilter: 'blur(14px)',
  border: '1px solid rgba(255,255,255,0.22)',
};

const glow = { boxShadow: '0 0 8px 2px rgba(255,215,0,.55)' };

const StyledBackground = styled('div', {
  shouldForwardProp: (prop) => prop !== 'dark',
})<{ dark: boolean }>(({ theme, dark }) => ({
  minHeight: '100vh',
  overflowX: 'hidden',
  background: dark
    ? 'linear-gradient(135deg,#0f2027,#203a43,#2c5364)'
    : 'linear-gradient(135deg,#293d5e,#5f84c7)',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  padding: theme.spacing(2),
  position: 'relative',
}));

const PageCard = styled(Paper)(({ theme }) => ({
  ...glass,
  borderRadius: 24,
  padding: 32,
  width: '100%',
  maxWidth: 720,
  animation: `${fadeIn} 0.8s ease-out`, // ✅ FIXED
  boxShadow: '0 12px 32px rgba(0,0,0,.35)',
  [theme.breakpoints.down('sm')]: {
    padding: 16,
    maxWidth: '100%',
    borderRadius: 20,
    marginTop: 72,
  },
}));

/* ────── Data Menu ────── */
type Hari =
  | 'Senin'
  | 'Selasa'
  | 'Rabu'
  | 'Kamis'
  | 'Jumat'
  | 'Sabtu'
  | 'Minggu';

interface MenuHarian {
  pagi: string;
  siang: string;
  malam: string;
}

const dailyMenus: Record<Hari, MenuHarian> = {
  Senin: {
    pagi: 'Oatmeal + kiwi & chia (≈310 kcal)',
    siang: 'Ayam kukus + sayur rebus (≈420 kcal)',
    malam: 'Sup tomat + tofu goreng (≈350 kcal)',
  },
  Selasa: {
    pagi: 'Roti gandum + selai kacang (≈360 kcal)',
    siang: 'Nasi merah + ayam teriyaki (≈500 kcal)',
    malam: 'Tumis brokoli + telur orak-arik (≈330 kcal)',
  },
  Rabu: {
    pagi: 'Smoothie mangga + granola (≈300 kcal)',
    siang: 'Bakwan jagung + lalapan (≈450 kcal)',
    malam: 'Spaghetti gandum + saus sayur (≈480 kcal)',
  },
  Kamis: {
    pagi: 'Telur rebus + pisang (≈280 kcal)',
    siang: 'Soto ayam bening + nasi merah (≈430 kcal)',
    malam: 'Salmon bakar + salad timun (≈460 kcal)',
  },
  Jumat: {
    pagi: 'Chia pudding + alpukat (≈320 kcal)',
    siang: 'Gado-gado + lontong (≈520 kcal)',
    malam: 'Sup jamur + telur dadar (≈340 kcal)',
  },
  Sabtu: {
    pagi: 'Greek yogurt + granola (≈310 kcal)',
    siang: 'Capcay ayam + tahu (≈440 kcal)',
    malam: 'Kari kentang + tempe panggang (≈480 kcal)',
  },
  Minggu: {
    pagi: 'French toast gandum + madu (≈370 kcal)',
    siang: 'Pepes ikan + sayur asem (≈460 kcal)',
    malam: 'Nasi uduk + tahu bacem (≈500 kcal)',
  },
};

/* ────── Komponen ────── */
export default function NutritionPage() {
  const router = useRouter();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const theme = useTheme();
  const downSm = useMediaQuery(theme.breakpoints.down('sm'));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [todayMenu, setTodayMenu] = useState<
    (MenuHarian & { hari: Hari }) | null
  >(null);
  const [checking, setChecking] = useState(true);

  /* tentukan hari ini */
  useEffect(() => {
    const hariList: Hari[] = [
      'Minggu',
      'Senin',
      'Selasa',
      'Rabu',
      'Kamis',
      'Jumat',
      'Sabtu',
    ];
    const hari = hariList[new Date().getDay()];
    setTodayMenu({ hari, ...dailyMenus[hari] });
  }, []);

  /* auth check */
  useEffect(() => {
    localStorage.getItem('isLoggedIn') === 'true'
      ? setChecking(false)
      : router.push('/auth/login');
  }, [router]);

  if (checking) return null;

  return (
    <StyledBackground dark={darkMode}>
      {/* ---------- Navbar ---------- */}
      <Box
        sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1 }}
      >
        <Link href="/dashboard">
          <IconButton
            sx={{
              color: '#FFD700',
              border: '1px solid #FFD700',
              background: 'rgba(255,255,255,0.15)',
              '&:hover': { background: 'rgba(255,255,255,0.25)', ...glow },
            }}
          >
            <HomeIcon fontSize="small" />
          </IconButton>
        </Link>

        <IconButton
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            color: '#FFD700',
            border: '1px solid #FFD700',
            background: 'rgba(255,255,255,0.15)',
            '&:hover': { background: 'rgba(255,255,255,0.25)', ...glow },
          }}
        >
          <MenuIcon fontSize="small" />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PaperProps={{
            sx: {
              ...glass,
              background: darkMode ? '#102127' : '#5d80c1',
              color: '#FFD700',
            },
          }}
        >
          {[
            { l: 'Data Diri', h: '/profile' },
            { l: 'Notifikasi Kesehatan', h: '/Reminders' },
            { l: 'Media Sosial', h: '/social' },
          ].map((i) => (
            <MenuItem
              key={i.h}
              onClick={() => setAnchorEl(null)}
              sx={{ color: '#FFD700' }}
            >
              <Link
                href={i.h}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {i.l}
              </Link>
            </MenuItem>
          ))}
          <MenuItem
            onClick={() => {
              toggleDarkMode();
              setAnchorEl(null);
            }}
          >
            <DarkModeToggle
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
          </MenuItem>
        </Menu>
      </Box>

      {/* ---------- Konten Utama ---------- */}
      <PageCard>
        <Typography
          variant={downSm ? 'h5' : 'h4'}
          fontWeight={800}
          textAlign="center"
          sx={{
            background: 'linear-gradient(90deg,#fff,#fff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
          gutterBottom
        >
          Menu Sehat Hari Ini
        </Typography>

        {todayMenu && (
          <>
            {/* kartu pagi/siang/malam */}
            <Typography
              variant="subtitle1"
              fontWeight={700}
              textAlign="center"
              sx={{ color: '#FFD700', mb: 2 }}
            >
              {todayMenu.hari}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                justifyContent: 'center',
              }}
            >
              {(['pagi', 'siang', 'malam'] as const).map((slot) => (
                <Box
                  key={slot}
                  sx={{ flexBasis: { xs: '100%', sm: '45%' }, flexGrow: 1 }}
                >
                  <NutritionCard
                    title={slot[0].toUpperCase() + slot.slice(1)}
                    description={todayMenu[slot]}
                    darkMode={darkMode}
                  />
                </Box>
              ))}
            </Box>

            {/* tabel mingguan */}
            <Box mt={4}>
              <Typography
                variant="subtitle2"
                fontWeight={700}
                sx={{ color: '#FFD700', mb: 1 }}
              >
                Rencana Menu 1 Minggu
              </Typography>

              <Box sx={{ overflowX: 'auto' }}>
                <Table
                  size="small"
                  sx={{
                    minWidth: 480,
                    '& td, & th': {
                      borderColor: 'rgba(255,255,255,0.2)',
                      fontSize: '0.75rem',
                      px: 1,
                      py: 0.5,
                      color: '#e0e0e0',
                    },
                    '& th': { color: '#fff', fontWeight: 700 },
                    '& tr:nth-of-type(odd)': {
                      background: 'rgba(255,255,255,0.05)',
                    },
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Hari</TableCell>
                      <TableCell>Pagi</TableCell>
                      <TableCell>Siang</TableCell>
                      <TableCell>Malam</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(Object.keys(dailyMenus) as Hari[]).map((h) => (
                      <TableRow key={h}>
                        <TableCell
                          sx={{
                            fontWeight: 700,
                            color: '#FFD700',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {h}
                        </TableCell>
                        <TableCell>{dailyMenus[h].pagi}</TableCell>
                        <TableCell>{dailyMenus[h].siang}</TableCell>
                        <TableCell>{dailyMenus[h].malam}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          </>
        )}
      </PageCard>
    </StyledBackground>
  );
}
