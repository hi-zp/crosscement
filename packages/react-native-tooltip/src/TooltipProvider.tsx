import React, { createContext, isValidElement, PropsWithChildren } from 'react';
import { Portal } from '@crosscement/react-native-portal';

type IContext = {
  scroll?: React.RefObject<any>;
};

export const TooltipContext = createContext<IContext>({} as IContext);

interface IProps {
  scroll?: IContext['scroll'];
}

export const TooltipProvider: React.FC<PropsWithChildren<IProps>> = ({ scroll, children }) => {
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
