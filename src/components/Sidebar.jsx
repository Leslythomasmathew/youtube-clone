import React from 'react';
import { Stack, Button, Divider } from '@mui/material';
import { sidebarMenu } from '../utils/constants.jsx';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ activeMenu, setActiveMenu }) => {
  const navigate = useNavigate();

  return (
    <Stack
      direction="row"
      sx={{
        overflowX: 'auto',
        overflowY: 'hidden',
        height: { xs: 'auto', md: '92vh' },
        flexDirection: { md: 'column' },
        py: { xs: 1, md: 1.5 },
        '&::-webkit-scrollbar': { display: 'none' },
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
        width: { xs: '100%', md: '240px' },
        backgroundColor: '#0f0f0f',
        flexShrink: 0
      }}
    >
      {sidebarMenu.map((item, index) => {
        if (item.divider) {
          return (
            <Divider 
              key={index} 
              sx={{ 
                my: 1, 
                borderColor: '#303030', 
                display: { xs: 'none', md: 'block' },
                mx: 2
              }} 
            />
          );
        }
        
        const isSelected = item.name === activeMenu;
        return (
          <Button
            key={item.name}
            onClick={() => {
              if (item.name === 'Shorts') {
                navigate('/shorts');
              } else {
                setActiveMenu(item.name);
                navigate('/');
              }
            }}
            sx={{
              justifyContent: { xs: 'center', md: 'flex-start' },
              textTransform: 'none',
              px: 3,
              py: 1.2,
              my: 0.2,
              mx: { xs: 0.5, md: 1.5 },
              borderRadius: '0 10px 10px 0',
              color: isSelected ? '#ff0055' : '#fff',
              background: isSelected 
                ? 'linear-gradient(90deg, rgba(255, 0, 85, 0.1) 0%, rgba(255, 85, 0, 0.02) 100%)' 
                : 'transparent',
              borderLeft: isSelected ? '3px solid #ff0055' : '3px solid transparent',
              minWidth: { xs: 'auto', md: '210px' },
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: isSelected 
                  ? 'linear-gradient(90deg, rgba(255, 0, 85, 0.15) 0%, rgba(255, 85, 0, 0.05) 100%)' 
                  : 'rgba(255, 255, 255, 0.08)',
              }
            }}
          >
            <span style={{ 
              color: isSelected ? '#ff0055' : '#fff', 
              marginRight: '24px',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.2s'
            }}>
              {item.icon}
            </span>
            <span style={{ 
              fontWeight: isSelected ? '600' : '400',
              fontSize: '14px',
              letterSpacing: '0.1px',
              color: isSelected ? '#fff' : '#e4e4e7',
              transition: 'color 0.2s'
            }}>
              {item.name}
            </span>
          </Button>
        );
      })}
    </Stack>
  );
};

export default Sidebar;
