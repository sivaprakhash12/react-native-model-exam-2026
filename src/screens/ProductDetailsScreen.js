import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS, SHADOWS } from '../theme/colors';

const { width } = Dimensions.get('window');

export default function ProductDetailsScreen({ route, navigation }) {
  const { product } = route.params;
  const { addToCart, toggleFavorite, isFavorite } = useApp();

  const [quantity, setQuantity] = useState(1);
  const weights = product.availableWeights || [product.weight, '1kg', '2kg'];
  const [selectedWeight, setSelectedWeight] = useState(weights[0] || product.weight);

  const isFav = isFavorite(product.id);

  // Weight price multiplier factor
  const getWeightMultiplier = (w) => {
    if (w.includes('250g') || w.includes('1 pc') || w.includes('3 pcs')) return 0.6;
    if (w.includes('500g') || w.includes('4 pcs') || w.includes('1 Liter') || w.includes('12 Pack')) return 1.0;
    if (w.includes('1kg') || w.includes('6 pcs') || w.includes('2 Liters') || w.includes('24 Pack')) return 1.8;
    if (w.includes('2kg')) return 3.4;
    return 1.0;
  };

  const unitPrice = product.price * getWeightMultiplier(selectedWeight);
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(
      {
        ...product,
        price: unitPrice,
      },
      quantity,
      selectedWeight
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Top Hero Image Header with Navigation Buttons */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: product.image }} style={styles.heroImage} resizeMode="cover" />

            {/* Back Button */}
            <TouchableOpacity
              style={[styles.headerFloatingBtn, styles.backBtn, SHADOWS.sm]}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
            </TouchableOpacity>

            {/* Favorite Button */}
            <TouchableOpacity
              style={[styles.headerFloatingBtn, styles.favBtn, SHADOWS.sm]}
              onPress={() => toggleFavorite(product.id)}
            >
              <Ionicons
                name={isFav ? 'heart' : 'heart-outline'}
                size={22}
                color={isFav ? COLORS.accentRed : COLORS.textPrimary}
              />
            </TouchableOpacity>
          </View>

          {/* Details Body Sheet */}
          <View style={styles.detailsSheet}>
            {/* Badges Row */}
            <View style={styles.badgesRow}>
              {product.isOrganic && (
                <View style={styles.organicTag}>
                  <Ionicons name="leaf" size={12} color="#15803D" />
                  <Text style={styles.organicTagText}>100% ORGANIC</Text>
                </View>
              )}
              <View style={styles.categoryTag}>
                <Text style={styles.categoryTagText}>{product.category.toUpperCase()}</Text>
              </View>
              <View style={styles.inStockTag}>
                <Text style={styles.inStockTagText}>IN STOCK ({product.stock || 25})</Text>
              </View>
            </View>

            {/* Product Name */}
            <Text style={styles.productTitle}>{product.name}</Text>

            {/* Rating and Review Stats */}
            <View style={styles.ratingSection}>
              <View style={styles.stars}>
                <Ionicons name="star" size={16} color={COLORS.accent} />
                <Text style={styles.ratingNumber}>{product.rating}</Text>
              </View>
              <Text style={styles.reviewCount}>({product.reviewsCount} customer reviews)</Text>
              <Text style={styles.dotSeparator}>•</Text>
              <Text style={styles.originText}>{product.origin || 'Local Farm'}</Text>
            </View>

            {/* Price Row */}
            <View style={styles.priceRow}>
              <View style={styles.priceCol}>
                <Text style={styles.priceLabel}>Price</Text>
                <View style={styles.priceNumberRow}>
                  <Text style={styles.currentPrice}>₹{unitPrice.toFixed(2)}</Text>
                  {product.originalPrice && (
                    <Text style={styles.originalPrice}>
                      ₹{(product.originalPrice * getWeightMultiplier(selectedWeight)).toFixed(2)}
                    </Text>
                  )}
                </View>
              </View>

              {/* Quantity Selector (- 1 +) */}
              <View style={styles.quantityControl}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Ionicons name="remove" size={18} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.qtyNumber}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => setQuantity((q) => q + 1)}
                >
                  <Ionicons name="add" size={18} color={COLORS.textPrimary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Weight / Pack Selector */}
            <View style={styles.sectionDivider} />
            <Text style={styles.sectionHeading}>Select Pack / Weight</Text>
            <View style={styles.weightsRow}>
              {weights.map((w, index) => {
                const isSelected = selectedWeight === w;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.weightPill, isSelected && styles.weightPillSelected]}
                    onPress={() => setSelectedWeight(w)}
                  >
                    <Text style={[styles.weightPillText, isSelected && styles.weightPillTextSelected]}>
                      {w}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Description */}
            <View style={styles.sectionDivider} />
            <Text style={styles.sectionHeading}>Description</Text>
            <Text style={styles.descriptionText}>{product.description}</Text>

            {/* Nutritional Value Card */}
            {product.nutrition && (
              <View style={styles.nutritionBox}>
                <Text style={styles.nutritionTitle}>Nutritional Value (per 100g)</Text>
                <View style={styles.nutritionGrid}>
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionValue}>{product.nutrition.calories}</Text>
                    <Text style={styles.nutritionKey}>Calories</Text>
                  </View>
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionValue}>{product.nutrition.carbs}</Text>
                    <Text style={styles.nutritionKey}>Carbs</Text>
                  </View>
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionValue}>{product.nutrition.protein}</Text>
                    <Text style={styles.nutritionKey}>Protein</Text>
                  </View>
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionValue}>{product.nutrition.fiber}</Text>
                    <Text style={styles.nutritionKey}>Fiber</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Sticky Bottom Add to Cart CTA Bar */}
        <View style={[styles.bottomBar, SHADOWS.lg]}>
          <View style={styles.totalSummary}>
            <Text style={styles.totalLabel}>Total Price</Text>
            <Text style={styles.totalValue}>₹{totalPrice.toFixed(2)}</Text>
          </View>

          <TouchableOpacity
            style={[styles.addToCartCta, SHADOWS.md]}
            onPress={handleAddToCart}
            activeOpacity={0.85}
          >
            <Ionicons name="cart" size={20} color="#FFFFFF" />
            <Text style={styles.addToCartCtaText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  imageContainer: {
    width: width,
    height: 320,
    backgroundColor: '#F1F5F9',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  headerFloatingBtn: {
    position: 'absolute',
    top: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  backBtn: {
    left: 20,
  },
  favBtn: {
    right: 20,
  },
  detailsSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -25,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  organicTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  organicTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
  },
  categoryTag: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  inStockTag: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  inStockTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0369A1',
  },
  productTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    lineHeight: 28,
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  stars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  reviewCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  dotSeparator: {
    color: COLORS.textMuted,
  },
  originText: {
    fontSize: 12,
    color: COLORS.primaryDark,
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    backgroundColor: '#F8FAF9',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  priceCol: {
    justifyContent: 'center',
  },
  priceLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  priceNumberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 2,
  },
  currentPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  originalPrice: {
    fontSize: 14,
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 4,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    paddingHorizontal: 16,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 18,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  weightsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  weightPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: '#FFFFFF',
  },
  weightPillSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  weightPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  weightPillTextSelected: {
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.textSecondary,
  },
  nutritionBox: {
    backgroundColor: '#F8FAF9',
    borderRadius: 16,
    padding: 14,
    marginTop: 18,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  nutritionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  nutritionKey: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  totalSummary: {
    justifyContent: 'center',
  },
  totalLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  addToCartCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
  },
  addToCartCtaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
