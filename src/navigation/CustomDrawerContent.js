import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS } from '../theme/colors';

export default function CustomDrawerContent(props) {
  const { user, switchRole, totalCartCount, favorites, showToast } = useApp();
  const { navigation } = props;

  const isAdmin = user.role === 'admin';

  const handleNav = (screenName, tabName = null) => {
    navigation.closeDrawer();
    if (tabName) {
      navigation.navigate('HomeTabs', { screen: tabName });
    } else {
      navigation.navigate(screenName);
    }
  };

  const handleLogout = () => {
    navigation.closeDrawer();
    showToast('Signed out successfully', 'info');
    navigation.replace('Auth');
  };

  return (
    <View style={styles.container}>
      {/* Header Profile Section */}
      <View style={styles.drawerHeader}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName} numberOfLines={1}>
            {user.name}
          </Text>
          <Text style={styles.userEmail} numberOfLines={1}>
            {user.email}
          </Text>
          <View
            style={[
              styles.roleBadge,
              isAdmin ? styles.roleBadgeAdmin : styles.roleBadgeCustomer,
            ]}
          >
            <Text
              style={[
                styles.roleBadgeText,
                isAdmin ? styles.roleBadgeTextAdmin : styles.roleBadgeTextCustomer,
              ]}
            >
              {isAdmin ? '🛡️ Admin Account' : '👤 Customer Account'}
            </Text>
          </View>
        </View>
      </View>

      {/* Role Switcher Pill */}
      <View style={styles.roleSwitcherBox}>
        <Text style={styles.roleSwitcherLabel}>Current Active Role:</Text>
        <TouchableOpacity
          style={styles.roleToggleBtn}
          onPress={() => switchRole(isAdmin ? 'customer' : 'admin')}
        >
          <Ionicons
            name="swap-horizontal"
            size={16}
            color={isAdmin ? '#7C3AED' : COLORS.primary}
          />
          <Text
            style={[
              styles.roleToggleText,
              { color: isAdmin ? '#7C3AED' : COLORS.primary },
            ]}
          >
            Switch to {isAdmin ? 'Customer' : 'Admin'} Mode
          </Text>
        </TouchableOpacity>
      </View>

      {/* Navigation Menu Items */}
      <ScrollView style={styles.menuScroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionHeader}>NAVIGATION MENU</Text>

        {/* 1. Daily Grocery Shop */}
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => handleNav('HomeTabs', 'ShopTab')}
        >
          <View style={styles.itemIconBox}>
            <Ionicons name="basket-outline" size={20} color={COLORS.primary} />
          </View>
          <Text style={styles.drawerItemText}>Daily Grocery Shop</Text>
        </TouchableOpacity>

        {/* 2. My Cart */}
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => handleNav('HomeTabs', 'CartTab')}
        >
          <View style={styles.itemIconBox}>
            <Ionicons name="cart-outline" size={20} color={COLORS.primary} />
          </View>
          <Text style={styles.drawerItemText}>My Shopping Cart</Text>
          {totalCartCount > 0 && (
            <View style={styles.counterBadge}>
              <Text style={styles.counterBadgeText}>{totalCartCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* 3. Favorites */}
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => handleNav('HomeTabs', 'FavoritesTab')}
        >
          <View style={styles.itemIconBox}>
            <Ionicons name="heart-outline" size={20} color={COLORS.accentRed} />
          </View>
          <Text style={styles.drawerItemText}>Favorite Products</Text>
          {favorites.length > 0 && (
            <View style={[styles.counterBadge, { backgroundColor: COLORS.accentRed }]}>
              <Text style={styles.counterBadgeText}>{favorites.length}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* 4. Customer Profile */}
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => handleNav('HomeTabs', 'ProfileTab')}
        >
          <View style={styles.itemIconBox}>
            <Ionicons name="person-outline" size={20} color={COLORS.textPrimary} />
          </View>
          <Text style={styles.drawerItemText}>Customer Profile</Text>
        </TouchableOpacity>

        {/* 5. Admin Inventory Management */}
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => handleNav('HomeTabs', 'AdminTab')}
        >
          <View style={[styles.itemIconBox, { backgroundColor: '#EDE9FE' }]}>
            <Ionicons name="cube-outline" size={20} color="#7C3AED" />
          </View>
          <Text style={[styles.drawerItemText, { color: '#6D28D9' }]}>
            Admin Inventory Panel
          </Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <Text style={styles.sectionHeader}>SUPPORT & ACCOUNT</Text>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            navigation.closeDrawer();
            navigation.navigate('EditProfile');
          }}
        >
          <View style={styles.itemIconBox}>
            <Ionicons name="settings-outline" size={20} color={COLORS.textSecondary} />
          </View>
          <Text style={styles.drawerItemText}>Edit Profile Settings</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Drawer Footer with Logout */}
      <View style={styles.drawerFooter}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.accentRed} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
        <Text style={styles.versionText}>FreshMart Grocery v1.0 • React Native 2026</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#F8FAF9',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: COLORS.primaryLight,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  userEmail: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 6,
  },
  roleBadgeCustomer: {
    backgroundColor: COLORS.customerBadgeBg,
  },
  roleBadgeAdmin: {
    backgroundColor: COLORS.adminBadgeBg,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  roleBadgeTextCustomer: {
    color: COLORS.customerBadge,
  },
  roleBadgeTextAdmin: {
    color: COLORS.adminBadge,
  },
  roleSwitcherBox: {
    backgroundColor: '#F1F5F9',
    margin: 16,
    padding: 12,
    borderRadius: 14,
  },
  roleSwitcherLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: 6,
  },
  roleToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 8,
  },
  roleToggleText: {
    fontSize: 13,
    fontWeight: '700',
  },
  menuScroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    marginVertical: 10,
    marginLeft: 6,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 4,
  },
  itemIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  drawerItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
  },
  counterBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  counterBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 12,
  },
  drawerFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    backgroundColor: '#F8FAF9',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.accentRed,
  },
  versionText: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
});
