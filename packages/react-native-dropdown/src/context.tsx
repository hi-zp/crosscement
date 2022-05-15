import React, { createContext, isValidElement } from 'react';
import { Portal } from './portal';

export type IContext = {
  scroll?: React.RefObject<any>;
};

export const DropdownContext = createContext<IContext>({} as IContext);

interface IProps {
  scroll?: IContext['scroll'];
}

export const DropdownProdiver: React.FC<IProps> = ({ scroll, children }) => {
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
