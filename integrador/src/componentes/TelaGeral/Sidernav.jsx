import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import TimelineIcon from '@mui/icons-material/Timeline';
import EditNoteIcon from '@mui/icons-material/EditNote';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import { useNavigate } from 'react-router-dom';
import { Collapse } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import  {useAppStore} from '../../appStore.jsx';


const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

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

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

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
  //const [open, setOpen] = React.useState(true);

  const open = useAppStore((state)=>state.dopen);

  const [openCadastros, setOpenCadastros] = React.useState(false);
  const [openDashboards, setOpenDashboards] = React.useState(false);
  const [openRelatorios, setOpenRelatorios] = React.useState(false);
  const navigate = useNavigate();

  const handleToggleCadastros = () => {
    setOpenCadastros(!openCadastros);
  };

  const handleToggleDashboards = () => {
    setOpenDashboards(!openDashboards);
  };

  const handleToggleRelatorios = () => {
    setOpenRelatorios(!openRelatorios);
  };

  return (
    <Box sx={{ display: 'flex'}}>
      <CssBaseline />
      <Drawer variant="permanent"
        open={open}
        sx={{ '& .MuiDrawer-paper': { paddingTop: '55px' } }}>
        {/*<DrawerHeader>
          <IconButton onClick={()=>setOpen(!open)}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>*/}
        <Divider />
        <List>
          {/* Botão Cadastros */}
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton onClick={handleToggleCadastros}>
              <ListItemIcon
                sx={[
                  { minWidth: 0, justifyContent: 'center' },
                  open ? { mr: 3 } : { mr: 'auto' },
                ]}
              >
                <EditNoteIcon />
              </ListItemIcon>
              <ListItemText primary="Cadastros" sx={[open ? { opacity: 1 } : { opacity: 0 }]} />
              {open && (openCadastros ? <ExpandLess /> : <ExpandMore />)}
            </ListItemButton>
          </ListItem>
          <Collapse in={open && openCadastros} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem disablePadding onClick={() => open && navigate("/cadastro-produto")}>
                <ListItemButton sx={{ pl: open ? 4 : 2 }}>
                  <ListItemText primary="Cadastro Produto" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding onClick={() => open && navigate("/cadastro-fornecedor")}>
                <ListItemButton sx={{ pl: open ? 4 : 2 }}>
                  <ListItemText primary="Cadastro Fornecedor" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding onClick={() => open && navigate("/cadastro-Vendas")}>
                <ListItemButton sx={{ pl: open ? 4 : 2 }}>
                  <ListItemText primary="Cadastro Vendas" />
                </ListItemButton>
              </ListItem>
            </List>
          </Collapse>

          {/* Botão Dashboards */}
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton onClick={handleToggleDashboards}>
              <ListItemIcon
                sx={[
                  { minWidth: 0, justifyContent: 'center' },
                  open ? { mr: 3 } : { mr: 'auto' },
                ]}
              >
                <TimelineIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboards" sx={[open ? { opacity: 1 } : { opacity: 0 }]} />
              {open && (openDashboards ? <ExpandLess /> : <ExpandMore />)}
            </ListItemButton>
          </ListItem>
          <Collapse in={open && openDashboards} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem disablePadding onClick={() => open && navigate("/dashboard-vendas")}>
                <ListItemButton sx={{ pl: open ? 4 : 2 }}>
                  <ListItemText primary="Dashboard Vendas" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding onClick={() => open && navigate("/dashboard-compras")}>
                <ListItemButton sx={{ pl: open ? 4 : 2 }}>
                  <ListItemText primary="Dashboard Compras" />
                </ListItemButton>
              </ListItem>
            </List>
          </Collapse>

          {/* Botão Relatórios */}
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton onClick={handleToggleRelatorios}>
              <ListItemIcon
                sx={[
                  { minWidth: 0, justifyContent: 'center' },
                  open ? { mr: 3 } : { mr: 'auto' },
                ]}
              >
                <AnalyticsIcon />
              </ListItemIcon>
              <ListItemText primary="Relatórios" sx={[open ? { opacity: 1 } : { opacity: 0 }]} />
              {open && (openRelatorios ? <ExpandLess /> : <ExpandMore />)}
            </ListItemButton>
          </ListItem>
          <Collapse in={open && openRelatorios} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem disablePadding onClick={() => open && navigate("/relatorio-gastos")}>
                <ListItemButton sx={{ pl: open ? 4 : 2 }}>
                  <ListItemText primary="Relatório de Gastos" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding onClick={() => open && navigate("/relatorio-vendas")}>
                <ListItemButton sx={{ pl: open ? 4 : 2 }}>
                  <ListItemText primary="Relatório de Vendas" />
                </ListItemButton>
              </ListItem>
            </List>
          </Collapse>
          <List>
  {/* Botão Catálogo */}
  <ListItem disablePadding sx={{ display: 'block' }}>
    <ListItemButton onClick={() => open && navigate("/catalogo-Produtos")}>
      <ListItemIcon
        sx={[
          { minWidth: 0, justifyContent: 'center' },
          open ? { mr: 3 } : { mr: 'auto' },
        ]}
      >
        <ImportContactsIcon />
      </ListItemIcon>
      <ListItemText primary="Catálogo" sx={[open ? { opacity: 1 } : { opacity: 0 }]} />
    </ListItemButton>
  </ListItem>

  {/* Botão Estoque */}
  <ListItem disablePadding sx={{ display: 'block' }}>
    <ListItemButton onClick={() => open && navigate("/estoque")}>
      <ListItemIcon
        sx={[
          { minWidth: 0, justifyContent: 'center' },
          open ? { mr: 3 } : { mr: 'auto' },
        ]}
      >
        <WarehouseIcon />
      </ListItemIcon>
      <ListItemText primary="Estoque" sx={[open ? { opacity: 1 } : { opacity: 0 }]} />
    </ListItemButton>
  </ListItem>
</List>

        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
      </Box>
    </Box>
  );
}
