import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import { COLORS, SHADOWS } from '../theme/colors';

const IMAGE_PRESETS = [
  {
    name: 'Berries',
    url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Avocado',
    url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Apples',
    url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Tomatoes',
    url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Bakery',
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
  },
];

export default function AdminAddEditProductScreen({ route, navigation }) {
  const { isEdit, product } = route.params || {};
  const { addProduct, updateProduct, showToast } = useApp();

  const [name, setName] = useState(isEdit ? product.name : '');
  const [category, setCategory] = useState(isEdit ? product.category : 'fruits');
  const [price, setPrice] = useState(isEdit ? product.price.toString() : '2.99');
  const [originalPrice, setOriginalPrice] = useState(
    isEdit && product.originalPrice ? product.originalPrice.toString() : '3.99'
  );
  const [weight, setWeight] = useState(isEdit ? product.weight : '1kg');
  const [stock, setStock] = useState(isEdit ? (product.stock || 20).toString() : '30');
  const [description, setDescription] = useState(
    isEdit ? product.description : 'Fresh, premium quality organic produce harvested daily from local farms.'
  );
  const [image, setImage] = useState(
    isEdit
      ? product.image
      : 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80' // Default Apple image
  );
  const [isOrganic, setIsOrganic] = useState(isEdit ? product.isOrganic : true);

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};

    if (!name.trim()) {
      errs.name = 'Please enter product name (e.g. Apple)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      showToast('Please enter product name', 'warning');
      return;
    }

    const finalPrice = price && !isNaN(parseFloat(price)) && parseFloat(price) > 0
      ? parseFloat(price)
      : 2.99;

    const finalOriginalPrice = originalPrice && !isNaN(parseFloat(originalPrice))
      ? parseFloat(originalPrice)
      : finalPrice * 1.25;

    const finalDescription = description.trim()
      ? description.trim()
      : `Fresh and juicy handpicked ${name.trim()} from organic farms. Packed with essential nutrients.`;

    // Smart image auto-match if name has apple / berry / avocado / tomato
    let finalImage = image;
    const lowerName = name.toLowerCase();
    if (lowerName.includes('apple')) {
      finalImage = 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80';
    } else if (lowerName.includes('berry') || lowerName.includes('strawberr')) {
      finalImage = 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80';
    } else if (lowerName.includes('avocado')) {
      finalImage = 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80';
    } else if (lowerName.includes('tomato')) {
      finalImage = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80';
    }

    const payload = {
      name: name.trim(),
      category: lowerName.includes('apple') ? 'fruits' : category,
      price: finalPrice,
      originalPrice: finalOriginalPrice,
      weight: weight.trim() || '1kg',
      stock: parseInt(stock) || 25,
      description: finalDescription,
      image: finalImage,
      isOrganic,
    };

    if (isEdit) {
      updateProduct(product.id, payload);
    } else {
      addProduct(payload);
    }

    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Image Preview & Presets */}
        <View style={[styles.card, SHADOWS.sm]}>
          <Text style={styles.cardTitle}>Product Photo</Text>
          <View style={styles.previewBox}>
            <Image source={{ uri: image }} style={styles.previewImage} resizeMode="cover" />
          </View>
          <Text style={styles.subtext}>Select a preset image:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetRow}>
            {IMAGE_PRESETS.map((p, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.presetChip, image === p.url && styles.presetChipActive]}
                onPress={() => setImage(p.url)}
              >
                <Text
                  style={[
                    styles.presetChipText,
                    image === p.url && styles.presetChipTextActive,
                  ]}
                >
                  {p.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Product Details Form */}
        <View style={[styles.card, SHADOWS.sm]}>
          <Text style={styles.cardTitle}>
            {isEdit ? 'Edit Grocery Item' : 'New Product Details'}
          </Text>

          {/* Name */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Product Name *</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={name}
              onChangeText={(val) => {
                setName(val);
                if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
              }}
              placeholder="e.g. Organic Strawberries"
              placeholderTextColor={COLORS.textMuted}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          {/* Category Chips */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoriesWrap}>
              {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={[
                    styles.catChip,
                    category === c.id && styles.catChipSelected,
                  ]}
                  onPress={() => setCategory(c.id)}
                >
                  <Text style={styles.catEmoji}>{c.emoji}</Text>
                  <Text
                    style={[
                      styles.catText,
                      category === c.id && styles.catTextSelected,
                    ]}
                  >
                    {c.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Price & Original Price */}
          <View style={styles.row}>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Price (₹) *</Text>
              <TextInput
                style={[styles.input, errors.price && styles.inputError]}
                value={price}
                onChangeText={(val) => {
                  setPrice(val);
                  if (errors.price) setErrors((prev) => ({ ...prev, price: null }));
                }}
                placeholder="120.00"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="numeric"
              />
              {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
            </View>

            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Original Price (₹)</Text>
              <TextInput
                style={styles.input}
                value={originalPrice}
                onChangeText={setOriginalPrice}
                placeholder="150.00"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Weight & Stock */}
          <View style={styles.row}>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Weight / Unit *</Text>
              <TextInput
                style={[styles.input, errors.weight && styles.inputError]}
                value={weight}
                onChangeText={(val) => {
                  setWeight(val);
                  if (errors.weight) setErrors((prev) => ({ ...prev, weight: null }));
                }}
                placeholder="e.g. 500g / 1kg"
                placeholderTextColor={COLORS.textMuted}
              />
              {errors.weight && <Text style={styles.errorText}>{errors.weight}</Text>}
            </View>

            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Stock Quantity *</Text>
              <TextInput
                style={[styles.input, errors.stock && styles.inputError]}
                value={stock}
                onChangeText={(val) => {
                  setStock(val);
                  if (errors.stock) setErrors((prev) => ({ ...prev, stock: null }));
                }}
                placeholder="25"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="numeric"
              />
              {errors.stock && <Text style={styles.errorText}>{errors.stock}</Text>}
            </View>
          </View>

          {/* Organic Toggle */}
          <TouchableOpacity
            style={styles.organicToggleRow}
            onPress={() => setIsOrganic(!isOrganic)}
          >
            <Ionicons
              name={isOrganic ? 'checkbox' : 'square-outline'}
              size={22}
              color={COLORS.primary}
            />
            <Text style={styles.organicToggleLabel}>Certified 100% Organic Item</Text>
          </TouchableOpacity>

          {/* Description */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                errors.description && styles.inputError,
              ]}
              value={description}
              onChangeText={(val) => {
                setDescription(val);
                if (errors.description)
                  setErrors((prev) => ({ ...prev, description: null }));
              }}
              placeholder="Fresh organic farm harvested daily..."
              placeholderTextColor={COLORS.textMuted}
              multiline
              numberOfLines={4}
            />
            {errors.description && (
              <Text style={styles.errorText}>{errors.description}</Text>
            )}
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveBtn, SHADOWS.md]}
            onPress={handleSave}
            activeOpacity={0.85}
          >
            <Ionicons name="checkmark-sharp" size={18} color="#FFFFFF" />
            <Text style={styles.saveBtnText}>
              {isEdit ? 'Update Product' : 'Add to Inventory'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 14,
  },
  previewBox: {
    width: '100%',
    height: 140,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
    marginBottom: 10,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  subtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  presetRow: {
    flexDirection: 'row',
  },
  presetChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  presetChipActive: {
    backgroundColor: '#EDE9FE',
    borderColor: '#7C3AED',
  },
  presetChipText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  presetChipTextActive: {
    color: '#7C3AED',
    fontWeight: '700',
  },
  formGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  inputError: {
    borderColor: COLORS.accentRed,
    backgroundColor: '#FEF2F2',
  },
  textArea: {
    height: 90,
    paddingTop: 10,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 11,
    color: COLORS.accentRed,
    marginTop: 4,
    marginLeft: 4,
  },
  categoriesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F8FAF9',
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 4,
  },
  catChipSelected: {
    backgroundColor: '#EDE9FE',
    borderColor: '#7C3AED',
  },
  catEmoji: {
    fontSize: 14,
  },
  catText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  catTextSelected: {
    color: '#7C3AED',
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  organicToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 6,
  },
  organicToggleLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  saveBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7C3AED',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 6,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
