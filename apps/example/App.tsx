import React from 'react';
import StorybookUIRoot from './.ondevice/Storybook';
import { SafeAreaView } from 'react-native';
import { DropdownProvider } from '@crosscement/react-native-dropdown';
import { TooltipProvider } from '@crosscement/react-native-tooltip';
import { ModalProvider } from '@crosscement/react-native-modals';

export default () => (
  <ModalProvider>
    <DropdownProvider>
      <TooltipProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <StorybookUIRoot />
        </SafeAreaView>
      </TooltipProvider>
    </DropdownProvider>
  </ModalProvider>
);
