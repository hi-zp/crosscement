export type IAlignment = 'start' | 'end';
export type ISide = 'top' | 'right' | 'bottom' | 'left';
export type IAlignedPlacement = `${ISide}-${IAlignment}`;
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
