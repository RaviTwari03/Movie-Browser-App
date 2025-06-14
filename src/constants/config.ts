export const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxM2U5YTU4MmIzNjliNTY4MTUzNzMzY2JjYTIxZDM5OCIsIm5iZiI6MTc0OTkzNjYxMS4xOTkwMDAxLCJzdWIiOiI2ODRkZTllM2MwMTAxNGI0NzkxZWMyYjIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.9cxbtALvI-ItEeKsjZwnlMmwtuEf9upFdGUq8HNFLDg';
export const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
export const POSTER_SIZES = {
  small: 'w185',
  medium: 'w342',
  large: 'w500',
  original: 'original',
};

export const ENDPOINTS = {
  popular: '/movie/popular',
  topRated: '/movie/top_rated',
  upcoming: '/movie/upcoming',
  search: '/search/movie',
  movieDetails: (id: number) => `/movie/${id}`,
};

export const STORAGE_KEYS = {
  favorites: '@ShelfEx:favorites',
  theme: '@ShelfEx:theme',
  searchHistory: '@ShelfEx:searchHistory',
} as const;

export const API_CONFIG = {
  baseURL: 'https://api.themoviedb.org/3',
  imageBaseURL: 'https://image.tmdb.org/t/p',
  posterSize: 'w342',
  backdropSize: 'w780',
} as const; 