import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import MovieGrid from '../components/MovieGrid';
import EmptyState from '../components/EmptyState';
import movies, { genres } from '../data/movies';
import { COLORS, SPACING } from '../constants/theme';

export default function GenresScreen() {
  const [selectedGenre, setSelectedGenre] = useState(genres[0]);

  const filteredMovies = movies.filter((movie) => movie.genre === selectedGenre);

  return (
    <View style={styles.screen}>
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {genres.map((genre) => {
            const active = genre === selectedGenre;
            return (
              <Pressable
                key={genre}
                onPress={() => setSelectedGenre(genre)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{genre}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <Text style={styles.count}>
        {selectedGenre} • {filteredMovies.length} {filteredMovies.length === 1 ? 'movie' : 'movies'}
      </Text>

      <MovieGrid
        movies={filteredMovies}
        emptyComponent={
          <EmptyState title="No movies yet" message={`There are no ${selectedGenre} movies.`} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  chipRow: { paddingHorizontal: SPACING, paddingVertical: 12, gap: 8 },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: COLORS.card,
  },
  chipActive: { backgroundColor: COLORS.primary },
  chipText: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '600' },
  chipTextActive: { color: COLORS.text },
  count: { color: COLORS.textSecondary, fontSize: 13, paddingHorizontal: SPACING, paddingBottom: 10 },
});
