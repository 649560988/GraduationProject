import { queryPasswordPolicyInfo, updatePasswordPolicyInfo } from '../services/passwordPolicy'

export default {
  namespace: 'passwordPolicy',

  state: {
    passwordPolicyInfo: {},
  },

  effects: {
    *fetch({payload}, {call, put}) {
      const response = yield call(queryPasswordPolicyInfo, payload)
      yield put({
        type: 'saveInfo',
        payload: response
      })
    },
    * update({payload, callback},{call}){
      const response = yield call(updatePasswordPolicyInfo, payload)
      callback(response)
    },
  },

  reducers: {
    saveInfo(state, action){

      // console.log(action.payload)
      return {
        ...state,
        passwordPolicyInfo: action.payload,
      }
    }
  }

}
