import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle, ViewProps } from 'react-native';

export interface IDropdownProps extends ViewProps {
  visible?: boolean;
  children: ReactNode;
  animationDuration?: number;
  useNativeDriver?: boolean;
  expand: ReactNode;
  expandHeight?: number;
  expandStyle?: StyleProp<ViewStyle>;
  constraintWith?: boolean;
  onShow?: () => void;
  onDismiss?: () => void;
  hasOverlay?: boolean;
  overlayPointerEvents?: 'auto' | 'none';
  overlayBackgroundColor?: string;
  overlayOpacity?: number;
}
