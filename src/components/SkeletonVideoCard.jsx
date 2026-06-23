import React from 'react';
import { Box, Stack } from '@mui/material';

const SkeletonVideoCard = () => (
  <Box 
    sx={{ 
      width: { xs: '100%', sm: '280px', md: '300px' },
      backgroundColor: 'transparent',
      mb: 3
    }}
  >
    {/* Aspect Ratio 16/9 Thumbnail Skeleton */}
    <Box 
      className="skeleton-pulse"
      sx={{ 
        width: '100%', 
        aspectRatio: '16/9', 
        borderRadius: '12px',
        backgroundColor: '#27272a'
      }} 
    />
    
    {/* Metadata Row Skeleton */}
    <Stack direction="row" gap="12px" mt="12px" alignItems="start">
      {/* Channel Profile Avatar Skeleton */}
      <Box 
        className="skeleton-pulse"
        sx={{ 
          width: 36, 
          height: 36, 
          borderRadius: '50%',
          backgroundColor: '#27272a',
          flexShrink: 0
        }} 
      />
      
      {/* Title & Channel Detail Skeletons */}
      <Box sx={{ flex: 1 }}>
        {/* Title Line 1 */}
        <Box 
          className="skeleton-pulse"
          sx={{ 
            height: '14px', 
            borderRadius: '4px',
            backgroundColor: '#27272a',
            mb: '8px',
            width: '90%'
          }} 
        />
        {/* Title Line 2 */}
        <Box 
          className="skeleton-pulse"
          sx={{ 
            height: '14px', 
            borderRadius: '4px',
            backgroundColor: '#27272a',
            mb: '12px',
            width: '60%'
          }} 
        />
        {/* Channel Name */}
        <Box 
          className="skeleton-pulse"
          sx={{ 
            height: '11px', 
            borderRadius: '4px',
            backgroundColor: '#27272a',
            mb: '6px',
            width: '45%'
          }} 
        />
        {/* Views & Date */}
        <Box 
          className="skeleton-pulse"
          sx={{ 
            height: '10px', 
            borderRadius: '4px',
            backgroundColor: '#27272a',
            width: '30%'
          }} 
        />
      </Box>
    </Stack>
  </Box>
);

export default SkeletonVideoCard;
