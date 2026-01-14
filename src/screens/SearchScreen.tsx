import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { Search as SearchIcon } from 'lucide-react-native';
import { Starship } from '../types';
import { searchStarships } from '../services/api';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme';
import StarshipCard from '../components/StarshipCard';
import CartBadge from '../components/CartBadge';

const SearchScreen: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [starships, setStarships] = useState<Starship[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (!searchTerm.trim()) {
      setStarships([]);
      setLoading(false);
      return;
    }

    // Set loading state immediately
    setLoading(true);
    setError(null);

    // Debounce the search
    debounceTimer.current = setTimeout(async () => {
      try {
        const data = await searchStarships(searchTerm);
        setStarships(data.results);
      } catch (err) {
        setError('Failed to search starships. Please try again.');
        setStarships([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    // Cleanup timer on unmount or when searchTerm changes
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchTerm]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search Starships</Text>
        <View style={styles.searchContainer}>
          <SearchIcon size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, model, or manufacturer..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchTerm}
            onChangeText={setSearchTerm}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {loading && <ActivityIndicator size="small" color={COLORS.primary} />}
        </View>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!loading && searchTerm.trim() && starships.length === 0 && !error && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No starships found for "{searchTerm}"</Text>
        </View>
      )}

      {!searchTerm.trim() && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Start typing to search starships...</Text>
        </View>
      )}

      <FlatList
        data={starships}
        renderItem={({ item }) => <StarshipCard starship={item} />}
        keyExtractor={(item) => item.url}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={null}
      />
      <CartBadge />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.md,
    paddingTop: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  searchIcon: {
    marginRight: SPACING.xs,
  },
  searchInput: {
    flex: 1,
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    paddingVertical: SPACING.sm,
  },
  listContent: {
    padding: SPACING.md,
    paddingBottom: 120, // Space for cart badge
  },
  errorContainer: {
    padding: SPACING.md,
    backgroundColor: COLORS.cardBackground,
    margin: SPACING.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  errorText: {
    ...TYPOGRAPHY.body,
    color: COLORS.danger,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default SearchScreen;
