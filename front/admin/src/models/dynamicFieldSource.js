import { fetch } from '../services/dynamicFieldSource'

export default {
  namespace: 'dynamicFieldSource',

  state: {
    data: [], // 数据
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0
    }, // 分页信息
    btnDeleteBatchLoading: false // 批量删除按钮loading状态
  },

  effects: {
    * fetch ({payload}, { call, put }) {
      const response = yield call(fetch, payload)
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
    },
    * fetchCurrent (_, { call, put }) {
      const response = yield call(queryCurrent)
      yield put({
        type: 'saveCurrentUser',
        payload: response
      })
    }
  },

  reducers: {
    save (state, action) {
      return {
        ...state,
        list: action.payload
      }
    },
    saveCurrentUser (state, action) {
      return {
        ...state,
        currentUser: action.payload || {}
      }
    },
    changeNotifyCount (state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload
        }
      }
    }
  }
}
