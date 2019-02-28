import { isUrl } from '../utils/utils'

/**
 *
 * @param {object[]} data
 * @param {*} parentPath
 * @param {*} parentAuthority
 * @param {*} level
 */
const formatter = (data, parentPath = '', parentAuthority = 'user', level = 1) => {
  let menu = data.sort((left, right) => left.id < right.id ? -1 : 1).map(item => {
    const { route, children: subMenus, menuName: name, id: code, icon, type } = item
    let path = route
    let authority = parentAuthority
    const result = {
      code,
      name,
      route,
      type,
      icon,
      path: `${parentPath}/${path}`,
      authority: parentAuthority
    }

    if (subMenus) {
      result.children = formatter(subMenus, result.path, authority, level + 1)
    }
    return result
  })

  return menu
}

export default {
  namespace: 'menu',

  state: {
    isLoading: true,
    menuData: []
  },

  effects: {

  },

  reducers: {
    save (state, action) {
      let menuData = formatter(action.payload)
      return {
        ...state,
        isLoading: false,
        menuData
      }
    }
  }
}
