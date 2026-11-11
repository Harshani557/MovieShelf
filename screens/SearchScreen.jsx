import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MovieGrid from '../components/MovieGrid';
import EmptyState from '../components/EmptyState';
import movies from '../data/movies';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

export default function SearchScreen() {
  const [query, setQuery] = useState('');

  const text = query.trim().toLowerCase();
  const results = text
    ? movies.filter((movie) => movie.title.toLowerCase().includes(text))
    : movies; 

  return (
    <View style={styles.screen}>
      
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={COLORS.textSecondary} />
        <TextInput
          style={styles.input}
          placeholder="Search movies by title..."
          placeholderTextColor={COLORS.textSecondary}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          returnKeyType="search"
        />
        
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')} hitSlop={10}>
            <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
          </Pressable>
        )}
      </View>

      <Text style={styles.count}>
        {text
          ? `${results.length} ${results.length === 1 ? 'result' : 'results'} for "${query.trim()}"`
          : `Type a title to search • showing all ${movies.length} movies`}
      </Text>

      <MovieGrid
        movies={results}
        emptyComponent={
          <EmptyState
            icon="search-outline"
            title="No movies found"
            message={`We could not find any movie with "${query.trim()}" in the title. Try a different word.`}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS,
    marginHorizontal: SPACING,
    marginTop: 12,
    paddingHorizontal: 14,
    height: 48,
  },
  input: { flex: 1, color: COLORS.text, fontSize: 16 },
  count: { color: COLORS.textSecondary, fontSize: 13, paddingHorizontal: SPACING, paddingVertical: 10 },
});
