import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MovieCard } from '../components/MovieCard';
import { useFavorites } from '../hooks/useFavorites';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Movie } from '../services/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'DrawerStack'>;

export default function FavoritesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { favorites, removeFavorite, isFavorite } = useFavorites();

  const handleMoviePress = (movie: Movie) => {
    navigation.navigate('MovieDetails', { movie });
  };

  const toggleFavorite = (movie: Movie) => {
    removeFavorite(movie.id);
  };

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="headlineSmall">No favorites yet</Text>
        <Text variant="bodyMedium" style={styles.emptyText}>
          Start adding movies to your favorites list by tapping the heart icon
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        renderItem={({ item }) => (
          <MovieCard
            movie={item}
            onPress={handleMoviePress}
            onFavoritePress={() => toggleFavorite(item)}
            isFavorite={isFavorite(item.id)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 8,
    color: '#666',
  },
}); 