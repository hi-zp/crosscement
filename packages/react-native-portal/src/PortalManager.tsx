import React from 'react';
import { View, StyleSheet } from 'react-native';

type IProtal = { key: number; children: React.ReactNode };
type IState = { portals: IProtal[] };

export class PortalManager extends React.PureComponent<{}, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      portals: [],
    };
  }

  mount = (key: number, children: React.ReactNode) => {
    this.setState((state) => ({
      portals: [...state.portals, { key, children }],
    }));
  };

  update = (key: number, children: React.ReactNode) =>
    this.setState((state) => ({
      portals: state.portals.map((item) => {
        if (item.key === key) {
          return { ...item, children };
        }
        return item;
      }),
    }));

  unmount = (key: number) =>
    this.setState((state) => ({
      portals: state.portals.filter((item) => item.key !== key),
    }));

  render() {
    return this.state.portals.map(({ key, children }) => (
      <View
        key={key}
        collapsable={false}
        pointerEvents="box-none"
        style={StyleSheet.absoluteFill}
      >
        {children}
      </View>
    ));
  }
}
