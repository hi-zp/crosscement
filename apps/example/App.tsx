import React from 'react';
import StorybookUIRoot from './.ondevice/Storybook';
import { SafeAreaView } from 'react-native';
import { DropdownProdiver } from '@crosscement/react-native-dropdown';
import { TooltipProdiver } from '@crosscement/react-native-tooltip';

export default () => (
  <DropdownProdiver>
    <TooltipProdiver>
      <SafeAreaView style={{ flex: 1 }}>
        <StorybookUIRoot />
      </SafeAreaView>
    </TooltipProdiver>
  </DropdownProdiver>
);
