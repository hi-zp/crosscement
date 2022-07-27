import * as React from 'react';
import { Button, View } from 'react-native';
import { Modal } from '@crosscement/react-native-modals';

export function BasicDemo() {
  const [visible, setVisible] = React.useState(false);
  const [visibleDeep, setVisibleDeep] = React.useState(false);
  const [visibleFlat, setVisibleFlat] = React.useState(false);

  return (
    <View style={{ flex: 1 }}>
      <Button title="open modal" onPress={() => setVisible(true)} />
      <Button title="open deep modal" onPress={() => setVisibleDeep(true)} />
      <Button title="open flat modal" onPress={() => setVisibleFlat(true)} />
      <Modal visible={visible} onDismiss={() => setVisible(false)}>
        <View style={{ padding: 12, backgroundColor: 'white' }}>
          <Button title="close modal" onPress={() => setVisible(false)} />
          <Button
            title="open deep modal"
            onPress={() => setVisibleDeep(true)}
          />
          <Button
            title="open flat modal"
            onPress={() => setVisibleFlat(true)}
          />
        </View>
        <Modal visible={visibleDeep} onDismiss={() => setVisibleDeep(false)}>
          <View style={{ padding: 12, backgroundColor: 'red' }}>
            <Button title="close modal" onPress={() => setVisible(false)} />
            <Button
              title="close deep modal"
              onPress={() => setVisibleDeep(false)}
            />
            <Button
              title="close flat modal"
              onPress={() => setVisibleFlat(false)}
            />
          </View>
        </Modal>
      </Modal>
      {/* test for back handler */}
      <Modal visible={visibleFlat} onDismiss={() => setVisible(false)}>
        <View style={{ padding: 12, backgroundColor: 'white' }}>
          <Button title="open modal" onPress={() => setVisible(true)} />
          <Button title="close modal" onPress={() => setVisible(false)} />
          <Button
            title="close deep modal"
            onPress={() => setVisibleDeep(false)}
          />
          <Button
            title="close flat modal"
            onPress={() => setVisibleFlat(false)}
          />
        </View>
      </Modal>
    </View>
  );
}
