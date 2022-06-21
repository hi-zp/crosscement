import React from 'react';
import { BasicDemo } from './BasicDemo';
import { BottomDemo } from './BottomDemo';

export default {
  title: 'Modal',
  argTypes: {
    onPress: { action: 'pressed' },
  },
};

export const Basic = (args: any) => <BasicDemo {...args} />;

export const Bottom = (args: any) => <BottomDemo {...args} />;
