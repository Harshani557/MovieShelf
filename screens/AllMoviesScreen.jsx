import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MovieGrid from '../components/MovieGrid';
import movies from '../data/movies';
import { COLORS, SPACING } from '../constants/theme';

export default function AllMoviesScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.count}>{movies.length} movies in your library</Text>
      <MovieGrid movies={movies} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  count: { color: COLORS.textSecondary, fontSize: 13, paddingHorizontal: SPACING, paddingVertical: 10 },
});
