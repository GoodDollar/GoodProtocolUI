export function tryJson<T = any>(source: string): T | null | string {
  if (source === null) {
    return null
  }

  try {
    return JSON.parse(source)
  } catch {
    return source
  }
}
