import React, { forwardRef } from 'react';
import { StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import type { ITooltipProps } from './types';

interface PolygonProps extends ViewProps {
  size?: ITooltipProps['arrowSize'];
  color?: ITooltipProps['arrowColor'];
  placement?: ITooltipProps['placement'];
}

const VARIATIONS: { [key in ITooltipProps['placement']]: string } = {
  'top': 'borderTopColor',
  'top-start': 'borderTopColor',
  'top-end': 'borderTopColor',
  'bottom': 'borderBottomColor',
  'bottom-start': 'borderBottomColor',
  'bottom-end': 'borderBottomColor',
  'left': 'borderLeftColor',
  'left-start': 'borderLeftColor',
  'left-end': 'borderLeftColor',
  'right': 'borderRightColor',
  'right-start': 'borderRightColor',
  'right-end': 'borderRightColor',
};

const styles = StyleSheet.create({
  root: {
    overflow: 'hidden',
    position: 'relative',
  },
  item: {
    height: 0,
    width: 0,
    borderColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export const Polygon = forwardRef<View, PolygonProps>((props, ref) => {
  const {
    size = 4,
    color = '#000000',
    placement = 'bottom',
    style,
    ...rest
  } = props;

  const rootStyle = StyleSheet.flatten([
    styles.root,
    style,
    { width: size, height: size },
  ]);

  const itemStyle = StyleSheet.flatten<ViewStyle>([
    styles.item,
    { borderWidth: size / 2 },
    { [VARIATIONS[placement]]: color },
  ]);

  return (
    <View style={rootStyle} ref={ref}>
      <View style={itemStyle} {...rest} />
    </View>
  );
});
