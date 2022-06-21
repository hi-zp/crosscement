import React from 'react';
import {
  Animated,
  GestureResponderEvent,
  LayoutChangeEvent,
  LayoutRectangle,
  PanResponder,
  PanResponderGestureState,
  PanResponderInstance,
} from 'react-native';
import { DIRECTIONS } from './constans';
import { IPanListenerViewProps as IProps, IPanResult } from './types';

type IResponder = (
  e: GestureResponderEvent,
  gestureState: PanResponderGestureState
) => void;

const defaultProps: Partial<IProps> = {
  directions: [
    DIRECTIONS.UP,
    DIRECTIONS.DOWN,
    DIRECTIONS.LEFT,
    DIRECTIONS.RIGHT,
  ],
  panSensitivity: 5,
  swipeVelocitySensitivity: 1.8,
};

export class PanListenerView extends React.PureComponent<IProps> {
  static defaultProps = defaultProps;

  panResponder: PanResponderInstance;
  layout?: LayoutRectangle;

  constructor(props: IProps) {
    super(props);
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: this.onMoveShouldSetPanResponder,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderGrant: this.onPanResponderGrant,
      onPanResponderMove: this.onPanResponderMove,
      onPanResponderRelease: this.onPanResponderRelease,
      onPanResponderTerminate: this.onPanResponderTerminate,
    });
  }

  onMoveShouldSetPanResponder = (
    _e: GestureResponderEvent,
    gestureState: PanResponderGestureState
  ): boolean => {
    const { dx, dy } = gestureState;
    const { directions, panSensitivity } = this.props as Required<IProps>;

    return (
      (directions.includes(DIRECTIONS.UP) && dy < -panSensitivity) ||
      (directions.includes(DIRECTIONS.DOWN) && dy > panSensitivity) ||
      (directions.includes(DIRECTIONS.LEFT) && dx < -panSensitivity) ||
      (directions.includes(DIRECTIONS.RIGHT) && dx > panSensitivity)
    );
  };

  onPanResponderGrant = () => {
    this.props.onPanStart?.();
  };

  onPanResponderMove: IResponder = (_e, gestureState) => {
    const { onSwipe, onDrag } = this.props;

    if (onSwipe) {
      const result = this.getSwipeDirection(gestureState);
      if (this.panResultHasValue(result)) {
        onSwipe?.({
          directions: result.directions,
          velocities: result.amounts,
        });
        return;
      }
    }

    if (onDrag) {
      const result = this.getDragDirection(gestureState);
      if (this.panResultHasValue(result)) {
        onDrag?.({
          directions: result.directions,
          deltas: result.amounts,
        });
      }
    }
  };

  panResultHasValue = (panResult?: IPanResult) => {
    return panResult && (panResult.directions.x || panResult.directions.y);
  };

  onPanResponderRelease: IResponder = () => {
    this.props.onPanRelease?.();
  };

  onPanResponderTerminate: IResponder = () => {
    this.props.onPanTerminated?.();
  };

  onLayout = (e: LayoutChangeEvent) => {
    this.layout = e.nativeEvent.layout;
  };

  getSwipeDirection = ({ vx, vy }: PanResponderGestureState) => {
    const { swipeVelocitySensitivity } = this.props as Required<IProps>;
    return this.getDirectionsOverSensitivity(vx, vy, swipeVelocitySensitivity);
  };

  getDragDirection = ({ dx, dy }: PanResponderGestureState) => {
    return this.getDirectionsOverSensitivity(dx, dy, 0);
  };

  getDirectionsOverSensitivity = (
    x: number,
    y: number,
    sensitivity: number
  ): IPanResult => {
    const { directions: directionsProp } = this.props as Required<IProps>;

    const directions: IPanResult['directions'] = {};
    const amounts: IPanResult['amounts'] = {};

    if (directionsProp.includes(DIRECTIONS.LEFT) && x < -sensitivity) {
      directions.x = DIRECTIONS.LEFT;
      amounts.x = x;
    } else if (directionsProp.includes(DIRECTIONS.RIGHT) && x > sensitivity) {
      directions.x = DIRECTIONS.RIGHT;
      amounts.x = x;
    }

    if (directionsProp.includes(DIRECTIONS.UP) && y < -sensitivity) {
      directions.y = DIRECTIONS.UP;
      amounts.y = y;
    } else if (directionsProp.includes(DIRECTIONS.DOWN) && y > sensitivity) {
      directions.y = DIRECTIONS.DOWN;
      amounts.y = y;
    }

    return { directions, amounts };
  };

  render(): React.ReactNode {
    const { children, ...others } = this.props;
    return (
      <Animated.View
        {...others}
        {...this.panResponder.panHandlers}
        onLayout={this.onLayout}
      >
        {children}
      </Animated.View>
    );
  }
}
