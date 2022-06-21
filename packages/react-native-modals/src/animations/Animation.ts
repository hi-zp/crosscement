import { Animated } from 'react-native';

export type AnimationConfig = {
  initialValue?: number;
  useNativeDriver?: boolean;
};

export class Animation {
  useNativeDriver: boolean;
  animate: Animated.Value;

  constructor({
    initialValue = 0,
    useNativeDriver = true,
  }: AnimationConfig = {}) {
    this.animate = new Animated.Value(initialValue);
    this.useNativeDriver = useNativeDriver;
  }

  in(_onFinished?: Function): void {
    throw Error('not implemented yet');
  }

  out(_onFinished?: Function): void {
    throw Error('not implemented yet');
  }

  getAnimations(): Object {
    throw Error('not implemented yet');
  }
}
