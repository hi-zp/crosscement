import React, { createContext, isValidElement } from 'react';
import { Portal } from './portal';

export type IContext = {
  scroll?: React.RefObject<any>;
};

export const TooltipContext = createContext<IContext>({} as IContext);

interface IProps {
  scroll?: IContext['scroll'];
}

export const TooltipProdiver: React.FC<IProps> = ({ scroll, children }) => {
  const context: IContext = {
    scroll,
  };

  if (!isValidElement(children)) {
    return null;
  }

  return (
    <Portal.Host>
      <TooltipContext.Provider value={context}>
        {children}
      </TooltipContext.Provider>
    </Portal.Host>
  );
};
