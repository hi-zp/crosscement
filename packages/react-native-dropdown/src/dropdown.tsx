import React, { createRef } from 'react';
import {
  Animated,
  Dimensions,
  I18nManager,
  StyleSheet,
  View,
} from 'react-native';
import { Backdrop } from './backdrop';
import { DropdownContext } from './context';
import { Portal } from './portal';
import type { IBoundary, IDropdownProps } from './types';
import { createScrollViewHook, handleRetry } from './utils';

type IStatus = 'closed' | 'opening' | 'opened' | 'closing';
type IState = { status: IStatus };

export class Dropdown extends React.Component<IDropdownProps, IState> {
  static defaultProps: Partial<IDropdownProps> = {
    visible: false,
    animationDuration: 200,
    onShow: () => {},
    onDismiss: () => {},
    useNativeDriver: true,
    hasOverlay: true,
    overlayOpacity: 0.5,
    overlayBackgroundColor: '#000',
  };

  translateY = new Animated.Value(0);
  target = createRef<View>();
  container = createRef<View>();
  expand = createRef<View>();

  constructor(props: IDropdownProps) {
    super(props);
    this.state = {
      status: 'closed',
    };
  }

  static contextType = DropdownContext;

  // @ts-ignore
  context!: React.ContextType<typeof DropdownContext>;

  private get _hasOverlay() {
    if (this.context.scroll) {
      return false;
    } else {
      return this.props.hasOverlay;
    }
  }

  componentDidUpdate(prevProps: IDropdownProps) {
    if (this.props.visible !== prevProps.visible) {
      this.props.visible ? this.show() : this.dismiss();
    }
  }

  show = () => {
    this.setState({ status: 'opening' }, async () => {
      const boundary = await this._getBoundary();
      this.container.current?.setNativeProps({
        top: boundary.top,
        left: 0,
        width: Dimensions.get('screen').width,
        height: this._hasOverlay ? Dimensions.get('screen').height : 'auto',
      });
      // delay
      const expandHeight = await this._getExpandHeight();
      this._in(() => {
        this.setState({ status: 'opened' }, this.props.onShow);
      }, expandHeight);
    });
  };

  dismiss = () => {
    this.setState({ status: 'closing' }, async () => {
      const expandHeight = await this._getExpandHeight();
      this._out(() => {
        this.setState({ status: 'closed' }, this.props.onDismiss);
      }, expandHeight);
    });
  };

  private _in = (onFinished: () => void, expandHeight: number) => {
    // prepare
    this.translateY.setValue(-expandHeight);
    this.container.current?.setNativeProps({ opacity: 1 });
    // animation
    Animated.timing(this.translateY, {
      toValue: 0,
      duration: this.props.animationDuration,
      useNativeDriver: this.props.useNativeDriver as boolean,
    }).start(onFinished);
  };

  private _out = (onFinished: () => void, expandHeight: number) => {
    // animation
    Animated.timing(this.translateY, {
      toValue: -expandHeight,
      duration: this.props.animationDuration,
      useNativeDriver: this.props.useNativeDriver as boolean,
    }).start(onFinished);
  };

  private _getBoundary = (): Promise<IBoundary> => {
    return new Promise((resolve) => {
      if (this.context.scroll) {
        const scrollable = this.context.scroll.current.getScrollableNode
          ? this.context.scroll.current.getScrollableNode()
          : this.context.scroll.current;
        this.target.current?.measureLayout(
          scrollable,
          (left, top, width, height) => {
            resolve({
              top: height + top,
              left: I18nManager.isRTL ? width - left : left,
              width,
              height,
            });
          },
          () => null
        );
      } else {
        this.target.current?.measureInWindow((x, y, width, height) => {
          const top = height + y;
          const left = I18nManager.isRTL ? width - x : x;
          resolve({ top, left, width, height });
        });
      }
    });
  };

  private _getExpandHeight = (): Promise<number> => {
    return new Promise((resolve) => {
      if (this.props.expandHeight) {
        return resolve(this.props.expandHeight);
      }
      handleRetry({ retryDelay: 10, retryAttempts: 5 }, (breakOff) => {
        this.expand.current?.measure((_x, _y, _width, height) => {
          if (height !== 0) {
            breakOff();
            resolve(height);
          }
        });
      });
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

  private _renderContainer() {
    const { expand, expandHeight, expandStyle } = this.props;
    return (
      <View ref={this.container} style={styles.expandContainer}>
        {this._hasOverlay && this._renderOverlay()}
        <Animated.View
          ref={this.expand}
          style={[
            expandStyle,
            { transform: [{ translateY: this.translateY }] },
            expandHeight ? { height: expandHeight } : {},
          ]}
        >
          {expand}
        </Animated.View>
      </View>
    );
  }

  render(): React.ReactNode {
    const { style, children } = this.props;
    return (
      <>
        <View collapsable={false} ref={this.target} style={style}>
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

const styles = StyleSheet.create({
  expandContainer: {
    position: 'absolute',
    zIndex: 1,
    overflow: 'hidden',
    opacity: 0,
  },
});
