import React, { ComponentClass, useRef } from 'react';
import { ScrollViewProps } from 'react-native';
import { TooltipProvider } from './TooltipProvider';
import { Portal } from '@crosscement/react-native-portal';

export function createScrollViewHook<T = ComponentClass<ScrollViewProps>>(
  Component: T
) {
  return React.forwardRef<any, {}>((props: any, ref) => {
    const forwardedRef = useRef();
    return (
      <TooltipProvider scroll={props.forwardedRef ?? forwardedRef}>
        {/* @ts-ignore */}
        <Component {...props} ref={props.forwardedRef ? ref : forwardedRef}>
          <Portal.Host>{props.children}</Portal.Host>
        </Component>
      </TooltipProvider>
    );
  }) as unknown as T;
}
