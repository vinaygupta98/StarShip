import { Minus, Plus } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../theme';

interface QuantityStepperProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  maxQuantity?: number;
  disableMinQuantity?: boolean;
}

const QuantityStepper: React.FC<QuantityStepperProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  maxQuantity = 5,
  disableMinQuantity = false,
}) => {
  const isMinDisabled= disableMinQuantity ? false : quantity <= 1
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isMinDisabled && styles.buttonDisabled]}
        onPress={onDecrease}
        disabled={isMinDisabled}
      >
        <Minus size={18} color={isMinDisabled ? COLORS.textSecondary : COLORS.text} />
      </TouchableOpacity>
      <Text style={styles.quantity}>{quantity}</Text>
      <TouchableOpacity
        style={[styles.button, quantity >= maxQuantity && styles.buttonDisabled]}
        onPress={onIncrease}
        disabled={quantity >= maxQuantity}
      >
        <Plus size={18} color={quantity >= maxQuantity ? COLORS.textSecondary : COLORS.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  button: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  quantity: {
    ...TYPOGRAPHY.body,
    minWidth: 40,
    textAlign: 'center',
    color: COLORS.text,
  },
});

export default QuantityStepper;
