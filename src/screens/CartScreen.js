import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS, SHADOWS } from '../theme/colors';

export default function CartScreen({ navigation }) {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    placeOrder,
    user,
    showToast,
  } = useApp();

  const [promoInput, setPromoInput] = useState('');
  const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'Credit Card' | 'Cash on Delivery'
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);

  // Cost calculations
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const discountAmount = appliedPromo?.discountPercent
    ? (subtotal * appliedPromo.discountPercent) / 100
    : 0;
  const deliveryFee = appliedPromo?.freeShipping || subtotal > 300 ? 0 : 40;
  const finalTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleApplyPromo = () => {
    if (!promoInput.trim()) {
      showToast('Please enter a promo code', 'warning');
      return;
    }
    applyPromoCode(promoInput);
    setPromoInput('');
  };

  const handleConfirmOrder = () => {
    if (paymentMethod === 'UPI') {
      setIsVerifyingPayment(true);
      setTimeout(() => {
        setIsVerifyingPayment(false);
        const order = placeOrder('UPI / Dynamic QR Code');
        if (order) {
          setIsCheckoutModalVisible(false);
          showToast(`UPI Payment of ₹${finalTotal.toFixed(2)} Received! 🎉`, 'success');
          navigation.navigate('OrderSuccess', { order });
        }
      }, 1100);
    } else {
      const order = placeOrder(paymentMethod);
      if (order) {
        setIsCheckoutModalVisible(false);
        navigation.navigate('OrderSuccess', { order });
      }
    }
  };

  const renderCartItem = ({ item }) => {
    return (
      <View style={[styles.cartItemCard, SHADOWS.sm]}>
        <Image
          source={{ uri: item.product.image }}
          style={styles.itemImage}
          resizeMode="cover"
        />

        <View style={styles.itemInfo}>
          <View style={styles.itemHeaderRow}>
            <Text style={styles.itemName} numberOfLines={1}>
              {item.product.name}
            </Text>
            <TouchableOpacity
              onPress={() => removeFromCart(item.product.id, item.selectedWeight)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="trash-outline" size={18} color={COLORS.accentRed} />
            </TouchableOpacity>
          </View>

          <Text style={styles.itemWeight}>Pack: {item.selectedWeight}</Text>

          <View style={styles.itemFooterRow}>
            <Text style={styles.itemPrice}>
              ₹{(item.product.price * item.quantity).toFixed(2)}
              <Text style={styles.unitPriceText}> (₹{item.product.price.toFixed(2)} ea)</Text>
            </Text>

            {/* Stepper (- 1 +) */}
            <View style={styles.stepperContainer}>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() =>
                  updateCartQuantity(item.product.id, item.selectedWeight, -1)
                }
              >
                <Ionicons name="remove" size={16} color={COLORS.textPrimary} />
              </TouchableOpacity>

              <Text style={styles.stepperQty}>{item.quantity}</Text>

              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() =>
                  updateCartQuantity(item.product.id, item.selectedWeight, 1)
                }
              >
                <Ionicons name="add" size={16} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {cart.length > 0 ? (
        <FlatList
          data={cart}
          keyExtractor={(item) => `${item.product.id}-${item.selectedWeight}`}
          renderItem={renderCartItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.cartTopBar}>
              <View>
                <Text style={styles.cartHeaderTitle}>
                  {user.role === 'admin' ? 'Store Cart (Admin View)' : 'My Cart'}
                </Text>
                <Text style={styles.cartHeaderSubtitle}>
                  {cart.length} items in your basket
                </Text>
              </View>

              <TouchableOpacity
                style={styles.clearCartBtn}
                onPress={clearCart}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.clearCartText}>Clear All</Text>
              </TouchableOpacity>
            </View>
          }
          ListFooterComponent={
            <View style={styles.footerSection}>
              {/* Promo Code Box */}
              <View style={[styles.promoCard, SHADOWS.sm]}>
                <Text style={styles.promoHeaderTitle}>Have a Coupon / Promo Code?</Text>
                {appliedPromo ? (
                  <View style={styles.appliedPromoRow}>
                    <View style={styles.appliedBadge}>
                      <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
                      <Text style={styles.appliedPromoText}>
                        Code {appliedPromo.code} Applied!
                      </Text>
                    </View>
                    <TouchableOpacity onPress={removePromoCode}>
                      <Text style={styles.removePromoText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.promoInputRow}>
                    <TextInput
                      style={styles.promoInput}
                      placeholder="Try 'FRESH20' for 20% off"
                      placeholderTextColor={COLORS.textMuted}
                      value={promoInput}
                      onChangeText={setPromoInput}
                      autoCapitalize="characters"
                    />
                    <TouchableOpacity
                      style={styles.applyPromoBtn}
                      onPress={handleApplyPromo}
                    >
                      <Text style={styles.applyPromoText}>Apply</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Order Summary Breakdown */}
              <View style={[styles.summaryCard, SHADOWS.sm]}>
                <Text style={styles.summaryHeaderTitle}>Order Summary</Text>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal</Text>
                  <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
                </View>

                {discountAmount > 0 && (
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, { color: COLORS.primary }]}>
                      Discount (20% OFF)
                    </Text>
                    <Text style={[styles.summaryValue, { color: COLORS.primary }]}>
                      -₹{discountAmount.toFixed(2)}
                    </Text>
                  </View>
                )}

                <View style={styles.summaryRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Text style={styles.summaryLabel}>Delivery Fee</Text>
                    {deliveryFee === 0 && (
                      <View style={styles.freeBadge}>
                        <Text style={styles.freeBadgeText}>FREE</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.summaryValue}>
                    {deliveryFee === 0 ? '₹0.00' : `₹${deliveryFee.toFixed(2)}`}
                  </Text>
                </View>

                <View style={styles.summaryDivider} />

                <View style={styles.summaryRow}>
                  <Text style={styles.totalLabel}>Estimated Total</Text>
                  <Text style={styles.totalValue}>₹{finalTotal.toFixed(2)}</Text>
                </View>
              </View>

              {/* Checkout Button */}
              <TouchableOpacity
                style={[styles.checkoutBtn, SHADOWS.md]}
                onPress={() => setIsCheckoutModalVisible(true)}
                activeOpacity={0.85}
              >
                <Text style={styles.checkoutBtnText}>
                  Proceed to Checkout • ₹{finalTotal.toFixed(2)}
                </Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          }
        />
      ) : (
        /* Empty Cart State */
        <View style={styles.emptyContainer}>
          <View style={styles.emptyCircle}>
            <Ionicons name="cart-outline" size={60} color={COLORS.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
          <Text style={styles.emptySubtitle}>
            Looks like you haven't added any fresh groceries to your cart yet.
          </Text>
          <TouchableOpacity
            style={[styles.startShoppingBtn, SHADOWS.sm]}
            onPress={() => navigation.navigate('ShopTab')}
          >
            <Ionicons name="basket" size={18} color="#FFFFFF" />
            <Text style={styles.startShoppingText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Checkout Modal */}
      <Modal
        visible={isCheckoutModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsCheckoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirm & Pay</Text>
              <TouchableOpacity onPress={() => setIsCheckoutModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Delivery Address Review */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Delivery Address</Text>
                <View style={styles.addressBox}>
                  <Ionicons name="location" size={20} color={COLORS.primary} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.addressName}>{user.name} ({user.phone})</Text>
                    <Text style={styles.addressDetail}>
                      {user.address}, {user.city} - {user.postalCode}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => {
                    setIsCheckoutModalVisible(false);
                    navigation.navigate('EditProfile');
                  }}>
                    <Text style={styles.changeAddressText}>Change</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Payment Methods */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Payment Method</Text>

                {[
                  { id: 'UPI', label: 'UPI / Dynamic QR Code', icon: 'qr-code-outline' },
                  { id: 'Credit Card', label: 'Credit / Debit Card', icon: 'card-outline' },
                  { id: 'Cash on Delivery', label: 'Cash on Delivery', icon: 'cash-outline' },
                ].map((m) => {
                  const isSelected = paymentMethod === m.id;
                  return (
                    <TouchableOpacity
                      key={m.id}
                      style={[
                        styles.paymentOption,
                        isSelected && styles.paymentOptionSelected,
                      ]}
                      onPress={() => setPaymentMethod(m.id)}
                    >
                      <View style={styles.paymentLeft}>
                        <Ionicons
                          name={m.icon}
                          size={20}
                          color={isSelected ? COLORS.primary : COLORS.textSecondary}
                        />
                        <Text
                          style={[
                            styles.paymentLabel,
                            isSelected && styles.paymentLabelSelected,
                          ]}
                        >
                          {m.label}
                        </Text>
                      </View>
                      <Ionicons
                        name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                        size={20}
                        color={isSelected ? COLORS.primary : COLORS.textMuted}
                      />
                    </TouchableOpacity>
                  );
                })}

                {/* Dynamic UPI QR Code Card when UPI is selected */}
                {paymentMethod === 'UPI' && (
                  <View style={styles.upiQrContainer}>
                    <View style={styles.upiQrHeader}>
                      <View style={styles.upiBadgeLeft}>
                        <Ionicons name="scan" size={16} color={COLORS.primary} />
                        <Text style={styles.upiBadgeText}>Scan QR Code to Pay</Text>
                      </View>
                      <View style={styles.upiTimerBadge}>
                        <Ionicons name="time-outline" size={13} color="#D97706" />
                        <Text style={styles.upiTimerText}>Active: 10:00</Text>
                      </View>
                    </View>

                    <Text style={styles.upiInstructionText}>
                      Scan with Google Pay, PhonePe, Paytm, or any UPI App to place order
                    </Text>

                    {/* QR Code Graphic Display */}
                    <View style={styles.qrCodeBox}>
                      <Image
                        source={{
                          uri: `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=upi%3A%2F%2Fpay%3Fpa%3Dfreshgrocery%40upi%26pn%3DFresh%20Grocery%26am%3D${finalTotal.toFixed(2)}%26cu%3DINR`,
                        }}
                        style={styles.qrImage}
                        resizeMode="contain"
                      />
                      <View style={styles.qrAmountPill}>
                        <Text style={styles.qrAmountPillText}>₹{finalTotal.toFixed(2)}</Text>
                      </View>
                    </View>

                    {/* UPI ID with Copy Action */}
                    <View style={styles.upiIdRow}>
                      <Text style={styles.upiIdLabel}>UPI ID: </Text>
                      <Text style={styles.upiIdText}>freshgrocery@okaxis</Text>
                      <TouchableOpacity
                        style={styles.upiCopyBtn}
                        onPress={() => showToast('UPI ID copied to clipboard! 📋', 'info')}
                      >
                        <Ionicons name="copy-outline" size={13} color={COLORS.primary} />
                        <Text style={styles.upiCopyText}>Copy</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Supported UPI Apps */}
                    <View style={styles.supportedAppsRow}>
                      <View style={styles.appBadge}><Text style={styles.appBadgeText}>GPay</Text></View>
                      <View style={styles.appBadge}><Text style={styles.appBadgeText}>PhonePe</Text></View>
                      <View style={styles.appBadge}><Text style={styles.appBadgeText}>Paytm</Text></View>
                      <View style={styles.appBadge}><Text style={styles.appBadgeText}>BHIM</Text></View>
                    </View>

                    {/* Customer Scan Complete Trigger Button */}
                    <TouchableOpacity
                      style={styles.customerScannedBtn}
                      onPress={handleConfirmOrder}
                      disabled={isVerifyingPayment}
                      activeOpacity={0.85}
                    >
                      {isVerifyingPayment ? (
                        <>
                          <ActivityIndicator size="small" color={COLORS.primary} />
                          <Text style={styles.customerScannedBtnText}>Verifying Payment with Bank...</Text>
                        </>
                      ) : (
                        <>
                          <Ionicons name="checkmark-circle-outline" size={18} color={COLORS.primary} />
                          <Text style={styles.customerScannedBtnText}>Customer Scanned? Tap to Complete Order</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Total Summary */}
              <View style={styles.modalTotalBox}>
                <Text style={styles.modalTotalLabel}>Total Amount Payable</Text>
                <Text style={styles.modalTotalValue}>₹{finalTotal.toFixed(2)}</Text>
              </View>
            </ScrollView>

            {/* Place Order CTA */}
            <TouchableOpacity
              style={[styles.placeOrderBtn, SHADOWS.md]}
              onPress={handleConfirmOrder}
              disabled={isVerifyingPayment}
              activeOpacity={0.85}
            >
              {isVerifyingPayment ? (
                <>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={styles.placeOrderBtnText}>Verifying UPI Payment...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="checkmark-done" size={20} color="#FFFFFF" />
                  <Text style={styles.placeOrderBtnText}>
                    Confirm Order (₹{finalTotal.toFixed(2)})
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  cartTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cartHeaderTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  cartHeaderSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  clearCartBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  clearCartText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.accentRed,
  },
  cartItemCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  itemHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  itemWeight: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  itemFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  unitPriceText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAF9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 2,
  },
  stepperBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperQty: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    paddingHorizontal: 12,
  },
  footerSection: {
    marginTop: 10,
  },
  promoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  promoHeaderTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  promoInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  promoInput: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 13,
    height: 42,
    color: COLORS.textPrimary,
  },
  applyPromoBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  applyPromoText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  appliedPromoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    padding: 10,
    borderRadius: 10,
  },
  appliedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  appliedPromoText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  removePromoText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.accentRed,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  summaryHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  freeBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  freeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emptyCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  startShoppingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8,
  },
  startShoppingText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  modalSection: {
    marginBottom: 16,
  },
  modalSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAF9',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: 10,
  },
  addressName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  addressDetail: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  changeAddressText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  paymentOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  paymentOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  paymentLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  paymentLabelSelected: {
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
  modalTotalBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
  },
  modalTotalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  modalTotalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  placeOrderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  placeOrderBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  upiQrContainer: {
    backgroundColor: '#F8FAF9',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: COLORS.primaryLight,
    alignItems: 'center',
  },
  upiQrHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 6,
  },
  upiBadgeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  upiBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  upiTimerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  upiTimerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
  },
  upiInstructionText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  qrCodeBox: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.sm,
  },
  qrImage: {
    width: 170,
    height: 170,
    borderRadius: 8,
  },
  qrAmountPill: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  qrAmountPillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  upiIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  upiIdLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  upiIdText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginRight: 6,
  },
  upiCopyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 6,
  },
  upiCopyText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  supportedAppsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    marginBottom: 10,
  },
  appBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  appBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  customerScannedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    width: '100%',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  customerScannedBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
});
