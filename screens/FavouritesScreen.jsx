import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MovieGrid from '../components/MovieGrid';
import EmptyState from '../components/EmptyState';
import movies from '../data/movies';
import { useFavourites } from '../context/FavouritesContext';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

export default function FavouritesScreen({ navigation }) {
  const { favouriteIds, loaded, removeFavourite } = useFavourites();

  if (!loaded) return <View style={styles.screen} />;

  const favouriteMovies = movies.filter((movie) => favouriteIds.includes(movie.id));

  return (
    <View style={styles.screen}>
      {favouriteMovies.length > 0 && (
        <Text style={styles.count}>
          {favouriteMovies.length} saved {favouriteMovies.length === 1 ? 'movie' : 'movies'} • tap ✕ to remove
        </Text>
      )}

      <MovieGrid
        movies={favouriteMovies}
        onRemove={(movie) => removeFavourite(movie.id)}
        emptyComponent={
          <EmptyState
            icon="heart-outline"
            title="No favourites yet"
            message="Open a movie and tap “Add to Favourites” to save it here."
          >
            <Pressable style={styles.browseButton} onPress={() => navigation.navigate('AllMovies')}>
              <Text style={styles.browseText}>Browse Movies</Text>
            </Pressable>
          </EmptyState>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  count: { color: COLORS.textSecondary, fontSize: 13, paddingHorizontal: SPACING, paddingVertical: 10 },
  browseButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 12,
  },
  browseText: { color: COLORS.text, fontWeight: '700', fontSize: 15 },
});
