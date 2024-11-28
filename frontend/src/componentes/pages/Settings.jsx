import React from 'react';
import Sidernav from './TelaGeral/Sidernav';
import Box from '@mui/material/Box';
import { styled, useTheme } from '@mui/material/styles';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));
const Settings = () => {
  return (
    <div>
      <Box sx={{ display: 'flex' }}>
      <Sidernav/>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
         <DrawerHeader />
         <h1>Setings</h1>
       </Box>
      </Box>
      
    </div>
  )
}

export default Settings
