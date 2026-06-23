// LocalStorage store utilities for the YouTube Clone state

const KEYS = {
  LIKED: 'yt_liked_videos',
  WATCH_LATER: 'yt_watch_later',
  HISTORY: 'yt_history',
  SUBSCRIPTIONS: 'yt_subscriptions',
  COMMENTS: 'yt_comments',
};

const getJSON = (key, fallback = []) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    console.error(`Error loading state for key ${key}:`, e);
    return fallback;
  }
};

const setJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving state for key ${key}:`, e);
  }
};

export const playlistStore = {
  // LIKED VIDEOS
  getLikedVideos: () => getJSON(KEYS.LIKED),
  
  isLikedVideo: (videoId) => {
    const list = getJSON(KEYS.LIKED);
    return list.some(item => (item.id?.videoId || item.id) === videoId);
  },
  
  toggleLikeVideo: (video) => {
    if (!video) return false;
    const list = getJSON(KEYS.LIKED);
    const videoId = video.id?.videoId || video.id;
    const index = list.findIndex(item => (item.id?.videoId || item.id) === videoId);
    
    let isNowLiked = false;
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.unshift(video);
      isNowLiked = true;
    }
    setJSON(KEYS.LIKED, list);
    return isNowLiked;
  },

  // WATCH LATER
  getWatchLaterVideos: () => getJSON(KEYS.WATCH_LATER),
  
  isWatchLaterVideo: (videoId) => {
    const list = getJSON(KEYS.WATCH_LATER);
    return list.some(item => (item.id?.videoId || item.id) === videoId);
  },
  
  toggleWatchLaterVideo: (video) => {
    if (!video) return false;
    const list = getJSON(KEYS.WATCH_LATER);
    const videoId = video.id?.videoId || video.id;
    const index = list.findIndex(item => (item.id?.videoId || item.id) === videoId);
    
    let isNowWatchLater = false;
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.unshift(video);
      isNowWatchLater = true;
    }
    setJSON(KEYS.WATCH_LATER, list);
    return isNowWatchLater;
  },

  // HISTORY
  getHistoryVideos: () => getJSON(KEYS.HISTORY),
  
  addToHistory: (video) => {
    if (!video) return;
    const list = getJSON(KEYS.HISTORY);
    const videoId = video.id?.videoId || video.id;
    
    // Remove if already exists so we can move it to top of list
    const filtered = list.filter(item => (item.id?.videoId || item.id) !== videoId);
    filtered.unshift(video);
    
    // Limit history size to 50 items
    if (filtered.length > 50) {
      filtered.pop();
    }
    setJSON(KEYS.HISTORY, filtered);
  },

  clearHistory: () => {
    setJSON(KEYS.HISTORY, []);
  },

  // SUBSCRIPTIONS
  getSubscribedChannels: () => getJSON(KEYS.SUBSCRIPTIONS),
  
  isSubscribedChannel: (channelId) => {
    const list = getJSON(KEYS.SUBSCRIPTIONS);
    return list.some(item => (item.id?.channelId || item.id) === channelId);
  },
  
  toggleSubscribeChannel: (channel) => {
    if (!channel) return false;
    const list = getJSON(KEYS.SUBSCRIPTIONS);
    const channelId = channel.id?.channelId || channel.id;
    const index = list.findIndex(item => (item.id?.channelId || item.id) === channelId);
    
    let isNowSubscribed = false;
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.unshift(channel);
      isNowSubscribed = true;
    }
    setJSON(KEYS.SUBSCRIPTIONS, list);
    return isNowSubscribed;
  },

  // DYNAMIC COMMENTS
  getVideoComments: (videoId) => {
    const allComments = getJSON(KEYS.COMMENTS, {});
    return allComments[videoId] || [];
  },

  addVideoComment: (videoId, comment) => {
    if (!videoId || !comment) return [];
    const allComments = getJSON(KEYS.COMMENTS, {});
    if (!allComments[videoId]) {
      allComments[videoId] = [];
    }
    allComments[videoId].unshift(comment);
    setJSON(KEYS.COMMENTS, allComments);
    return allComments[videoId];
  }
};
