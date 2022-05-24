import type { ReactNode, ComponentClass } from 'react';
import type {
  StyleProp,
  ViewStyle,
  FlatListProps,
  SectionListProps,
  ScrollViewProps,
  ViewProps,
} from 'react-native';
import { IPlacement } from '@crosscement/react-native-utils';

export type IRootElementType =
  | 'View'
  | 'Scollview'
  | 'FlatList'
  | 'SectionList';

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

export type IScrollableView<T> = ComponentClass<
  SectionListProps<T> | FlatListProps<T> | ScrollViewProps
>;
