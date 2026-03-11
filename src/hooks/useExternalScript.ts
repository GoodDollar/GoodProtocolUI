import { useEffect, useState } from 'react'

type ScriptStatus = 'idle' | 'loading' | 'ready' | 'error'

/**
 * Hook to load an external script tag once and track its loading status
 * @param src - The source URL of the script to load
 * @returns The current loading status: 'idle' | 'loading' | 'ready' | 'error'
 */
export const useExternalScript = (src: string): ScriptStatus => {
    const [status, setStatus] = useState<ScriptStatus>('idle')

    useEffect(() => {
        if (!src) return

        // Check if script is already loaded
        const existingScript = document.querySelector(`script[src="${src}"]`)
        if (existingScript) {
            setStatus('ready')
            return
        }

        setStatus('loading')

        const script = document.createElement('script')
        script.src = src
        script.type = 'text/javascript'
        script.async = true

        const handleLoad = () => setStatus('ready')
        const handleError = () => setStatus('error')

        script.addEventListener('load', handleLoad)
        script.addEventListener('error', handleError)

        document.head.appendChild(script)

        return () => {
            script.removeEventListener('load', handleLoad)
            script.removeEventListener('error', handleError)
            // Don't remove script - it may be needed for the web component
        }
    }, [src])

    return status
}
