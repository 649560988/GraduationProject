export function get (getter, defaultValue) {
  try {
    const value = getter()
    if (typeof value === 'undefined') {
      return defaultValue
    }
    return value
  } catch (e) {
    return defaultValue
  }
}
