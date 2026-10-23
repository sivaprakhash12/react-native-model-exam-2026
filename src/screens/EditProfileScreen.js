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
import { COLORS, SHADOWS } from '../theme/colors';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
];

export default function EditProfileScreen({ navigation }) {
  const { user, updateProfile, showToast } = useApp();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [address, setAddress] = useState(user.address);
  const [city, setCity] = useState(user.city || 'Chennai');
  const [postalCode, setPostalCode] = useState(user.postalCode || '600001');
  const [avatar, setAvatar] = useState(user.avatar);

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};

    if (!name.trim()) {
      errs.name = 'Full Name is required';
    } else if (name.trim().length < 3) {
      errs.name = 'Name must be at least 3 characters';
    }

    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (phone.replace(/\D/g, '').length < 10) {
      errs.phone = 'Phone number must contain at least 10 digits';
    }

    if (!address.trim()) {
      errs.address = 'Delivery address is required';
    } else if (address.trim().length < 5) {
      errs.address = 'Please enter a complete address';
    }

    if (!city.trim()) {
      errs.city = 'City is required';
    }

    if (!postalCode.trim()) {
      errs.postalCode = 'Postal code is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      showToast('Please fix the validation errors below', 'warning');
      return;
    }

    updateProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      postalCode: postalCode.trim(),
      avatar,
    });

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
        {/* Avatar Selection Card */}
        <View style={[styles.card, SHADOWS.sm]}>
          <Text style={styles.cardSectionTitle}>Profile Photo</Text>
          <View style={styles.avatarRow}>
            {AVATAR_PRESETS.map((item, index) => {
              const isSelected = avatar === item;
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => setAvatar(item)}
                  style={[
                    styles.avatarChoice,
                    isSelected && styles.avatarChoiceSelected,
                  ]}
                >
                  <Image source={{ uri: item }} style={styles.avatarImg} />
                  {isSelected && (
                    <View style={styles.avatarCheck}>
                      <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Input Details Card with Validation */}
        <View style={[styles.card, SHADOWS.sm]}>
          <Text style={styles.cardSectionTitle}>Personal Information</Text>

          {/* Full Name */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <View style={[styles.inputBox, errors.name && styles.inputError]}>
              <Ionicons name="person-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={(val) => {
                  setName(val);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
                }}
                placeholder="Your Name"
                placeholderTextColor={COLORS.textMuted}
              />
            </View>
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          {/* Email */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email Address *</Text>
            <View style={[styles.inputBox, errors.email && styles.inputError]}>
              <Ionicons name="mail-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={(val) => {
                  setEmail(val);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                }}
                placeholder="name@example.com"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          {/* Phone */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <View style={[styles.inputBox, errors.phone && styles.inputError]}>
              <Ionicons name="call-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={(val) => {
                  setPhone(val);
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: null }));
                }}
                placeholder="+91 98765 43210"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="phone-pad"
              />
            </View>
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
          </View>
        </View>

        {/* Address Card */}
        <View style={[styles.card, SHADOWS.sm]}>
          <Text style={styles.cardSectionTitle}>Delivery Address</Text>

          {/* Street Address */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Street Address / Apartment *</Text>
            <View style={[styles.inputBox, errors.address && styles.inputError]}>
              <Ionicons name="home-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={(val) => {
                  setAddress(val);
                  if (errors.address) setErrors((prev) => ({ ...prev, address: null }));
                }}
                placeholder="42 Blossom Garden, Green Avenue"
                placeholderTextColor={COLORS.textMuted}
              />
            </View>
            {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
          </View>

          {/* City and Postal Code */}
          <View style={styles.rowInputs}>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>City *</Text>
              <View style={[styles.inputBox, errors.city && styles.inputError]}>
                <TextInput
                  style={styles.input}
                  value={city}
                  onChangeText={(val) => {
                    setCity(val);
                    if (errors.city) setErrors((prev) => ({ ...prev, city: null }));
                  }}
                  placeholder="Chennai"
                  placeholderTextColor={COLORS.textMuted}
                />
              </View>
              {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
            </View>

            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Postal Code *</Text>
              <View style={[styles.inputBox, errors.postalCode && styles.inputError]}>
                <TextInput
                  style={styles.input}
                  value={postalCode}
                  onChangeText={(val) => {
                    setPostalCode(val);
                    if (errors.postalCode) setErrors((prev) => ({ ...prev, postalCode: null }));
                  }}
                  placeholder="600001"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="numeric"
                />
              </View>
              {errors.postalCode && <Text style={styles.errorText}>{errors.postalCode}</Text>}
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
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
            <Text style={styles.saveBtnText}>Save Changes</Text>
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
  cardSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 14,
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 6,
  },
  avatarChoice: {
    position: 'relative',
    borderRadius: 35,
    padding: 3,
  },
  avatarChoiceSelected: {
    borderWidth: 2.5,
    borderColor: COLORS.primary,
  },
  avatarImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarCheck: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
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
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  inputError: {
    borderColor: COLORS.accentRed,
    backgroundColor: '#FEF2F2',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  errorText: {
    fontSize: 11,
    color: COLORS.accentRed,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: '500',
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
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
    backgroundColor: COLORS.primary,
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
