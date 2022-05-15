import * as React from 'react';

import { Text, SafeAreaView, Button, View } from 'react-native';
import {
  IPlacement,
  Tooltip,
  TooltipProdiver,
} from '@crosscement/react-native-tooltip';

export function BasicDemo() {
  const [visible, setVisible] = React.useState(false);
  const [placement, setPlacement] = React.useState<IPlacement>('bottom');
  return (
    <TooltipProdiver>
      <SafeAreaView style={{ flex: 1 }}>
        <Text style={{ fontWeight: 'bold' }}>Placement</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {Tooltip.placements.map((i) => (
            <Text
              key={i}
              style={{ padding: 12, color: placement === i ? 'red' : 'black' }}
              onPress={() => setPlacement(i)}
            >
              {i}
            </Text>
          ))}
        </View>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Tooltip
            visible={visible}
            content={<Text>tooltip</Text>}
            hasOverlay={false}
            placement={placement}
            contentStyle={{
              backgroundColor: 'red',
              maxWidth: 100,
            }}
            style={{
              backgroundColor: 'yellow',
              marginTop: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button title="toggle" onPress={() => setVisible(!visible)} />
          </Tooltip>
        </View>
      </SafeAreaView>
    </TooltipProdiver>
  );
}
