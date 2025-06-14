import React from 'react';
import {
  ScrollView,
  View,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Text, IconButton, useTheme } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { IMAGE_BASE_URL, POSTER_SIZES } from '../constants/config';
import { useFavorites } from '../hooks/useFavorites';

type Props = NativeStackScreenProps<RootStackParamList, 'MovieDetails'>;

const { width } = Dimensions.get('window');

export default function MovieDetailsScreen({ route }: Props) {
  const theme = useTheme();
  const { movie } = route.params;
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const backdropUrl = movie.backdrop_path
    ? `${IMAGE_BASE_URL}/${POSTER_SIZES.original}${movie.backdrop_path}`
    : 'https://via.placeholder.com/500x281';

  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}/${POSTER_SIZES.large}${movie.poster_path}`
    : 'https://via.placeholder.com/500x750';

  const handleFavoritePress = () => {
    if (isFavorite(movie.id)) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      bounces={false}
    >
      <View style={styles.header}>
        <Image source={{ uri: backdropUrl }} style={styles.backdrop} />
        <View style={styles.overlay}>
          <View style={styles.titleContainer}>
            <Text variant="headlineMedium" style={styles.title}>
              {movie.title}
            </Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.star}>★</Text>
              <Text style={styles.rating}>{movie.vote_average.toFixed(1)}</Text>
            </View>
          </View>
        </View>
        <IconButton
          icon={isFavorite(movie.id) ? 'heart' : 'heart-outline'}
          size={24}
          onPress={handleFavoritePress}
          style={styles.favoriteButton}
          iconColor={isFavorite(movie.id) ? '#e91e63' : '#ffffff'}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.posterContainer}>
          <Image source={{ uri: posterUrl }} style={styles.poster} />
          <View style={styles.info}>
            <Text variant="titleMedium" style={styles.releaseDate}>
              Release Date: {new Date(movie.release_date).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={styles.overview}>
          <Text variant="bodyLarge" style={styles.overview}>
            {movie.overview}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'relative',
  },
  backdrop: {
    width: width,
    height: (width * 3) / 2,
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 32,
    background: 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.9))',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#ffffff',
    flex: 1,
    marginRight: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    color: '#FFD700',
    fontSize: 20,
    marginRight: 4,
  },
  rating: {
    color: '#ffffff',
    fontSize: 18,
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    padding: 20,
  },
  posterContainer: {
    flexDirection: 'row',
    marginTop: -50,
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'flex-end',
  },
  overview: {
    color: '#ffffff',
    marginBottom: 24,
    lineHeight: 24,
  },
  releaseDate: {
    color: '#ffffff',
    opacity: 0.7,
  },
}); 