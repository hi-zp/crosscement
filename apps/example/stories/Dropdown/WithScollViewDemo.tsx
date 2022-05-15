import * as React from 'react';
import { View, Button, ScrollView, Animated } from 'react-native';
import { Dropdown } from '@crosscement/react-native-dropdown';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
const XScrollView = Dropdown.createScrollViewHook(AnimatedScrollView);

export function WithScollViewDemo() {
  const dropdownRef = React.useRef<Dropdown>(null);
  return (
    <XScrollView>
      <View style={{ height: 500 }} />
      <View>
        <Dropdown
          ref={dropdownRef}
          expand={
            <View style={{ height: 100, backgroundColor: 'red' }}>
              <Button
                title="Inside the scroll area. => close"
                onPress={() => dropdownRef.current?.dismiss()}
              />
            </View>
          }
        >
          <Button
            title="Inside the scroll area."
            onPress={() => dropdownRef.current?.show()}
          />
        </Dropdown>
      </View>
      <View style={{ height: 500 }} />
      <Button
        title="Inside the scroll area. => close"
        onPress={() => dropdownRef.current?.dismiss()}
      />
    </XScrollView>
  );
}
