import React from 'react';
import { BasicDemo } from './BasicDemo';

export default {
  title: 'Tooltip',
  argTypes: {
    onPress: { action: 'pressed' },
  },
};

export const Basic = (args: any) => <BasicDemo {...args} />;
