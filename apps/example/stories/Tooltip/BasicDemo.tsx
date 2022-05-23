import * as React from 'react';

import { Text, Button, View } from 'react-native';
import { Tooltip } from '@crosscement/react-native-tooltip';

export function BasicDemo() {
  const [visible, setVisible] = React.useState(false);
  const [placement, setPlacement] = React.useState<any>('bottom');
  return (
    <View style={{ flex: 1 }}>
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
      <View style={{ marginTop: 200 }}>
        <Tooltip
          visible={visible}
          content={<Text>tooltip</Text>}
          hasOverlay={false}
          placement={placement}
          contentStyle={{
            backgroundColor: 'red',
            maxWidth: 90,
          }}
          style={{
            backgroundColor: 'yellow',
            marginTop: 20,
            justifyContent: 'center',
            alignItems: 'center',
            width: 200,
            left: 60,
          }}
        >
          <Button title="toggle" onPress={() => setVisible(!visible)} />
        </Tooltip>
      </View>
    </View>
  );
}
