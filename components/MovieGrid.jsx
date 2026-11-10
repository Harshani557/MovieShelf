import React from 'react';
import { FlatList, StyleSheet, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MovieCard from './MovieCard';
import { SPACING } from '../constants/theme';

export default function MovieGrid({ movies, header, emptyComponent, onRemove }) {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  const cardWidth = (width - SPACING * 3) / 2;

  return (
    <FlatList
      data={movies}
      keyExtractor={(item) => String(item.id)}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.content}
      ListHeaderComponent={header}
      ListEmptyComponent={emptyComponent}
      keyboardShouldPersistTaps="handled"
      renderItem={({ item }) => (
        <MovieCard
          movie={item}
          width={cardWidth}
          
          onPress={() => navigation.navigate('MovieDetails', { movieId: item.id })}
          onRemove={onRemove ? () => onRemove(item) : undefined}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: SPACING * 2, flexGrow: 1 },
  row: { justifyContent: 'space-between', paddingHorizontal: SPACING, marginBottom: SPACING },
});
