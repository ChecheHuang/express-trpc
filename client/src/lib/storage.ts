export const storage = {
  get(key: string) {
    const item = localStorage.getItem(key)
    if (!item || item === 'null' || item === 'undefined') return false
    return JSON.parse(item)
  },
  set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value))
  },
  remove(key: string) {
    localStorage.removeItem(key)
  },
  clear() {
    localStorage.clear()
  },
}

export const cookie = {
  get(key: string) {
    const arr = document.cookie?.split('; ')
    let value = ''
    arr.forEach((item) => {
      const _arr = item.split('=')
      if (_arr[0] === key) {
        value = _arr[1]
      }
    })
    return value
  },
  set(key: string, value: any, expiryDate = 1) {
    const currentDate = new Date()
    currentDate.setDate(currentDate.getDate() + expiryDate)
    document.cookie = key + '=' + value + '; expires=' + currentDate
  },
  remove(key: string) {
    this.set(key, '', -1)
  },
  clear() {
    const arr = document.cookie?.split('; ')
    arr.forEach((item) => {
      const _arr = item.split('=')
      this.set(_arr[0], '', -1)
    })
  },
}
