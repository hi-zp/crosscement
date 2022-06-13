import type { ViewProps } from 'react-native';

export interface IBackdropProps {
  visible: boolean;
  opacity: number;
  onPress?: () => void;
  backgroundColor?: string;
  animationDuration?: number;
  pointerEvents?: ViewProps['pointerEvents'];
  useNativeDriver?: boolean;
}
