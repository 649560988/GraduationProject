import React from 'react'
import { connect } from 'dva'
import { Spin } from 'antd'
import { Redirect } from 'dva/router'
import request from '../../src/utils/request'
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
      console.log('redirect',redirect)
        return '/home'
        // return redirect ? redirect.path : '/exception/404'
      
      
    }
  }
//   componentWillMount(){
//     this.getCurrentUser()
//   }
//  getCurrentUser(){
//     console.log('进入函数')
//     let url = '/v1/sysUserDomin/getAuth'
//    request(url, {
//         method: 'GET'
//     }).then((res) => {
//       if (res.message === '成功') {
//         console.log('redirect','吱吱吱吱吱吱吱吱')
//         res.data.sysRoles.map((item,index)=>{
//         if(item.indexOf('building_user')>-1){
//           this.setState({
//             user:true
//           })
//         }
//         if(item.indexOf('admin')>-1){
//           this.setState({
//             admin:true
//           })
//         }
//         })
//       } 
//       else 
//       {
//         console.log('res.data未登录')
//       }
//     }).catch(() => {
//       console.log('res.data出错')
    
//     })
//   }
  render () {
    const { menu } = this.props
    if (menu.isLoading) return <Spin />

    const baseRedirect = this.getBaseRedirect()
    return (
      <Redirect to={baseRedirect} />
    )
  }
}
