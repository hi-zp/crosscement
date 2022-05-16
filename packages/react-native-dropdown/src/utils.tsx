import React, { ComponentClass, useRef } from 'react';
import type { ScrollViewProps } from 'react-native';
import { DropdownProdiver } from './context';
import { Portal } from '@crosscement/react-native-portal';
import type { IRootElementType, IScrollableView } from './types';

// export function useEffectState<S, F = () => void>(
//   initialState: S | (() => S)
// ): [S, (state: S, success?: F) => void] {
//   const [state, dispatch] = useState(initialState);
//   const successRef = useRef<F>();

//   const effectDispatch = (newState: S, success?: F) => {
//     successRef.current = success;
//     dispatch(newState);
//   };

//   useEffect(() => {
//     // @ts-ignore
//     successRef.current?.();
//   }, [state]);

//   return [state, effectDispatch];
// }

export const isScrollable = (type: IRootElementType) => {
  return /(FlatList|SectionList|Scollview)/.test(type);
};

export const isVirtualizedList = (type: IRootElementType) => {
  return /(FlatList|SectionList)/.test(type);
};

export function createScrollableHook<P = {}, T = IScrollableView<P>>(
  Component: T,
  elementType: IRootElementType
) {
  return React.forwardRef<any, {}>((props: any, ref) => {
    const forwardedRef = useRef();

    // <Portal.Host>
    //   {(manager) => (
    //     // @ts-ignore
    //     <Component
    //       {...props}
    //       ref={props.forwardedRef ? ref : forwardedRef}
    //       renderScrollComponent={(scrollProps: ScrollViewProps) => (
    //         <ScrollView {...scrollProps}>{manager}</ScrollView>
    //       )}
    //     />
    //   )}
    // </Portal.Host>

    return (
      <DropdownProdiver scroll={props.forwardedRef ?? forwardedRef}>
        {isVirtualizedList(elementType) ? null : (
          // @ts-ignore
          <Component {...props} ref={props.forwardedRef ? ref : forwardedRef}>
            <Portal.Host>{props.children}</Portal.Host>
          </Component>
        )}
      </DropdownProdiver>
    );
  }) as unknown as T;
}

export function createScrollViewHook<T = ComponentClass<ScrollViewProps>>(
  Component: T
) {
  return createScrollableHook(Component, 'Scollview');
}

// export function createFlatListHook<P, T = ComponentClass<FlatListProps<P>>>(
//   Component: T
// ) {
//   return createScrollableHook(Component, 'FlatList');
// }

// export function createSectionListHook<
//   P,
//   T = ComponentClass<SectionListProps<P>>
// >(Component: T) {
//   return createScrollableHook(Component, 'SectionList');
// }

interface IHandleRetryOptions {
  retryAttempts: number;
  retryDelay: number;
}

export function handleRetry(
  options: IHandleRetryOptions,
  handler: (breakOff: () => void) => void
) {
  const { retryDelay, retryAttempts } = options;
  const states = { through: false, attempt: 0, timer: 0 };

  const executor = () => {
    clearTimeout(states.timer);
    // breakOff callback
    handler(() => (states.through = true));
    // check
    if (!states.through && states.attempt < retryAttempts) {
      states.timer = setTimeout(() => {
        states.attempt += 1;
        executor();
      }, retryDelay) as any;
    }
  };

  executor();
}
