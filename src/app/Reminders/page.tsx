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
  Select,
  FormControl,
  InputLabel,
  Button,
  Paper,
  Switch,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';
import { styled, keyframes } from '@mui/system';
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

/* ───────── styled helpers ───────── */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Background = styled(Box, { shouldForwardProp: p => p !== '$dark' })<{
  $dark: boolean;
}>(({ theme, $dark }) => ({
  minHeight: '100vh',
  background: $dark
    ? 'linear-gradient(135deg,#0f2027,#203a43,#2c5364)'
    : 'linear-gradient(135deg,#293d5e,#5f84c7)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(6, 2, 8),
  position: 'relative',
}));

const Card = styled(Paper)(({ theme }) => ({
  backgroundColor: 'rgba(255,255,255,.12)',
  backdropFilter: 'blur(14px)',
  borderRadius: 24,
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: 800,
  color: '#fff',
  boxShadow: '0 18px 38px rgba(0,0,0,.35)',
  animation: `${fadeIn} .8s ease-out`,
}));

/* ───────── form tanpa Grid ───────── */
function ReminderForm({
  onAdd,
  dark,
}: {
  onAdd: (d: any) => void;
  dark: boolean;
}) {
  const [form, setForm] = useState({
    text: '',
    category: '',
    time: '',
    contactType: 'email',
    contact: '',
  });

  const update = (k: string) => (e: any) =>
    setForm({ ...form, [k]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(form);
    setForm({ ...form, text: '', category: '', time: '', contact: '' });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <Typography variant="h6" fontWeight={700}>
        Tambah Pengingat
      </Typography>

      {/* waktu + kategori */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <TextField
          fullWidth
          label="Jam Pengingat"
          type="time"
          value={form.time}
          onChange={update('time')}
          InputLabelProps={{ shrink: true, sx: { color: '#fff' } }}
          sx={{
            flex: '1 1 180px',
            '& .MuiOutlinedInput-root': { color: '#fff' },
            '& fieldset': { borderColor: '#fff' },
          }}
          required
        />

        <FormControl sx={{ flex: '1 1 220px' }}>
          <InputLabel shrink sx={{ color: '#fff' }}>
            Jenis Pengingat
          </InputLabel>
          <Select
            value={form.category}
            onChange={update('category')}
            sx={{ color: '#fff', '& .MuiSvgIcon-root': { color: '#fff' } }}
            required
          >
            <MenuItem value="makan">Makan</MenuItem>
            <MenuItem value="minum">Minum</MenuItem>
            <MenuItem value="tidur">Tidur</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TextField
        fullWidth
        label="Deskripsi Pengingat"
        value={form.text}
        onChange={update('text')}
        InputLabelProps={{ shrink: true, sx: { color: '#fff' } }}
        sx={{ '& fieldset': { borderColor: '#fff' }, color: '#fff' }}
        required
      />

      {/* metode + kontak */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <FormControl sx={{ flex: '1 1 180px' }}>
          <InputLabel shrink sx={{ color: '#fff' }}>
            Metode
          </InputLabel>
          <Select
            value={form.contactType}
            onChange={update('contactType')}
            sx={{ color: '#fff', '& .MuiSvgIcon-root': { color: '#fff' } }}
            required
          >
            <MenuItem value="email">Email</MenuItem>
            <MenuItem value="whatsapp">WhatsApp</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label={form.contactType === 'email' ? 'Alamat Email' : 'Nomor WhatsApp'}
          type={form.contactType === 'email' ? 'email' : 'tel'}
          value={form.contact}
          onChange={update('contact')}
          InputLabelProps={{ shrink: true, sx: { color: '#fff' } }}
          sx={{ flex: '1 1 220px', '& fieldset': { borderColor: '#fff' }, color: '#fff' }}
          required
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" type="submit" sx={{ px: 4, borderRadius: 28 }}>
          SIMPAN
        </Button>
      </Box>
    </Box>
  );
}

export default function Reminders() {
  const router = useRouter();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [reminders, setReminders] = useState<any[]>([]);
  const [checking, setChecking] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  /* auth check */
  useEffect(() => {
    localStorage.getItem('isLoggedIn') === 'true'
      ? setChecking(false)
      : router.push('/auth/login');
  }, [router]);

  /* fetch data */
  useEffect(() => {
    if (!checking) {
      fetch(MOCKAPI_URL)
        .then((r) => r.json())
        .then(setReminders);
    }
  }, [checking]);

  /* CRUD handlers */
  const addReminder = async (d: any) => {
    const res = await fetch(MOCKAPI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(d),
    });
    const newReminder = await res.json(); // ✅ tunggu di sini
    setReminders((r) => [newReminder, ...r]);
  };

  const delReminder = async (idx: number) => {
    const victim = reminders[idx];
    if (victim.id) await fetch(`${MOCKAPI_URL}/${victim.id}`, { method: 'DELETE' });
    setReminders((r) => r.filter((_, i) => i !== idx));
  };

  /* top‑bar menu */
  const openMenu = Boolean(anchorEl);

  if (checking)
    return (
      <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );

  return (
    <Background $dark={darkMode}>
      {/* top‑bar  */}
      <Box sx={{ position: 'fixed', top: 24, right: 24, display: 'flex', gap: 1 }}>
        <Tooltip title="Dashboard">
          <Link href="/dashboard" passHref>
            <IconButton
              sx={{ color: '#ffd700', background: 'rgba(255,255,255,.18)', border: '1px solid #ffd700' }}
            >
              <HomeIcon fontSize="small" />
            </IconButton>
          </Link>
        </Tooltip>
        <Tooltip title="Menu">
          <IconButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ color: '#ffd700', background: 'rgba(255,255,255,.18)', border: '1px solid #ffd700' }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* pop‑menu */}
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            background: darkMode ? '#102127' : '#6f95d3',
            backdropFilter: 'blur(14px)',
            border: '1px solid rgba(255,255,255,.25)',
          },
        }}
      >
        {[
          { l: 'Data Diri', h: '/profile' },
          { l: 'Menu Sehat', h: '/Nutrition' },
          { l: 'Media Sosial', h: '/social' },
        ].map((i) => (
          <MenuItem key={i.h} onClick={() => setAnchorEl(null)}>
            <Link href={i.h} style={{ textDecoration: 'none', color: '#ffd700', width: '100%' }}>
              {i.l}
            </Link>
          </MenuItem>
        ))}
        <MenuItem
          onClick={() => {
            toggleDarkMode();
            setAnchorEl(null);
          }}
          sx={{ color: '#ffd700' }}
        >
          <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </MenuItem>
      </Menu>

      {/* main card */}
      <Card>
        <Typography variant="h4" fontWeight={700} align="center" sx={{ mb: 1 }}>
          Pengingat Hidup Sehat 💧🍽️🥬
        </Typography>
        <Divider sx={{ my: 2, borderColor: '#555' }} />

        <ReminderForm onAdd={addReminder} dark={darkMode} />

        <Box mt={4}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Daftar Pengingat
          </Typography>

          {reminders.length === 0 ? (
            <Typography sx={{ textAlign: 'center', py: 4, color: '#ccc' }}>
              Belum ada pengingat.
            </Typography>
          ) : (
            <Box sx={{ borderRadius: 3, border: '1px solid #555', overflow: 'hidden' }}>
              <List disablePadding>
                {reminders.map((r, i) => (
                  <Box key={r.id || i}>
                    <ListItem
                      secondaryAction={
                        <Tooltip title="Hapus">
                          <IconButton onClick={() => delReminder(i)}>
                            <DeleteIcon color="error" />
                          </IconButton>
                        </Tooltip>
                      }
                      sx={{
                        background: 'rgba(255,255,255,.05)',
                        '&:hover': { background: 'rgba(255,255,255,.1)' },
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography fontWeight={700}>
                            {r.text} ({r.category})
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography
                              variant="body2"
                              display="flex"
                              alignItems="center"
                              sx={{ mb: 0.25 }}
                            >
                              <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                              {r.time}
                            </Typography>
                            <Typography variant="body2">
                              Kirim ke {r.contactType}: {r.contact}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {i < reminders.length - 1 && (
                      <Divider sx={{ borderColor: '#555' }} />
                    )}
                  </Box>
                ))}
              </List>
            </Box>
          )}
        </Box>
      </Card>
    </Background>
  );
}
