import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Trash2, ImageOff } from 'lucide-react-native';
import { CartItem } from '../types';
import { formatPrice } from '../utils';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme';
import { MAX_CART_QUANTITY } from '../constants';
import { useCart } from '../context/CartContext';
import QuantityStepper from './QuantityStepper';
import FastImage from 'react-native-fast-image';

interface CartItemCardProps {
  item: CartItem;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();
  const { starship, quantity } = item;
  const [imageError, setImageError] = useState(false);

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(starship.url, newQuantity);
  };

  const handleRemove = () => {
    removeItem(starship.url);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Handle "unknown" cost values
  const creditsStr = starship.cost_in_credits;
  const credits = creditsStr && creditsStr !== 'unknown' ? parseFloat(creditsStr) : 0;
  const itemPrice = credits / 10000;
  const totalPrice = itemPrice * quantity;

  return (
    <View style={styles.card}>
      {imageError ? (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <ImageOff size={32} color={COLORS.textSecondary} />
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
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(starship.cost_in_credits)}</Text>
          <Text style={styles.totalPrice}>Total: {totalPrice.toFixed(2)} AED</Text>
        </View>
        <View style={styles.controlsRow}>
          <QuantityStepper
            quantity={quantity}
            onIncrease={() => handleQuantityChange(quantity + 1)}
            onDecrease={() => handleQuantityChange(quantity - 1)}
            maxQuantity={MAX_CART_QUANTITY}
          />
          <TouchableOpacity style={styles.removeButton} onPress={handleRemove}>
            <Trash2 size={18} color={COLORS.danger} />
          </TouchableOpacity>
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
    flexDirection: 'row',
  },
  image: {
    width: 100,
    height: 100,
    backgroundColor: COLORS.border,
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  name: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  model: {
    ...TYPOGRAPHY.caption,
    marginBottom: SPACING.sm,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  price: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  totalPrice: {
    ...TYPOGRAPHY.body,
    color: COLORS.accent,
    fontWeight: '600',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  removeButton: {
    padding: SPACING.xs,
  },
});

export default CartItemCard;
