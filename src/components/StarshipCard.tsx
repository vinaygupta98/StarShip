import { ImageOff } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { MAX_CART_QUANTITY } from '../constants';
import { useCart } from '../context/CartContext';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme';
import { Starship } from '../types';
import { formatPrice } from '../utils';
import QuantityStepper from './QuantityStepper';

interface StarshipCardProps {
  starship: Starship;
}

const StarshipCard: React.FC<StarshipCardProps> = ({ starship }) => {
  const { addItem, items, updateQuantity, removeItem } = useCart();
  const [imageError, setImageError] = useState(false);
  // Check if starship is already in cart
  const cartItem = items.find(item => item.starship.url === starship.url);
  const quantity = cartItem?.quantity || 0;
  const isInCart = quantity > 0;

  const handleAddToCart = () => {
    addItem(starship);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(starship.url);
    } else {
      updateQuantity(starship.url, newQuantity);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <View style={styles.card}>
      {imageError ? (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <ImageOff size={48} color={COLORS.textSecondary} />
        </View>
      ) : (
        <FastImage
          source={{ uri: starship.image }}
          style={styles.image}
          onError={handleImageError}
          resizeMode="cover"
        />
      )}
      <View style={styles.content}>
        <Text style={styles.name}>{starship.name}</Text>
        <Text style={styles.model}>{starship.model}</Text>
        <Text style={styles.manufacturer}>{starship.manufacturer}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(starship.cost_in_credits)}</Text>
          {isInCart ? (
            <QuantityStepper
              quantity={quantity}
              disableMinQuantity
              onIncrease={() => handleQuantityChange(quantity + 1)}
              onDecrease={() => handleQuantityChange(quantity - 1)}
              maxQuantity={MAX_CART_QUANTITY}
            />
          ) : (
            <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
              <Text style={styles.addButtonText}> Add to Cart</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.border,
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: SPACING.md,
  },
  name: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  model: {
    ...TYPOGRAPHY.body,
    marginBottom: SPACING.xs,
  },
  manufacturer: {
    ...TYPOGRAPHY.caption,
    marginBottom: SPACING.sm,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  price: {
    ...TYPOGRAPHY.h2,
    color: COLORS.accent,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal:SPACING.md,
    paddingVertical:SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.background,
    fontWeight: '600',
  },
});

export default StarshipCard;
