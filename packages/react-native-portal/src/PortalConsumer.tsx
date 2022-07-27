import React from 'react';
import type { IContext } from './PortalHost';

type IProps = {
  manager: IContext;
  prefix?: string;
};

export class PortalConsumer extends React.Component<IProps> {
  prefix: string;

  async componentDidMount() {
    this.checkManager();

    // Delay updating to prevent React from going to infinite loop
    await Promise.resolve();

    this.prefix = this.props.manager.mount(this.props.children);
  }

  componentDidUpdate() {
    this.checkManager();

    this.props.manager.update(this.prefix, this.props.children);
  }

  componentWillUnmount() {
    this.checkManager();

    this.props.manager.unmount(this.prefix);
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
