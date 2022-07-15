import { ComponentClass } from 'react';
import { FlatListProps, ScrollViewProps, SectionListProps } from 'react-native';

export type IAlignment = 'start' | 'end';
export type ISide = 'top' | 'right' | 'bottom' | 'left';
// export type IAlignedPlacement = `${ISide}-${IAlignment}`;
export type IAlignedPlacement =
  | 'top-start'
  | 'top-end'
  | 'right-start'
  | 'right-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'left-start'
  | 'left-end';
export type IPlacement = ISide | IAlignedPlacement;

export interface IRect {
  width: number;
  height: number;
}

export interface IPosition {
  left: number | 'auto';
  right: number | 'auto';
  top: number | 'auto';
  bottom: number | 'auto';
}

export interface IBoundary {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
}

export interface IRootMargin {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export type IMeasureResult = {
  top: number;
  left: number;
  height: number;
  width: number;
};

export type IScrollableView<T> = ComponentClass<
  SectionListProps<T> | FlatListProps<T> | ScrollViewProps
>;
