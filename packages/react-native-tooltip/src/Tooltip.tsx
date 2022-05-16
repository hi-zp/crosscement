import React, { createRef } from 'react';
import { Animated, View } from 'react-native';
import { Backdrop } from '@crosscement/react-native-backdrop';
import { TooltipContext } from './TooltipProdiver';
import { Portal } from '@crosscement/react-native-portal';
import type { IBoundary, ITooltipProps } from './types';
import { calculate, createScrollViewHook, handleRetry } from './utils';
import { Polygon } from './Polygon';
import { placements } from './constants';

type IStatus = 'closed' | 'opening' | 'opened' | 'closing';
type IState = { status: IStatus };

export class Tooltip extends React.Component<ITooltipProps, IState> {
  static placements = placements;

  static defaultProps: Partial<ITooltipProps> = {
    visible: false,
    animationDuration: 200,
    onShow: () => {},
    onDismiss: () => {},
    useNativeDriver: true,
    mainOffset: 0,
    crossOffset: 0,
    hasOverlay: true,
    hasPolygon: true,
    polygonSize: 8,
    polygonColor: 'red',
    placement: 'bottom',
  };

  opacity = new Animated.Value(0);
  target = createRef<View>();
  content = createRef<View>();
  polygonRef = createRef<View>();

  constructor(props: ITooltipProps) {
    super(props);
    this.state = {
      status: 'closed',
    };
  }

  static contextType = TooltipContext;

  // @ts-ignore
  context!: React.ContextType<typeof TooltipContext>;

  private get _hasOverlay() {
    if (this.context.scroll) {
      return false;
    } else {
      return this.props.hasOverlay;
    }
  }

  componentDidMount() {
    this.props.visible && this.show();
  }

  componentDidUpdate(prevProps: ITooltipProps) {
    if (this.props.visible !== prevProps.visible) {
      this.props.visible ? this.show() : this.dismiss();
    }
    if (!areEqual(this.props, prevProps) && this.state.status === 'opened') {
      this._layout();
    }
  }

  show = () => {
    this.setState({ status: 'opening' }, async () => {
      await this._layout();
      this._in(() => {
        this.setState({ status: 'opened' }, this.props.onShow);
      });
    });
  };

  private _layout = async () => {
    const [boundary, contentSize] = await Promise.all([
      this._getBoundary(),
      this._getContentSize(),
    ]);
    const { contentPosition, polygonPosition } = calculate(
      boundary,
      contentSize,
      this.props.placement as any,
      this.props.polygonSize as any,
      this.props.mainOffset as any,
      this.props.crossOffset as any
    );
    this.polygonRef.current?.setNativeProps(polygonPosition);
    this.content.current?.setNativeProps(contentPosition);
  };

  dismiss = () => {
    this.setState({ status: 'closing' }, () => {
      this._out(() => {
        this.setState({ status: 'closed' }, this.props.onDismiss);
      });
    });
  };

  private _in = (onFinished: () => void) => {
    // prepare
    this.opacity.setValue(0);
    // animation
    Animated.timing(this.opacity, {
      toValue: 1,
      duration: this.props.animationDuration,
      useNativeDriver: this.props.useNativeDriver as boolean,
    }).start(onFinished);
  };

  private _out = (onFinished: () => void) => {
    // animation
    Animated.timing(this.opacity, {
      toValue: 0,
      duration: this.props.animationDuration,
      useNativeDriver: this.props.useNativeDriver as boolean,
    }).start(onFinished);
  };

  private _getBoundary = (): Promise<IBoundary> => {
    return new Promise((resolve) => {
      handleRetry(
        (breakOff) => {
          if (this.context.scroll) {
            const scrollable = this.context.scroll.current.getScrollableNode
              ? this.context.scroll.current.getScrollableNode()
              : this.context.scroll.current;
            this.target.current?.measureLayout(
              scrollable,
              (left, top, width, height) => {
                if (!width && !height) {
                  return;
                }
                breakOff();
                resolve({
                  top,
                  left,
                  right: left + width,
                  bottom: top + height,
                  width,
                  height,
                  coordinate: {
                    x: left + width / 2,
                    y: top + height / 2,
                  },
                });
              },
              () => null
            );
          } else {
            this.target.current?.measureInWindow((x, y, width, height) => {
              if (!width && !height) {
                return;
              }
              breakOff();
              resolve({
                top: y,
                left: x,
                right: x + width,
                bottom: y + height,
                width,
                height,
                coordinate: {
                  x: x + width / 2,
                  y: y + height / 2,
                },
              });
            });
          }
        },
        { retryAttempts: 10, retryDelay: 10 }
      );
    });
  };

  private _getContentSize = (): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      handleRetry(
        (breakOff) => {
          this.content.current?.measure((_x, _y, width, height) => {
            if (height !== 0) {
              breakOff();
              resolve({ width, height });
            }
          });
        },
        { retryAttempts: 10 }
      );
    });
  };

  private _renderOverlay() {
    const props = this.props;
    const overlayVisible = ['opening', 'opened'].includes(this.state.status);
    return (
      <Backdrop
        visible={overlayVisible}
        onPress={this.dismiss}
        animationDuration={props.animationDuration}
        opacity={props.overlayOpacity}
        pointerEvents={props.overlayPointerEvents}
        backgroundColor={props.overlayBackgroundColor}
      />
    );
  }

  private _renderPolygon() {
    const props = this.props;
    return (
      <Polygon
        ref={this.polygonRef}
        size={props.polygonSize}
        placement={props.placement}
        color={props.polygonColor}
        style={{ position: 'absolute' }}
      />
    );
  }

  private _renderContainer() {
    const { content, contentStyle, hasPolygon } = this.props;
    return (
      <>
        {this._hasOverlay && this._renderOverlay()}
        <Animated.View
          ref={this.content}
          style={[contentStyle, { opacity: this.opacity }]}
        >
          {hasPolygon && this._renderPolygon()}
          {content}
        </Animated.View>
      </>
    );
  }

  render(): React.ReactNode {
    const { children, ...props } = this.props;
    return (
      <>
        <View collapsable={false} ref={this.target} {...props}>
          {children}
        </View>
        <Portal>
          {this.state.status !== 'closed' ? this._renderContainer() : null}
        </Portal>
      </>
    );
  }

  static createScrollViewHook = createScrollViewHook;
}

function shallowDiffers(prev: Object, next: Object): boolean {
  for (const attribute in prev) {
    if (!(attribute in next)) {
      return true;
    }
  }
  for (const attribute in next) {
    // @ts-ignore
    if (prev[attribute] !== next[attribute]) {
      return true;
    }
  }
  return false;
}

function areEqual(prevProps: Object, nextProps: Object): boolean {
  const { style: prevStyle, ...prevRest } = prevProps as any;
  const { style: nextStyle, ...nextRest } = nextProps as any;

  return (
    !shallowDiffers(prevStyle, nextStyle) && !shallowDiffers(prevRest, nextRest)
  );
}
