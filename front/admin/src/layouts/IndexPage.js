import React from 'react'
import { connect } from 'dva'
import { Spin } from 'antd'
import { Redirect } from 'dva/router'

export default
@connect(({ menu }) => ({
  menu
}))
class IndexPage extends React.Component {
  getBaseRedirect = () => {
    // According to the url parameter to redirect
    // 这里是重定向的,重定向到 url 的 redirect 参数所示地址
    const urlParams = new URL(window.location.href)

    const redirect = urlParams.searchParams.get('redirect')
    // Remove the parameters in the url
    if (redirect) {
      urlParams.searchParams.delete('redirect')
      window.history.replaceState(null, 'redirect', urlParams.href)
      return redirect
    } else {
      // const { routerData } = this.props
      // // get the first authorized route path in routerData
      // const authorizedPath = Object.keys(routerData).find(
      //   item => check(routerData[item].authority, item)
      //     && item !== '/'
      // )
      // return authorizedPath

      // TODO 跳转到第一个可访问的menu
      const { menu } = this.props
      const getFirstMenu = (item) => {
        // TODO 暂时硬编成home
        if (item.route === 'home') return item
        if (item.type === 'menu') return item
        if (!item.children) return false
        return item.children.find(item => getFirstMenu(item))
      }
      const redirect = getFirstMenu({ children: menu.menuData })
      return redirect ? redirect.path : '/exception/404'
    }
  }

  render () {
    const { menu } = this.props
    if (menu.isLoading) return <Spin />

    const baseRedirect = this.getBaseRedirect()
    return (
      <Redirect to={baseRedirect} />
    )
  }
}
