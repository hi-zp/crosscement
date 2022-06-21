import * as React from 'react';
import { Button, View } from 'react-native';
import { Modal } from '@crosscement/react-native-modals';

export function BasicDemo() {
  const [visible, setVisible] = React.useState(false);

  return (
    <View style={{ flex: 1 }}>
      <Button title="open modal" onPress={() => setVisible(true)} />
      <Modal visible={visible} onDismiss={() => setVisible(false)}>
        <View style={{ padding: 12, backgroundColor: 'white' }}>
          <Button title="close modal" onPress={() => setVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}
