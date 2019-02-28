import request from '../utils/request'
import { get } from '../utils/get'

/**
 * @typedef {Object} CurrentUser
 * @property {string} name - 用户名.
 * @property {string} id - 用户id.
 * @property {string} imageUrl - 头像.
 * @property {string} organizationId - 组织id.
 * @property {string[]} permissions - 权限列表.
 * @property {string} role - 角色.
 * @property {string[]} roleNameList - 角色列表.
 * @property {boolean} admin - 是否是admin.
 */

export default {
  namespace: 'user',

  state: {
    list: [],

    /**
     * @type {CurrentUser}
     */
    currentUser: {
      menuData: [],
      roleNameList: []
    }
  },

  effects: {
    * fetchCurrent (_, { call, put }) {
      const user = {
        menuData: [],
        roleNameList: []
      }
      const res = yield request(`/v1/sysUserDomin/getAuth`)
      user.name = res.data.userName
      user.id = res.data.id

      const menuRes = yield request(`/v1/sysUserDomin/queryRolesMenus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      user.menuData = get(() => menuRes.data.sysMenus, [])
      user.roleNameList = get(() => menuRes.data.roles, []).map(item => item.name)

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
