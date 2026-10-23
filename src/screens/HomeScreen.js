import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import { COLORS, SHADOWS } from '../theme/colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export default function HomeScreen({ navigation }) {
  const {
    user,
    products,
    deleteProduct,
    addToCart,
    favorites,
    toggleFavorite,
    isFavorite,
    totalCartCount,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    switchRole,
  } = useApp();

  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'price-low' | 'price-high' | 'rating'

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory =
          selectedCategory === 'all' || p.category === selectedCategory;
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // default order
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  const isAdmin = user.role === 'admin';

  // Render Product Card
  const renderProductItem = ({ item }) => {
    const isFav = isFavorite(item.id);

    return (
      <View style={[styles.productCard, SHADOWS.sm]}>
        {/* Top Badges & Favorite Heart */}
        <View style={styles.cardHeader}>
          {item.isOrganic ? (
            <View style={styles.organicBadge}>
              <Text style={styles.organicText}>ORGANIC</Text>
            </View>
          ) : (
            <View style={{ width: 10 }} />
          )}

          <TouchableOpacity
            style={styles.favoriteBtn}
            onPress={() => toggleFavorite(item.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isFav ? 'heart' : 'heart-outline'}
              size={18}
              color={isFav ? COLORS.accentRed : COLORS.textMuted}
            />
          </TouchableOpacity>
        </View>

        {/* Product Image - Tap to view Details */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate('ProductDetails', { product: item })}
          style={styles.imageContainer}
        >
          <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="cover" />
        </TouchableOpacity>

        {/* Product Details */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate('ProductDetails', { product: item })}
        >
          <Text style={styles.productWeight}>{item.weight}</Text>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color={COLORS.accent} />
            <Text style={styles.ratingText}>{item.rating}</Text>
            <Text style={styles.reviewText}>({item.reviewsCount})</Text>
          </View>
        </TouchableOpacity>

        {/* Price & Add to Cart Action */}
        <View style={styles.cardFooter}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>₹{item.price.toFixed(2)}</Text>
            {item.originalPrice && (
              <Text style={styles.originalPriceText}>
                ₹{item.originalPrice.toFixed(2)}
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={[styles.addBtn, SHADOWS.sm]}
            onPress={() => addToCart(item, 1)}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Admin Quick Action Controls */}
        {isAdmin && (
          <View style={styles.adminControlsRow}>
            <TouchableOpacity
              style={styles.adminEditBtn}
              onPress={() =>
                navigation.navigate('AdminAddEditProduct', { product: item, isEdit: true })
              }
            >
              <Ionicons name="create-outline" size={14} color="#7C3AED" />
              <Text style={styles.adminControlText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.adminDeleteBtn}
              onPress={() => deleteProduct(item.id)}
            >
              <Ionicons name="trash-outline" size={14} color={COLORS.accentRed} />
              <Text style={[styles.adminControlText, { color: COLORS.accentRed }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Main Top App Bar */}
      <View style={styles.topHeader}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.openDrawer()}
          >
            <Ionicons name="menu-outline" size={26} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <View style={styles.userGreeting}>
            <Text style={styles.greetingText}>Hello, {user.name.split(' ')[0]} 👋</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-sharp" size={12} color={COLORS.primary} />
              <Text style={styles.locationText} numberOfLines={1}>
                {user.city || 'Chennai'}, India
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.headerRight}>
          {/* Quick Role Switcher Pill */}
          <TouchableOpacity
            style={[
              styles.roleBadgeBtn,
              isAdmin ? styles.roleBadgeAdmin : styles.roleBadgeCustomer,
            ]}
            onPress={() => switchRole(isAdmin ? 'customer' : 'admin')}
          >
            <Text
              style={[
                styles.roleBadgeText,
                isAdmin ? styles.roleBadgeTextAdmin : styles.roleBadgeTextCustomer,
              ]}
            >
              {isAdmin ? '🛡️ Admin' : '👤 Customer'}
            </Text>
          </TouchableOpacity>

          {/* Cart Icon with badge */}
          <TouchableOpacity
            style={styles.cartIconBtn}
            onPress={() => navigation.navigate('CartTab')}
          >
            <Ionicons name="cart-outline" size={24} color={COLORS.textPrimary} />
            {totalCartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{totalCartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Admin Quick Action Banner if in Admin mode */}
      {isAdmin && (
        <View style={styles.adminBanner}>
          <View style={styles.adminBannerInfo}>
            <Ionicons name="settings-outline" size={18} color="#7C3AED" />
            <Text style={styles.adminBannerText}>Admin Management Active</Text>
          </View>
          <TouchableOpacity
            style={styles.addNewProductBtn}
            onPress={() =>
              navigation.navigate('AdminAddEditProduct', { isEdit: false })
            }
          >
            <Ionicons name="add-circle" size={16} color="#FFFFFF" />
            <Text style={styles.addNewProductText}>Add Product</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* FlatList for optimal performance */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderProductItem}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Search Input Bar */}
            <View style={styles.searchSection}>
              <View style={[styles.searchBar, SHADOWS.sm]}>
                <Ionicons name="search-outline" size={20} color={COLORS.textMuted} style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search fresh grocery, fruits, milk..."
                  placeholderTextColor={COLORS.textMuted}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Figma-Style Promo Hero Banner */}
            <View style={[styles.heroBanner, SHADOWS.md]}>
              <View style={styles.heroContent}>
                <View style={styles.dealTag}>
                  <Text style={styles.dealTagText}>SPECIAL OFFER</Text>
                </View>
                <Text style={styles.heroTitle}>20% OFF Daily Groceries</Text>
                <Text style={styles.heroDesc}>Use code FRESH20 at checkout</Text>
                <TouchableOpacity
                  style={styles.heroBtn}
                  onPress={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.heroBtnText}>Shop Now</Text>
                  <Ionicons name="arrow-forward" size={14} color={COLORS.primaryDark} />
                </TouchableOpacity>
              </View>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400&q=80',
                }}
                style={styles.heroImage}
                resizeMode="cover"
              />
            </View>

            {/* Categories Header */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <TouchableOpacity onPress={() => setSelectedCategory('all')}>
                <Text style={styles.seeAllText}>Reset</Text>
              </TouchableOpacity>
            </View>

            {/* Categories Scroll */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesScroll}
            >
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryPill,
                      isActive && styles.categoryPillActive,
                      SHADOWS.sm,
                    ]}
                    onPress={() => setSelectedCategory(cat.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                    <Text
                      style={[
                        styles.categoryName,
                        isActive && styles.categoryNameActive,
                      ]}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Products Section Header with Sort Options */}
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Daily Fresh Grocery</Text>
                <Text style={styles.sectionSubtitle}>
                  {filteredProducts.length} items available
                </Text>
              </View>

              {/* Sort pills */}
              <View style={styles.sortRow}>
                <TouchableOpacity
                  style={[
                    styles.sortChip,
                    sortBy === 'popular' && styles.sortChipActive,
                  ]}
                  onPress={() => setSortBy('popular')}
                >
                  <Text
                    style={[
                      styles.sortChipText,
                      sortBy === 'popular' && styles.sortChipTextActive,
                    ]}
                  >
                    All
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.sortChip,
                    sortBy === 'price-low' && styles.sortChipActive,
                  ]}
                  onPress={() => setSortBy('price-low')}
                >
                  <Text
                    style={[
                      styles.sortChipText,
                      sortBy === 'price-low' && styles.sortChipTextActive,
                    ]}
                  >
                    Price ↑
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.sortChip,
                    sortBy === 'rating' && styles.sortChipActive,
                  ]}
                  onPress={() => setSortBy('rating')}
                >
                  <Text
                    style={[
                      styles.sortChipText,
                      sortBy === 'rating' && styles.sortChipTextActive,
                    ]}
                  >
                    ★ Top
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="basket-outline" size={60} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>No Grocery Items Found</Text>
            <Text style={styles.emptyDesc}>
              Try searching for something else or reset the category filter.
            </Text>
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
            >
              <Text style={styles.resetBtnText}>Clear Filters</Text>
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
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userGreeting: {
    justifyContent: 'center',
  },
  greetingText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    maxWidth: 140,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  roleBadgeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  roleBadgeCustomer: {
    backgroundColor: COLORS.customerBadgeBg,
    borderColor: COLORS.customerBadge,
  },
  roleBadgeAdmin: {
    backgroundColor: COLORS.adminBadgeBg,
    borderColor: COLORS.adminBadge,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  roleBadgeTextCustomer: {
    color: COLORS.customerBadge,
  },
  roleBadgeTextAdmin: {
    color: COLORS.adminBadge,
  },
  cartIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.accentRed,
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  adminBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD6FE',
  },
  adminBannerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  adminBannerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6D28D9',
  },
  addNewProductBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7C3AED',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
  },
  addNewProductText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  searchSection: {
    marginTop: 14,
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  heroBanner: {
    flexDirection: 'row',
    backgroundColor: '#064E3B',
    borderRadius: 20,
    overflow: 'hidden',
    height: 140,
    marginBottom: 18,
  },
  heroContent: {
    flex: 1.2,
    padding: 16,
    justifyContent: 'center',
  },
  dealTag: {
    backgroundColor: '#10B981',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  dealTagText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroDesc: {
    fontSize: 11,
    color: '#A7F3D0',
    marginBottom: 8,
  },
  heroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
  },
  heroBtnText: {
    color: COLORS.primaryDark,
    fontSize: 11,
    fontWeight: '700',
  },
  heroImage: {
    flex: 0.8,
    height: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  categoriesScroll: {
    paddingVertical: 4,
    gap: 8,
    marginBottom: 16,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 14,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  categoryPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryEmoji: {
    fontSize: 16,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  categoryNameActive: {
    color: '#FFFFFF',
  },
  sortRow: {
    flexDirection: 'row',
    gap: 6,
  },
  sortChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
  },
  sortChipActive: {
    backgroundColor: COLORS.primaryLight,
  },
  sortChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  sortChipTextActive: {
    color: COLORS.primaryDark,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  productCard: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  organicBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  organicText: {
    color: '#15803D',
    fontSize: 9,
    fontWeight: '800',
  },
  favoriteBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 110,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
    marginBottom: 8,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productWeight: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  productName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 2,
    minHeight: 34,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 3,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  reviewText: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  originalPriceText: {
    fontSize: 11,
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
  },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    gap: 4,
  },
  adminEditBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#EDE9FE',
    gap: 4,
  },
  adminDeleteBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#FEE2E2',
    gap: 4,
  },
  adminControlText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6D28D9',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 12,
  },
  emptyDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 20,
  },
  resetBtn: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 10,
  },
  resetBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
