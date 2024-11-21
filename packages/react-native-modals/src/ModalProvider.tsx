import React, {
  createContext,
  isValidElement,
  PropsWithChildren,
  useCallback,
  useState,
} from 'react';
import { Portal } from '@crosscement/react-native-portal';

type IContext = {
  stacks: Array<{ key: string }>;
  pushStack: (key: string) => void;
  dropStack: (key: string) => void;
};

export const ModalContext = createContext<IContext>({} as IContext);

export const ModalProvider: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const [stacks, setStacks] = useState<IContext['stacks']>([]);

  const pushStack = useCallback<IContext['pushStack']>((key) => {
    setStacks((prevStacks) => prevStacks.concat({ key }));
  }, []);

  const dropStack = useCallback<IContext['pushStack']>((key) => {
    setStacks((prevStacks) => prevStacks.filter((stack) => stack.key !== key));
  }, []);

  const context: IContext = {
    stacks,
    pushStack,
    dropStack,
  };

  if (!isValidElement(children)) {
    return null;
  }

  return (
    <Portal.Host>
      <ModalContext.Provider value={context}>{children}</ModalContext.Provider>
    </Portal.Host>
  );
};
