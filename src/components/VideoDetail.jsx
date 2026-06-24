import React, { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Typography, Box, Stack, Avatar, Button, TextField, IconButton, Snackbar, Alert, Tooltip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ReplyIcon from '@mui/icons-material/Reply';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined';

import { Videos, Loader } from './index.js';
import { fetchFromAPI } from '../utils/fetchFromAPI.js';
import { getMockChannelDetail } from '../utils/mockData.js';
import { demoProfilePicture } from '../utils/constants.jsx';
import { playlistStore } from '../utils/playlistStore.js';

const mockStaticComments = [
  {
    author: 'Code Enthusiast',
    handle: '@code_enthusiast',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
    content: 'This tutorial is absolutely mind-blowing! The way everything is structured makes React so much easier to understand. Thank you!',
    likes: 245,
    time: '2 days ago'
  },
  {
    author: 'Sarah Smith',
    handle: '@sarah_s',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    content: 'Loved the Material UI integration. The customization options are endless. High quality production!',
    likes: 89,
    time: '1 week ago'
  },
  {
    author: 'Dev J',
    handle: '@dev_j',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80',
    content: 'Offline mock data fallback is such a smart architectural design choice. Very clean codebase!',
    likes: 12,
    time: '3 weeks ago'
  }
];

// Resolves source URLs for playing different video media types
const getVideoUrl = (id, queryUrl) => {
  if (id === 'custom' && queryUrl) {
    return decodeURIComponent(queryUrl);
  }
  return `https://www.youtube.com/watch?v=${id}`;
};

const VideoDetail = () => {
  const [videoDetail, setVideoDetail] = useState(null);
  const [videos, setVideos] = useState(null);
  const [playerSource, setPlayerSource] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Local interaction states
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isWatchLater, setIsWatchLater] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentsList, setCommentsList] = useState([]);
  
  // Toast notifications
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const queryUrl = searchParams.get('url');

  useEffect(() => {
    setIsLoading(true);
    setVideos(null);
    setPlayerSource(getVideoUrl(id, queryUrl));
    
    // Reset interaction states based on active video
    setIsLiked(playlistStore.isLikedVideo(id));
    setIsWatchLater(playlistStore.isWatchLaterVideo(id));
    setIsDisliked(false);

    // Load custom comments
    const savedComments = playlistStore.getVideoComments(id);
    setCommentsList([...savedComments, ...mockStaticComments]);

    if (id === 'custom' && queryUrl) {
      const decodedUrl = decodeURIComponent(queryUrl);
      const urlParts = decodedUrl.split('/');
      const fileName = urlParts[urlParts.length - 1] || 'External Stream Source';
      const cleanTitle = fileName.split('?')[0].replace(/[-_]/g, ' ');

      const customDetail = {
        id: 'custom',
        snippet: {
          title: cleanTitle.length > 5 ? cleanTitle : 'Custom Video Media Stream',
          channelId: 'custom_channel',
          channelTitle: 'Custom Stream Player',
          description: `Playing media URL: ${decodedUrl}\n\nThis player supports multiple source containers (MP4, HLS/m3u8, YouTube, Twitch, Vimeo, DailyMotion).`,
          publishedAt: new Date().toISOString()
        },
        statistics: {
          viewCount: '1240',
          likeCount: '84'
        }
      };

      setVideoDetail(customDetail);
      playlistStore.addToHistory(customDetail);
      setIsLoading(false);
      
      // Load related recommendations from mock New category
      fetchFromAPI(`search?part=snippet&q=New`)
        .then((data) => {
          if (data && data.items) {
            setVideos(data.items);
          }
        });

    } else {
      // Standard video details retrieval
      fetchFromAPI(`videos?part=snippet,statistics&id=${id}`)
        .then((data) => {
          if (data && data.items && data.items.length > 0) {
            const detail = data.items[0];
            setVideoDetail(detail);
            
            // Log video to playback history
            playlistStore.addToHistory(detail);
            
            // Check subscribe state
            setIsSubscribed(playlistStore.isSubscribedChannel(detail.snippet?.channelId));
          }
          setIsLoading(false);
        });

      fetchFromAPI(`search?part=snippet&relatedToVideoId=${id}&type=video`)
        .then((data) => {
          if (data && data.items) {
            setVideos(data.items);
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, queryUrl]);

  if (isLoading && !videoDetail) return <Loader />;
  if (!videoDetail?.snippet) return <Loader />;

  const { 
    snippet: { title, channelId, channelTitle, description, publishedAt }, 
    statistics: { viewCount, likeCount } 
  } = videoDetail;

  const channelInfo = getMockChannelDetail(channelId);
  const channelAvatar = channelInfo?.snippet?.thumbnails?.high?.url || demoProfilePicture;
  const subscriberCount = channelInfo?.statistics?.subscriberCount || '142000';

  const handlePlayerError = () => {
    console.warn('Media element load error, falling back to static W3Schools stream');
    if (playerSource !== 'https://www.w3schools.com/html/mov_bbb.mp4') {
      setPlayerSource('https://www.w3schools.com/html/mov_bbb.mp4');
    }
  };

  const handleLike = () => {
    const nextState = playlistStore.toggleLikeVideo(videoDetail);
    setIsLiked(nextState);
    if (nextState) {
      setIsDisliked(false);
      showToast('Added to Liked videos', 'success');
    } else {
      showToast('Removed from Liked videos', 'info');
    }
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    if (!isDisliked) {
      setIsLiked(false);
      // Remove from liked videos list if liked before
      if (playlistStore.isLikedVideo(id)) {
        playlistStore.toggleLikeVideo(videoDetail);
      }
    }
  };

  const handleWatchLater = () => {
    const nextState = playlistStore.toggleWatchLaterVideo(videoDetail);
    setIsWatchLater(nextState);
    if (nextState) {
      showToast('Added to Watch Later', 'success');
    } else {
      showToast('Removed from Watch Later', 'info');
    }
  };

  const handleSubscribe = () => {
    const mockChannelObject = channelInfo || {
      id: { channelId },
      snippet: { title: channelTitle, thumbnails: { high: { url: channelAvatar } } },
      statistics: { subscriberCount }
    };
    
    const nextState = playlistStore.toggleSubscribeChannel(mockChannelObject);
    setIsSubscribed(nextState);
    if (nextState) {
      showToast(`Subscribed to ${channelTitle}`, 'success');
    } else {
      showToast(`Unsubscribed from ${channelTitle}`, 'info');
    }
  };

  const handleAddComment = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      const trimmed = commentText.trim();
      if (!trimmed) return;

      const newComment = {
        author: 'User Account',
        handle: '@user_account',
        avatar: demoProfilePicture,
        content: trimmed,
        likes: 0,
        time: 'Just now'
      };

      // Add to store
      playlistStore.addVideoComment(id, newComment);
      
      // Update UI list
      setCommentsList(prev => [newComment, ...prev]);
      setCommentText('');
      showToast('Comment posted', 'success');
    }
  };

  const showToast = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const formattedDate = publishedAt 
    ? new Date(publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : 'Recently';

  // Calculate dynamic subscribers
  const getSubscribersText = () => {
    let count = parseInt(subscriberCount);
    if (isSubscribed) count += 1;
    return count.toLocaleString();
  };

  // Calculate dynamic likes
  const getLikesText = () => {
    let likes = parseInt(likeCount || '0');
    if (isLiked) likes += 1;
    return likes.toLocaleString();
  };

  // Determine if URL is a direct file stream
  const isDirectFile = playerSource && (
    playerSource.includes('.mp4') || 
    playerSource.includes('.m3u8') || 
    playerSource.includes('w3schools.com') || 
    playerSource.includes('googleapis.com') || 
    playerSource.includes('html5demos.com')
  );

  return (
    <Box sx={{ minHeight: '92vh', backgroundColor: '#09090b', p: { xs: 1.5, md: 3 } }}>
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3}>
        {/* Left column - Player and details */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ width: '100%', position: 'relative', paddingTop: '56.25%', borderRadius: '16px', overflow: 'hidden', backgroundColor: '#000', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
            {isDirectFile ? (
              <video 
                src={playerSource}
                className="react-player"
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '100%', 
                  height: '100%',
                  objectFit: 'contain',
                  backgroundColor: '#000'
                }}
                controls
                autoPlay
                muted
                onError={handlePlayerError}
              />
            ) : (
              <iframe
                src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
                title={title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  backgroundColor: '#000'
                }}
              />
            )}
          </Box>
          
          <Typography color="#fff" variant="h5" fontWeight="700" mt={2.5} mb={1.5} sx={{ fontSize: { xs: '18px', md: '22px' }, fontFamily: "'Outfit', sans-serif" }}>
            {title}
          </Typography>

          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            sx={{
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 2.5,
              pb: 2,
              borderBottom: '1px solid #27272a'
            }}
          >
            {/* Profile section */}
            <Stack direction="row" sx={{ alignItems: 'center' }} gap={2}>
              <Link to={`/channel/${channelId}`}>
                <Avatar src={channelAvatar} sx={{ width: 44, height: 44, border: '1.5px solid #27272a', '&:hover': { borderColor: '#ff0055' } }} />
              </Link>
              <Box>
                <Link to={`/channel/${channelId}`}>
                  <Typography variant="h6" color="#fff" display="flex" alignItems="center" sx={{ fontSize: '15.5px', fontWeight: 'bold' }}>
                    {channelTitle}
                    <CheckCircleIcon sx={{ fontSize: '14px', color: '#a1a1aa', ml: '4px' }} />
                  </Typography>
                </Link>
                <Typography variant="body2" sx={{ color: '#71717a', fontSize: '12px' }}>
                  {getSubscribersText()} subscribers
                </Typography>
              </Box>
              <Button
                onClick={handleSubscribe}
                sx={{
                  backgroundColor: isSubscribed ? '#27272a' : '#ff0055',
                  color: '#fff',
                  borderRadius: '20px',
                  px: 3,
                  py: 0.8,
                  fontSize: '13.5px',
                  fontWeight: '600',
                  textTransform: 'none',
                  ml: 2,
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: isSubscribed ? '#3f3f46' : '#ff3377',
                    transform: 'scale(1.03)'
                  }
                }}
              >
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </Button>
            </Stack>

            {/* Actions pills row */}
            <Stack direction="row" sx={{ gap: 1.5, flexWrap: 'wrap' }}>
              
              {/* Like / Dislike pill */}
              <Stack direction="row" sx={{ alignItems: 'center', backgroundColor: '#27272a', borderRadius: '20px', overflow: 'hidden' }}>
                <Tooltip title="Like this video">
                  <Button 
                    onClick={handleLike}
                    startIcon={isLiked ? <ThumbUpIcon sx={{ color: '#ff0055' }} /> : <ThumbUpOutlinedIcon />} 
                    sx={{ 
                      color: isLiked ? '#ff0055' : '#fff', 
                      px: 2.2, 
                      py: 1, 
                      fontSize: '13px',
                      textTransform: 'none', 
                      borderRight: '1px solid rgba(255,255,255,0.08)', 
                      borderRadius: 0,
                      fontWeight: '600',
                      '&:hover': { backgroundColor: '#3f3f46' }
                    }}
                  >
                    {getLikesText()}
                  </Button>
                </Tooltip>
                <Tooltip title="Dislike this video">
                  <Button 
                    onClick={handleDislike}
                    sx={{ 
                      color: isDisliked ? '#ff0055' : '#fff', 
                      px: 1.8, 
                      py: 1, 
                      minWidth: 'auto', 
                      borderRadius: 0,
                      '&:hover': { backgroundColor: '#3f3f46' }
                    }}
                  >
                    {isDisliked ? <ThumbDownIcon /> : <ThumbDownOutlinedIcon sx={{ fontSize: '18px' }} />}
                  </Button>
                </Tooltip>
              </Stack>

              {/* Watch Later Pill */}
              <Tooltip title="Save to Watch Later">
                <Button 
                  onClick={handleWatchLater}
                  startIcon={isWatchLater ? <WatchLaterIcon sx={{ color: '#ff0055' }} /> : <WatchLaterOutlinedIcon />}
                  sx={{ 
                    backgroundColor: '#27272a', 
                    color: isWatchLater ? '#ff0055' : '#fff', 
                    borderRadius: '20px', 
                    px: 2.2, 
                    py: 1, 
                    fontSize: '13px',
                    fontWeight: '600',
                    textTransform: 'none', 
                    transition: 'all 0.2s',
                    '&:hover': { backgroundColor: '#3f3f46', transform: 'scale(1.02)' } 
                  }}
                >
                  {isWatchLater ? 'Saved' : 'Watch Later'}
                </Button>
              </Tooltip>

              <Button 
                startIcon={<ReplyIcon sx={{ transform: 'scaleX(-1)', fontSize: '20px' }} />} 
                sx={{ 
                  backgroundColor: '#27272a', 
                  color: '#fff', 
                  borderRadius: '20px', 
                  px: 2.2, 
                  py: 1, 
                  fontSize: '13px',
                  fontWeight: '600',
                  textTransform: 'none', 
                  '&:hover': { backgroundColor: '#3f3f46' } 
                }}
              >
                Share
              </Button>

              <Button 
                startIcon={<FileDownloadIcon sx={{ fontSize: '20px' }} />} 
                sx={{ 
                  backgroundColor: '#27272a', 
                  color: '#fff', 
                  borderRadius: '20px', 
                  px: 2.2, 
                  py: 1, 
                  fontSize: '13px',
                  fontWeight: '600',
                  textTransform: 'none', 
                  '&:hover': { backgroundColor: '#3f3f46' } 
                }}
              >
                Download
              </Button>
            </Stack>
          </Stack>

          {/* Description Block */}
          <Box sx={{ mt: 2.5, p: 2, backgroundColor: '#18181b', borderRadius: '12px', maxHeight: '180px', overflowY: 'auto', border: '1px solid #27272a' }}>
            <Typography variant="body2" color="#fff" fontWeight="bold" sx={{ fontSize: '13.5px', mb: 1 }}>
              {parseInt(viewCount || '0').toLocaleString()} views • {formattedDate}
            </Typography>
            <Typography variant="body2" color="#e4e4e7" style={{ whiteSpace: 'pre-line', fontSize: '13px', lineHeight: '1.6' }}>
              {description || "No description available."}
            </Typography>
          </Box>

          {/* Comments section */}
          <Box sx={{ mt: 4, pb: 4 }}>
            <Typography variant="h6" color="#fff" fontWeight="bold" mb={3} sx={{ fontSize: '18px', fontFamily: "'Outfit', sans-serif" }}>
              {commentsList.length} Comments
            </Typography>
            
            {/* Input Comment block */}
            <Stack direction="row" gap={2} mb={4} sx={{ alignItems: 'center' }}>
              <Avatar src={demoProfilePicture} sx={{ width: 40, height: 40, border: '1px solid #27272a' }} />
              <TextField 
                variant="standard" 
                placeholder="Add a public comment..." 
                fullWidth
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={handleAddComment}
                slotProps={{
                  input: {
                    disableUnderline: false,
                    style: { color: '#fff', fontSize: '14.5px' }
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
                disabled={!commentText.trim()}
                sx={{ 
                  backgroundColor: commentText.trim() ? '#ff0055' : '#27272a',
                  color: commentText.trim() ? '#fff' : '#71717a',
                  borderRadius: '20px',
                  textTransform: 'none',
                  fontWeight: '600',
                  px: 2.5,
                  '&:hover': {
                    backgroundColor: commentText.trim() ? '#ff3377' : '#27272a',
                  }
                }}
              >
                Comment
              </Button>
            </Stack>

            {/* Comments List */}
            <Stack gap={3}>
              {commentsList.map((comment, index) => (
                <Stack key={index} direction="row" gap={2} sx={{ alignItems: 'flex-start', animation: index === 0 && comment.time === 'Just now' ? 'pulse 0.5s ease-out' : 'none' }}>
                  <Avatar src={comment.avatar} sx={{ width: 40, height: 40, border: '1px solid #27272a' }} />
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" gap={1} sx={{ alignItems: 'center' }} mb={0.5}>
                      <Typography variant="subtitle2" color="#fff" fontWeight="bold" sx={{ fontSize: '13px' }}>
                        {comment.author}
                      </Typography>
                      <Typography variant="caption" color="#71717a" sx={{ fontSize: '11px' }}>
                        {comment.handle} • {comment.time}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="#e4e4e7" sx={{ fontSize: '13.8px', lineHeight: '1.5' }}>
                      {comment.content}
                    </Typography>
                    <Stack direction="row" gap={2} sx={{ alignItems: 'center', color: '#71717a' }} mt={1}>
                      <IconButton sx={{ color: 'inherit', p: 0.5, '&:hover': { color: '#ff0055' } }}>
                        <ThumbUpOutlinedIcon sx={{ fontSize: '13px' }} />
                      </IconButton>
                      <Typography variant="caption" sx={{ fontSize: '11px' }}>
                        {comment.likes}
                      </Typography>
                      <IconButton sx={{ color: 'inherit', p: 0.5 }}>
                        <ThumbDownOutlinedIcon sx={{ fontSize: '13px' }} />
                      </IconButton>
                      <Typography variant="caption" sx={{ fontSize: '11px', cursor: 'pointer', ml: 1, '&:hover': { color: '#fff' } }}>
                        Reply
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Box>

        {/* Right column - Recommended videos */}
        <Box sx={{ width: { xs: '100%', lg: '320px' }, flexShrink: 0 }}>
          <Typography variant="h6" fontWeight="600" color="#fff" mb={2} sx={{ fontSize: '15px', fontFamily: "'Outfit', sans-serif" }}>
            Recommended videos
          </Typography>
          <Videos videos={videos} direction="column" />
        </Box>
      </Stack>

      {/* Snackbar Alert */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ 
            backgroundColor: snackbar.severity === 'success' ? '#18181b' : undefined,
            color: '#fff',
            border: '1px solid #27272a',
            borderRadius: '8px',
            fontSize: '13.5px',
            '& .MuiAlert-icon': {
              color: '#ff0055'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VideoDetail;
