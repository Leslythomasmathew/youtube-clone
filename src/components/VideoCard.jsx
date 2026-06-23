import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Box, Stack, Avatar } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import { demoThumbnailUrl, demoVideoUrl, demoVideoTitle, demoChannelUrl, demoChannelTitle, demoProfilePicture } from '../utils/constants.jsx';
import { mockChannels } from '../utils/mockData.js';

const VideoCard = ({ video: { id: { videoId }, snippet } }) => {
  // Retrieve channel profile details from local mockData if available
  const channelAvatar = mockChannels[snippet?.channelId]?.snippet?.thumbnails?.high?.url || demoProfilePicture;

  // Generate deterministic views/date to simulate live YouTube metadata
  const titleSeed = snippet?.title?.length || 15;
  const simulatedViews = ((titleSeed * 7) % 850) + 12;
  const simulatedDaysAgo = (titleSeed % 28) + 1;
  const simulatedDuration = `${(titleSeed % 15) + 3}:${((titleSeed * 13) % 45) + 10}`;

  return (
    <Box 
      sx={{ 
        width: { xs: '100%', sm: '280px', md: '300px' },
        boxShadow: 'none', 
        backgroundColor: 'transparent',
        cursor: 'pointer',
        mb: 3,
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          '& .video-thumbnail-box': {
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.6), 0 0 15px rgba(255, 0, 85, 0.1)',
          },
          '& .play-overlay': {
            opacity: 1
          }
        }
      }}
    >
      {/* Thumbnail with overlay duration */}
      <Link to={videoId ? `/video/${videoId}` : demoVideoUrl}>
        <Box 
          className="video-thumbnail-box"
          sx={{ 
            width: '100%', 
            aspectRatio: '16/9', 
            borderRadius: '12px', 
            overflow: 'hidden', 
            position: 'relative',
            backgroundColor: '#181818',
            transition: 'box-shadow 0.3s ease'
          }}
        >
          <img
            src={snippet?.thumbnails?.high?.url || demoThumbnailUrl}
            alt={snippet?.title}
            style={{ 
              width: '100%', 
              height: '100%',
              objectFit: 'cover'
            }}
          />
          
          {/* Dynamic Play Overlay */}
          <Box 
            className="play-overlay"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.45)',
              opacity: 0,
              transition: 'opacity 0.25s ease-in-out',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2
            }}
          >
            <Box 
              sx={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 0, 85, 0.95)', // Neon Red Accent Play
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(255, 0, 85, 0.6)'
              }}
            >
              <PlayArrowIcon sx={{ color: '#fff', fontSize: '26px', ml: '3px' }} />
            </Box>
          </Box>

          <Box sx={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            px: '6px',
            py: '2px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: '600',
            zIndex: 3
          }}>
            {simulatedDuration}
          </Box>
        </Box>
      </Link>
      
      {/* Metadata Row: Avatar + Title & Channel Details */}
      <Stack direction="row" gap="12px" mt="12px" alignItems="start">
        <Link to={snippet?.channelId ? `/channel/${snippet?.channelId}` : demoChannelUrl}>
          <Avatar 
            src={channelAvatar} 
            sx={{ 
              width: 36, 
              height: 36,
              border: '1px solid #27272a',
              '&:hover': { borderColor: '#ff0055' }
            }} 
          />
        </Link>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Link to={videoId ? `/video/${videoId}` : demoVideoUrl}>
            <Typography 
              variant="subtitle1" 
              fontWeight="500" 
              color="#FFF" 
              sx={{ 
                lineHeight: '1.4', 
                height: '40px',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                fontSize: '14.2px',
                mb: '4px',
                fontFamily: "'Roboto', sans-serif"
              }}
            >
              {snippet?.title || demoVideoTitle}
            </Typography>
          </Link>
          <Link to={snippet?.channelId ? `/channel/${snippet?.channelId}` : demoChannelUrl}>
            <Typography 
              variant="subtitle2" 
              color="#71717a" 
              display="flex" 
              alignItems="center" 
              sx={{ 
                fontSize: '12px', 
                mb: '2px',
                transition: 'color 0.2s',
                '&:hover': { color: '#ff0055' } 
              }}
            >
              {snippet?.channelTitle || demoChannelTitle}
              <CheckCircleIcon sx={{ fontSize: '13px', color: '#71717a', ml: '5px' }} />
            </Typography>
          </Link>
          <Typography variant="caption" color="#71717a" sx={{ fontSize: '11.5px' }}>
            {simulatedViews}K views • {simulatedDaysAgo} days ago
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default VideoCard;
