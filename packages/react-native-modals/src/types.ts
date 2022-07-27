import type { Animation } from './animations';

export type IDragEvent = {
  axis: {
    x: number;
    y: number;
  };
  layout: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  swipeDirection: string | null;
};

export interface IModalProps {
  visible?: boolean;
  children?: any;
  width?: number;
  height?: number;
  hasOverlay?: boolean;
  overlayPointerEvents?: 'auto' | 'none';
  overlayBackgroundColor?: string;
  overlayOpacity?: number;
  overlayClosable?: boolean;
  modalAnimation?: Animation;
  modalStyle?: any;
  style?: any;
  animationDuration?: number;
  onHardwareBackPress?: () => boolean;
  onShow?: () => void;
  onDismiss?: () => void;
  // onMove?: (event: DragEvent) => void;
  // onSwiping?: (event: DragEvent) => void;
  // onSwipeRelease?: (event: DragEvent) => void;
  // onSwipingOut?: (event: DragEvent) => void;
  // onSwipeOut?: (event: DragEvent) => void;
  // swipeDirection?: IDirection | Array<IDirection>;
  // swipeThreshold?: number;
}
