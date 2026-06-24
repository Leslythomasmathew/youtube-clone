import HomeIcon from '@mui/icons-material/Home';

// Navigation-specific Icons
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import HistoryIcon from '@mui/icons-material/History';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import BoltIcon from '@mui/icons-material/Bolt';

export const logo = 'https://i.ibb.co/s9Qys2j/logo.png';

// Categories represent the top horizontal scrolling chips on YouTube
export const categories = [
  { name: 'All' },
  { name: 'JS Mastery' },
  { name: 'Coding' },
  { name: 'ReactJS' },
  { name: 'NextJS' },
  { name: 'Music' },
  { name: 'Education' },
  { name: 'Podcast' },
  { name: 'Movie' },
  { name: 'Entertainment' },
  { name: 'Gaming' },
  { name: 'Live' },
  { name: 'Sport' },
  { name: 'Fashion' },
  { name: 'Beauty' },
  { name: 'Comedy' },
  { name: 'Gym' },
  { name: 'Crypto' },
];

// Left sidebar items reflecting standard YouTube structure
export const sidebarMenu = [
  { name: 'Home', icon: <HomeIcon /> },
  { name: 'Trending', icon: <WhatshotIcon /> },
  { name: 'Subscriptions', icon: <SubscriptionsIcon /> },
  { divider: true },
  { name: 'Library', icon: <VideoLibraryIcon /> },
  { name: 'History', icon: <HistoryIcon /> },
  { name: 'Watch Later', icon: <WatchLaterIcon /> },
  { name: 'Liked Videos', icon: <ThumbUpIcon /> },
];

export const demoThumbnailUrl = 'https://i.ibb.co/G2L2Gq7/youtube.png';
export const demoChannelUrl = '/channel/UCmXmlB4-HJytD7wek0Uo97A';
export const demoVideoUrl = '/video/GDa8kNZVfbU';
export const demoChannelTitle = 'JavaScript Mastery';
export const demoVideoTitle = 'Build and Deploy a Modern YouTube Clone Application | React JS';
export const demoProfilePicture = '';
