import React, { createContext, isValidElement, PropsWithChildren } from 'react';
import { Portal } from '@crosscement/react-native-portal';

type IContext = {
  scroll?: React.RefObject<any>;
};

export const DropdownContext = createContext<IContext>({} as IContext);

interface IProps {
  scroll?: IContext['scroll'];
}

export const DropdownProvider: React.FC<PropsWithChildren<IProps>> = ({
  scroll,
  children,
}) => {
  const context: IContext = {
    scroll,
  };

  if (!isValidElement(children)) {
    return null;
  }

  return (
    <Portal.Host>
      <DropdownContext.Provider value={context}>
        {children}
      </DropdownContext.Provider>
    </Portal.Host>
  );
};
