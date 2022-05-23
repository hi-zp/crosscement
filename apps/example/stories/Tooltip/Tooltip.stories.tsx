import React from 'react';
import { BasicDemo } from './BasicDemo';
import { WithScollViewDemo } from './WithScollViewDemo';

export default {
  title: 'Tooltip',
  argTypes: {
    onPress: { action: 'pressed' },
  },
};

export const Basic = (args: any) => <BasicDemo {...args} />;

export const WithScollView = (args: any) => <WithScollViewDemo {...args} />;
