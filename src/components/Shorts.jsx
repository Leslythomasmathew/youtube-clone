import React, { useState, useEffect, useRef } from 'react';
import { Box, Stack, Typography, Avatar, Button, IconButton, Drawer, TextField, Divider } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import CloseIcon from '@mui/icons-material/Close';

import { Sidebar } from './index.js';
import { playlistStore } from '../utils/playlistStore.js';
import { demoProfilePicture } from '../utils/constants.jsx';
import { getMockChannelDetail } from '../utils/mockData.js';

const MOCK_SHORTS = [
  {
    id: 'short1',
    title: 'Vite React starter build compilation is blindingly fast! ⚡',
    channelId: 'UCmXmlB4-HJytD7wek0Uo97A',
    channelTitle: 'JavaScript Mastery',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    likes: '14K',
    commentsCount: '1.4K',
    channelAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'
  },
  {
    id: 'short2',
    title: 'Subaru Outback ripping through dirty sand dunes! 🏎️',
    channelId: 'UCW5YeuERMmlnqo4on8EsLxA',
    channelTitle: 'Traversy Media',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    likes: '25K',
    commentsCount: '2.9K',
    channelAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80'
  },
  {
    id: 'short3',
    title: 'Surreal CGI art from Elephant\'s Dream project 🐘',
    channelId: 'UC4UXCTnH_H6aTjT-p2PrB2A',
    channelTitle: 'Academind',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    likes: '11K',
    commentsCount: '1.1K',
    channelAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'
  },
  {
    id: 'short4',
    title: 'Calisthenics workout routine that is gravity-defying! 🤸‍♂️',
    channelId: 'UC7_Yx5lJ_RQDgW_M2A2d_ww',
    channelTitle: 'MKIceAndFire',
    videoUrl: 'https://raw.githubusercontent.com/intel-iot-devkit/sample-videos/master/classroom.mp4',
    likes: '95K',
    commentsCount: '8.4K',
    channelAvatar: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=100&q=80'
  },
  {
    id: 'short5',
    title: 'React 19 "use" hook is a game-changer for database fetching! 🚀',
    channelId: 'UC8butISFwT-Wl7EV0hUK0BQ',
    channelTitle: 'freeCodeCamp.org',
    videoUrl: 'https://raw.githubusercontent.com/intel-iot-devkit/sample-videos/master/bolt-detection.mp4',
    likes: '4.2K',
    commentsCount: '312',
    channelAvatar: 'https://yt3.ggpht.com/ytc/AIdro5k2_gK7L-kO1y_p-zUjG6981oE75c404r5Lg00x=s800-c-k-c0xffffffff-no-rj-mo'
  },
  {
    id: 'short6',
    title: 'The CGI details in this movie scene are completely out of this world! 🤯',
    channelId: 'UCyN9yP1M5e5Q',
    channelTitle: 'Vogue Runway',
    videoUrl: 'https://raw.githubusercontent.com/intel-iot-devkit/sample-videos/master/one-by-one-person-detection.mp4',
    likes: '512K',
    commentsCount: '41K',
    channelAvatar: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=100&q=80'
  },
  {
    id: 'short7',
    title: 'Daft Punk playing synthesizers in Paris - pure nostalgia! 🎹',
    channelId: 'UC8R5H2u6cR6jEGF2T2R7UvQ',
    channelTitle: 'Lofi Girl',
    videoUrl: 'https://raw.githubusercontent.com/intel-iot-devkit/sample-videos/master/car-detection.mp4',
    likes: '124K',
    commentsCount: '9.2K',
    channelAvatar: 'https://yt3.ggpht.com/gXT5dtm7G62L5QeU8Q-zYd-1t0k1_n4q7B-473k7=s800-c-k-c0xffffffff-no-rj-mo'
  },
  {
    id: 'short8',
    title: 'Giant basketball shot off the top of a massive stadium! 🏀',
    channelId: 'UCWJ2l187cJgYg9w9xK1w32A',
    channelTitle: 'Sports Highlights',
    videoUrl: 'https://raw.githubusercontent.com/intel-iot-devkit/sample-videos/master/store-aisle-detection.mp4',
    likes: '340K',
    commentsCount: '28K',
    channelAvatar: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=100&q=80'
  }
];

// Single Short Player card item
const ShortCard = ({ short, activeId, isMuted, setIsMuted, onOpenComments }) => {
  const isPlaying = activeId === short.id;
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const videoRef = useRef(null);

  useEffect(() => {
    setSubscribed(playlistStore.isSubscribedChannel(short.channelId));
  }, [short.channelId]);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(err => {
          console.warn("Shorts play interrupted:", err);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handleLike = () => {
    setLiked(!liked);
    if (!liked) setDisliked(false);
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (!disliked) setLiked(false);
  };

  const handleSubscribe = () => {
    const channelDetail = getMockChannelDetail(short.channelId) || {
      id: { channelId: short.channelId },
      snippet: { title: short.channelTitle, thumbnails: { high: { url: short.channelAvatar } } },
      statistics: { subscriberCount: '100000' }
    };
    const nextState = playlistStore.toggleSubscribeChannel(channelDetail);
    setSubscribed(nextState);
  };

  const getLikesDisplay = () => {
    let count = parseFloat(short.likes);
    if (liked) count += 0.1; // simulate bump
    return `${count.toFixed(1)}K`;
  };

  return (
    <Box 
      sx={{ 
        height: '84vh', 
        width: { xs: '100%', sm: '380px' }, 
        position: 'relative', 
        borderRadius: '16px', 
        overflow: 'hidden',
        backgroundColor: '#000',
        scrollSnapAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 12px 36px rgba(0,0,0,0.6)'
      }}
    >
      <video
        ref={videoRef}
        src={short.videoUrl}
        loop
        muted={isMuted}
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover',
          cursor: 'pointer'
        }}
        onClick={() => setIsMuted(!isMuted)}
      />

      {/* Floating Sound Toggle */}
      <IconButton 
        onClick={() => setIsMuted(!isMuted)}
        sx={{ 
          position: 'absolute', 
          top: '20px', 
          right: '20px', 
          color: '#fff', 
          backgroundColor: 'rgba(0,0,0,0.5)',
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
        }}
      >
        {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
      </IconButton>

      {/* Text overlay info at bottom */}
      <Box 
        sx={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          width: '100%', 
          p: 3, 
          background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)',
          color: '#fff',
          zIndex: 3
        }}
      >
        <Stack direction="row" sx={{ alignItems: 'center' }} gap={1.5} mb={2}>
          <Avatar src={short.channelAvatar} sx={{ width: 36, height: 36, border: '1px solid #fff' }} />
          <Typography variant="subtitle2" fontWeight="bold">
            {short.channelTitle}
          </Typography>
          <Button 
            onClick={handleSubscribe} 
            sx={{ 
              backgroundColor: subscribed ? 'rgba(255,255,255,0.2)' : '#ff0055',
              color: '#fff',
              borderRadius: '20px',
              px: 2,
              py: 0.4,
              fontSize: '11px',
              textTransform: 'none',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: subscribed ? 'rgba(255,255,255,0.3)' : '#ff3377',
              }
            }}
          >
            {subscribed ? 'Subscribed' : 'Subscribe'}
          </Button>
        </Stack>
        <Typography variant="body2" sx={{ fontSize: '13.5px', lineHeight: '1.5', opacity: 0.95 }}>
          {short.title}
        </Typography>
      </Box>

      {/* Right side floating action bar */}
      <Stack 
        spacing={2.5}
        sx={{ 
          position: 'absolute', 
          right: '-60px', 
          bottom: '80px',
          alignItems: 'center',
          color: '#fff',
          zIndex: 10,
          transform: { xs: 'translateX(-80px)', sm: 'translateX(-70px)' }
        }}
      >
        {/* Like */}
        <Stack alignItems="center">
          <IconButton onClick={handleLike} sx={{ backgroundColor: liked ? 'rgba(255, 0, 85, 0.2)' : 'rgba(0,0,0,0.5)', color: liked ? '#ff0055' : '#fff', p: 1.5, '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' } }}>
            {liked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
          </IconButton>
          <Typography variant="caption" sx={{ mt: 0.5, fontSize: '12px', fontWeight: 'bold' }}>{getLikesDisplay()}</Typography>
        </Stack>

        {/* Dislike */}
        <Stack alignItems="center">
          <IconButton onClick={handleDislike} sx={{ backgroundColor: disliked ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.5)', color: disliked ? '#ff0055' : '#fff', p: 1.5, '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' } }}>
            {disliked ? <ThumbDownIcon /> : <ThumbDownOutlinedIcon />}
          </IconButton>
          <Typography variant="caption" sx={{ mt: 0.5, fontSize: '12px', fontWeight: 'bold' }}>Dislike</Typography>
        </Stack>

        {/* Comments */}
        <Stack alignItems="center">
          <IconButton onClick={() => onOpenComments(short.id)} sx={{ backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff', p: 1.5, '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' } }}>
            <CommentIcon />
          </IconButton>
          <Typography variant="caption" sx={{ mt: 0.5, fontSize: '12px', fontWeight: 'bold' }}>{short.commentsCount}</Typography>
        </Stack>

        {/* Share */}
        <Stack alignItems="center">
          <IconButton sx={{ backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff', p: 1.5, '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' } }}>
            <ShareIcon />
          </IconButton>
          <Typography variant="caption" sx={{ mt: 0.5, fontSize: '12px', fontWeight: 'bold' }}>Share</Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

const Shorts = () => {
  const [activeMenu, setActiveMenu] = useState('Shorts');
  const [activeId, setActiveId] = useState(MOCK_SHORTS[0].id);
  const [isMuted, setIsMuted] = useState(true);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentsShortId, setCommentsShortId] = useState(null);
  
  // Custom comments list for selected short
  const [customComments, setCustomComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const containerRef = useRef(null);

  // Monitor vertical scroll snap elements to trigger auto-play for active short
  const handleScroll = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const cardHeight = container.clientHeight;
    
    // Determine which index is currently snapped
    const index = Math.round(scrollTop / cardHeight);
    if (index >= 0 && index < MOCK_SHORTS.length) {
      if (activeId !== MOCK_SHORTS[index].id) {
        setActiveId(MOCK_SHORTS[index].id);
      }
    }
  };

  const handleOpenComments = (shortId) => {
    setCommentsShortId(shortId);
    setCustomComments(playlistStore.getVideoComments(shortId));
    setCommentsOpen(true);
  };

  const handleAddComment = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      const trimmed = newComment.trim();
      if (!trimmed) return;

      const commentObj = {
        author: 'User Account',
        handle: '@user_account',
        avatar: demoProfilePicture,
        content: trimmed,
        likes: 0,
        time: 'Just now'
      };

      playlistStore.addVideoComment(commentsShortId, commentObj);
      setCustomComments(prev => [commentObj, ...prev]);
      setNewComment('');
    }
  };

  return (
    <Stack sx={{ flexDirection: { xs: 'column', md: 'row' }, backgroundColor: '#09090b', minHeight: '92vh' }}>
      {/* Sidebar on left */}
      <Box sx={{ 
        height: { xs: 'auto', md: '92vh' }, 
        position: 'sticky',
        top: '56px',
        zIndex: 5
      }}>
        <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      </Box>

      {/* Main vertical scrolling area */}
      <Box 
        ref={containerRef}
        onScroll={handleScroll}
        sx={{ 
          flex: 2, 
          height: '92vh', 
          overflowY: 'scroll', 
          scrollSnapType: 'y mandatory',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8vh',
          py: '4vh',
          '&::-webkit-scrollbar': { display: 'none' }, // hide scrollbar
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        {MOCK_SHORTS.map((short) => (
          <ShortCard 
            key={short.id} 
            short={short} 
            activeId={activeId} 
            isMuted={isMuted} 
            setIsMuted={setIsMuted} 
            onOpenComments={handleOpenComments}
          />
        ))}
      </Box>

      {/* Comments Slide-out Drawer */}
      <Drawer
        anchor="right"
        open={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: '380px' },
            backgroundColor: '#121212',
            borderLeft: '1px solid #27272a',
            color: '#fff',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }
        }}
      >
        <Stack direction="row" justifyContent="space-between" sx={{ alignItems: 'center' }} mb={2}>
          <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: "'Outfit', sans-serif" }}>
            Comments
          </Typography>
          <IconButton onClick={() => setCommentsOpen(false)} sx={{ color: '#fff' }}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Divider sx={{ borderColor: '#27272a', mb: 3 }} />

        {/* Input box */}
        <Stack direction="row" gap={1.5} mb={3} sx={{ alignItems: 'center' }}>
          <Avatar src={demoProfilePicture} sx={{ width: 36, height: 36 }} />
          <TextField
            variant="standard"
            placeholder="Add a comment..."
            fullWidth
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleAddComment}
            slotProps={{
              input: {
                disableUnderline: false,
                style: { color: '#fff', fontSize: '13.5px' }
              }
            }}
            sx={{
              '& .MuiInput-underline:before': { borderBottomColor: '#27272a' },
              '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: '#71717a' },
              '& .MuiInput-underline:after': { borderBottomColor: '#ff0055' }
            }}
          />
          <Button 
            onClick={handleAddComment} 
            disabled={!newComment.trim()}
            sx={{ 
              color: newComment.trim() ? '#ff0055' : '#71717a',
              textTransform: 'none', 
              fontWeight: 'bold',
              minWidth: 'auto'
            }}
          >
            Post
          </Button>
        </Stack>

        {/* Comments scrolling block */}
        <Box sx={{ flex: 1, overflowY: 'auto', pr: 1 }}>
          {customComments.length === 0 ? (
            <Box sx={{ textAlign: 'center', color: '#71717a', py: 5 }}>
              <Typography variant="body2">No comments yet. Be the first to comment!</Typography>
            </Box>
          ) : (
            <Stack gap={2.5}>
              {customComments.map((cmt, idx) => (
                <Stack key={idx} direction="row" gap={1.5} sx={{ alignItems: 'flex-start' }}>
                  <Avatar src={cmt.avatar} sx={{ width: 32, height: 32 }} />
                  <Box>
                    <Stack direction="row" gap={1} sx={{ alignItems: 'center' }}>
                      <Typography variant="caption" fontWeight="bold" color="#fff">
                        {cmt.author}
                      </Typography>
                      <Typography variant="caption" color="#71717a" sx={{ fontSize: '10px' }}>
                        {cmt.time}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ fontSize: '13px', mt: 0.3, color: '#e4e4e7' }}>
                      {cmt.content}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          )}
        </Box>
      </Drawer>
    </Stack>
  );
};

export default Shorts;
