import React from 'react';
import { View, StyleSheet } from 'react-native';

type IProtal = { prefix: string; children: React.ReactNode };
type IState = { portals: IProtal[] };

export class PortalManager extends React.PureComponent<{}, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      portals: [],
    };
  }

  mount = (prefix: string, children: React.ReactNode) => {
    this.setState((state) => ({
      portals: [...state.portals, { prefix, children }],
    }));
  };

  update = (prefix: string, children: React.ReactNode) =>
    this.setState((state) => ({
      portals: state.portals.map((item) => {
        if (item.prefix === prefix) {
          return { ...item, children };
        }
        return item;
      }),
    }));

  unmount = (prefix: string) =>
    this.setState((state) => ({
      portals: state.portals.filter((item) => item.prefix !== prefix),
    }));

  render() {
    return this.state.portals.map(({ prefix, children }) => (
      <View
        key={prefix}
        collapsable={false}
        pointerEvents="box-none"
        style={StyleSheet.absoluteFill}
      >
        {children}
      </View>
    ));
  }
}
