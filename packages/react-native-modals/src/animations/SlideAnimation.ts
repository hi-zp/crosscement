import { Animated, Dimensions } from 'react-native';
import { Animation, AnimationConfig } from './Animation';

type SlideFrom = 'top' | 'bottom' | 'left' | 'right';
type SlideAnimationConfig = AnimationConfig & {
  slideFrom?: SlideFrom;
  slideWidth?: number;
  slideHeight?: number;
};

export class SlideAnimation extends Animation {
  slideFrom: SlideFrom;
  slideWidth: number;
  slideHeight: number;

  static SLIDE_FROM_TOP = 'top';
  static SLIDE_FROM_BOTTOM = 'bottom';
  static SLIDE_FROM_LEFT = 'left';
  static SLIDE_FROM_RIGHT = 'right';

  constructor({
    initialValue = 0,
    useNativeDriver = true,
    slideFrom = SlideAnimation.SLIDE_FROM_BOTTOM as SlideFrom,
    slideWidth,
    slideHeight,
  }: SlideAnimationConfig = {}) {
    super({ initialValue, useNativeDriver });
    this.slideFrom = slideFrom;
    const scaledSize = Dimensions.get('window');
    this.slideWidth = slideWidth ?? scaledSize.width;
    this.slideHeight = slideHeight ?? scaledSize.height;
  }

  in(onFinished?: () => {}, options = {}): void {
    Animated.spring(this.animate, {
      toValue: 1,
      velocity: 0,
      tension: 65,
      friction: 11,
      useNativeDriver: this.useNativeDriver,
      ...options,
    }).start(onFinished);
  }

  out(onFinished?: () => {}, options = {}): void {
    Animated.spring(this.animate, {
      toValue: 0,
      velocity: 0,
      tension: 65,
      friction: 11,
      useNativeDriver: this.useNativeDriver,
      ...options,
    }).start(onFinished);
  }

  getAnimations(): Object {
    const transform = [];
    if (this.slideFrom === SlideAnimation.SLIDE_FROM_TOP) {
      transform.push({
        translateY: this.animate.interpolate({
          inputRange: [0, 1],
          outputRange: [-this.slideHeight, 0],
        }),
      });
    } else if (this.slideFrom === SlideAnimation.SLIDE_FROM_BOTTOM) {
      transform.push({
        translateY: this.animate.interpolate({
          inputRange: [0, 1],
          outputRange: [this.slideHeight, 0],
        }),
      });
    } else if (this.slideFrom === SlideAnimation.SLIDE_FROM_LEFT) {
      transform.push({
        translateX: this.animate.interpolate({
          inputRange: [0, 1],
          outputRange: [-this.slideWidth, 0],
        }),
      });
    } else if (this.slideFrom === SlideAnimation.SLIDE_FROM_RIGHT) {
      transform.push({
        translateX: this.animate.interpolate({
          inputRange: [0, 1],
          outputRange: [this.slideWidth, 0],
        }),
      });
    } else {
      throw new Error(`
        slideFrom: ${this.slideFrom} not supported. 'slideFrom' must be 'top' | 'bottom' | 'left' | 'right'
      `);
    }
    return {
      transform,
    };
  }
}
