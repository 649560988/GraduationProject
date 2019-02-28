// import { fakeRegister } from '../services/api'
import { setAuthority } from '../utils/authority'
import { reloadAuthorized } from '../utils/Authorized'
import axios from 'axios'
import { Alert } from 'antd'

export default {
  namespace: 'register',

  state: {
    status: undefined
  },

  effects: {
    async submit ({ payload }, { call, put }) {
      // const response = await call(fakeRegister, payload)
      delete axios.defaults.headers.common['Authorization']
      const { prefix, ...requestPayload } = payload

      const res = await axios.post(`/user/register/3`, {
        ...requestPayload
      })
      // {"retCode":0,"retData":"Register Success!"}
      console.log(res)
      if (res.retCode === 1002) {

      }
      if (res.retCode === 0) {

      }

      // await put({
      //   type: 'registerHandle',
      //   payload: response
      // })
    }
  },

  reducers: {
    registerHandle (state, { payload }) {
      // @heineiuo: 注册以后，在localStorage里保存状态
      setAuthority('user')
      reloadAuthorized()
      return {
        ...state,
        status: payload.status
      }
    }
  }
}
