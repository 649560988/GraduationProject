
import { addLocaleData } from 'react-intl'
import {
  // isCookieEnabled,
  getCookie,
  setCookie
  // removeCookie
} from '../utils/cookie'

import { queryLocalePackage } from '../services/locale'

export default {
  namespace: 'locale',

  state: {
    current: getCookie('lang') || getCookie('locale') || 'zh_cn',
    messages: {}
  },

  effects: {
    * fetchCurrent (_, { call, put }) {
      let locale = getCookie('lang') || getCookie('locale') || 'zh_cn'
      if (!['zh_cn', 'en_us'].includes(locale)) {
        locale = 'zh_cn'
        setCookie('locale', locale)
      }
      const fields = yield call(queryLocalePackage, { locale })
      addLocaleData({
        locale,
        fields,
        pluralRuleFunction (e, t) {
          return t && e === 1 ? 'one' : 'other'
        }
      })

      // const messages = defineMessages(Object.keys(fields).reduce((prev, current) => {
      //   prev[current] = {
      //     id: current,
      //     defaultMessage: fields[current]
      //   }
      //   return prev
      // }, {}))

      yield put({
        type: 'save',
        payload: { locale, messages: fields }
      })
    }
  },

  reducers: {
    save (state, action) {
      return {
        ...state,
        current: action.payload.locale,
        messages: action.payload.messages
      }
    }
  }
}
