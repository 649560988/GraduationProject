import { query, insert } from '../services/process'
// import request from '../utils/request'
import { fakeSubmitForm } from '../services/api'
// 引入api接口

export default {
  namespace: 'process',
  state: {
    list: []
  },
  reducers: {
    save (state, action) {
      return {
        ...state,
        list: action.data
      }
    },
    insertBack (state, action) {
      return {
        ...state,
        insertBack: action.insertBack
      }
    },
    defaultInsertback (state, action) {
      return {
        ...state,
        insertBack: action.insertBack
      }
    }
  },
  effects: {
    * fetch ({payload}, { put, call }) {
      const data = yield call(query, payload)
      yield put({ type: 'save', data: data })
    },
    * insert ({payload}, { put, call }) {
      const data = yield call(insert, payload)

      yield put({ type: 'insertBack', insertBack: data })
    }
  },
  subscriptions: {
    // setup({ dispatch, history }) {
    //   return history.listen(({ pathname }) => {
    //     if (pathname === '/setting/process-template-customization') {
    //       dispatch({
    //         payload:{page:0,size:5},
    //         type: 'fetch'});
    //     }
    //   });
    // },
  }
}
