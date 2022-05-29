import React, { ComponentClass, useRef } from 'react';
import { ScrollViewProps } from 'react-native';
import { TooltipProvider } from './TooltipProvider';
import { Portal } from '@crosscement/react-native-portal';
import type { IRootElementType, IScrollableView } from './types';

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

    return (
      <TooltipProvider scroll={props.forwardedRef ?? forwardedRef}>
        {isVirtualizedList(elementType) ? null : (
          // @ts-ignore
          <Component {...props} ref={props.forwardedRef ? ref : forwardedRef}>
            <Portal.Host>{props.children}</Portal.Host>
          </Component>
        )}
      </TooltipProvider>
    );
  }) as unknown as T;
}

export function createScrollViewHook<T = ComponentClass<ScrollViewProps>>(
  Component: T
) {
  return createScrollableHook(Component, 'Scollview');
}
