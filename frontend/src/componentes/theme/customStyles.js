import { styled } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';


// customStyles.js
export const listItemButtonStyles = {
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      backgroundColor: '#3a4c58',
      transform: 'scale(1.05)',
    },
    '&:active': {
      transform: 'scale(0.95)',
    },
  };
  
  export const listItemIconStyles = {
    color: 'silver',
    transition: 'color 0.3s ease-in-out',
    '&:hover': { color: '#ffffff' },
  };
  
  export const collapsedItemStyles = (open) => ({
    pl: open ? 4 : 2,
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      backgroundColor: '#3a4c58',
      transform: 'scale(1.05)',
    },
    '&:active': {
      transform: 'scale(0.95)',
    },
  });
  
  export const CleanOutlinedInput = styled(OutlinedInput)(() => ({
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    '&.Mui-focused': {
      borderColor: '#b0b0b0',
      backgroundColor: '#ffffff',
    },
  }));