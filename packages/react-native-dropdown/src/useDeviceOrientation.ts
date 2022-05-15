import { useEffect, useState } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

export const isOrientationLandscape = ({ width, height }: ScaledSize) =>
  width >= height;

export const useDeviceOrientation = (): 'PORTRAIT' | 'LANDSCAPE' => {
  const [landscape, setLandscape] = useState(
    isOrientationLandscape(Dimensions.get('screen'))
  );

  useEffect(() => {
    const onChange = ({ screen }: { screen: ScaledSize }) => {
      setLandscape(isOrientationLandscape(screen));
    };
    const subscription = Dimensions.addEventListener('change', onChange);
    return () => {
      // @ts-ignore
      if (typeof subscription?.remove === 'function') {
        // @ts-ignore
        subscription.remove();
      } else {
        Dimensions.removeEventListener('change', onChange);
      }
    };
  }, []);

  return landscape ? 'LANDSCAPE' : 'PORTRAIT';
};
