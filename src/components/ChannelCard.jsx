import React from 'react';
import { Box, CardContent, CardMedia, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Link } from 'react-router-dom';
import { demoProfilePicture } from '../utils/constants.jsx';

const ChannelCard = ({ channelDetail, marginTop }) => (
  <Box
    sx={{
      boxShadow: 'none',
      borderRadius: '20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: { xs: '100%', sm: '280px', md: '300px' },
      height: '290px',
      margin: 'auto',
      marginTop,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'scale(1.02)'
      }
    }}
  >
    <Link to={`/channel/${channelDetail?.id?.channelId || channelDetail?.id}`}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', color: '#fff' }}>
        <CardMedia
          component="img"
          image={channelDetail?.snippet?.thumbnails?.high?.url || demoProfilePicture}
          alt={channelDetail?.snippet?.title}
          sx={{ 
            borderRadius: '50%', 
            height: '150px', 
            width: '150px', 
            mb: 2, 
            mx: 'auto',
            border: '2px solid #2d2d2d',
            objectFit: 'cover'
          }}
        />
        <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          {channelDetail?.snippet?.title}
          <CheckCircleIcon sx={{ fontSize: '14px', color: '#aaaaaa' }} />
        </Typography>
        {channelDetail?.statistics?.subscriberCount && (
          <Typography sx={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255, 255, 255, 0.6)', mt: '4px' }}>
            {parseInt(channelDetail?.statistics?.subscriberCount).toLocaleString('en-US')} Subscribers
          </Typography>
        )}
      </CardContent>
    </Link>
  </Box>
);

export default ChannelCard;
