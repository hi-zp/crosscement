import { Animated } from 'react-native';
import { Animation } from './Animation';

export class ScaleAnimation extends Animation {
  in(onFinished?: () => {}): void {
    Animated.spring(this.animate, {
      toValue: 1,
      velocity: 0,
      tension: 65,
      friction: 7,
      useNativeDriver: this.useNativeDriver,
    }).start(onFinished);
  }

  out(onFinished?: () => {}): void {
    Animated.timing(this.animate, {
      toValue: 0,
      duration: 200,
      useNativeDriver: this.useNativeDriver,
    }).start(onFinished);
  }

  getAnimations(): Object {
    return {
      transform: [
        {
          scale: this.animate.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          }),
        },
      ],
    };
  }
}
