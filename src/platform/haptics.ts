import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

let enabled = true;
export const setHaptics = (on: boolean) => (enabled = on);

export function buzz(kind: 'light' | 'medium' | 'heavy' = 'light'): void {
  if (!enabled) return;
  if (Capacitor.isNativePlatform()) {
    const style = kind === 'heavy' ? ImpactStyle.Heavy : kind === 'medium' ? ImpactStyle.Medium : ImpactStyle.Light;
    Haptics.impact({ style }).catch(() => {});
  } else if ('vibrate' in navigator) {
    navigator.vibrate(kind === 'heavy' ? 30 : kind === 'medium' ? 18 : 8);
  }
}
