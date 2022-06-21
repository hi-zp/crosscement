import { ViewProps } from 'react-native';
import { DIRECTIONS } from './constans';

export type IDirection = typeof DIRECTIONS[keyof typeof DIRECTIONS];

export type IPanResult = {
  directions: { x?: 'left' | 'right'; y?: 'up' | 'down' };
  amounts: { x?: number; y?: number };
};

export interface IPanListenerViewProps extends ViewProps {
  directions?: Array<IDirection>;
  panSensitivity?: number;
  swipeVelocitySensitivity?: number;
  onDrag?: (result: {
    directions: IPanResult['directions'];
    deltas: IPanResult['amounts'];
  }) => void;
  onSwipe?: (result: {
    directions: IPanResult['directions'];
    velocities: IPanResult['amounts'];
  }) => void;
  onPanStart?: () => void;
  onPanRelease?: () => void;
  onPanTerminated?: () => void;
}
