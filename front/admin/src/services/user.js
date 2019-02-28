import axios from 'axios'
import axiosWrapper from '../utils/axiosWrapper'
import flatten from 'lodash/flatten'
import uniqBy from 'lodash/uniqBy'
import { message } from 'antd'

export const mergeMenuTree = (rootNodes) => {
  let rootlength = rootNodes.length
  if (rootlength === 0) {
    return {
      subMenus: []
    }
  }
  if (rootlength === 1) return rootNodes[0]

  return rootNodes[0]
}

export async function queryCurrent () {
  const user = await axiosWrapper(axios.get(`/iam/v1/users/self`))
  user.name = user.loginName
  Object.assign(user, await queryRoles(user))
  user.menuData = await queryMenu()
  user.permissions = await queryPermissions(user.roleIdList)
  return user
}

export async function queryCurrentExt () {
  const ext = await axiosWrapper(axios.get(`iam-ext/v1/userinfo/self`))
  let { userDTO: user, roleDTOs, menuMap } = ext
  if (user === null) {
    message.error('该用户已被禁用')
  }

  user.name = user.loginName
  user.permissions = []
  user.roleNameList = []

  if (roleDTOs.length > 0) {
    const roleNameList = roleDTOs.map(item => item.name)
    user.roleNameList = roleNameList
    user.role = roleNameList.includes('超级管理员') ? '超级管理员' : roleNameList[0]
    const permissions = roleDTOs.map(role => role.permissions)
    user.permissions = uniqBy(flatten(permissions), 'code').map(item => item.code)
  }

  const showableMenu = flatten(Object.values(menuMap)).filter(item => item.code === 'ocms.code.ocms')
  if (process.env.NODE_ENV !== 'production') {
    console.log(
      showableMenu
    )
  }
  user.menuData = showableMenu.length === 0 ? [] : mergeMenuTree(showableMenu).subMenus
  return user
}

export async function queryMenu () {
  try {
    const res = await axios.get(`/iam/v1/menus?level=site&source_id=0`)
    if (res.statusText === 'OK') {
      const target = Object.values(res.data).find(item => item.code === 'ocms.code.ocms')
      if (!target) return {}
      return target.subMenus
    } else {
      throw new Error('请求失败')
    }
  } catch (e) {
    console.log(e)
    return {}
  }
}

export async function queryRoles (userData) {
  const res = await axiosWrapper(axios.post(`/iam/v1/site/role_members/users/roles`, {
    loginName: userData.loginName
  }))
  const result = {
    role: '游客',
    roleIdList: [],
    roleNameList: []
  }
  if (!res) {
    return result
  }

  let roles = []
  if (res.content instanceof Array && res.content.length > 0) {
    roles = res.content[0].roles
  }
  if (roles.length > 0) {
    result.roleIdList = roles.map(item => item.id)
    result.roleNameList = roles.map(item => item.name)
    result.role = result.roleNameList.includes('超级管理员') ? '超级管理员' : result.roleNameList[0]
  }
  return result
}

export async function queryPermissions (roleIdList) {
  const permissions = await Promise.all(roleIdList.map(id => {
    return new Promise(async (resolve, reject) => {
      const res = await axiosWrapper(axios.get(`/iam/v1/roles/${id}/permissions?page=0&size=500`))
      resolve(res.content)
    })
  }))

  const filteredPermissions = uniqBy(flatten(permissions), 'code').map(item => item.code)

  return filteredPermissions
}
