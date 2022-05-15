import * as React from 'react';
import { View, Button, ScrollView, Animated, Text } from 'react-native';
import { Dropdown } from '@crosscement/react-native-dropdown';

const XScrollView = Animated.createAnimatedComponent(
  Dropdown.createScrollViewHook(ScrollView)
);

export function WithNestedScollViewDemo() {
  const dropdownRef = React.useRef<Dropdown>(null);
  const ref = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    ref.current?.scrollToEnd();
  }, []);

  return (
    <ScrollView>
      <View style={{ height: 500 }} />
      <XScrollView ref={ref} style={{ height: 300 }}>
        <View style={{ height: 500, backgroundColor: 'pink' }} />
        <View>
          <Dropdown
            ref={dropdownRef}
            expand={<View style={{ height: 100, backgroundColor: 'red' }} />}
          >
            <Button
              title={`Inside the scroll area. \n Current state: hide`}
              onPress={() => dropdownRef.current?.show()}
            />
          </Dropdown>
        </View>
        <View style={{ height: 500, backgroundColor: 'pink' }} />
      </XScrollView>
      <Text>Top ScrollView</Text>
      <View style={{ height: 500 }} />
    </ScrollView>
  );
}
