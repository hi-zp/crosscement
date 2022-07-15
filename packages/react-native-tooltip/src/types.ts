import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle, ViewProps } from 'react-native';
import { IPlacement } from '@crosscement/react-native-utils';

export interface ITooltipProps extends ViewProps {
  visible?: boolean;
  children: ReactNode;
  animationDuration?: number;
  useNativeDriver?: boolean;
  trigger?: 'press' | 'appear' | 'context';
  content: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  placement?: IPlacement;
  mainOffset?: number;
  crossOffset?: number;
  onShow?: () => void;
  onDismiss?: () => void;
  hasOverlay?: boolean;
  overlayPointerEvents?: 'auto' | 'none';
  overlayBackgroundColor?: string;
  overlayOpacity?: number;
  hasPolygon?: boolean;
  arrowSize?: number;
  arrowColor?: string;
  arrowOffset?: number;
}
