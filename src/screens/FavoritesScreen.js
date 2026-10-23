import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS, SHADOWS } from '../theme/colors';

export default function FavoritesScreen({ navigation }) {
  const {
    products,
    favorites,
    toggleFavorite,
    addToCart,
    addAllFavoritesToCart,
  } = useApp();

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  const renderFavoriteItem = ({ item }) => {
    return (
      <View style={[styles.card, SHADOWS.sm]}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('ProductDetails', { product: item })}
          style={styles.imageBox}
        >
          <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="cover" />
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <View style={styles.topRow}>
            <Text style={styles.categoryBadge}>{item.category.toUpperCase()}</Text>
            <TouchableOpacity
              onPress={() => toggleFavorite(item.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="heart" size={20} color={COLORS.accentRed} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('ProductDetails', { product: item })}
          >
            <Text style={styles.productName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.productWeight}>{item.weight}</Text>
          </TouchableOpacity>

          <View style={styles.bottomRow}>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>₹{item.price.toFixed(2)}</Text>
              {item.originalPrice && (
                <Text style={styles.originalPrice}>
                  ₹{item.originalPrice.toFixed(2)}
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={[styles.addToCartBtn, SHADOWS.sm]}
              onPress={() => addToCart(item, 1)}
              activeOpacity={0.8}
            >
              <Ionicons name="cart-outline" size={16} color="#FFFFFF" />
              <Text style={styles.addToCartText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Banner with Add All button */}
      {favoriteProducts.length > 0 && (
        <View style={styles.headerBar}>
          <View>
            <Text style={styles.headerTitle}>My Favorite Products</Text>
            <Text style={styles.headerSubtitle}>
              {favoriteProducts.length} items saved for later
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.addAllBtn, SHADOWS.sm]}
            onPress={addAllFavoritesToCart}
            activeOpacity={0.85}
          >
            <Ionicons name="cart" size={16} color="#FFFFFF" />
            <Text style={styles.addAllBtnText}>Add All to Cart</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={favoriteProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderFavoriteItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="heart-dislike-outline" size={48} color={COLORS.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>Your Wishlist is Empty</Text>
            <Text style={styles.emptySubtitle}>
              Explore fresh groceries and tap the heart icon to save your favorite products here!
            </Text>
            <TouchableOpacity
              style={[styles.exploreBtn, SHADOWS.sm]}
              onPress={() => navigation.navigate('ShopTab')}
            >
              <Text style={styles.exploreBtnText}>Browse Grocery Products</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  addAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  addAllBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  imageBox: {
    width: 90,
    height: 90,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  infoBox: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primaryDark,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  productWeight: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  originalPrice: {
    fontSize: 11,
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
  },
  addToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 4,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8,
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
