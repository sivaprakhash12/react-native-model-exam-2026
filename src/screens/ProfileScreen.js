import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS, SHADOWS } from '../theme/colors';

export default function ProfileScreen({ navigation }) {
  const { user, switchRole, orders, showToast } = useApp();

  const handleSignOut = () => {
    showToast('Signed out successfully', 'info');
    navigation.replace('Auth');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header Card */}
      <View style={[styles.profileCard, SHADOWS.md]}>
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
          <TouchableOpacity
            style={styles.editAvatarBtn}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Ionicons name="camera" size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>

        <View style={styles.badgeRow}>
          <View style={styles.roleBadge}>
            <Ionicons name="shield-checkmark" size={12} color={COLORS.primaryDark} />
            <Text style={styles.roleBadgeText}>
              {user.role === 'admin' ? 'Store Administrator' : 'Verified Customer'}
            </Text>
          </View>
          <View style={styles.goldBadge}>
            <Ionicons name="sparkles" size={12} color="#D97706" />
            <Text style={styles.goldBadgeText}>{user.memberStatus || 'Gold Member'}</Text>
          </View>
        </View>

        {/* Edit Profile Button */}
        <TouchableOpacity
          style={[styles.editProfileBtn, SHADOWS.sm]}
          onPress={() => navigation.navigate('EditProfile')}
          activeOpacity={0.8}
        >
          <Ionicons name="create-outline" size={16} color="#FFFFFF" />
          <Text style={styles.editProfileBtnText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Quick Cards */}
      <View style={styles.statsRow}>
        <View style={[styles.statBox, SHADOWS.sm]}>
          <Text style={styles.statNumber}>₹{user.walletBalance.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Fresh Wallet</Text>
        </View>
        <View style={[styles.statBox, SHADOWS.sm]}>
          <Text style={styles.statNumber}>{orders.length}</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>
        <View style={[styles.statBox, SHADOWS.sm]}>
          <Text style={styles.statNumber}>250</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
      </View>

      {/* Contact & Address Information */}
      <View style={[styles.infoSection, SHADOWS.sm]}>
        <Text style={styles.sectionHeaderTitle}>Account Details</Text>

        <View style={styles.infoItem}>
          <View style={styles.infoIconBox}>
            <Ionicons name="call-outline" size={18} color={COLORS.primary} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Phone Number</Text>
            <Text style={styles.infoValue}>{user.phone}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoItem}>
          <View style={styles.infoIconBox}>
            <Ionicons name="location-outline" size={18} color={COLORS.primary} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Delivery Address</Text>
            <Text style={styles.infoValue}>
              {user.address}, {user.city} - {user.postalCode}
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Navigation Settings Options */}
      <View style={[styles.settingsMenu, SHADOWS.sm]}>
        <Text style={styles.sectionHeaderTitle}>Customer Preferences</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('FavoritesTab')}
        >
          <View style={styles.menuLeft}>
            <Ionicons name="heart-outline" size={20} color={COLORS.accentRed} />
            <Text style={styles.menuTitle}>My Favorite Products</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('CartTab')}
        >
          <View style={styles.menuLeft}>
            <Ionicons name="cart-outline" size={20} color={COLORS.primary} />
            <Text style={styles.menuTitle}>Shopping Cart & Checkout</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => switchRole(user.role === 'admin' ? 'customer' : 'admin')}
        >
          <View style={styles.menuLeft}>
            <Ionicons name="swap-horizontal-outline" size={20} color="#7C3AED" />
            <Text style={styles.menuTitle}>
              Switch to {user.role === 'admin' ? 'Customer Mode' : 'Admin Mode'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Sign Out Button */}
      <TouchableOpacity
        style={styles.signOutBtn}
        onPress={handleSignOut}
        activeOpacity={0.8}
      >
        <Ionicons name="log-out-outline" size={18} color={COLORS.accentRed} />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: COLORS.primaryLight,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  userEmail: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    marginBottom: 16,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  goldBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  goldBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 6,
  },
  editProfileBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: '600',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  sectionHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  infoIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 10,
  },
  settingsMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 6,
  },
  signOutText: {
    color: COLORS.accentRed,
    fontSize: 15,
    fontWeight: '700',
  },
});
