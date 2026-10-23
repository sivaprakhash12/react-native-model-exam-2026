import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AdminInventoryScreen from '../screens/AdminInventoryScreen';
import { useApp } from '../context/AppContext';
import { COLORS, SHADOWS } from '../theme/colors';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const { totalCartCount, favorites, user } = useApp();
  const isAdmin = user.role === 'admin';

  return (
    <Tab.Navigator
      initialRouteName="ShopTab"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: COLORS.borderLight,
          height: Platform.OS === 'ios' ? 86 : 64,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
          ...SHADOWS.md,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'ShopTab') {
            iconName = focused ? 'storefront' : 'storefront-outline';
          } else if (route.name === 'FavoritesTab') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'CartTab') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'AdminTab') {
            iconName = focused ? 'cube' : 'cube-outline';
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="ShopTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Grocery',
        }}
      />

      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Favorites',
          tabBarBadge: favorites.length > 0 ? favorites.length : undefined,
          tabBarBadgeStyle: {
            backgroundColor: COLORS.accentRed,
            fontSize: 10,
            fontWeight: '700',
          },
        }}
      />

      <Tab.Screen
        name="CartTab"
        component={CartScreen}
        options={{
          tabBarLabel: 'My Cart',
          tabBarBadge: totalCartCount > 0 ? totalCartCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: COLORS.primaryDark,
            fontSize: 10,
            fontWeight: '700',
          },
        }}
      />

      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />

      <Tab.Screen
        name="AdminTab"
        component={AdminInventoryScreen}
        options={{
          tabBarLabel: 'Admin',
          tabBarActiveTintColor: '#7C3AED',
        }}
      />
    </Tab.Navigator>
  );
}
