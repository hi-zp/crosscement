import React, { createRef } from 'react';
import { Backdrop } from '@crosscement/react-native-backdrop';
import { Portal } from '@crosscement/react-native-portal';
import { ModalContext } from './ModalProvider';
import {
  Animated,
  BackHandler,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { IModalProps } from './types';
import { Animation, FadeAnimation } from './animations';

type IStatus = 'closed' | 'opening' | 'opened' | 'closing';
type IState = {
  modalAnimation: Animation;
  status: IStatus;
};

export class Modal extends React.Component<IModalProps, IState> {
  static defaultProps: Partial<IModalProps> = {
    visible: false,
    animationDuration: 200,
    onShow: () => {},
    onDismiss: () => {},
    hasOverlay: true,
    // onMove: () => {},
    // onSwiping: () => {},
    // onSwipeRelease: () => {},
    // onSwipingOut: () => {},
  };

  opacity = new Animated.Value(0);
  overlayRef = createRef<View>();
  backdropRef = createRef<Backdrop>();

  constructor(props: IModalProps) {
    super(props);
    this.state = {
      modalAnimation: props.modalAnimation || new FadeAnimation(),
      status: 'closed',
    };
  }

  static contextType = ModalContext;

  // @ts-ignore
  context!: React.ContextType<typeof ModalContext>;

  componentDidMount() {
    this._checkContext();
    this.props.visible && this.show();
    BackHandler.addEventListener('hardwareBackPress', this.onHardwareBackPress);
  }

  componentDidUpdate(prevProps: IModalProps) {
    if (this.props.visible !== prevProps.visible) {
      this.props.visible ? this.show() : this.dismiss();
    }
  }

  componentWillUnmount(): void {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.onHardwareBackPress
    );
  }

  private onHardwareBackPress = (): boolean => {
    return this.props.onHardwareBackPress();
  };

  public show = () => {
    if (this.state.status === 'opened' || this.state.status === 'opening') {
      return;
    }
    this.setState({ status: 'opening' }, this.showingSubsequent);
  };

  private showingSubsequent = async () => {
    if (!this.overlayRef.current) {
      requestAnimationFrame(this.showingSubsequent);
      return;
    }
    this.state.modalAnimation.in(() => {
      this.setState({ status: 'opened' }, this.props.onShow);
    });
  };

  public dismiss = () => {
    if (this.state.status === 'closed' || this.state.status === 'closing') {
      return;
    }
    this.setState({ status: 'closing' }, () => {
      this.state.modalAnimation.out(() => {
        this.setState({ status: 'closed' }, this.props.onDismiss);
      });
    });
  };

  private renderOverlay() {
    const props = this.props;
    const overlayVisible = ['opening', 'opened'].includes(this.state.status);
    return (
      <Backdrop
        ref={this.backdropRef}
        visible={overlayVisible}
        onPress={this.dismiss}
        animationDuration={props.animationDuration}
        opacity={props.overlayOpacity}
        pointerEvents={props.overlayPointerEvents}
        backgroundColor={props.overlayBackgroundColor}
      />
    );
  }

  private get modalSize(): Object {
    const { width: screenWidth, height: screenHeight } =
      Dimensions.get('window');
    let { width, height } = this.props;
    if (width && width > 0.0 && width <= 1.0) {
      width *= screenWidth;
    }
    if (height && height > 0.0 && height <= 1.0) {
      height *= screenHeight;
    }
    return { width, height };
  }

  private renderContainer() {
    const { modalStyle, style, children } = this.props;
    return (
      <View style={styles.container} pointerEvents="auto">
        <View style={StyleSheet.flatten([styles.draggableView, style])}>
          {this.renderOverlay()}
          <Animated.View
            ref={this.overlayRef}
            style={[
              this.modalSize,
              modalStyle,
              this.state.modalAnimation.getAnimations(),
            ]}
          >
            {children}
          </Animated.View>
        </View>
      </View>
    );
  }

  private _checkContext() {
    if (!Array.isArray(this.context.stacks)) {
      throw new Error('There is no modal provider!');
    }
  }

  render(): React.ReactNode {
    return (
      <Portal>
        {this.state.status !== 'closed' ? this.renderContainer() : null}
      </Portal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  modal: {
    overflow: 'hidden',
  },
  draggableView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
