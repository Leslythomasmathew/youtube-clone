import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container, Stack, Avatar, Typography, Button, Tabs, Tab, Snackbar, Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { Videos, Loader } from './index.js';
import { fetchFromAPI } from '../utils/fetchFromAPI.js';
import { getMockChannelDetail } from '../utils/mockData.js';
import { playlistStore } from '../utils/playlistStore.js';

const ChannelDetail = () => {
  const [videos, setVideos] = useState([]);
  const [activeTab, setActiveTab] = useState(1); // Default to Videos tab
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const { id } = useParams();

  const channelDetail = getMockChannelDetail(id);

  useEffect(() => {
    if (id) {
      setIsSubscribed(playlistStore.isSubscribedChannel(id));
    }
    
    setVideos([]);
    fetchFromAPI(`search?part=snippet&channelId=${id}&order=date`)
      .then((data) => {
        if (data && data.items) {
          setVideos(data.items);
        }
      });
  }, [id]);

  if (!channelDetail?.snippet) return <Loader />;

  const { 
    snippet: { title, description, thumbnails }, 
    statistics: { subscriberCount, videoCount },
    brandingSettings: { image } 
  } = channelDetail;

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSubscribe = () => {
    const nextState = playlistStore.toggleSubscribeChannel(channelDetail);
    setIsSubscribed(nextState);
    setToastOpen(true);
  };

  const getSubscribersCount = () => {
    let count = parseInt(subscriberCount || '120000');
    // If subscribed, simulate adding ourselves to subscriber count
    if (isSubscribed && !playlistStore.isSubscribedChannel(id)) {
      count += 1;
    } else if (isSubscribed) {
      // If subscribed on mount, count is already correct, but let's be safe
    }
    return count.toLocaleString();
  };

  return (
    <Box sx={{ minHeight: '92vh', backgroundColor: '#09090b', color: '#fff' }}>
      {/* Banner */}
      <Box sx={{ width: '100%', height: { xs: '140px', sm: '200px', md: '260px' }, overflow: 'hidden', position: 'relative' }}>
        <img 
          src={image?.bannerExternalUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'} 
          alt="banner" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(9,9,11,1) 100%)' }} />
      </Box>

      {/* Profile Details Block */}
      <Container maxWidth="lg" sx={{ pt: 2, pb: 2 }}>
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          gap={{ xs: 3, md: 4 }} 
          sx={{ alignItems: 'center', textAlign: { xs: 'center', sm: 'left' } }}
        >
          <Avatar 
            src={thumbnails?.high?.url} 
            alt={title}
            sx={{ 
              width: { xs: 110, sm: 130, md: 150 }, 
              height: { xs: 110, sm: 130, md: 150 }, 
              border: '3px solid #27272a',
              boxShadow: '0 8px 24px rgba(0,0,0,0.6)'
            }}
          />
          <Box flex={1}>
            <Typography 
              variant="h4" 
              fontWeight="bold" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: { xs: 'center', sm: 'start' }, 
                fontSize: { xs: '24px', md: '36px' }, 
                mb: 1,
                fontFamily: "'Outfit', sans-serif"
              }}
            >
              {title}
              <CheckCircleIcon sx={{ fontSize: '20px', color: '#a1a1aa', ml: '8px' }} />
            </Typography>
            
            <Typography variant="body2" color="#71717a" sx={{ fontSize: '14.5px', mb: 1, fontWeight: '500' }}>
              @{title.toLowerCase().replace(/\s+/g, '')} • {getSubscribersCount()} subscribers • {videoCount} videos
            </Typography>
            
            <Typography 
              variant="body2" 
              color="#a1a1aa" 
              sx={{ 
                fontSize: '13px', 
                maxWidth: '650px', 
                mb: 2.5, 
                display: '-webkit-box', 
                WebkitLineClamp: 2, 
                WebkitBoxOrient: 'vertical', 
                overflow: 'hidden',
                lineHeight: 1.5
              }}
            >
              {description}
            </Typography>
            
            <Button
              onClick={handleSubscribe}
              sx={{
                backgroundColor: isSubscribed ? '#27272a' : '#fff',
                color: isSubscribed ? '#fff' : '#09090b',
                borderRadius: '20px',
                px: 4,
                py: 1,
                fontWeight: 'bold',
                textTransform: 'none',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: isSubscribed ? '#3f3f46' : '#e4e4e7',
                  transform: 'scale(1.03)'
                }
              }}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </Button>
          </Box>
        </Stack>

        {/* Tab row */}
        <Box sx={{ borderBottom: 1, borderColor: '#27272a', mt: 4 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            textColor="inherit"
            indicatorColor="primary"
            sx={{
              '& .MuiTabs-indicator': { backgroundColor: '#ff0055' }, // Custom neon red tab indicator
              '& .MuiTab-root': { 
                textTransform: 'none', 
                fontWeight: '600', 
                minWidth: '80px', 
                fontSize: '15px',
                color: '#71717a',
                '&.Mui-selected': { color: '#fff' }
              }
            }}
          >
            <Tab label="Home" disabled />
            <Tab label="Videos" />
            <Tab label="Playlists" disabled />
            <Tab label="About" />
          </Tabs>
        </Box>

        {/* Video grid container */}
        <Box sx={{ pt: 4 }}>
          {activeTab === 3 ? (
            <Box sx={{ p: 2, color: '#a1a1aa' }}>
              <Typography variant="h6" color="#fff" mb={2} sx={{ fontFamily: "'Outfit', sans-serif" }}>About {title}</Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7, fontSize: '14.5px' }}>{description}</Typography>
            </Box>
          ) : (
            <Videos videos={videos} />
          )}
        </Box>
      </Container>

      {/* Subscription Toast notification */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={() => setToastOpen(false)} 
          severity="success" 
          variant="filled"
          sx={{ 
            backgroundColor: '#18181b', 
            color: '#fff', 
            border: '1px solid #27272a',
            fontSize: '13.5px',
            '& .MuiAlert-icon': { color: '#ff0055' }
          }}
        >
          {isSubscribed ? `Subscribed to ${title}` : `Unsubscribed from ${title}`}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ChannelDetail;
