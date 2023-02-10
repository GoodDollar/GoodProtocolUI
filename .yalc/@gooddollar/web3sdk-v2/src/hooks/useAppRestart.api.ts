export const restart = (path?: string): void => {
  const { location } = window

  if (!path) {
    location.reload()
    return
  }

  location.replace(path)
}
