import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS, SHADOWS } from '../theme/colors';

export default function AdminInventoryScreen({ navigation }) {
  const { products, deleteProduct, switchRole, showToast } = useApp();

  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'lowStock' | 'sortedStock'

  const totalProducts = products.length;
  const lowStockCount = products.filter((p) => (p.stock || 0) < 15).length;
  const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0);

  // Filtered/Sorted Products based on KPI click
  const displayedProducts = useMemo(() => {
    if (filterMode === 'lowStock') {
      return products.filter((p) => (p.stock || 0) < 15);
    }
    if (filterMode === 'sortedStock') {
      return [...products].sort((a, b) => (b.stock || 0) - (a.stock || 0));
    }
    return products;
  }, [products, filterMode]);

  const handleCardClick = (mode) => {
    if (mode === filterMode && mode !== 'all') {
      setFilterMode('all');
      showToast('Showing all products', 'info');
    } else {
      setFilterMode(mode);
      if (mode === 'lowStock') {
        showToast(`Filtered: ${lowStockCount} Low Stock products shown`, 'warning');
      } else if (mode === 'sortedStock') {
        showToast('Sorted by highest stock units', 'success');
      } else {
        showToast('Showing all products catalog', 'info');
      }
    }
  };

  const renderProductRow = ({ item }) => {
    const isLowStock = (item.stock || 0) < 15;

    return (
      <View style={[styles.productRow, SHADOWS.sm]}>
        <Image source={{ uri: item.image }} style={styles.thumbnail} />

        <View style={styles.itemMeta}>
          <View style={styles.topInfo}>
            <Text style={styles.categoryBadge}>{item.category.toUpperCase()}</Text>
            <View
              style={[
                styles.stockPill,
                isLowStock ? styles.stockPillLow : styles.stockPillOk,
              ]}
            >
              <Text
                style={[
                  styles.stockPillText,
                  isLowStock ? styles.stockPillTextLow : styles.stockPillTextOk,
                ]}
              >
                {item.stock} in stock
              </Text>
            </View>
          </View>

          <Text style={styles.itemName} numberOfLines={1}>
            {item.name}
          </Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{item.price.toFixed(2)}</Text>
            <Text style={styles.weight}>{item.weight}</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() =>
              navigation.navigate('AdminAddEditProduct', { product: item, isEdit: true })
            }
          >
            <Ionicons name="pencil" size={16} color="#7C3AED" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => deleteProduct(item.id)}
          >
            <Ionicons name="trash" size={16} color={COLORS.accentRed} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Admin Stat KPI Cards - Now Interactive on Click! */}
      <View style={styles.kpiContainer}>
        <TouchableOpacity
          style={[
            styles.kpiCard,
            filterMode === 'all' && styles.kpiCardActiveAll,
            SHADOWS.sm,
          ]}
          onPress={() => handleCardClick('all')}
          activeOpacity={0.8}
        >
          <Text style={styles.kpiNumber}>{totalProducts}</Text>
          <Text style={styles.kpiLabel}>Total Items</Text>
          {filterMode === 'all' && <View style={styles.activeDot} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.kpiCard,
            filterMode === 'lowStock' && styles.kpiCardActiveLow,
            SHADOWS.sm,
          ]}
          onPress={() => handleCardClick('lowStock')}
          activeOpacity={0.8}
        >
          <Text style={[styles.kpiNumber, { color: COLORS.accentOrange }]}>
            {lowStockCount}
          </Text>
          <Text style={styles.kpiLabel}>Low Stock</Text>
          {filterMode === 'lowStock' && (
            <View style={[styles.activeDot, { backgroundColor: COLORS.accentOrange }]} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.kpiCard,
            filterMode === 'sortedStock' && styles.kpiCardActiveStock,
            SHADOWS.sm,
          ]}
          onPress={() => handleCardClick('sortedStock')}
          activeOpacity={0.8}
        >
          <Text style={[styles.kpiNumber, { color: COLORS.primaryDark }]}>
            {totalStock}
          </Text>
          <Text style={styles.kpiLabel}>Units Stocked</Text>
          {filterMode === 'sortedStock' && (
            <View style={[styles.activeDot, { backgroundColor: COLORS.primaryDark }]} />
          )}
        </TouchableOpacity>
      </View>

      {/* Header bar */}
      <View style={styles.listHeaderBar}>
        <View>
          <Text style={styles.listHeaderTitle}>
            {filterMode === 'lowStock'
              ? '⚠️ Low Stock Items'
              : filterMode === 'sortedStock'
              ? '📊 Sorted by Stock Units'
              : 'Inventory Catalog'}
          </Text>
          <Text style={styles.listHeaderSubtitle}>
            {filterMode === 'lowStock'
              ? `Showing ${displayedProducts.length} items needing restocking`
              : filterMode === 'sortedStock'
              ? 'Showing highest inventory stock first'
              : 'Live grocery stock & management'}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.addBtn, SHADOWS.sm]}
          onPress={() =>
            navigation.navigate('AdminAddEditProduct', { isEdit: false })
          }
        >
          <Ionicons name="add" size={18} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Add Product</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={displayedProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderProductRow}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  kpiContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
  },
  kpiCardActiveAll: {
    borderColor: '#7C3AED',
    backgroundColor: '#F5F3FF',
  },
  kpiCardActiveLow: {
    borderColor: COLORS.accentOrange,
    backgroundColor: '#FFFBEB',
  },
  kpiCardActiveStock: {
    borderColor: COLORS.primaryDark,
    backgroundColor: '#ECFDF5',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7C3AED',
    marginTop: 4,
  },
  kpiNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#7C3AED',
  },
  kpiLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  listHeaderBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  listHeaderTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  listHeaderSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7C3AED',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  itemMeta: {
    flex: 1,
    marginLeft: 12,
  },
  topInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: '#7C3AED',
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  stockPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  stockPillOk: {
    backgroundColor: '#DCFCE7',
  },
  stockPillLow: {
    backgroundColor: '#FEE2E2',
  },
  stockPillText: {
    fontSize: 9,
    fontWeight: '800',
  },
  stockPillTextOk: {
    color: '#15803D',
  },
  stockPillTextLow: {
    color: COLORS.accentRed,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 3,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  price: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  weight: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 6,
    marginLeft: 8,
  },
  editBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
