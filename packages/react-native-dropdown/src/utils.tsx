import React, { ComponentClass, useRef } from 'react';
import type { ScrollViewProps } from 'react-native';
import { DropdownProvider } from './DropdownProvider';
import { Portal } from '@crosscement/react-native-portal';

export function createScrollViewHook<T = ComponentClass<ScrollViewProps>>(
  Component: T
) {
  return React.forwardRef<any, {}>((props: any, ref) => {
    const forwardedRef = useRef();
    return (
      <DropdownProvider scroll={props.forwardedRef ?? forwardedRef}>
        {/* @ts-ignore */}
        <Component {...props} ref={props.forwardedRef ? ref : forwardedRef}>
          <Portal.Host>{props.children}</Portal.Host>
        </Component>
      </DropdownProvider>
    );
  }) as unknown as T;
}
