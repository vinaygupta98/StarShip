import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import CartBadge from '../components/CartBadge';
import StarshipCard from '../components/StarshipCard';
import { fetchStarships, PaginatedStarships } from '../services/api';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme';
import { Starship } from '../types';

const HomeScreen: React.FC = () => {
  const [starships, setStarships] = useState<Starship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadStarships = async (page: number = 1, append: boolean = false) => {
    try {
      if (!append) {
        setError(null);
      }
      const data: PaginatedStarships = await fetchStarships(page);
      if (append) {
        setStarships(prev => [...prev, ...data.results]);
      } else {
        setStarships(data.results);
      }
      setHasNextPage(!!data.next);
      setCurrentPage(page);
    } catch (err) {
      setError('Failed to load starships. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadStarships();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setCurrentPage(1);
    loadStarships(1, false);
  };

  const loadMore = () => {
    if (hasNextPage && !loadingMore) {
      setLoadingMore(true);
      loadStarships(currentPage + 1, true);
    }
  };
  const renderHeader = () => (<View style={styles.header}>
    <Text style={styles.title}>Star Wars Starships</Text>
    <Text style={styles.subtitle}>Explore the galaxy's finest vessels</Text>
  </View>);

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading starships...</Text>
        </View>
      </View>
    );
  }

  if (error && starships.length === 0) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      <FlatList
        data={starships}
        renderItem={({ item }) => <StarshipCard starship={item} />}
        keyExtractor={(item) => item.url}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.loadingMoreContainer}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.loadingMoreText}>Loading more starships...</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No starships found</Text>
          </View>
        }
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
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
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  listContent: {
    padding: SPACING.md,
    paddingBottom: 120, // Space for cart badge
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    marginTop: SPACING.md,
    color: COLORS.textSecondary,
  },
  errorText: {
    ...TYPOGRAPHY.body,
    color: COLORS.danger,
    textAlign: 'center',
  },
  emptyContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  loadingMoreContainer: {
    padding: SPACING.md,
    alignItems: 'center',
  },
  loadingMoreText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
});

export default HomeScreen;
