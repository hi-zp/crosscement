import { RefObject } from 'react';
import { HostComponent } from 'react-native';
import { IPlacement } from '../types';

export interface IOptions {
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
   * @default 0
   */
  arrowSize?: number;
  /**
   * The arrow offset from main axis.
   * @default 0
   */
  arrowOffset?: number;
  /**
   * Set layout to right-to-left.
   * @default false
   */
  isRTL?: boolean;
}
