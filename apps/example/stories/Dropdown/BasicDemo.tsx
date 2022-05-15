import * as React from 'react';
import { View, Button, Text } from 'react-native';
import { Dropdown } from '@crosscement/react-native-dropdown';

export function BasicDemo() {
  const [visible, setVisible] = React.useState(false);
  const dropdownRef = React.useRef<Dropdown>(null);

  const [height, setHeight] = React.useState(100);

  const show = () => {
    setVisible(true);
  };

  const hide = () => {
    setVisible(false);
  };

  React.useEffect(() => {
    let timer = setTimeout(() => {
      setHeight(visible ? 200 : 100);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [visible]);

  return (
    <View style={{ paddingHorizontal: 12 }}>
      <Dropdown
        visible={visible}
        expand={
          <View style={{ height, backgroundColor: 'yellow' }}>
            <Text>height: {height}</Text>
            <Button title="hide dynamic container" onPress={hide} />
          </View>
        }
        onDismiss={hide}
      >
        <Text>height: {height}</Text>
        <Button title="show dynamic container" onPress={show} />
      </Dropdown>
      <View>
        <Dropdown
          ref={dropdownRef}
          expand={
            <View style={{ height: 300, backgroundColor: 'pink' }}>
              <Button
                title="hide static container with ref"
                onPress={() => dropdownRef.current?.dismiss()}
              />
            </View>
          }
        >
          <Button
            title="show static container with ref"
            onPress={() => dropdownRef.current?.show()}
          />
        </Dropdown>
      </View>
    </View>
  );
}
