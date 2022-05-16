import React from 'react';
import StorybookUIRoot from './.ondevice/Storybook';
import { Platform, StatusBar, View } from 'react-native';
import { DropdownProdiver } from '@crosscement/react-native-dropdown';
import { TooltipProdiver } from '@crosscement/react-native-tooltip';

export default () => (
  <DropdownProdiver>
    <TooltipProdiver>
      <View
        style={{
          flex: 1,
          marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        }}
      >
        <StorybookUIRoot />
      </View>
    </TooltipProdiver>
  </DropdownProdiver>
);
