import axios from 'axios';
import { BASE_URL, API_KEY } from '../constants/config';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export const movieService = {
  getPopular: (page = 1) => 
    api.get<MovieResponse>('/movie/popular'),
    
  getTopRated: (page = 1) =>
    api.get<MovieResponse>('/movie/top_rated', { params: { page } }),
    
  getUpcoming: (page = 1) =>
    api.get<MovieResponse>('/movie/upcoming', { params: { page } }),
    
  search: (query: string, page = 1) =>
    api.get<MovieResponse>('/search/movie', { params: { query, page } }),
    
  getDetails: (movieId: number) =>
    api.get<Movie>(`/movie/${movieId}`),
}; 