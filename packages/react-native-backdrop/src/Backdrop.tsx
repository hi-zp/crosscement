import React from 'react';
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  ViewProps,
} from 'react-native';

export interface BackdropProps {
  visible: boolean;
  opacity: number;
  onPress?: () => void;
  backgroundColor?: string;
  animationDuration?: number;
  pointerEvents?: ViewProps['pointerEvents'];
  useNativeDriver?: boolean;
}

const defaultProps: Partial<BackdropProps> = {
  backgroundColor: '#000',
  opacity: 0.5,
  animationDuration: 200,
  visible: false,
  useNativeDriver: true,
  onPress: () => {},
};

export class Backdrop extends React.PureComponent<BackdropProps> {
  static defaultProps = defaultProps;

  opacity = new Animated.Value(0);

  setOpacity = (value: number) => {
    this.opacity.setValue(value);
  };

  componentDidUpdate(prevProps: BackdropProps) {
    const { visible } = this.props;
    if (prevProps.visible !== visible) {
      this._inOut();
    }
  }

  componentDidMount() {
    this._inOut();
  }

  private _inOut() {
    const {
      visible,
      useNativeDriver = true,
      opacity,
      animationDuration: duration,
    } = this.props;
    const toValue = visible ? opacity : 0;
    Animated.timing(this.opacity, {
      toValue,
      duration,
      useNativeDriver,
    }).start();
  }

  render(): React.ReactNode {
    const { onPress, pointerEvents, backgroundColor } = this.props;
    const { opacity } = this;
    return (
      <Animated.View
        pointerEvents={pointerEvents}
        style={StyleSheet.flatten([
          StyleSheet.absoluteFill,
          // @ts-ignore
          { backgroundColor, opacity },
        ])}
      >
        <TouchableOpacity
          onPress={onPress}
          style={StyleSheet.absoluteFillObject}
          activeOpacity={1}
        />
      </Animated.View>
    );
  }
}
