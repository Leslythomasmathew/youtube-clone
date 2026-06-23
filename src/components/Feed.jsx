import React, { useState, useEffect } from 'react';
import { Box, Stack, Button, Typography } from '@mui/material';
import { fetchFromAPI } from '../utils/fetchFromAPI.js';
import { Sidebar, Videos } from './index.js';
import { categories } from '../utils/constants.jsx';
import { playlistStore } from '../utils/playlistStore.js';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const Feed = () => {
  const [activeMenu, setActiveMenu] = useState('Home');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [videos, setVideos] = useState([]);
  const [isLoadingLocal, setIsLoadingLocal] = useState(false);

  useEffect(() => {
    // Clear feed to show loader
    setVideos([]);
    setIsLoadingLocal(false);

    // If activeMenu represents a local playlist, pull directly from localStorage
    if (['Liked Videos', 'Watch Later', 'History', 'Subscriptions', 'Library'].includes(activeMenu)) {
      setIsLoadingLocal(true);
      // Short timeout to simulate layout loading feel
      const timer = setTimeout(() => {
        let items = [];
        if (activeMenu === 'Liked Videos') {
          items = playlistStore.getLikedVideos();
        } else if (activeMenu === 'Watch Later') {
          items = playlistStore.getWatchLaterVideos();
        } else if (activeMenu === 'History') {
          items = playlistStore.getHistoryVideos();
        } else if (activeMenu === 'Subscriptions') {
          items = playlistStore.getSubscribedChannels();
        } else if (activeMenu === 'Library') {
          // Library combines some Liked and Watch Later videos
          const liked = playlistStore.getLikedVideos().slice(0, 4);
          const watchLater = playlistStore.getWatchLaterVideos().slice(0, 4);
          items = [...liked, ...watchLater];
        }
        setVideos(items);
        setIsLoadingLocal(false);
      }, 300);
      return () => clearTimeout(timer);
    }

    // Determine the query term for live API
    let query = selectedCategory;
    if (activeMenu === 'Trending') {
      query = 'Trending';
    } else if (selectedCategory === 'All') {
      query = 'Coding';
    }

    fetchFromAPI(`search?part=snippet&q=${query}`)
      .then((data) => {
        if (data && data.items) {
          setVideos(data.items);
        }
      });
  }, [selectedCategory, activeMenu]);

  // If user changes menu item in sidebar, reset category chips to 'All'
  const handleActiveMenuChange = (menuName) => {
    setActiveMenu(menuName);
    setSelectedCategory('All');
  };

  const getPageHeader = () => {
    if (activeMenu === 'Home' && selectedCategory === 'All') return null;
    if (activeMenu === 'Home') return `${selectedCategory} Videos`;
    return activeMenu;
  };

  const pageHeader = getPageHeader();
  const isEmpty = videos.length === 0 && !isLoadingLocal;

  return (
    <Stack sx={{ flexDirection: { xs: 'column', md: 'row' }, backgroundColor: '#09090b', minHeight: '92vh' }}>
      {/* Sidebar on left */}
      <Box sx={{ 
        height: { xs: 'auto', md: '92vh' }, 
        position: 'sticky',
        top: '56px',
        zIndex: 5
      }}>
        <Sidebar activeMenu={activeMenu} setActiveMenu={handleActiveMenuChange} />
      </Box>

      {/* Main Feed Content area */}
      <Box p={3} sx={{ overflowY: 'auto', height: '92vh', flex: 2, pt: 1.5 }}>
        
        {/* Horizontal scrollable category chips - only show on Home screen */}
        {activeMenu === 'Home' && (
          <Stack 
            direction="row" 
            spacing={1.5} 
            sx={{ 
              overflowX: 'auto', 
              pb: 2, 
              mb: 3,
              '&::-webkit-scrollbar': { display: 'none' }, 
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            {categories.map((category) => {
              const isSelected = category.name === selectedCategory;
              return (
                <Button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  sx={{
                    textTransform: 'none',
                    px: 2.2,
                    py: 0.6,
                    borderRadius: '8px',
                    fontSize: '13.5px',
                    fontWeight: isSelected ? '600' : '400',
                    color: isSelected ? '#09090b' : '#f4f4f5',
                    backgroundColor: isSelected ? '#f4f4f5' : '#27272a',
                    flexShrink: 0,
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      backgroundColor: isSelected ? '#e4e4e7' : '#3f3f46',
                    }
                  }}
                >
                  {category.name}
                </Button>
              );
            })}
          </Stack>
        )}

        {/* Dynamic Section Header */}
        {pageHeader && (
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            mb={3.5} 
            sx={{ 
              color: '#fff', 
              fontFamily: "'Outfit', sans-serif",
              fontSize: { xs: '22px', md: '28px' },
              borderBottom: '1px solid #27272a',
              pb: 1.5
            }}
          >
            {pageHeader}
          </Typography>
        )}

        {/* Dynamic Empty States */}
        {isEmpty ? (
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              minHeight: '50vh',
              textAlign: 'center',
              color: '#71717a',
              p: 3
            }}
          >
            <PlayArrowIcon sx={{ fontSize: '64px', mb: 2, color: '#3f3f46' }} />
            <Typography variant="h6" fontWeight="bold" color="#fff" mb={1} sx={{ fontSize: '18px', fontFamily: "'Outfit', sans-serif" }}>
              This list is empty
            </Typography>
            <Typography variant="body2" sx={{ maxWidth: '350px', lineHeight: 1.6 }}>
              {activeMenu === 'Liked Videos' && "Videos you like will be saved here."}
              {activeMenu === 'Watch Later' && "Videos you save to watch later will appear here."}
              {activeMenu === 'History' && "Videos you watch will be saved in your playback history."}
              {activeMenu === 'Subscriptions' && "Channels you subscribe to will show up here."}
              {activeMenu === 'Library' && "Your combined playlists and watch later content will appear here."}
            </Typography>
          </Box>
        ) : (
          <Videos videos={videos} />
        )}
      </Box>
    </Stack>
  );
};

export default Feed;
