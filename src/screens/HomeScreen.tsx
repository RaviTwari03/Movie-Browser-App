import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Text, Searchbar, IconButton, Menu } from 'react-native-paper';
import debounce from 'lodash.debounce';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MovieCard } from '../components/MovieCard';
import { movieService, Movie } from '../services/api';
import { useFavorites } from '../hooks/useFavorites';
import { useSearchHistory } from '../hooks/useSearchHistory';
import { useTheme } from '../context/ThemeContext';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'DrawerStack'>;

export default function HomeScreen() {
  const { paperTheme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { searchHistory, addToHistory, removeFromHistory, clearHistory } = useSearchHistory();
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const fetchMovies = async (pageNum: number, isRefresh = false) => {
    if (loading || (!hasMore && !isRefresh)) return;

    try {
      setLoading(true);
      const response = await movieService.getPopular(pageNum);
      const newMovies = response.data.results;
      
      if (isRefresh) {
        setMovies(newMovies);
      } else {
        setMovies((prev) => [...prev, ...newMovies]);
      }
      
      setHasMore(response.data.page < response.data.total_pages);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const searchMovies = async (query: string) => {
    if (!query.trim()) {
      fetchMovies(1, true);
      return;
    }

    try {
      setLoading(true);
      const response = await movieService.search(query);
      setMovies(response.data.results);
      setHasMore(response.data.page < response.data.total_pages);
      setPage(1);
      addToHistory(query);
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((query: string) => searchMovies(query), 300),
    []
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowHistory(query.length > 0 && searchHistory.length > 0);
    debouncedSearch(query);
  };

  const handleHistoryItemPress = (query: string) => {
    setSearchQuery(query);
    setShowHistory(false);
    searchMovies(query);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMovies(1, true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore && !searchQuery) {
      fetchMovies(page + 1);
    }
  };

  const handleMoviePress = (movie: Movie) => {
    navigation.navigate('MovieDetails', { movie });
  };

  const toggleFavorite = (movie: Movie) => {
    if (isFavorite(movie.id)) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };

  useEffect(() => {
    fetchMovies(1, true);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search movies..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={[styles.searchBar, { backgroundColor: paperTheme.colors.surface }]}
          inputStyle={[styles.searchInput, { color: paperTheme.colors.text }]}
          iconColor={paperTheme.colors.primary}
          placeholderTextColor={paperTheme.colors.secondary}
        />
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <IconButton
              icon="dots-vertical"
              onPress={() => setMenuVisible(true)}
              iconColor={paperTheme.colors.primary}
            />
          }
        >
          <Menu.Item
            onPress={() => {
              clearHistory();
              setMenuVisible(false);
            }}
            title="Clear Search History"
          />
        </Menu>
      </View>

      {showHistory && (
        <View style={[styles.historyContainer, { backgroundColor: paperTheme.colors.surface }]}>
          {searchHistory.map((item, index) => (
            <TouchableOpacity
              key={`search-history-${item}-${index}`}
              style={styles.historyItem}
              onPress={() => handleHistoryItemPress(item)}
            >
              <Text style={{ color: paperTheme.colors.text }}>{item}</Text>
              <IconButton
                icon="close"
                size={20}
                onPress={() => removeFromHistory(item)}
                iconColor={paperTheme.colors.secondary}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text variant="titleLarge" style={[styles.sectionTitle, { color: paperTheme.colors.text }]}>
        {searchQuery ? 'Search Results' : 'Popular Movies'}
      </Text>

      <FlatList
        data={movies}
        renderItem={({ item }) => (
          <MovieCard
            movie={item}
            onPress={handleMoviePress}
            onFavoritePress={() => toggleFavorite(item)}
            isFavorite={isFavorite(item.id)}
          />
        )}
        keyExtractor={(item) => `movie-${item.id}-${Date.now()}`}
        numColumns={2}
        contentContainerStyle={styles.list}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={paperTheme.colors.primary}
          />
        }
        ListFooterComponent={
          loading ? (
            <ActivityIndicator
              style={styles.loader}
              size="large"
              color={paperTheme.colors.primary}
            />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    elevation: 0,
    borderRadius: 12,
  },
  searchInput: {
    fontSize: 16,
  },
  historyContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    marginLeft: 16,
    marginBottom: 16,
  },
  list: {
    paddingHorizontal: 8,
    gap: 16,
  },
  loader: {
    padding: 16,
  },
}); 