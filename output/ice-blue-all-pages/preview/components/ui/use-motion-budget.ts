'use client';

import { useEffect, useState } from 'react';

type Connection = EventTarget & { saveData?: boolean };
type DeviceNavigator = Navigator & { deviceMemory?: number; connection?: Connection };
export type MotionBudget = 'full' | 'limited' | 'reduced';

// Start with static content, including during SSR. Motion is progressive enhancement.
export function useMotionBudget(): MotionBudget {
  const [budget, setBudget] = useState<MotionBudget>('reduced');
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const touch = window.matchMedia('(pointer: coarse)');
    const device = navigator as DeviceNavigator;
    const update = () =>
      setBudget(
        preference.matches
          ? 'reduced'
          : touch.matches ||
              device.connection?.saveData ||
              (device.hardwareConcurrency > 0 && device.hardwareConcurrency <= 4) ||
              (device.deviceMemory !== undefined && device.deviceMemory <= 4)
            ? 'limited'
            : 'full',
      );
    update();
    preference.addEventListener('change', update);
    touch.addEventListener('change', update);
    device.connection?.addEventListener('change', update);
    return () => {
      preference.removeEventListener('change', update);
      touch.removeEventListener('change', update);
      device.connection?.removeEventListener('change', update);
    };
  }, []);
  return budget;
}
