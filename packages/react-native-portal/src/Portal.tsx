import React from 'react';
import { PortalConsumer } from './PortalConsumer';
import { PortalHost, PortalContext } from './PortalHost';

export class Portal extends React.Component<{}> {
  static Host = PortalHost;
  render() {
    const { children } = this.props;
    return (
      <PortalContext.Consumer>
        {(manager) =>
          (manager.mount as any) ? (
            <PortalConsumer manager={manager}>{children}</PortalConsumer>
          ) : (
            children
          )
        }
      </PortalContext.Consumer>
    );
  }
}
