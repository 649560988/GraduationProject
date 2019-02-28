import React, { Fragment } from 'react'
import { Link, Redirect, Switch, Route } from 'dva/router'
import DocumentTitle from 'react-document-title'
import { Icon } from 'antd'
import GlobalFooter from '../components/GlobalFooter'
import styles from './UserLayout.less'
// import logo from '../assets/logo.svg'
import { getRoutes, getPageQuery, getQueryPath } from '../utils/utils'
import qs from 'qs'

const links = [
  {
    key: 'help',
    title: '帮助',
    href: ''
  },
  {
    key: 'privacy',
    title: '隐私',
    href: ''
  },
  {
    key: 'terms',
    title: '条款',
    href: ''
  }
]

const copyright = (
  <Fragment>
    Copyright <Icon type='copyright' /> 2018 {process.env.companyname} 出品
  </Fragment>
)

function getLoginPathWithRedirectPath () {
  const params = getPageQuery()
  const { redirect } = params
  return getQueryPath('/user/login', {
    redirect
  })
}

class UserLayout extends React.PureComponent {
  componentDidMount () {
    /**
     * 跳转到授权服务器
     */
    return null
    window.location.href = `${process.env.server}/oauth/oauth/authorize?${qs.stringify({
      response_type: 'token',
      client_id: process.env.clientId,
      state: ''
    })}`
  }

  getPageTitle () {
    const { routerData, location } = this.props
    const { pathname } = location
    let title = process.env.titlename
    if (routerData[pathname] && routerData[pathname].name) {
      // title = `${routerData[pathname].name} - ${process.env.titlename}`;
      title = `${process.env.titlename}`
    }
    return title
  }

  render () {
    const { routerData, match } = this.props
    // return null
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to='/'>
                  {/* <img alt="logo" className={styles.logo} src={logo} /> */}
                  <span className={styles.title}>{process.env.titlename}</span>
                </Link>
              </div>
              <div className={styles.desc}>
                {/* TODO slogan */}
              </div>
            </div>
            <Switch>
              {getRoutes(match.path, routerData).map(item => (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              ))}
              <Redirect from='/user' to={getLoginPathWithRedirectPath()} />
            </Switch>
          </div>
          <GlobalFooter links={links} copyright={copyright} />
        </div>
      </DocumentTitle>
    )
  }
}

export default UserLayout
