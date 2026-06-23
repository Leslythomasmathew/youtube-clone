import axios from 'axios';
import { 
  mockVideosByCategory, 
  mockVideoDetails, 
  getMockChannelDetail, 
  getMockChannelVideos, 
  getMockRelatedVideos, 
  searchMockVideos 
} from './mockData.js';

export const BASE_URL = 'https://youtube-v31.p.rapidapi.com';

const options = {
  params: {
    maxResults: '50'
  },
  headers: {
    'X-RapidAPI-Key': import.meta.env.VITE_RAPID_API_KEY || '',
    'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com'
  }
};

/**
 * Custom fetcher that integrates RapidAPI and falls back to mock data
 * when API key is missing or calls fail.
 */
export const fetchFromAPI = async (url) => {
  // Dispatch custom event to activate top progress loading bar
  window.dispatchEvent(new CustomEvent('api-loading', { detail: true }));

  const apiKey = import.meta.env.VITE_RAPID_API_KEY;
  
  const finishLoading = (data) => {
    window.dispatchEvent(new CustomEvent('api-loading', { detail: false }));
    return data;
  };

  // If API Key is missing, bypass network calls and use mock data immediately
  if (!apiKey || apiKey === 'YOUR_RAPID_API_KEY_HERE' || apiKey.trim() === '') {
    console.log('fetchFromAPI: RapidAPI key is missing. Using mock data.');
    const data = await fetchMockData(url);
    return finishLoading(data);
  }

  try {
    const { data } = await axios.get(`${BASE_URL}/${url}`, options);
    return finishLoading(data);
  } catch (error) {
    console.warn('fetchFromAPI: Live API request failed, falling back to mock data.', error);
    const data = await fetchMockData(url);
    return finishLoading(data);
  }
};

/**
 * Resolves local mock data by parsing the request URL paths.
 */
const fetchMockData = async (url) => {
  // Simulate network latency for natural UI transitions
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const parsedUrl = new URL(url, BASE_URL);
  const path = parsedUrl.pathname.replace(/^\//, '');
  const params = parsedUrl.searchParams;

  if (path === 'search') {
    const q = params.get('q');
    const channelId = params.get('channelId');
    const relatedToVideoId = params.get('relatedToVideoId');

    if (relatedToVideoId) {
      return { items: getMockRelatedVideos(relatedToVideoId) };
    }
    if (channelId) {
      return { items: getMockChannelVideos(channelId) };
    }
    if (q) {
      return { items: searchMockVideos(q) };
    }
    return { items: mockVideosByCategory.New };
  } 
  
  if (path === 'videos') {
    const id = params.get('id');
    const detail = mockVideoDetails[id];
    return { items: detail ? [detail] : [] };
  } 
  
  if (path === 'channels') {
    const id = params.get('id');
    const detail = getMockChannelDetail(id);
    return { items: detail ? [detail] : [] };
  }

  // General fallback
  return { items: [] };
};
