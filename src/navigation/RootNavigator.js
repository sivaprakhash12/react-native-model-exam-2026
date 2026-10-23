import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from '../screens/AuthScreen';
import DrawerNavigator from './DrawerNavigator';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import AdminAddEditProductScreen from '../screens/AdminAddEditProductScreen';
import OrderSuccessScreen from '../screens/OrderSuccessScreen';
import { COLORS } from '../theme/colors';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Auth"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
      }}
    >
      {/* 1. Auth / Welcome Screen with Sign Up & Sign In */}
      <Stack.Screen name="Auth" component={AuthScreen} />

      {/* 2. Main App with Drawer & Bottom Tabs */}
      <Stack.Screen name="MainDrawer" component={DrawerNavigator} />

      {/* 3. Product Details Screen (Stack Screen with animated slide) */}
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />

      {/* 4. Edit Profile Screen with validation */}
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          headerShown: true,
          title: 'Edit Profile',
          headerTintColor: COLORS.textPrimary,
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTitleStyle: { fontWeight: '800' },
          animation: 'slide_from_bottom',
        }}
      />

      {/* 5. Admin Add / Edit Product Modal */}
      <Stack.Screen
        name="AdminAddEditProduct"
        component={AdminAddEditProductScreen}
        options={({ route }) => ({
          headerShown: true,
          title: route.params?.isEdit ? 'Edit Product' : 'Add New Product',
          headerTintColor: '#6D28D9',
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTitleStyle: { fontWeight: '800' },
          presentation: 'modal',
        })}
      />

      {/* 6. Order Success Confirmation Screen */}
      <Stack.Screen
        name="OrderSuccess"
        component={OrderSuccessScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
}
