import type { ReactNode, ComponentClass } from 'react';
import type {
  StyleProp,
  ViewStyle,
  FlatListProps,
  SectionListProps,
  ScrollViewProps,
  ViewProps,
} from 'react-native';
import type { placements } from './constants';

export type IPlacement = typeof placements[number];

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
  polygonSize?: number;
  polygonColor?: string;
}

export type IScrollableView<T> = ComponentClass<
  SectionListProps<T> | FlatListProps<T> | ScrollViewProps
>;

export type IBoundary = {
  left: number;
  top: number;
  right: number;
  bottom: number;
  coordinate: { x: number; y: number };
  width: number;
  height: number;
};
