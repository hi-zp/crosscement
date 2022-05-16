import React, { createContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { PortalManager } from './PortalManager';

type IAction = {
  type: 'mount' | 'update' | 'unmount';
  key: number;
  children?: React.ReactNode;
};

type IProps = {
  children?: React.ReactNode | ((manager: JSX.Element) => React.ReactNode);
};

export type IContext = {
  mount: (children: React.ReactNode) => number;
  update: (key: number, children: React.ReactNode) => void;
  unmount: (key: number) => void;
};

export const PortalContext = createContext<IContext>({} as IContext);

/**
 * Portal host renders all of its children `Portal` elements.
 * For example, you can wrap a screen in `Portal.Host` to render items above the screen.
 * If you're using the `Provider` component, it already includes `Portal.Host`.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Text } from 'react-native';
 * import { Portal } from 'react-native-paper';
 *
 * export default class MyComponent extends React.Component {
 *   render() {
 *     return (
 *       <Portal.Host>
 *         <Text>Content of the app</Text>
 *       </Portal.Host>
 *     );
 *   }
 * }
 * ```
 *
 * Here any `Portal` elements under `<App />` are rendered alongside `<App />` and will appear above `<App />` like a `Modal`.
 */
export class PortalHost extends React.Component<IProps> {
  nextKey = 0;
  queue: Array<IAction> = [];
  manager?: PortalManager = undefined;

  componentDidMount() {
    const manager = this.manager;
    const queue = this.queue;

    while (queue.length && manager) {
      const action = queue.pop();
      if (action) {
        switch (action.type) {
          case 'mount':
            manager.mount(action.key, action.children);
            break;
          case 'update':
            manager.update(action.key, action.children);
            break;
          case 'unmount':
            manager.unmount(action.key);
            break;
        }
      }
    }
  }

  setManager = (manager: PortalManager) => {
    this.manager = manager;
  };

  mount = (children: React.ReactNode): number => {
    const key = this.nextKey++;

    if (this.manager) {
      this.manager.mount(key, children);
    } else {
      this.queue.push({ type: 'mount', key, children });
    }

    return key;
  };

  update = (key: number, children: React.ReactNode) => {
    if (this.manager) {
      this.manager.update(key, children);
    } else {
      const op: IAction = { type: 'mount', key, children };
      const index = this.queue.findIndex(
        (o) => o.type === 'mount' || (o.type === 'update' && o.key === key)
      );

      if (index > -1) {
        this.queue[index] = op;
      } else {
        this.queue.push(op);
      }
    }
  };

  unmount = (key: number) => {
    if (this.manager) {
      this.manager.unmount(key);
    } else {
      this.queue.push({ type: 'unmount', key });
    }
  };

  render() {
    const { children } = this.props;
    const manager = <PortalManager ref={this.setManager} />;
    return (
      <PortalContext.Provider
        value={{
          mount: this.mount,
          update: this.update,
          unmount: this.unmount,
        }}
      >
        <View
          style={styles.container}
          collapsable={false}
          pointerEvents="box-none"
        >
          {typeof children === 'function' ? children(manager) : children}
        </View>
        {typeof children === 'function' ? null : manager}
      </PortalContext.Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
