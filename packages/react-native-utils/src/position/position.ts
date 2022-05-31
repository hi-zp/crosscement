import { Dimensions } from 'react-native';
import { IAlignment, IBoundary, IPosition, IRect, ISide } from '../types';
import { IOptions } from './types';

const defaultPosition: IPosition = {
  left: 'auto',
  right: 'auto',
  bottom: 'auto',
  top: 'auto',
};

export class Position {
  public overlayPosition: Partial<IPosition> = defaultPosition;
  public arrowPosition: IPosition = defaultPosition;

  public side: ISide;
  public alignment: IAlignment;
  public rootWidth = Dimensions.get('window').width;

  private mainOffset = 0; // aixs offset, if with arrow, need to add arrow size.
  private crossOffset = 0; // cross offset
  private arrowSize = 0;
  private arrowOffset = 0;
  private isRTL: boolean;

  private targetRef: IOptions['targetRef'];
  private overlayRef: IOptions['overlayRef'];
  private scrollNode: IOptions['scrollNode'];

  private _targetBoundary: IBoundary;
  private _overlayRect: IRect;

  constructor(public readonly options: IOptions) {
    // initial option values
    this.targetRef = options.targetRef;
    this.overlayRef = options.overlayRef;
    this.scrollNode = options.scrollNode;
    this.mainOffset = (options.mainOffset ?? 0) + (options.arrowSize ?? 0);
    this.crossOffset = options.crossOffset ?? 0;
    this.arrowSize = options.arrowSize ?? 0;
    this.arrowOffset = options.arrowOffset ?? 0;
    this.isRTL = options.isRTL ?? false;

    // towards
    const [side, alignment] = options.placement.split('-') as [
      ISide,
      IAlignment
    ];
    this.side = side;
    this.alignment = alignment;
  }

  /**
   * calculate floating & reference
   * @returns position information
   */
  async calculate() {
    const { targetBoundary, overlayRect } = await measure(
      this.targetRef,
      this.overlayRef,
      this.scrollNode
    );

    this._targetBoundary = targetBoundary;
    this._overlayRect = overlayRect;

    const overlayPosition = {
      ...this._calculateAxis(targetBoundary, overlayRect),
      ...this._calculateCross(targetBoundary, overlayRect),
    };

    const arrowPosition = this._calculateArrow(overlayRect);

    return {
      overlayPosition,
      arrowPosition,
    };
  }

  public async getTargetBoundary() {
    return this._targetBoundary ?? measureTargetBoundary(this.targetRef);
  }

  public async getOverlayRect() {
    return this._overlayRect ?? measureOverlayRect(this.overlayRef);
  }

  /**
   * Handle axis
   * @param boundary reference boundary info
   * @param rect floating size
   * @returns position
   */
  private _calculateAxis(boundary: IBoundary, rect: IRect): Partial<IPosition> {
    switch (this.side) {
      case 'top':
        return { top: boundary.top - rect.height - this.mainOffset };
      case 'bottom':
        return { top: boundary.bottom + this.mainOffset };
      case 'left':
        return {
          left: this.isRTL
            ? this.rootWidth - boundary.right - rect.width - this.mainOffset
            : boundary.left - rect.width - this.mainOffset,
        };
      default:
        return {
          left: this.isRTL
            ? this.rootWidth - boundary.left + this.mainOffset
            : boundary.right + this.mainOffset,
        };
    }
  }

  /**
   * Handle cross
   * @param boundary reference boundary info
   * @param rect floating size
   * @returns position
   */
  private _calculateCross(
    boundary: IBoundary,
    rect: IRect
  ): Partial<IPosition> {
    const verticalRTL = this.isRTL && ['top', 'bottom'].includes(this.side);
    const crossSide = CROSS_SIDE[this.side];
    const crossSize = CROSS_SIZE[this.side];

    let crossOffset = 0;

    if (this.alignment === 'start') {
      crossOffset += this.crossOffset;
      if (verticalRTL) {
        crossOffset += this.rootWidth - boundary[flipSide(crossSide)];
      } else {
        crossOffset += boundary[crossSide];
      }
    } else if (this.alignment === 'end') {
      crossOffset -= this.crossOffset;
      if (verticalRTL) {
        crossOffset += this.rootWidth - boundary[crossSide] - rect[crossSize];
      } else {
        crossOffset += boundary[flipSide(crossSide)] - rect[crossSize];
      }
    } else {
      crossOffset += (boundary[crossSize] - rect[crossSize]) / 2;
      if (verticalRTL) {
        crossOffset += this.rootWidth - boundary[flipSide(crossSide)];
      } else {
        crossOffset += boundary[crossSide];
      }
    }

    return {
      [crossSide]: crossOffset,
    };
  }

  /**
   * Handle arrow, both axis and cross
   * @param rect floating size
   * @returns position
   */
  private _calculateArrow(rect: IRect): IPosition {
    const position: IPosition = {
      top: 'auto',
      left: 'auto',
      right: 'auto',
      bottom: 'auto',
    };

    if (!this.arrowSize) return position;

    const crossSide = CROSS_SIDE[this.side];
    const crossSize = CROSS_SIZE[this.side];

    // axis
    position[flipSide(this.side)] = -this.arrowSize;

    // cross
    if (this.alignment === 'start') {
      position[crossSide] = Math.min(
        this.arrowOffset,
        rect[crossSize] - this.arrowSize
      );
    } else if (this.alignment === 'end') {
      position[flipSide(crossSide)] = Math.min(
        this.arrowOffset,
        rect[crossSize] - this.arrowSize
      );
    } else {
      position[crossSide] = (rect[crossSize] - this.arrowSize) / 2;
    }

    return position;
  }
}

const measure = (
  targetRef: IOptions['targetRef'],
  overlayRef: IOptions['overlayRef'],
  scrollNode?: IOptions['scrollNode']
) => {
  return new Promise<{ targetBoundary: IBoundary; overlayRect: IRect }>(
    (resolve) => {
      const main = () => {
        Promise.all([
          measureTargetBoundary(targetRef, scrollNode),
          measureOverlayRect(overlayRef),
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

const flipSide = (side: ISide) => {
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
