import React, { useEffect, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Collapse } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EditNoteIcon from '@mui/icons-material/EditNote';
import TimelineIcon from '@mui/icons-material/Timeline';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

import { useAppStore } from '../../appStore.jsx';

const drawerWidth = 240;

// Drawer aberto
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

// Drawer fechado
const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

// Estilização do header
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

// Estilização do Drawer
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

export default function MiniDrawer() {
  const theme = useTheme();
  const navigate = useNavigate();
  const open = useAppStore((state) => state.dopen);

  const [openCadastros, setOpenCadastros] = useState(false);
  const [openDashboards, setOpenDashboards] = useState(false);
  const [openRelatorios, setOpenRelatorios] = useState(false);
  const [userType, setUserType] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userTypeFromStorage = localStorage.getItem('userType');
  
    if (!userTypeFromStorage && token) {
      // Decodifica o token para recuperar o tipo de usuário se não estiver salvo
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userType = decodedToken.tipousuario;
  
      if (userType) {
        localStorage.setItem('userType', userType); // Salva no localStorage
        setUserType(userType); // Atualiza o estado
      }
    } else {
      setUserType(userTypeFromStorage || '');
    }
  }, []);
  

  const handleToggleCadastros = () => setOpenCadastros(!openCadastros);
  const handleToggleDashboards = () => setOpenDashboards(!openDashboards);
  const handleToggleRelatorios = () => setOpenRelatorios(!openRelatorios);

  // Estilos
  const listItemButtonStyle = {
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      backgroundColor: '#3a4c58',
      transform: 'scale(1.05)',
    },
    '&:active': {
      transform: 'scale(0.95)',
    },
  };

  const listItemIconStyle = {
    color: 'silver',
    transition: 'color 0.3s ease-in-out',
    '&:hover': { color: '#ffffff' },
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          '& .MuiDrawer-paper': {
            paddingTop: '55px',
            backgroundColor: '#2d4351',
            color: 'silver',
          },
        }}
      >
        <Divider />
        <List>
          {/* Botão Cadastros - visível apenas para Administradores */}
          {userType === 'Administrador' && (
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton onClick={handleToggleCadastros} sx={listItemButtonStyle}>
                <ListItemIcon sx={{ ...listItemIconStyle, ...(open ? { mr: 3 } : { mr: 'auto' }) }}>
                  <EditNoteIcon sx={listItemIconStyle} />
                </ListItemIcon>
                <ListItemText primary="Cadastros" sx={[open ? { opacity: 1 } : { opacity: 0 }]} />
                {open && (openCadastros ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
              <Collapse in={open && openCadastros} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {['Produto', 'Fornecedor', 'Vendas', 'Categoria', 'Compra'].map((item) => (
                    <ListItem key={item} disablePadding>
                      <ListItemButton
                        onClick={() => open && navigate(`/cadastro-${item.toLowerCase()}`)}
                        sx={{ ...listItemButtonStyle, pl: open ? 4 : 2 }}
                      >
                        <ListItemText primary={`Cadastro ${item}`} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </ListItem>
          )}

          {/* Botão Dashboards */}
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton onClick={handleToggleDashboards} sx={listItemButtonStyle}>
              <ListItemIcon sx={{ ...listItemIconStyle, ...(open ? { mr: 3 } : { mr: 'auto' }) }}>
                <TimelineIcon sx={listItemIconStyle} />
              </ListItemIcon>
              <ListItemText primary="Dashboards" sx={[open ? { opacity: 1 } : { opacity: 0 }]} />
              {open && (openDashboards ? <ExpandLess /> : <ExpandMore />)}
            </ListItemButton>
          </ListItem>
          <Collapse in={open && openDashboards} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => open && navigate('/dashboard-vendas')}
                  sx={{ ...listItemButtonStyle, pl: open ? 4 : 2 }}
                >
                  <ListItemText primary="Dashboard Vendas" />
                </ListItemButton>
              </ListItem>
            </List>
          </Collapse>

          {/* Botão Relatórios */}
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton onClick={handleToggleRelatorios} sx={listItemButtonStyle}>
              <ListItemIcon sx={{ ...listItemIconStyle, ...(open ? { mr: 3 } : { mr: 'auto' }) }}>
                <AnalyticsIcon sx={listItemIconStyle} />
              </ListItemIcon>
              <ListItemText primary="Relatórios" sx={[open ? { opacity: 1 } : { opacity: 0 }]} />
              {open && (openRelatorios ? <ExpandLess /> : <ExpandMore />)}
            </ListItemButton>
          </ListItem>
          <Collapse in={open && openRelatorios} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {['Gastos', 'Vendas'].map((item) => (
                <ListItem key={item} disablePadding>
                  <ListItemButton
                    onClick={() => open && navigate(`/relatorio-${item.toLowerCase()}`)}
                    sx={{ ...listItemButtonStyle, pl: open ? 4 : 2 }}
                  >
                    <ListItemText primary={`Relatório de ${item}`} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>

          {/* Botão Catálogo */}
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton onClick={() => open && navigate('/catalogo-produtos')} sx={listItemButtonStyle}>
              <ListItemIcon sx={{ ...listItemIconStyle, ...(open ? { mr: 3 } : { mr: 'auto' }) }}>
                <ImportContactsIcon sx={listItemIconStyle} />
              </ListItemIcon>
              <ListItemText primary="Catálogo" sx={[open ? { opacity: 1 } : { opacity: 0 }]} />
            </ListItemButton>
          </ListItem>

          {/* Botão Fornecedores */}
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton onClick={() => open && navigate('/catalogo-fornecedores')} sx={listItemButtonStyle}>
              <ListItemIcon sx={{ ...listItemIconStyle, ...(open ? { mr: 3 } : { mr: 'auto' }) }}>
                <ImportContactsIcon sx={listItemIconStyle} />
              </ListItemIcon>
              <ListItemText primary="Fornecedores" sx={[open ? { opacity: 1 } : { opacity: 0 }]} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
      </Box>
    </Box>
  );
}
