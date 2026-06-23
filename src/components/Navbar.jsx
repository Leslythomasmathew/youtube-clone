import React, { useState, useEffect } from 'react';
import { Stack, Typography, IconButton, Avatar, Badge, Popover, Box, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { logo, demoProfilePicture } from '../utils/constants.jsx';
import SearchBar from './SearchBar.jsx';

const MOCK_NOTIFICATIONS = [
  { id: 1, text: '🔴 Lofi Girl is live: lo-fi beats to code/relax to', time: '5 mins ago' },
  { id: 2, text: 'freeCodeCamp.org uploaded: Learn Material UI v5 in 2026', time: '1 hour ago' },
  { id: 3, text: 'JavaScript Mastery uploaded: Next.js 15 Server Actions Deep Dive', time: '4 hours ago' },
  { id: 4, text: 'Dave Gray mentioned you in a comment', time: '2 days ago' }
];

const Navbar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [notiAnchor, setNotiAnchor] = useState(null);
  const [unreadCount, setUnreadCount] = useState(MOCK_NOTIFICATIONS.length);

  useEffect(() => {
    const handleLoading = (e) => {
      setIsLoading(!!e.detail);
    };

    window.addEventListener('api-loading', handleLoading);
    return () => window.removeEventListener('api-loading', handleLoading);
  }, []);

  const handleOpenNoti = (event) => {
    setNotiAnchor(event.currentTarget);
    setUnreadCount(0); // Mark all as read when opened
  };

  const handleCloseNoti = () => {
    setNotiAnchor(null);
  };

  const notiOpen = Boolean(notiAnchor);

  return (
    <>
      {/* Top Loading Progress Bar */}
      {isLoading && <div className="top-loading-bar" />}

      <Stack
        direction="row"
        alignItems="center"
        p={2}
        sx={{
          position: 'sticky',
          background: 'rgba(9, 9, 11, 0.8)', // Zinc 950 with transparency
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          top: 0,
          justifyContent: 'space-between',
          zIndex: 100,
          height: '56px',
          px: { xs: 2, md: 3 }
        }}
      >
        {/* Left Side branding */}
        <Stack direction="row" sx={{ alignItems: 'center' }} gap="16px">
          <IconButton sx={{ color: '#fff', display: { xs: 'none', md: 'inline-flex' }, p: '8px' }}>
            <MenuIcon />
          </IconButton>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={logo} alt="logo" height={22} style={{ transition: 'transform 0.3s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'} />
            <Typography 
              variant="h5" 
              fontWeight="800" 
              sx={{ 
                color: '#fff', 
                fontFamily: "'Outfit', sans-serif",
                letterSpacing: '-0.8px', 
                display: { xs: 'none', sm: 'block' },
                fontSize: '19px',
                position: 'relative',
                background: 'linear-gradient(90deg, #ffffff 0%, #a1a1aa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              YouTube
              <span style={{ 
                color: '#ff0055', 
                fontSize: '8px', 
                position: 'absolute',
                top: '-4px',
                right: '-16px',
                fontWeight: 'bold',
                letterSpacing: '0',
                WebkitTextFillColor: '#ff0055'
              }}>
                IN
              </span>
            </Typography>
          </Link>
        </Stack>

        {/* Center search */}
        <SearchBar />

        {/* Right Side actions */}
        <Stack direction="row" sx={{ alignItems: 'center' }} gap="12px">
          <IconButton sx={{ color: '#fff', display: { xs: 'none', sm: 'inline-flex' } }}>
            <VideoCallIcon sx={{ fontSize: '24px' }} />
          </IconButton>
          
          <IconButton onClick={handleOpenNoti} sx={{ color: '#fff' }}>
            <Badge badgeContent={unreadCount} color="error" sx={{ '& .MuiBadge-badge': { background: 'linear-gradient(90deg, #ff0055, #ff5500)' } }}>
              <NotificationsIcon sx={{ fontSize: '24px' }} />
            </Badge>
          </IconButton>

          <Avatar 
            src={demoProfilePicture} 
            sx={{ 
              width: 32, 
              height: 32, 
              cursor: 'pointer',
              border: '1.5px solid #27272a',
              transition: 'border-color 0.2s',
              '&:hover': {
                borderColor: '#ff0055'
              }
            }} 
          />
        </Stack>
      </Stack>

      {/* Notifications Popover */}
      <Popover
        open={notiOpen}
        anchorEl={notiAnchor}
        onClose={handleCloseNoti}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: '320px',
            backgroundColor: 'rgba(18, 18, 18, 0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid #27272a',
            borderRadius: '12px',
            mt: '8px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
          }
        }}
      >
        <Box sx={{ p: 2, pb: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#fff', fontFamily: "'Outfit', sans-serif" }}>
            Notifications
          </Typography>
        </Box>
        <Divider sx={{ borderColor: '#27272a' }} />
        <List disablePadding>
          {MOCK_NOTIFICATIONS.map((item) => (
            <React.Fragment key={item.id}>
              <ListItem 
                alignItems="flex-start" 
                sx={{ 
                  py: 1.5, 
                  px: 2, 
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.04)' },
                  cursor: 'pointer'
                }}
              >
                <ListItemText
                  primary={item.text}
                  secondary={item.time}
                  primaryTypographyProps={{ fontSize: '13px', color: '#f4f4f5', lineHeight: 1.4 }}
                  secondaryTypographyProps={{ fontSize: '11px', color: '#71717a', mt: 0.5 }}
                />
              </ListItem>
              <Divider sx={{ borderColor: '#27272a' }} />
            </React.Fragment>
          ))}
        </List>
      </Popover>
    </>
  );
};

export default Navbar;
