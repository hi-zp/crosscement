import React, { createRef } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { Backdrop } from '@crosscement/react-native-backdrop';
import { DropdownContext } from './DropdownProvider';
import { Portal } from '@crosscement/react-native-portal';
import type { IDropdownProps } from './types';
import { createScrollViewHook } from './utils';
import { areEqual, pick, Position } from '@crosscement/react-native-utils';

type IStatus = 'closed' | 'opening' | 'opened' | 'closing';
type IState = { status: IStatus };

const UpdateEffectProps: Array<keyof IDropdownProps> = ['expandHeight'];

export class Dropdown extends React.Component<IDropdownProps, IState> {
  static defaultProps: Partial<IDropdownProps> = {
    visible: false,
    animationDuration: 200,
    onShow: () => {},
    onDismiss: () => {},
    useNativeDriver: true,
    constraintWith: false,
    hasOverlay: true,
    overlayOpacity: 0.5,
    overlayBackgroundColor: '#000',
  };

  translateY = new Animated.Value(0);
  targetRef = createRef<View>();
  containerRef = createRef<View>();
  expandRef = createRef<View>();

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

  private _getScrollNode = () => {
    if (this.context.scroll) {
      return this.context.scroll.current.getScrollableNode
        ? this.context.scroll.current.getScrollableNode()
        : this.context.scroll.current;
    } else {
      return undefined;
    }
  };

  componentDidUpdate(prevProps: IDropdownProps) {
    if (this.props.visible !== prevProps.visible) {
      this.props.visible ? this.show() : this.dismiss();
    } else if (
      !areEqual(
        pick(this.props, UpdateEffectProps),
        pick(prevProps, UpdateEffectProps)
      ) &&
      (this.state.status === 'opened' || this.state.status === 'opening')
    ) {
      this._showingSubsequent();
    }
  }

  show = () => {
    this.setState({ status: 'opening' }, this._showingSubsequent);
  };

  private _showingSubsequent = async () => {
    if (!this.containerRef.current || !this.targetRef.current) {
      requestAnimationFrame(this._showingSubsequent);
      return;
    }

    // calculate floating position
    const position = new Position({
      placement: 'bottom',
      targetRef: this.targetRef,
      overlayRef: this.containerRef,
      scrollNode: this._getScrollNode(),
    });

    const { overlayPosition } = await position.calculate();

    const expandRootStyle: ViewStyle = {
      top: overlayPosition.top,
      height: this._hasOverlay ? Dimensions.get('screen').height : 'auto',
    };

    if (this.props.constraintWith) {
      const boundary = await position.getTargetBoundary();
      expandRootStyle.left = boundary.left;
      expandRootStyle.width = boundary.width ?? 0;
    }

    this.containerRef.current?.setNativeProps(expandRootStyle);

    // calculate expand height
    const expandHeight = await this._getExpandHeight();
    this._in(() => {
      this.setState({ status: 'opened' }, this.props.onShow);
    }, expandHeight);
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
    this.containerRef.current?.setNativeProps({ opacity: 1 });
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

  private _getExpandHeight = (): Promise<number> => {
    return new Promise((resolve) => {
      if (this.props.expandHeight) {
        return resolve(this.props.expandHeight);
      }
      this.expandRef.current?.measure((_x, _y, _width, height) => {
        if (height !== 0) {
          resolve(height);
        }
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

  private get _defaultContainerStyle(): ViewStyle {
    if (!this.props.constraintWith) {
      return {
        left: 0,
        width: Dimensions.get('screen').width,
      };
    } else {
      return {};
    }
  }

  private _renderContainer() {
    const { expand, expandHeight, expandStyle } = this.props;
    return (
      <View
        ref={this.containerRef}
        style={[styles.expandContainer, this._defaultContainerStyle]}
      >
        {this._hasOverlay && this._renderOverlay()}
        <Animated.View
          ref={this.expandRef}
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
        <View collapsable={false} ref={this.targetRef} style={style}>
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
