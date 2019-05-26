import React, { PureComponent ,Fragment} from 'react'
import { Menu, Icon, Spin, Tag, Drawer, Avatar, Dropdown, Divider, Button } from 'antd'
import moment from 'moment'
import groupBy from 'lodash/groupBy'
import Debounce from 'lodash-decorators/debounce'
import { Link } from 'dva/router'
import styles from './index.less'
import styled from 'styled-components'
import { setCookie } from '../../utils/cookie'
import { connect } from 'dva'
// import { request } from 'http';
import request from '../../utils/request'

const AvatarCard = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  margin-left: -24px;
  margin-right: -24px;
  border-bottom: 1px solid #EEE;
`

const RoleNames = styled.div`
  font-size: 12px;
  line-height: 30px;
  color: #666;
`
export default @connect(({ locale }) => ({
  locale
}))
class GlobalHeader extends PureComponent {
  constructor(props){
    super(props);
    this.state={
      cuttentItem: '首页',
      list:[],
      isCurrentUser:false
    }
  }
  state = {
    drawerVisible: false
  }
componentWillMount(){
  this.getCurrentUser()
}
  componentWillUnmount () {
    this.triggerResizeEvent.cancel()
 
  }
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
          list,
          isCurrentUser:true
        })
        } else {
            console.log(err)
        }
    }).catch(() => {})
  }
  getNoticeData () {
    const { notices } = this.props
    if (notices == null || notices.length === 0) {
      return {}
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice }
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow()
      }
      // transform id to item key
      if (newNotice.id) {
        newNotice.key = newNotice.id
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold'
        }[newNotice.status]
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        )
      }
      return newNotice
    })
    return groupBy(newNotices, 'type')
  }

  toggle = () => {
    const { collapsed, onCollapse } = this.props
    onCollapse(!collapsed)
    this.triggerResizeEvent()
  };

  handleDrawerClose = () => {
    this.setState({ drawerVisible: false })
  }

  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }

  handleLocaleMenuClick = (e) => {
    setCookie('locale', e.key)
    global.location.reload()
  }

  isLocaleDisabled = (keyLocal) => {
    const { locale } = this.props
    return locale.current === keyLocal
  }

  onMenuClick = (...args) => {
    this.setState({
      drawerVisible: false
    })
    this.props.onMenuClick(...args)
  }
  handClick=(e)=>{
    console.log("click",e)
    this.setState({
      cuttentItem:e.key
    })
  }

  render() {
    const {
      locale,
      currentUser = {},
      collapsed,
      fetchingNotices,
      isMobile,
      logo,
      onNoticeVisibleChange,
      onMenuClick,
      onNoticeClear,
    } = this.props;

    const noticeData = this.getNoticeData();
    return (
     
      <div className={styles.header}  >
          {isMobile && [
          <Link to="/" className={styles.logo} key="logo">
            <img src={logo} alt="logo" width="20" />
          </Link>,
          <Divider type="vertical" key="line" />,
        ]}
        <Icon
          className={styles.trigger}
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        />
        <div className={styles.right}>
          <Dropdown
            placement="bottomRight"
            overlay={
              <Menu
                className={styles.localeMenu}
                // selectedKeys={[locale.current]}
                onClick={this.handleLocaleMenuClick}
              >
                <Menu.Item disabled={this.isLocaleDisabled('zh_cn')} key="zh_cn">中文(简)</Menu.Item>
                <Menu.Item disabled={this.isLocaleDisabled('en_us')} key="en_us">English</Menu.Item>
              </Menu>
            }
          >
            <span style={{ marginRight: 20 }}>
              <Button size="small">
                <span style={{ fontWeight: 'bold' }}>
                  {{
                    'zh_cn': '语言',
                    'en_us': 'Language',
                  }[locale.current]}
                </span>
              </Button>
            </span>
          </Dropdown>
          <React.Fragment>
            <span
              className={`${styles.action} ${styles.account}`}
              onClick={_ => this.setState({ drawerVisible: true })}
            >
              <Avatar
                size="small"
                className={styles.avatar}
                src={currentUser.imageUrl || require('../../assets/iceberg.png')}
              />
              {/* <span className={styles.name}>{currentUser.name}</span> */}
            </span>
            <Drawer
              className={'ocms-global-header-drawer'}
              style={{ top: 48 }}
              // title={_ => null}
              placement="right"
              closable={false}
              maskClosable
              onClose={this.handleDrawerClose}
              visible={this.state.drawerVisible}
            >
              <div>
                <AvatarCard>
                  <Avatar
                    size="large"
                    className={styles.avatar}
                    src={currentUser.imageUrl || require('../../assets/iceberg.png')}
                  />
                  <div style={{ lineHeight: '40px' }}>
                    {currentUser.name
                      ? <span>{currentUser.name}</span>
                      : <Spin size="small" style={{ marginLeft: 8 }} />
                    }
                  </div>
                  <RoleNames>{currentUser.roleNameList.join(' / ')}</RoleNames>
                </AvatarCard>
                <div>
                  <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
                    <Menu.Item key="personal">
                      <Icon type="user" />基本信息
                          </Menu.Item>
                          {
                         (this.state.list.indexOf('building_user')>-1)?
                         <Menu.Item >
                         <a href= " http://localhost:9090/#/renthouse-create"><span style={{fontSize:'15px'}}><strong>发布出租屋</strong></span></a>
                         </Menu.Item>
                         :
                         <p></p>
                          }
                           {
                         (this.state.list.indexOf('building_user')>-1)?
                         <Menu.Item >
                          <a href= " http://localhost:9090/#/building-create"><span style={{fontSize:'15px'}}><strong>发布楼盘</strong></span></a>
                          </Menu.Item>
                         :
                         <p></p>
                          }
                       
                          {
                         (this.state.list.indexOf('building_user')>-1)?
                         <Menu.Item >
                         <a href= " http://localhost:9090/#/edit-html"><span style={{fontSize:'15px'}}><strong>发布楼讯</strong></span></a>
                         </Menu.Item>
                         :
                         <p></p>
                          }
                           {
                         (this.state.list.indexOf('building_user')>-1)&&(this.state.list.indexOf('admin')==-1)?
                         <Menu.Item >
                         <a href= " http://localhost:9090/#/myrenthouse"><span style={{fontSize:'15px'}}><strong>我的出租屋</strong></span></a>
                         </Menu.Item>
                         :
                         <p></p>
                          }
                             {
                         (this.state.list.indexOf('building_user')>-1)?
                         <Menu.Item >
                         <a href= " http://localhost:9090/#/mybuilding"><span style={{fontSize:'15px'}}><strong>我的楼盘信息</strong></span></a>
                         </Menu.Item>
                         :
                         <p></p>
                          }
                              {
                         (this.state.list.indexOf('building_user')>-1)?
                         <Menu.Item >
                         <a href= " http://localhost:9090/#/myarticle"><span style={{fontSize:'15px'}}><strong>我的楼讯</strong></span></a>
                         </Menu.Item>
                         :
                         <p></p>
                          }
                            {
                         (this.state.list.indexOf('building_user')>-1)?
                         <Menu.Item >
                         <a href= " http://localhost:9090/#/my-predetermine"><span style={{fontSize:'15px'}}><strong>我的预定</strong></span></a>
                         </Menu.Item>
                         :
                         <p></p>
                          }
                            {
                         (this.state.list.indexOf('building_user')>-1)?
                         <Menu.Item >
                         <a href= " http://localhost:9090/#/my-order"><span style={{fontSize:'15px'}}><strong>我的订单</strong></span></a>
                         </Menu.Item>
                         :
                         <p></p>
                          }
                    <Menu.Item key="change-password">
                      <Icon type="key" />密码修改
                        </Menu.Item>
                  </Menu>
                </div>
                <div style={{ display: 'flex', flex: 1 }}>
                  <Button
                    style={{ flex: 1 }}
                    type='primary'
                    icon="logout"
                    onClick={_ => this.onMenuClick({ key: 'logout' })}
                  >安全退出</Button>
                </div>
              </div>
            </Drawer>
          </React.Fragment>
        </div>
        <div
        className={styles.right} >
     
     </div>
  
        
      </div>
    );
  }
}
