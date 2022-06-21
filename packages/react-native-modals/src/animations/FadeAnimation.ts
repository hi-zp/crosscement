import { Animated } from 'react-native';
import { Animation, AnimationConfig } from './Animation';

type FadeAnimationConfig = AnimationConfig & {
  animationDuration?: number;
};

export class FadeAnimation extends Animation {
  animationDuration: number;

  constructor({
    initialValue = 0,
    useNativeDriver = false,
    animationDuration = 200,
  }: FadeAnimationConfig = {}) {
    super({ initialValue, useNativeDriver });
    this.animationDuration = animationDuration;
  }

  in(onFinished?: () => {}): void {
    Animated.timing(this.animate, {
      toValue: 1,
      duration: this.animationDuration,
      useNativeDriver: this.useNativeDriver,
    }).start(onFinished);
  }

  out(onFinished?: () => {}): void {
    Animated.timing(this.animate, {
      toValue: 0,
      duration: this.animationDuration,
      useNativeDriver: this.useNativeDriver,
    }).start(onFinished);
  }

  getAnimations(): Object {
    return { opacity: this.animate };
  }
}
