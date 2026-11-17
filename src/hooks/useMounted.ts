import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/** False during prerendering and hydration, true afterwards – for values that only exist in the browser. */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
