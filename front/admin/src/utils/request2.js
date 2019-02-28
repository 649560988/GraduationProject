/* global FormData */

import fetch from 'dva/fetch'
import { notification } from 'antd'
import { routerRedux } from 'dva/router'
import store from '../index'

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'
}

function checkStatus (response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  }
  const errortext = codeMessage[response.status] || response.statusText
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext
  })
  const error = new Error(errortext)
  error.name = response.status
  error.response = response
  throw error
}

async function getAuthorization () {
  try {
    const accessTokenExpire = localStorage.getItem('accessTokenExpire')
    if (!accessTokenExpire) {
      return null
    }
    let accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      return null
    }
    if (Number(accessTokenExpire) > Date.now() + 10000) {
      return `Bearer ${accessToken}`
    }

    const refreshTokenExpire = localStorage.getItem('refreshTokenExpire')
    if (!refreshTokenExpire) {
      return null
    }

    if (Number(refreshTokenExpire) < Date.now()) {
      return null
    }
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      return null
    }

    const res = await fetch(`${process.env.server}/oauth/token?grant_type=refresh_token&refresh_token=${refreshToken}&client_id=client&client_secret=secret&type=222`, {
      method: 'POST',
      credentials: 'omit'
    })
    const json = await res.json()
    accessToken = json.data.access_token
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('accessTokenExpire', Date.now() + json.data.expires_in * 1000)
    return `Bearer ${accessToken}`
  } catch (e) {
    return null
  }
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default async function request2 (url, options) {
  try {
    const defaultOptions = {
      method: 'GET',
      mode: 'cors',
      credentials: 'omit'
    }
    const newOptions = { ...defaultOptions, ...options }
    newOptions.method = newOptions.method.toUpperCase()
    const Authorization = await getAuthorization()
    if (Authorization) {
      if (!newOptions.headers) {
        newOptions.headers = {}
      }
      newOptions.headers.Authorization = Authorization
    }

    if (
      newOptions.method === 'POST' ||
      newOptions.method === 'PUT' ||
      newOptions.method === 'DELETE'
    ) {
      if (!(newOptions.body instanceof FormData)) {
        newOptions.headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
          ...newOptions.headers
        }
        newOptions.body = JSON.stringify(newOptions.body)
      } else {
        // newOptions.body is FormData
        newOptions.headers = {
          Accept: 'application/json',
          ...newOptions.headers
        }
      }
    }
    url = process.env.server + url
    let res = await fetch(url, newOptions)
    res = await checkStatus(res)

    if (newOptions.method === 'DELETE' || res.status === 204) {
      return await res.text()
    }
    return await res.json()
  } catch (e) {
    const { dispatch } = store
    const status = e.name
    if (status === 401) {
      dispatch({
        type: 'login/logout'
      })
      return
    }
    if (status === 403) {
      dispatch(routerRedux.push('/exception/403'))
      return
    }
    if (status <= 504 && status >= 500) {
      dispatch(routerRedux.push('/exception/500'))
      return
    }
    if (status >= 404 && status < 422) {
      dispatch(routerRedux.push('/exception/404'))
    }
  }
}
