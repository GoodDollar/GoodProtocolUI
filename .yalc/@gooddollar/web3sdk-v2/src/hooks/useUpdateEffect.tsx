import { useRef, useEffect } from 'react';

// https://github.com/streamich/react-use/blob/master/src/useFirstMountState.ts
export function useFirstMountState(): boolean {
  const isFirst = useRef(true);

  if (isFirst.current) {
    isFirst.current = false;

    return true;
  }

  return isFirst.current;
}

// https://github.com/streamich/react-use/blob/master/src/useUpdateEffect.ts
const useUpdateEffect: typeof useEffect = (effect, deps) => {
  const isFirstMount = useFirstMountState();

  useEffect(() => {
    if (!isFirstMount) {
      return effect();
    }
  }, deps);
};

export default useUpdateEffect;