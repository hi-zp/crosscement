import { RefObject } from 'react';
import { Dimensions, HostComponent } from 'react-native';
import {
  IAlignment,
  IBoundary,
  IPlacement,
  IPosition,
  IRect,
  ISide,
} from '../types';
import { isRTL } from '../utils';

interface IOptions {
  /**
   * The ref for the element which the overlay positions itself with respect to.
   */
  targetRef: RefObject<any>;
  /**
   * The ref for the overlay element.
   */
  overlayRef: RefObject<any>;
  /**
   * The placement of the element with respect to its anchor element.
   * @default 'bottom'
   */
  placement?: IPlacement;
  /**
   * When used inside scoll, need to send scroll node
   */
  scrollNode?: HostComponent<unknown> | number;
  /**
   * The additional offset applied along the main axis between the element and its
   * anchor element.
   * @default 0
   */
  mainOffset?: number;
  /**
   * The additional offset applied along the cross axis between the element and its
   * anchor element.
   * @default 0
   */
  crossOffset?: number;
  /**
   * Whether the element should flip its orientation (e.g. top to bottom or left to right) when
   * there is insufficient room for it to render completely.
   * @default true
   */
  // shouldFlip?: boolean;
  /**
   * The arrow size, only supports a single size.
   * @default 8
   */
  arrowSize?: number;
  /**
   * The arrow offset from main axis.
   * @default 0
   */
  arrowOffset: number;
}

export const calculatePosition = async (options: IOptions) => {
  const {
    placement = 'bottom',
    mainOffset = 0,
    crossOffset = 0,
    arrowSize = 8,
    arrowOffset = 0,
  } = options;

  const { targetBoundary, overlayRect } = await measure(options);

  const floating: Partial<IPosition> = {};
  const arrow: IPosition = {
    left: 'auto',
    right: 'auto',
    bottom: 'auto',
    top: 'auto',
  };

  const fullMainOffset = mainOffset + arrowSize;
  const fullCrossOffset = crossOffset;

  const [side, alignment] = placement.split('-') as [ISide, IAlignment];

  const crossSide = CROSS_SIDE[side];
  const crossSize = CROSS_SIZE[side];

  const windows = Dimensions.get('window');
  const rtl = isRTL();
  const vertical = side === 'top' || side === 'bottom';

  // handle axis
  if (side === 'top') {
    floating.top = targetBoundary.top - overlayRect.height - fullMainOffset;
  } else if (side === 'bottom') {
    floating.top = targetBoundary.bottom + fullMainOffset;
  } else if (side === 'left') {
    floating.left = rtl
      ? windows.width -
        targetBoundary.right -
        overlayRect.width -
        fullMainOffset
      : targetBoundary.left - overlayRect.width - fullMainOffset;
  } else {
    floating.left = rtl
      ? windows.width - targetBoundary.left + fullMainOffset
      : targetBoundary.right + fullMainOffset;
  }

  // handle cross
  if (alignment === 'start') {
    floating[crossSide] =
      vertical && rtl
        ? windows.width -
          targetBoundary[getFlipSide(crossSide)] +
          fullCrossOffset
        : targetBoundary[crossSide] + fullCrossOffset;
  } else if (alignment === 'end') {
    floating[crossSide] =
      vertical && rtl
        ? windows[crossSize] -
          targetBoundary[crossSide] -
          overlayRect[crossSize] -
          fullCrossOffset
        : targetBoundary[getFlipSide(crossSide)] -
          overlayRect[crossSize] -
          fullCrossOffset;
  } else {
    floating[crossSide] =
      vertical && rtl
        ? windows[crossSize] -
          targetBoundary[getFlipSide(crossSide)] +
          (targetBoundary[crossSize] - overlayRect[crossSize]) / 2
        : targetBoundary[crossSide] +
          targetBoundary[crossSize] / 2 -
          overlayRect[crossSize] / 2;
  }

  // handle arrow
  arrow[getFlipSide(side)] = -arrowSize;
  if (alignment === 'start') {
    arrow[crossSide] = Math.min(
      arrowOffset,
      overlayRect[crossSize] - arrowSize
    );
  } else if (alignment === 'end') {
    arrow[getFlipSide(crossSide)] = Math.min(
      arrowOffset,
      overlayRect[crossSize] - arrowSize
    );
  } else {
    arrow[crossSide] = (overlayRect[crossSize] - arrowSize) / 2;
  }

  return {
    floating,
    arrow,
  };
};

const measure = (
  options: Pick<IOptions, 'scrollNode' | 'targetRef' | 'overlayRef'>
) => {
  return new Promise<{ targetBoundary: IBoundary; overlayRect: IRect }>(
    (resolve) => {
      const main = () => {
        Promise.all([
          measureTargetBoundary(options.targetRef, options.scrollNode),
          measureOverlayRect(options.overlayRef),
        ]).then(([targetBoundary, overlayRect]) => {
          // Sometimes measure returns height/width 0. Best solution would be to use onLayout callback, but that might diverege from React Aria's useOverlayPosition API. Decide later, this works for now
          if (
            !targetBoundary.width ||
            !targetBoundary.height ||
            !overlayRect.width ||
            !overlayRect.height
          ) {
            requestAnimationFrame(main);
            return;
          }
          resolve({ targetBoundary, overlayRect });
        });
      };
      main();
    }
  );
};

const measureTargetBoundary = (
  targetRef: IOptions['targetRef'],
  scrollNode?: IOptions['scrollNode']
) =>
  new Promise<IBoundary>((resolve) => {
    if (scrollNode) {
      targetRef.current?.measureLayout(
        scrollNode,
        (left: number, top: number, width: number, height: number) => {
          resolve({
            left,
            right: left + width,
            top,
            bottom: top + height,
            width,
            height,
          });
        },
        () => null
      );
    } else {
      targetRef.current?.measureInWindow(
        (x: number, y: number, width: number, height: number) => {
          resolve({
            left: x,
            right: x + width,
            top: y,
            bottom: y + height,
            width,
            height,
          });
        }
      );
    }
  });

const measureOverlayRect = (overlayRef: IOptions['overlayRef']) =>
  new Promise<IRect>((resolve) => {
    overlayRef.current?.measure(
      (_x: number, _y: number, width: number, height: number) => {
        resolve({ width, height });
      }
    );
  });

const getFlipSide = (side: ISide) => {
  return {
    left: 'right',
    right: 'left',
    bottom: 'top',
    top: 'bottom',
  }[side] as ISide;
};

const CROSS_SIDE = {
  left: 'top',
  right: 'top',
  top: 'left',
  bottom: 'left',
} as any;

const CROSS_SIZE = {
  left: 'height',
  right: 'height',
  top: 'width',
  bottom: 'width',
} as any;
