import React from 'react';
import { PortalConsumer } from './PortalConsumer';
import { PortalHost, PortalContext } from './PortalHost';

interface IPortalProps {
  prefix?: string;
}

export class Portal extends React.Component<IPortalProps> {
  static Host = PortalHost;
  render() {
    const { children, prefix } = this.props;
    return (
      <PortalContext.Consumer>
        {(manager) =>
          (manager.mount as any) ? (
            <PortalConsumer manager={manager} prefix={prefix}>
              {children}
            </PortalConsumer>
          ) : (
            children
          )
        }
      </PortalContext.Consumer>
    );
  }
}
