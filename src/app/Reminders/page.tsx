'use client';

import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  Box,
  Menu,
  MenuItem,
  TextField,
  Button,
  Paper,
  CircularProgress,
} from '@mui/material';
import { styled, keyframes, useTheme } from '@mui/system';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDarkMode } from '@/context/DarkModeContext';
import DarkModeToggle from '@/components/DarkModeToggle';

const MOCKAPI_URL = 'https://685d194e769de2bf085f55ed.mockapi.io/Reminders';
const GOLD = '#FFD700';

/* ---------- Animasi ---------- */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ---------- Styled ---------- */
const Background = styled(Box, {
  shouldForwardProp: (p) => p !== 'darkmode',
})<{ darkmode: boolean }>(({ theme, darkmode }) => ({
  minHeight: '100vh',
  background: darkmode
    ? 'linear-gradient(135deg,#0f2027,#203a43,#2c5364)'
    : 'linear-gradient(135deg,#293d5e,#5f84c7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(6, 2, 10),
  flexDirection: 'column',
  transition: 'background 0.4s',
}));

const Card = styled(Paper, {
  shouldForwardProp: (p) => p !== 'darkmode',
})<{ darkmode: boolean }>(({ theme, darkmode }) => ({
  backdropFilter: 'blur(12px)',
  backgroundColor: darkmode
    ? 'rgba(16,33,39,0.95)'
    : 'rgba(255,255,255,0.1)',
  borderRadius: 24,
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: 800,
  color: '#fff',
  animation: `${fadeIn} 0.7s ease-out`, // ✅ fixed
}));

const inputStyle = (theme: any, dark: boolean) => ({
  '& label': { color: '#fff' },
  '& input': { color: '#fff' },
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: '#fff' },
    '&:hover fieldset': { borderColor: '#fff' },
    '&.Mui-focused fieldset': { borderColor: GOLD },
  },
  '& .MuiSelect-select': { color: '#fff' },
  '& .MuiSvgIcon-root': { color: '#fff' },
});

const StyledButton = styled(Button)({
  borderRadius: 30,
  backgroundColor: '#1976d2',
  color: '#fff',
  textTransform: 'none',
  fontWeight: 600,
  padding: '10px 24px',
  '&:hover': { backgroundColor: '#155a9c' },
});

/* ---------- Form Komponen ---------- */
function ReminderForm({
  onAdd,
  dark,
}: {
  onAdd: (data: any) => void;
  dark: boolean;
}) {
  const [form, setForm] = useState({
    text: '',
    category: '',
    time: '',
    contactType: 'email',
    contact: '',
  });
  const theme = useTheme();
  const update =
    (key: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [key]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(form);
    setForm({
      text: '',
      category: '',
      time: '',
      contactType: 'email',
      contact: '',
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <Typography variant="h6" fontWeight={700} color="#fff">
        Tambah Pengingat
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <TextField
          label="Jam Pengingat"
          type="time"
          value={form.time}
          onChange={update('time')}
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
          sx={{ flex: 1, ...inputStyle(theme, dark) }}
        />
        <TextField
          select
          label="Kategori"
          value={form.category}
          onChange={update('category')}
          fullWidth
          required
          sx={{ flex: 1, ...inputStyle(theme, dark) }}
        >
          <MenuItem value="makan">Makan</MenuItem>
          <MenuItem value="minum">Minum</MenuItem>
          <MenuItem value="tidur">Tidur</MenuItem>
        </TextField>
      </Box>

      <TextField
        label="Deskripsi"
        value={form.text}
        onChange={update('text')}
        fullWidth
        required
        sx={inputStyle(theme, dark)}
      />

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <TextField
          select
          label="Metode"
          value={form.contactType}
          onChange={update('contactType')}
          fullWidth
          sx={{ flex: 1, ...inputStyle(theme, dark) }}
        >
          <MenuItem value="email">Email</MenuItem>
          <MenuItem value="whatsapp">WhatsApp</MenuItem>
        </TextField>
        <TextField
          label={form.contactType === 'email' ? 'Email' : 'WhatsApp'}
          value={form.contact}
          onChange={update('contact')}
          type={form.contactType === 'email' ? 'email' : 'tel'}
          fullWidth
          required
          sx={{ flex: 1, ...inputStyle(theme, dark) }}
        />
      </Box>

      <Box sx={{ textAlign: 'right' }}>
        <StyledButton type="submit">Simpan</StyledButton>
      </Box>
    </Box>
  );
}

/* ---------- Halaman Utama ---------- */
export default function Reminders() {
  const router = useRouter();
  const { darkMode, toggleDarkMode } = useDarkMode();

  const [reminders, setReminders] = useState<any[]>([]);
  const [checking, setChecking] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  /* auth check */
  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      router.push('/auth/login');
    } else {
      setChecking(false);
    }
  }, [router]);

  /* fetch reminders */
  useEffect(() => {
    if (!checking) fetchReminders();
  }, [checking]);

  const fetchReminders = async () => {
    const res = await fetch(MOCKAPI_URL);
    const data = await res.json();
    setReminders(data);
  };

  const addReminder = async (r: any) => {
    const res = await fetch(MOCKAPI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(r),
    });
    const newData = await res.json();
    setReminders((prev) => [newData, ...prev]);
  };

  const deleteReminder = async (id: string) => {
    await fetch(`${MOCKAPI_URL}/${id}`, { method: 'DELETE' }); // ✅ fixed
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  if (checking)
    return (
      <Box
        minHeight="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Background darkmode={darkMode}>
      {/* ---------- Navbar Mini ---------- */}
      <Box
        sx={{
          position: 'fixed',
          top: 24,
          right: 24,
          display: 'flex',
          gap: 1,
          zIndex: 1000,
        }}
      >
        <Tooltip title="Dashboard">
          <Link href="/dashboard">
            <IconButton
              sx={{
                color: GOLD,
                bgcolor: 'rgba(255,255,255,0.1)',
                border: `1px solid ${GOLD}`, // ✅ fixed
              }}
            >
              <HomeIcon fontSize="small" />
            </IconButton>
          </Link>
        </Tooltip>

        <Tooltip title="Menu">
          <IconButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              color: GOLD,
              bgcolor: 'rgba(255,255,255,0.1)',
              border: `1px solid ${GOLD}`, // ✅ fixed
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={() => setAnchorEl(null)}
          PaperProps={{
            sx: {
              background: darkMode ? '#102127' : '#6f95d3',
              color: GOLD,
              borderRadius: 2,
              backdropFilter: 'blur(12px)',
            },
          }}
        >
          {[
            { l: 'Data Diri', h: '/profile' },
            { l: 'Menu Sehat', h: '/Nutrition' },
            { l: 'Media Sosial', h: '/social' },
          ].map((i) => (
            <MenuItem
              key={i.h}
              onClick={() => setAnchorEl(null)}
              sx={{ color: GOLD }}
            >
              <Link
                href={i.h}
                style={{ textDecoration: 'none', color: GOLD, width: '100%' }}
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

      {/* ---------- Card Utama ---------- */}
      <Card darkmode={darkMode}>
        <Typography
          variant="h4"
          fontWeight={800}
          textAlign="center"
          gutterBottom
        >
          Pengingat Hidup Sehat 💧🍽🥬

        </Typography>
        <Divider sx={{ mb: 3, borderColor: '#555' }} />

        <ReminderForm onAdd={addReminder} dark={darkMode} />

        <Box mt={5}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Daftar Pengingat
          </Typography>

          {reminders.length === 0 ? (
            <Typography color="#ccc" textAlign="center" component="span">
              Belum ada pengingat.
            </Typography>
          ) : (
            <List>
              {reminders.map((r, i) => (
                <Box key={r.id}>
                  <ListItem
                    secondaryAction={
                      <Tooltip title="Hapus">
                        <IconButton onClick={() => deleteReminder(r.id)}>
                          <DeleteIcon color="error" />
                        </IconButton>
                      </Tooltip>
                    }
                    sx={{
                      bgcolor: darkMode
                        ? 'rgba(255,255,255,0.05)'
                        : 'rgba(0,0,0,0.03)',
                      '&:hover': {
                        bgcolor: darkMode
                          ? 'rgba(255,255,255,0.08)'
                          : 'rgba(0,0,0,0.06)',
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          fontWeight={700}
                          color="#fff"
                          component="span"
                        >
                          {r.text} ({r.category})
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography
                            variant="body2"
                            color="#ccc"
                            component="span"
                            sx={{ display: 'flex', alignItems: 'center' }}
                          >
                            <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} />{' '}
                            {r.time}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="#ccc"
                            component="span"
                          >
                            Kirim via {r.contactType}: {r.contact}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {i < reminders.length - 1 && (
                    <Divider sx={{ borderColor: '#444' }} />
                  )}
                </Box>
              ))}
            </List>
          )}
        </Box>
      </Card>
    </Background>
  );
}
