import axios from 'axios';
import { Starship } from '../types';
import { enrichStarship } from '../utils';

const BASE_URL = 'https://swapi-api.hbtn.io/api';
const API_TIMEOUT = 10000; // 10 seconds

// Configure axios instance with timeout
const apiClient = axios.create({
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface PaginatedStarships {
  results: Starship[];
  next: string | null;
  previous: string | null;
  count: number;
}

/**
 * Fetch starships with pagination
 * Returns one page of results
 */
export const fetchStarships = async (page: number = 1): Promise<PaginatedStarships> => {
  try {
    const response = await apiClient.get(`${BASE_URL}/starships/?page=${page}`);
    const data = response.data;
    return {
      results: data.results.map(enrichStarship),
      next: data.next,
      previous: data.previous,
      count: data.count,
    };
  } catch (error) {
    // Handle timeout and network errors
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please check your connection and try again.');
      }
      if (error.response) {
        throw new Error(`API error: ${error.response.status}`);
      }
      if (error.request) {
        throw new Error('Network error. Please check your connection.');
      }
    }
    throw error;
  }
};

/**
 * Search starships by term with pagination
 * Returns one page of results
 */
export const searchStarships = async (searchTerm: string, page: number = 1): Promise<PaginatedStarships> => {
  try {
    if (!searchTerm.trim()) {
      return { results: [], next: null, previous: null, count: 0 };
    }
    const response = await apiClient.get(
      `${BASE_URL}/starships/?search=${encodeURIComponent(searchTerm)}&page=${page}`
    );
    const data = response.data;
    return {
      results: data.results.map(enrichStarship),
      next: data.next,
      previous: data.previous,
      count: data.count,
    };
  } catch (error) {
    // Handle timeout and network errors
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please check your connection and try again.');
      }
      if (error.response) {
        throw new Error(`API error: ${error.response.status}`);
      }
      if (error.request) {
        throw new Error('Network error. Please check your connection.');
      }
    }
    throw error;
  }
};
