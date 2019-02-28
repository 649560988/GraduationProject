import { routerRedux } from 'dva/router'
import { message } from 'antd'
import { setAuthority } from '../utils/authority'
import { reloadAuthorized } from '../utils/Authorized'
import { queryCurrentExt } from '../services/user'
import request from '../utils/request'

export default {
  namespace: 'login',

  state: {
    username: undefined,
    status: undefined
  },

  effects: {
    * login ({ payload }, { call, put }) {
      if (payload.token) {
        /**
         * 根据登录中心返回的token登录
         */
        const user = yield call(queryCurrentExt)
        yield put({
          type: 'saveCurrentUser',
          payload: {
            ...user
          }
        })
        yield put({
          type: 'menu/save',
          payload: user.menuData
        })

        yield put({
          type: 'changeLoginStatus',
          payload: {
            currentAuthority: 'admin',
            token: payload.token,
            username: 'admin',
            status: true
          }
        })
        yield put(routerRedux.replace(payload.redirect || '/'))
      } else {
        try {
        /**
         * 根据用户名密码登录
         */
          const { userName, password } = payload
          const res = yield request(`/oauth/token?username=${userName}&password=${password}&grant_type=password&client_id=client&client_secret=secret&type=222`, {
            method: 'POST',
            credentials: 'omit'
          })
          // console.log(res)
          if (res.data) {
            // todo
            localStorage.setItem('accessToken', res.data.access_token)
            localStorage.setItem('accessTokenExpire', Date.now() + res.data.expires_in * 1000)
            localStorage.setItem('refreshToken', res.data.refresh_token)
            localStorage.setItem('refreshTokenExpire', new Date('3000-01-01').getTime())
            yield put({
              type: 'changeLoginStatus',
              payload: {
                currentAuthority: 'user',
                status: true
              }
            })
            yield put(routerRedux.replace({ pathname: '/' }))
          } else {
            console.log(res)
            message.error('登录失败')
          }
        } catch (e) {
          // window.location.reload()
          message.error('登录失败，请检查用户名密码')
          yield put({
            type: 'changeLoginStatus',
            payload: {
              currentAuthority: 'guest',
              status: false
            }
          })
        }
      }
    },

    * logout (_, { put, call }) {
      // let token = localStorage['antd-pro-token']
      localStorage.clear()
      yield put(routerRedux.replace('/user/login'))
      // window.location.href = `${process.env.server}/oauth/logout?access_token=${token}`
    }
  },

  reducers: {
    changeLoginStatus (state, action) {
      // console.log(state, action)
      // @heineiuo: 登录以后，在localStorage里保存状态
      setAuthority(action.payload.currentAuthority)
      reloadAuthorized()
      return {
        ...state,
        status: action.payload.status
      }
    }
  }
}
