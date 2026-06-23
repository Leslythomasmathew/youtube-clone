import React from 'react';
import { Stack, Box } from '@mui/material';
import { VideoCard, ChannelCard, Loader } from './index.js';

const Videos = ({ videos, direction }) => {
  if (!videos?.length) return <Loader />;
  
  return (
    <Stack 
      direction={direction || 'row'} 
      sx={{ 
        flexWrap: 'wrap',
        justifyContent: { xs: 'center', sm: 'start' },
        alignItems: 'start',
        gap: 2,
        width: '100%'
      }}
    >
      {videos.map((item, idx) => (
        <Box key={idx} sx={{ width: { xs: '100%', sm: 'auto' }, display: 'flex', justifyContent: 'center' }}>
          {item.id.videoId && <VideoCard video={item} /> }
          {item.id.channelId && <ChannelCard channelDetail={item} /> }
        </Box>
      ))}
    </Stack>
  );
};

export default Videos;
