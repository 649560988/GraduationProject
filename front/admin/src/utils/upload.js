
/**
 * @name upload
 * @param option {
 *  onProgress: (event: { percent: number }): void,
 *  onError: (event: Error, body?: Object): void,
 *  onSuccess: (body: Object): void,
 *  data: Object,
 *  name: String,
 *  file: File,
 *  withCredentials: Boolean,
 *  url: String,
 *  headers: Object,
 * }
 */
export const upload = (option) => {
  if (!option.method) option.method = 'post'
  const getError = (option, xhr) => {
    const msg = `cannot post ${option.url} ${xhr.status}'`
    const err = new Error(msg)
    err.status = xhr.status
    err.method = option.method
    err.url = option.url
    return err
  }

  const getBody = (xhr) => {
    const text = xhr.responseText || xhr.response
    if (!text) return text

    try {
      return JSON.parse(text)
    } catch (e) {
      return text
    }
  }
  const xhr = new XMLHttpRequest() // eslint-disable-line
  if (option.onProgress && xhr.upload) {
    xhr.upload.onprogress = e => {
      if (e.total > 0) {
        e.percent = e.loaded / e.total * 100
      }
      option.onProgress(e)
    }
  }
  xhr.onerror = e => option.onError(e)
  xhr.onload = () => {
    if (xhr.status < 200 || xhr.status >= 300) {
      return option.onError(getError(option, xhr), getBody(xhr))
    }
    option.onSuccess(getBody(xhr), xhr)
  }
  xhr.open(option.method, option.url, true)

  if (option.withCredentials && 'withCredentials' in xhr) {
    xhr.withCredentials = true
  }

  const headers = option.headers || {}
  Object.keys(headers).forEach(h => {
    if (headers[h]) xhr.setRequestHeader(h, headers[h])
  })
  if (headers['X-Requested-With']) {
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
  }

  const formData = new FormData() // eslint-disable-line
  if (option.data) {
    Object.keys(option.data).forEach(key => {
      formData.append(key, option.data[key])
    })
  }
  formData.append(option.name || 'file', option.file)

  xhr.send(formData)
  return xhr
}
