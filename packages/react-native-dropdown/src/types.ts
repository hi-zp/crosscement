import type { ReactNode, ComponentClass } from 'react';
import type {
  StyleProp,
  ViewStyle,
  FlatListProps,
  SectionListProps,
  ScrollViewProps,
  ViewProps,
} from 'react-native';

export type IRootElementType =
  | 'View'
  | 'Scollview'
  | 'FlatList'
  | 'SectionList';

export interface IDropdownProps extends ViewProps {
  visible?: boolean;
  children: ReactNode;
  animationDuration?: number;
  useNativeDriver?: boolean;
  expand: ReactNode;
  expandHeight?: number;
  expandStyle?: StyleProp<ViewStyle>;
  onShow?: () => void;
  onDismiss?: () => void;
  hasOverlay?: boolean;
  overlayPointerEvents?: 'auto' | 'none';
  overlayBackgroundColor?: string;
  overlayOpacity?: number;
}

export type IScrollableView<T> = ComponentClass<
  SectionListProps<T> | FlatListProps<T> | ScrollViewProps
>;
