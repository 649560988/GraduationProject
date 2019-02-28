import { queryIntlList, checkUnique, add, updateChange } from '../services/intl'

export default {
  namespace: 'intl',

  state: {
    list: [],
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0
    },
    selectedItem: undefined
  },

  effects: {

    * fetch ({payload}, {call, put}){
      const response = yield call( queryIntlList, payload)
      yield put({
        type: 'saveIntlList',
        payload: response
      })
    },

    * checkUnique ({payload, callback},{ call }){
      const response = yield call(checkUnique, payload)
      callback(response)
    },

    * add({payload, callback},{ call }){
      const response = yield call(add,payload)
      callback(response)
    },

    * updateSelectedItem ({payload, callback}, {put}){
      yield put({
        type: 'saveSelectedItem',
        payload: payload
      })
      callback()
    },

    * update ({payload, callback}, {call}){
      const response = yield call(updateChange,payload)
      callback(response)
    }
  },

  reducers: {

    saveIntlList( state, action ){
      return {
        ...state,
        list: action.payload.content,
        pagination: {
          current: action.payload.number + 1,
          pageSize: action.payload.size,
          total: action.payload.totalElements
        }
      }
    },

    saveSelectedItem(state, action){
      return {
        ...state,
        selectedItem: action.payload
      }
    }
  }

}
