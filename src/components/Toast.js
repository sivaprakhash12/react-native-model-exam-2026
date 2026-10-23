import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS, SHADOWS } from '../theme/colors';

export const Toast = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  const getIcon = () => {
    switch (toastMessage.type) {
      case 'success':
        return 'checkmark-circle';
      case 'warning':
        return 'alert-circle';
      case 'danger':
        return 'close-circle';
      default:
        return 'information-circle';
    }
  };

  const getBgColor = () => {
    switch (toastMessage.type) {
      case 'success':
        return COLORS.primaryDark;
      case 'warning':
        return COLORS.accentOrange;
      case 'danger':
        return COLORS.accentRed;
      default:
        return '#1E293B';
    }
  };

  return (
    <View style={styles.container} pointerEvents="none">
      <View style={[styles.toastBox, { backgroundColor: getBgColor() }, SHADOWS.lg]}>
        <Ionicons name={getIcon()} size={20} color="#FFFFFF" style={styles.icon} />
        <Text style={styles.messageText}>{toastMessage.message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 55,
    left: 20,
    right: 20,
    zIndex: 9999,
    alignItems: 'center',
  },
  toastBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 25,
    maxWidth: '92%',
  },
  icon: {
    marginRight: 8,
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
