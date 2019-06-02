import React from 'react'
import PropTypes from 'prop-types'
import { Layout, message, Spin, Modal } from 'antd'
import DocumentTitle from 'react-document-title'
import { connect } from 'dva'
import { Route, Redirect, Switch, routerRedux } from 'dva/router'
import { ContainerQuery } from 'react-container-query'
import classNames from 'classnames'
// import pathToRegexp from 'path-to-regexp'
import { enquireScreen, unenquireScreen } from 'enquire-js'
import GlobalHeader from '../components/GlobalHeader'
import SiderMenu from '../components/SiderMenu'
import ChangePassword from '../routes/ChangePassword/ChangePassword'
import PasswordUpdate from '../routes/PasswordUpdate/PasswordUpdate'
import NotFound from '../routes/Exception/404'
import { getRoutes } from '../utils/utils'
import Authorized from '../utils/Authorized'
import logo from '../assets/logo.svg'
import axios from 'axios/index'
import { FormattedMessage } from 'react-intl'
import styles from './BasicLayout.less'
import IndexPage from './IndexPage'
import request from '../utils/request'
const { Content, Header } = Layout
const { AuthorizedRoute } = Authorized

/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 * @param {Object} routerData 路由配置
 */
const getBreadcrumbNameMap = (menuData, routerData) => {
  const result = {}
  const childResult = {}
  for (const i of menuData) {
    if (!routerData[i.path]) {
      result[i.path] = i
    }
    if (i.children) {
      Object.assign(childResult, getBreadcrumbNameMap(i.children, routerData))
    }
  }
  return Object.assign({}, routerData, result, childResult)
}

const query = {
  'screen-xs': {
    maxWidth: 575
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599
  },
  'screen-xxl': {
    minWidth: 1600
  }
}

let isMobile
enquireScreen(b => {
  isMobile = b
})
@connect(({ user }) => ({
  user: user
}))
class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object
  };

  // state = {
  //   isMobile,
  //   psw1: '',
  //   psw2: '',
  //   flag: 0,
  //   result: 0,
  //   message1: '',
  //   message2: '',
  //   message3: ''

  // };
  state = {
    isMobile,
    psw1: '',
    psw2: '',
    flag: 1,
    result: 0,
    message1: '',
    message2: '',
    message3: '',
    visible: false
  };

  getChildContext () {
    const { location, routerData, menuData } = this.props
    return {
      location,
      breadcrumbNameMap: getBreadcrumbNameMap(menuData, routerData)
    }
  }

  componentDidMount () {
    this.enquireHandler = enquireScreen(mobile => {
      this.setState({
        isMobile: mobile
      })
    })
    const { dispatch } = this.props
    dispatch({
      type: 'user/fetchCurrent'
    })
    dispatch({
      type: 'menu/fetch'
    })
    document.body.classList.add(styles.BasicLayoutBodyClass)
  }

  componentWillUnmount () {
    unenquireScreen(this.enquireHandler)
    document.body.classList.remove(styles.BasicLayoutBodyClass)
  }

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed
    })
  };

  handleNoticeClear = type => {
    message.success(`清空了${type}`)
    const { dispatch } = this.props
    dispatch({
      type: 'global/clearNotices',
      payload: type
    })
  };

  // /**
  //  * 获取新密码和原始密码
  //  * 以及标志位
  //  * @param key
  //  */
  // getPassword=(psw1, psw2, flag) => {
  //   this.setState({
  //     psw1: psw1,
  //     psw2: psw2,
  //     flag: flag
  //   })
  // };

  // /**
  //  * 获取错误原因
  //  */
  // getErrorMessage = (message1, message2, message3) => {
  //   this.setState({
  //     message1: message3,
  //     message2: message1,
  //     message3: message2
  //   })
  // };

  // /**
  //  * 修改密码
  //  * @param key
  //  */
  // updatePassword =() => {
  //   let _this = this
  //   axios({
  //     method: 'put',
  //     url: 'iam/v1/users/' + this.props.user.currentUser.id + '/password',
  //     data: {
  //       originalPassword: this.state.psw1,
  //       password: this.state.psw2
  //     },
  //     async: false
  //   }).then((res) => {
  //     if (res.data.failed) {
  //       if (res.data.message === 'The original password is wrong') {
  //         _this.error('原始密码错误', '')
  //       } else {
  //         _this.error(res.data.message, '', '')
  //       }
  //     } else {
  //       _this.success(_this.state.psw2)
  //     }
  //   }).catch((err) => {
  //     console.log(err)
  //   })
  // };

  // // 修改失败提示框
  // error=(message1, message2, message3) => {
  //   let errorMes = <div>
  //     <p>{message1}</p>
  //     <p>{message2}</p>
  //     <p>{message3}</p>
  //   </div>
  //   if (errorMes.props.children[0].props.children.length === 0 && errorMes.props.children[1].props.children.length === 0 && errorMes.props.children[2].props.children.length === 0) {
  //     errorMes = <p>输入不能为空</p>
  //   }
  //   Modal.error({
  //     title: '修改失败',
  //     content: errorMes
  //   })
  //   // setTimeout(() => modal.destroy(), 1000);
  // };
  // // 修改成功提示框
  // success=(newPassword) => {
  //   let mess = <p>修改成功<br />新密码为：{newPassword}</p>
  //   const modal = Modal.success({
  //     title: '修改成功',
  //     content: mess
  //   })
  //   setTimeout(() => modal.destroy(), 1000)
  // };

  /**
   * 获取新密码和原始密码
   * 以及标志位
   * @param key
   */
  // getPassword=(psw1, psw2, flag) => {
  //   this.setState({
  //     psw1: psw1,
  //     psw2: psw2,
  //     flag: flag
  //   })
  // };

  /**
   * 获取错误原因
   */
  // getErrorMessage =(message1, message2, message3) => {
  //   this.setState({
  //     message1: message3,
  //     message2: message1,
  //     message3: message2
  //   })
  // };

  /**
   * 修改密码
   * @param key
   */
  // updatePassword =() => {
  //   let _this = this
  //   axios({
  //     method: 'put',
  //     url: 'iam/v1/users/' + this.props.user.currentUser.id + '/password',
  //     data: {
  //       originalPassword: this.state.psw1,
  //       password: this.state.psw2
  //     },
  //     async: false
  //   }).then((res) => {
  //     if (res.data.failed) {
  //       if (res.data.message === 'The original password is wrong') {
  //         _this.error('原始密码错误', '', '')
  //       } else {
  //         _this.error(res.data.message, '', '')
  //       }
  //     } else {
  //       _this.success(_this.state.psw2)
  //     }
  //   }).catch((err) => {
  //     console.log(err)
  //   })
  // };

  // 修改失败提示框
  // error=(message1, message2, message3) => {
  //   let errorMes = <div>
  //     <p>{message1}</p>
  //     <p>{message2}</p>
  //     <p>{message3}</p>
  //   </div>
  //   if (errorMes.props.children[0].props.children.length === 0 && errorMes.props.children[1].props.children.length === 0 && errorMes.props.children[2].props.children.length === 0) {
  //     errorMes = <p>输入不能为空</p>
  //   }
  //   Modal.error({
  //     title: '修改失败',
  //     content: errorMes
  //   })
    // setTimeout(() => modal.destroy(), 1000);
  // };
  // 修改成功提示框
  // success=(newPassword) => {
  //   this.handleCancel()
  //   let mess = <p>修改成功<br />新密码为：{newPassword}</p>
  //   const modal = Modal.success({
  //     title: '修改成功',
  //     content: mess
  //   })
  //   setTimeout(() => modal.destroy(), 1000)
  // };

  // handleCancel = () => {
  //   this.setState({
  //     visible: false,
  //     message1: '',
  //     message2: '',
  //     message3: ''
  //   })
  // }

  // handleOk = () => {
  //   if (this.state.flag === 1) {
  //     this.updatePassword()
  //     this.setState({
  //       flag: 0
  //     })
  //   } else if (this.state.flag === 0) {
  //     this.error(this.state.message1, this.state.message2, this.state.message3)
  //   }
  // }

  handleMenuClick = ({ key }) => {
    const { dispatch } = this.props
    if (key === 'triggerError') {
      dispatch(routerRedux.push('/exception/trigger'))
      return
    }
    if (key === 'personal') {
      // dispatch(routerRedux.push('/person/information'))
      dispatch(routerRedux.push('/setting/personal-update'))
      return
    }
    if (key === 'change-password') {
      this.setState({
        visible: true
      })
      // let _this = this
      // Modal.confirm({
      //   title: '修改密码',
      //   content: <ChangePassword getPasswpord={this.getPassword} getErrorMessage={this.getErrorMessage} />,
      //   okText: '确定',
      //   cancelText: '取消',
      //   iconType: ' ',
      //   // iconType:
      //   onOk () {
      //     if (_this.state.flag === 1) {
      //       _this.updatePassword()
      //       _this.setState({
      //         flag: 0
      //       })
      //     } else if (_this.state.flag === 0) {
      //       _this.error(_this.state.message1, _this.state.message2, _this.state.message3)
      //       _this.setState({
      //         message1: '',
      //         message2: '',
      //         message3: ''
      //       })
      //     }
      //   }
      // })
      return
    }
    if (key === 'logout') {
     this.logout()
      dispatch({
        type: 'login/logout'
      })
    }
  };
   /**
     * 创建新用户
     */
    logout= () => {
      request('/user/logout',{
        method: 'POST',
      }
      )
    }
  handleOnCancel = () => {
    this.setState({
      visible: false
    })
  }

  handleNoticeVisibleChange = visible => {
    const { dispatch } = this.props
    if (visible) {
      dispatch({
        type: 'global/fetchNotices'
      })
    }
  };

  render () {
    const {
      menuData,
      currentUser,
      collapsed,
      fetchingNotices,
      notices,
      routerData,
      match,
      location
    } = this.props

    /**
     * 根据菜单取得重定向地址.
     */
    const redirectData = []
    const getRedirect = item => {
      if (item && item.children) {
        if (item.children[0] && item.children[0].path) {
          redirectData.push({
            from: `${item.path}`,
            to: `${item.children[0].path}`
          })
          item.children.forEach(children => {
            getRedirect(children)
          })
        }
      }
    }
    menuData.forEach(getRedirect)

    const { isMobile: mb } = this.state

    const layout = (
      <Layout style={{ height: '100%' }}>
        <SiderMenu
          logo={logo}
          // 不带Authorized参数的情况下如果没有权限,会强制跳到403界面
          // If you do not have the Authorized parameter
          // you will be forced to jump to the 403 interface without permission
          Authorized={Authorized}
          menuData={menuData}
          collapsed={collapsed}
          location={location}
          isMobile={mb}
          onCollapse={this.handleMenuCollapse}
        />
        <Layout style={{ flex: 1, height: '100%' }}>
          <Header style={{ padding: 0 }}>
            <GlobalHeader
              logo={logo}
              currentUser={currentUser}
              fetchingNotices={fetchingNotices}
              notices={notices}
              collapsed={collapsed}
              isMobile={mb}
              onNoticeClear={this.handleNoticeClear}
              onCollapse={this.handleMenuCollapse}
              onMenuClick={this.handleMenuClick}
              onNoticeVisibleChange={this.handleNoticeVisibleChange}
            />
          </Header>
          <PasswordUpdate handleOnCancel={this.handleOnCancel} visible={this.state.visible} />
          <Layout style={{ flex: 1, minHeight: 'auto' }}>
            <Content style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {!currentUser.id
                ? <Spin />
                : <Switch>
                  {redirectData.map(item => (
                    <Redirect key={item.from} exact from={item.from} to={item.to} />
                  ))}
                  {getRoutes(match.path, routerData).map(item => (
                    <AuthorizedRoute
                      key={item.key}
                      path={item.path}
                      component={item.component}
                      exact={item.exact}
                      authority={item.authority}
                      redirectPath='/exception/403'
                    />
                  ))}
                  <Route exact component={IndexPage} />
                  <Route render={NotFound} />
                </Switch>
              }
            </Content>
          </Layout>
        </Layout>
      </Layout>
    )

    return (
      <FormattedMessage id={process.env.titlename}>
        {(title) => (
          <DocumentTitle title={title}>
            <ContainerQuery query={query}>
              {params => <div className={classNames(params)} style={{ height: '100%' }}>{layout}</div>}
            </ContainerQuery>
          </DocumentTitle>
        )}
      </FormattedMessage>
    )
  }
}

export default connect(({ user, global = {}, menu, loading }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  menuData: menu.menuData,
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices
}))(BasicLayout)
