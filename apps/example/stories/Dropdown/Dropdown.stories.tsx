import React from 'react';

import { BasicDemo } from './BasicDemo';
import { WithScollViewDemo } from './WithScollViewDemo';
import { WithNestedScollViewDemo } from './WithNestedScollViewDemo';

export default {
  title: 'Dropdown',
  argTypes: {
    onPress: { action: 'pressed' },
  },
};

export const Basic = (args: any) => <BasicDemo {...args} />;

Basic.args = {
  text: 'Hello World',
  color: 'purple',
};

export const WithScollView = (args: any) => <WithScollViewDemo {...args} />;

export const WithNestedScollView = (args: any) => (
  <WithNestedScollViewDemo {...args} />
);
