import { useCallback, useRef } from 'react'
import { restart } from './useAppRestart.api'

let isRestarting = false

export default function useAppRestart(): typeof restart {
  const restartingRef = useRef(isRestarting)

  return useCallback((path?: string): void => {
    if (restartingRef.current) {
      return
    }

    restartingRef.current = isRestarting = true
    restart(path)
  }, [])
}
