import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/config';

const MAX_HISTORY_ITEMS = 10;

export const useSearchHistory = () => {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = async () => {
    try {
      const history = await AsyncStorage.getItem(STORAGE_KEYS.searchHistory);
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  };

  const addToHistory = async (query: string) => {
    if (!query.trim()) return;
    
    try {
      const newHistory = [
        query,
        ...searchHistory.filter(item => item !== query)
      ].slice(0, MAX_HISTORY_ITEMS);
      
      setSearchHistory(newHistory);
      await AsyncStorage.setItem(STORAGE_KEYS.searchHistory, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  const clearHistory = async () => {
    try {
      setSearchHistory([]);
      await AsyncStorage.removeItem(STORAGE_KEYS.searchHistory);
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  };

  const removeFromHistory = async (query: string) => {
    try {
      const newHistory = searchHistory.filter(item => item !== query);
      setSearchHistory(newHistory);
      await AsyncStorage.setItem(STORAGE_KEYS.searchHistory, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error removing from search history:', error);
    }
  };

  return {
    searchHistory,
    addToHistory,
    clearHistory,
    removeFromHistory,
  };
}; 