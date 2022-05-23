import * as React from 'react';
import { View, Button, ScrollView, Animated } from 'react-native';
import { Tooltip } from '@crosscement/react-native-tooltip';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
const XScrollView = Tooltip.createScrollViewHook(AnimatedScrollView);

export function WithScollViewDemo() {
  const tooltipRef = React.useRef<Tooltip>(null);

  return (
    <XScrollView>
      <View style={{ height: 500 }} />
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <Tooltip
          ref={tooltipRef}
          content={
            <Button
              title="close"
              onPress={() => tooltipRef.current?.dismiss()}
            />
          }
          contentStyle={{ height: 50, width: 100, backgroundColor: 'red' }}
          placement="left"
        >
          <Button
            title="Inside the scroll area."
            onPress={() => tooltipRef.current?.show()}
          />
        </Tooltip>
      </View>
      <View style={{ height: 500 }} />
      <Button
        title="Inside the scroll area. => close"
        onPress={() => tooltipRef.current?.dismiss()}
      />
    </XScrollView>
  );
}
