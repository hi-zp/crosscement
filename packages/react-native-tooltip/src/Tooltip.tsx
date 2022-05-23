import React, { createRef } from 'react';
import { Animated, View } from 'react-native';
import { Backdrop } from '@crosscement/react-native-backdrop';
import { TooltipContext } from './TooltipProdiver';
import { Portal } from '@crosscement/react-native-portal';
import type { ITooltipProps } from './types';
import { createScrollViewHook } from './utils';
import { Polygon } from './Polygon';
import { calculatePosition, PLACEMENTS } from '@crosscement/react-native-utils';

type IStatus = 'closed' | 'opening' | 'opened' | 'closing';
type IState = { status: IStatus };

export class Tooltip extends React.Component<ITooltipProps, IState> {
  static placements = PLACEMENTS;

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
    arrowSize: 8,
    arrowColor: 'red',
    placement: 'bottom',
  };

  opacity = new Animated.Value(0);
  targetRef = createRef<View>();
  overlayRef = createRef<View>();
  arrowRef = createRef<View>();

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

  private getScrollNode = () => {
    if (this.context.scroll) {
      return this.context.scroll.current.getScrollableNode
        ? this.context.scroll.current.getScrollableNode()
        : this.context.scroll.current;
    } else {
      return undefined;
    }
  };

  private _layout = async () => {
    if (!this.overlayRef.current || !this.targetRef.current) {
      requestAnimationFrame(this._layout);
      return;
    }
    const { floating, arrow } = await calculatePosition({
      targetRef: this.targetRef,
      overlayRef: this.overlayRef,
      scrollNode: this.getScrollNode(),
      placement: this.props.placement,
      mainOffset: this.props.mainOffset,
      crossOffset: this.props.crossOffset,
      arrowSize: this.props.arrowSize,
      arrowOffset: 0,
    });
    this.overlayRef.current?.setNativeProps(floating);
    this.arrowRef.current?.setNativeProps(arrow);
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
        ref={this.arrowRef}
        size={props.arrowSize}
        placement={props.placement}
        color={props.arrowColor}
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
          ref={this.overlayRef}
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
        <View collapsable={false} ref={this.targetRef} {...props}>
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
