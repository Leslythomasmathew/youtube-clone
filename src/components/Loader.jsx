import React from 'react';
import { Box, Stack } from '@mui/material';
import SkeletonVideoCard from './SkeletonVideoCard.jsx';

const Loader = () => (
  <Box 
    sx={{ 
      minHeight: '92vh', 
      backgroundColor: '#09090b',
      p: 3,
      width: '100%'
    }}
  >
    <Stack 
      direction="row" 
      sx={{ 
        flexWrap: 'wrap',
        justifyContent: { xs: 'center', sm: 'start' },
        gap: 2,
        width: '100%'
      }}
    >
      {[...Array(12)].map((_, index) => (
        <Box key={index} sx={{ width: { xs: '100%', sm: 'auto' }, display: 'flex', justifyContent: 'center' }}>
          <SkeletonVideoCard />
        </Box>
      ))}
    </Stack>
  </Box>
);

export default Loader;
