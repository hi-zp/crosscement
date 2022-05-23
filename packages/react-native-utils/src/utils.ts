import { I18nManager } from 'react-native';

export const isRTL = () => {
  // To support previous RN versions. Newer versions use below getConstants()
  if (I18nManager.isRTL !== undefined) {
    return I18nManager.isRTL;
  }

  // @ts-ignore - RN web only
  if (I18nManager.getConstants) {
    // @ts-ignore - RN web only
    return I18nManager.getConstants().isRTL;
  }

  return false;
};
