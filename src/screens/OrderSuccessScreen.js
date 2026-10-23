import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS, SHADOWS } from '../theme/colors';

export default function OrderSuccessScreen({ route, navigation }) {
  const { order } = route.params || {};
  const { user } = useApp();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Animated / Celebration Icon Badge */}
        <View style={styles.headerBox}>
          <View style={[styles.successIconCircle, SHADOWS.md]}>
            <Ionicons name="checkmark" size={48} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>Order Placed Successfully!</Text>
          <Text style={styles.subtitle}>
            Your fresh grocery order has been received and is being prepared.
          </Text>
        </View>

        {/* Order Details Card */}
        {order && (
          <View style={[styles.orderCard, SHADOWS.sm]}>
            <View style={styles.orderCardHeader}>
              <View>
                <Text style={styles.orderLabel}>Order Number</Text>
                <Text style={styles.orderId}>{order.id}</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{order.status}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Estimated Delivery Time */}
            <View style={styles.deliveryRow}>
              <Ionicons name="time-outline" size={20} color={COLORS.primary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.deliveryLabel}>Estimated Delivery</Text>
                <Text style={styles.deliveryValue}>Today in 25 - 35 minutes</Text>
              </View>
            </View>

            {/* Delivery Address */}
            <View style={styles.deliveryRow}>
              <Ionicons name="location-outline" size={20} color={COLORS.primary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.deliveryLabel}>Delivery Address</Text>
                <Text style={styles.deliveryValue}>
                  {user.address}, {user.city}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Items Summary */}
            <Text style={styles.itemsHeading}>Items Purchased ({order.items?.length || 0}):</Text>
            {order.items?.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Text style={styles.itemQuantity}>{item.qty}x</Text>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.name} {item.weight ? `(${item.weight})` : ''}
                </Text>
                <Text style={styles.itemPrice}>₹{(item.price * item.qty).toFixed(2)}</Text>
              </View>
            ))}

            <View style={styles.divider} />

            {/* Total */}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Paid</Text>
              <Text style={styles.totalPrice}>₹{order.totalAmount.toFixed(2)}</Text>
            </View>
          </View>
        )}

        {/* Back to Home Button */}
        <TouchableOpacity
          style={[styles.homeBtn, SHADOWS.md]}
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'MainDrawer' }],
            });
          }}
          activeOpacity={0.85}
        >
          <Ionicons name="home-outline" size={18} color="#FFFFFF" />
          <Text style={styles.homeBtnText}>Back to Grocery Shop</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: 'center',
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: 24,
  },
  successIconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    width: '100%',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  orderId: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 12,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  deliveryLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  deliveryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 1,
  },
  itemsHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemQuantity: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark,
    width: 26,
  },
  itemName: {
    fontSize: 12,
    color: COLORS.textSecondary,
    flex: 1,
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  homeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
  },
  homeBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
