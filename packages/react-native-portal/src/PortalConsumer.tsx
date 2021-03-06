import React from 'react';
import type { IContext } from './PortalHost';

type IProps = {
  manager: IContext;
};

export class PortalConsumer extends React.Component<IProps> {
  key?: string = undefined;

  async componentDidMount() {
    this.checkManager();

    // Delay updating to prevent React from going to infinite loop
    await Promise.resolve();

    this.key = this.props.manager.mount(this.props.children);
  }

  componentDidUpdate() {
    this.checkManager();

    this.props.manager.update(this.key as string, this.props.children);
  }

  componentWillUnmount() {
    this.checkManager();

    this.props.manager.unmount(this.key as string);
  }

  checkManager() {
    if (!this.props.manager) {
      throw new Error('There is no portal manager!');
    }
  }

  render() {
    return null;
  }
}
