import React, { PureComponent } from 'react'
import { Layout, Menu, Icon } from 'antd'
import pathToRegexp from 'path-to-regexp'
import { Link } from 'dva/router'
import { FormattedMessage } from 'react-intl'
import styles from './index.less'
import { urlToList } from '../_utils/pathTools'
import request from '../../utils/request'
const { Sider } = Layout
const { SubMenu } = Menu

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = icon => {
  if (typeof icon === 'string') {
    if (icon.indexOf('http') === 0) {
      return <img src={icon} alt='icon' className={`${styles.icon} sider-menu-item-img`} />
    }
    return <Icon type={icon} />
  }

  return icon
}

/**
 * Recursively flatten the data
 * [{path:string},{path:string}] => [path,path2]
 * @param  menu
 */
export const getFlatMenuKeys = menu =>
  menu.reduce((keys, item) => {
    keys.push(item.path)
    if (item.children) {
      return keys.concat(getFlatMenuKeys(item.children))
    }
    return keys
  }, [])

/**
 * Find all matched menu keys based on paths
 * @param  flatMenuKeys: [/abc, /abc/:id, /abc/:id/info]
 * @param  paths: [/abc, /abc/11, /abc/11/info]
 */
export const getMenuMatchKeys = (flatMenuKeys, paths) =>
  paths.reduce(
    (matchKeys, path) =>
      matchKeys.concat(flatMenuKeys.filter(item => pathToRegexp(item).test(path))),
    []
  )

export default class SiderMenu extends PureComponent {
  constructor (props) {
    super(props)
    this.flatMenuKeys = getFlatMenuKeys(props.menuData)
    this.state = {
      openKeys: this.getDefaultCollapsedSubMenus(props),
      id:'',
      name:[]
    }
  }

  componentWillReceiveProps (nextProps) {
    const { location } = this.props
    if (nextProps.location.pathname !== location.pathname) {
      this.setState({
        openKeys: this.getDefaultCollapsedSubMenus(nextProps)
      })
    }
  }
  componentWillMount(){
    this.getCurrentUser()
  }
  componentDidUpdate () {
    this.flatMenuKeys = getFlatMenuKeys(this.props.menuData)
  }

  componentWillUnmount () {
    // console.warn('SideMenu unmount')
  }

  /**
   * Convert pathname to openKeys
   * /list/search/articles = > ['list','/list/search']
   * @param  props
   */
  getDefaultCollapsedSubMenus (props) {
    const {
      location: { pathname }
    } =
      props || this.props
    return getMenuMatchKeys(this.flatMenuKeys, urlToList(pathname))
  }

  /**
   * 判断是否是http链接.返回 Link 或 a
   * Judge whether it is http link.return a or Link
   * @memberof SiderMenu
   */
  getMenuItemPath = item => {
    const itemPath = this.conversionPath(item.path)
    const icon = getIcon(item.icon)
    const { target } = item
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          {icon}
          {/* <FormattedMessage id={item.code} /> */}
          {item.name}
        </a>
      )
    }
    const { location, isMobile, onCollapse } = this.props
    return (
      <Link
        to={itemPath}
        target={target}
        replace={itemPath === location.pathname}
        onClick={
          isMobile
            ? () => {
              onCollapse(true)
            }
            : undefined
        }
      >
        {icon}
        {item.name}
        {/* <FormattedMessage id={item.code} /> */}
      </Link>
    )
  };

  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem = item => {
    if (item.children && item.children.some(child => child.name)) {
      const childrenItems = this.getNavMenuItems(item.children)
      // 当无子菜单时就不展示菜单
      if (childrenItems && childrenItems.length > 0) {
        console.log(item.code)
        // const menuName = <FormattedMessage id={item.code} />
        const menuName = item.name
        return (
          <SubMenu
            title={
              item.icon ? (
                <span>
                  {getIcon(item.icon)}
                  {menuName}
                </span>
              ) : (
                menuName
              )
            }
            key={item.path}
          >
            {childrenItems}
          </SubMenu>
        )
      }
      return null
    } else {
      return <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>
    }
  };

  /**
   * 获得菜单子节点
   * @memberof SiderMenu
   */
  getNavMenuItems = menusData => {
    if (!menusData) {
      return []
    }
    return menusData
      .filter(item => {
        // return item.name && !item.hideInMenu
        return !item.hideInMenu
      })
      .map(item => {
        // make dom
        const ItemDom = this.getSubMenuOrItem(item)
        return this.checkPermissionItem(item.authority, ItemDom)
      })
      .filter(item => item)
  };

  // Get the currently selected menu
  getSelectedMenuKeys = () => {
    const {
      location: { pathname }
    } = this.props
    return getMenuMatchKeys(this.flatMenuKeys, urlToList(pathname))
  };

  // conversion Path
  // 转化路径
  conversionPath = path => {
    if (path && path.indexOf('http') === 0) {
      return path
    } else {
      return `/${path || ''}`.replace(/\/+/g, '/')
    }
  };
 //获得当前用户
 getCurrentUser = () => {
  let url = '/v1/sysUserDomin/getAuth'
  request(url, {
      method: 'GET'
  }).then((res) => {
      if (res.message === '成功') {
        let list=[]
      res.data.sysRoles.map((item,index)=>{
      list.push(item.name)
      })
      this.setState({
        id:res.data.id,
        name:list
    })
      } else {
          console.log(err)
      }
  }).catch(() => {})
}
  // permission to check
  checkPermissionItem = (authority, ItemDom) => {
    const { Authorized } = this.props
    if (Authorized && Authorized.check) {
      const { check } = Authorized
      return check(authority, ItemDom)
    }
    return ItemDom
  };

  isMainMenu = key => {
    const { menuData } = this.props
    return menuData.some(item => key && (item.key === key || item.path === key))
  };

  handleOpenChange = openKeys => {
    const lastOpenKey = openKeys[openKeys.length - 1]
    const moreThanOne = openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1
    this.setState({
      openKeys: moreThanOne ? [lastOpenKey] : [...openKeys]
    })
  };

  render () {
    const { logo, menuData, collapsed, onCollapse } = this.props
    const { openKeys } = this.state
    // Don't show popup menu when it is been collapsed
    const menuProps = collapsed
      ? {}
      : {
        openKeys
      }
    // if pathname can't match, use the nearest parent's key
    let selectedKeys = this.getSelectedMenuKeys()
    if (!selectedKeys.length) {
      selectedKeys = [openKeys[openKeys.length - 1]]
    }
    return (
      <div>
        {
          (this.state.name.indexOf('admin')>-1)?
          <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint='lg'
          onCollapse={onCollapse}
          width={256}
          className={styles.sider}
          style={{ height: '100%', overflowY: 'auto' }}
        >
          <div className={styles.logo} key='logo'>
            <Link to='/'>
  
              <img src={logo} alt='logo' />
  
              {/*
                @author heineiuo: 由于logo隐藏掉了，所以当收起菜单的时候，要预留一个空间
              */}
              {/* <div style={{ display: 'inline-block', width: 32 }}></div> */}
              <h1>{process.env.titlename}</h1>
              {/* <FormattedMessage
                tagName='h1'
                id='ocms.code.ocms'
              /> */}
            </Link>
          </div>
          <Menu
            key='Menu'
            theme='light'
            mode='inline'
            {...menuProps}
            onOpenChange={this.handleOpenChange}
            selectedKeys={selectedKeys}
            style={{ padding: '16px 0', width: '100%' }}
            // style={{width: 256}}
          >
            {this.getNavMenuItems(menuData)}
          </Menu>
        </Sider>
        :
        <p></p>
        }
     
      </div>
    )
  }
}
