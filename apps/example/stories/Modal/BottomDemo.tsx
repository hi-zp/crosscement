import * as React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { Modal, SlideAnimation } from '@crosscement/react-native-modals';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
  },
});

export function BottomDemo() {
  const [visible, setVisible] = React.useState(false);

  return (
    <View style={{ flex: 1 }}>
      <Button title="open modal" onPress={() => setVisible(true)} />
      <Modal
        visible={visible}
        onDismiss={() => setVisible(false)}
        modalAnimation={new SlideAnimation({ slideFrom: 'bottom' })}
        style={styles.container}
        width={1}
      >
        <View style={{ padding: 12, backgroundColor: 'white' }}>
          <Button title="close modal" onPress={() => setVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}
