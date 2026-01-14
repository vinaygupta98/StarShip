import { CreditCard, Wallet } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import CartItemCard from '../components/CartItemCard';
import { TAX_RATE } from '../constants';
import { useCart } from '../context/CartContext';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme';

type PaymentMethod = 'credit_card' | 'cash';

const CartScreen: React.FC = () => {
  const { items, clearCart, getTotalPrice } = useCart();
  const [isCartFinalizing, setIsCartFinalizing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');

  const subtotal = getTotalPrice();
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before placing an order.');
      return;
    }

    Alert.alert(
      'Confirm Order',
      `Total: ${total.toFixed(2)} AED\nPayment Method: ${paymentMethod === 'credit_card' ? 'Credit Card' : 'Cash'}\n\nPlace this order?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Place Order',
          onPress: () => {
            clearCart();
          },
        },
      ]
    );
  };

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Shopping Cart</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Text style={styles.emptySubtext}>Add some starships to get started!</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shopping Cart</Text>
        <Text style={styles.itemCount}>{items.length} item{items.length !== 1 ? 's' : ''}</Text>
      </View>

      <FlatList
        data={items}
        renderItem={({ item }) => <CartItemCard item={item} />}
        keyExtractor={(item) => item.starship.url}
        contentContainerStyle={styles.listContent}
      />

      {isCartFinalizing && <View style={styles.footer}>
        <ScrollView style={styles.summaryContainer}>
          <View style={styles.cancelSection}>
             <TouchableOpacity style={styles.cancelBtn} onPress={()=> setIsCartFinalizing(false)}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
          </View>
          <View style={styles.paymentSection}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <View style={styles.paymentOptions}>
              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  paymentMethod === 'credit_card' && styles.paymentOptionActive,
                ]}
                onPress={() => setPaymentMethod('credit_card')}
              >
                <CreditCard
                  size={20}
                  color={paymentMethod === 'credit_card' ? COLORS.primary : COLORS.textSecondary}
                />
                <Text
                  style={[
                    styles.paymentOptionText,
                    paymentMethod === 'credit_card' && styles.paymentOptionTextActive,
                  ]}
                >
                  Credit Card
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  paymentMethod === 'cash' && styles.paymentOptionActive,
                ]}
                onPress={() => setPaymentMethod('cash')}
              >
                <Wallet
                  size={20}
                  color={paymentMethod === 'cash' ? COLORS.primary : COLORS.textSecondary}
                />
                <Text
                  style={[
                    styles.paymentOptionText,
                    paymentMethod === 'cash' && styles.paymentOptionTextActive,
                  ]}
                >
                  Cash
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.orderSummary}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{subtotal.toFixed(2)} AED</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax ({TAX_RATE * 100}%)</Text>
              <Text style={styles.summaryValue}>{tax.toFixed(2)} AED</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{total.toFixed(2)} AED</Text>
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
          <Text style={styles.placeOrderText}>Place Order</Text>
        </TouchableOpacity>
      </View>}
      {!isCartFinalizing && <TouchableOpacity style={styles.placeOrderButton} onPress={() => setIsCartFinalizing(true)}>
        <Text style={styles.placeOrderText}>Place Order</Text>
      </TouchableOpacity>}
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
    marginBottom: SPACING.xs,
  },
  itemCount: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  listContent: {
    padding: SPACING.md,
    paddingBottom: 300, // Space for footer
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyText: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptySubtext: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.cardBackground,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: SPACING.md,
  },
  summaryContainer: {
    padding: SPACING.md,
  },
  paymentSection: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  paymentOptions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  paymentOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    padding: SPACING.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  paymentOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.cardBackground,
  },
  paymentOptionText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  paymentOptionTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  orderSummary: {
    marginTop: SPACING.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  summaryLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },
  totalRow: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  totalLabel: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
  },
  totalValue: {
    ...TYPOGRAPHY.h2,
    color: COLORS.accent,
  },
  placeOrderButton: {
    backgroundColor: COLORS.primary,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  placeOrderText: {
    ...TYPOGRAPHY.h2,
    color: COLORS.background,
    fontWeight: 'bold',
  },
  cancelBtn:{
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  cancelText: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  cancelSection:{
    display:'flex',
    alignItems:'flex-end',
  }
});

export default CartScreen