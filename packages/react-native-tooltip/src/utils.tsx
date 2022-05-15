import React, { ComponentClass, useRef } from 'react';
import type { ScrollViewProps } from 'react-native';
import { TooltipProdiver } from './TooltipProdiver';
import { Portal } from './portal';
import type {
  IBoundary,
  IPlacement,
  IRootElementType,
  IScrollableView,
} from './types';

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
      <TooltipProdiver scroll={props.forwardedRef ?? forwardedRef}>
        {isVirtualizedList(elementType) ? null : (
          // @ts-ignore
          <Component {...props} ref={props.forwardedRef ? ref : forwardedRef}>
            <Portal.Host>{props.children}</Portal.Host>
          </Component>
        )}
      </TooltipProdiver>
    );
  }) as unknown as T;
}

export function createScrollViewHook<T = ComponentClass<ScrollViewProps>>(
  Component: T
) {
  return createScrollableHook(Component, 'Scollview');
}

interface IHandleRetryOptions {
  retryAttempts?: number;
  retryDelay?: number;
}

export function handleRetry(
  handler: (breakOff: () => void) => void,
  options: IHandleRetryOptions = {}
) {
  const { retryDelay = 0, retryAttempts = 0 } = options;
  const states = { through: false, attempt: 0, timer: 0 };

  const executor = () => {
    clearTimeout(states.timer);
    // breakOff callback
    handler(() => (states.through = true));
    // check
    if (
      states.through ||
      (retryAttempts > 0 && states.attempt >= retryAttempts)
    ) {
      return;
    }
    // next executor
    const next = () => {
      states.attempt += 1;
      requestAnimationFrame(executor);
    };
    if (retryDelay) {
      states.timer = setTimeout(next, retryDelay) as any;
    } else {
      next();
    }
  };

  executor();
}

type IPosition = {
  left?: number;
  top?: number;
};

export const calculate = (
  boundary: IBoundary,
  contentSize: { width: number; height: number },
  placement: IPlacement,
  polygonSize: number,
  mainOffset: number,
  crossOffset: number
) => {
  const contentPosition: IPosition = {};
  const polygonPosition: IPosition = {};

  const fullMainOffset = mainOffset + polygonSize;
  const fullCrossOffset = crossOffset;

  if (/^(top|bottom)/.test(placement)) {
    if (/^top/.test(placement)) {
      contentPosition.top = boundary.top - contentSize.height - fullMainOffset;
      polygonPosition.top = contentSize.height;
    } else {
      contentPosition.top = boundary.bottom + fullMainOffset;
      polygonPosition.top = -polygonSize;
    }

    if (/Left$/.test(placement)) {
      contentPosition.left = boundary.left + fullCrossOffset;
    } else if (/Right$/.test(placement)) {
      contentPosition.left =
        boundary.right - contentSize.width - fullCrossOffset;
    } else {
      contentPosition.left = boundary.coordinate.x - contentSize.width / 2;
    }

    polygonPosition.left = (contentSize.width - polygonSize) / 2;
    if (contentSize.width > boundary.width) {
      if (/Left$/.test(placement)) {
        polygonPosition.left = (boundary.width - polygonSize) / 2;
      } else if (/Right$/.test(placement)) {
        polygonPosition.left =
          contentSize.width - (boundary.width + polygonSize) / 2;
      }
    }
  } else {
    if (/^left/.test(placement)) {
      contentPosition.left = boundary.left - contentSize.width - fullMainOffset;
      polygonPosition.left = contentSize.width;
    } else {
      contentPosition.left = boundary.right + fullMainOffset;
      polygonPosition.left = -polygonSize;
    }

    if (/Top$/.test(placement)) {
      contentPosition.top = boundary.top + fullCrossOffset;
    } else if (/Bottom$/.test(placement)) {
      contentPosition.top =
        boundary.bottom - contentSize.height - fullCrossOffset;
    } else {
      contentPosition.top = boundary.coordinate.y - contentSize.height / 2;
    }

    polygonPosition.top = (contentSize.height - polygonSize) / 2;
    if (contentSize.height > boundary.height) {
      if (/Top$/.test(placement)) {
        polygonPosition.top = (boundary.height - polygonSize) / 2;
      } else if (/Bottom$/.test(placement)) {
        polygonPosition.top =
          contentSize.height - (boundary.height + polygonSize) / 2;
      }
    }
  }

  return {
    contentPosition,
    polygonPosition,
  };
};
