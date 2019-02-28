import React, { Fragment } from 'react'
import { Icon, Layout } from 'antd'
import GlobalFooter from '../../components/GlobalFooter'
const { Footer } = Layout

export default class Welcome extends React.Component {
  render () {
    return (
      <div style={{ padding: 20, overflowY: 'auto', flex: 1 }}>
        <img
          src={require('../../assets/images/u33.jpg')}
          alt=''
          style={{width: '100%'}}
        />
        <Footer style={{ padding: 0 }}>
          <GlobalFooter
            links={[
              // {
              //   key: 'Pro 首页',
              //   title: 'Pro 首页',
              //   href: 'http://pro.ant.design',
              //   blankTarget: true,
              // },
              // {
              //   key: 'github',
              //   title: <Icon type="github" />,
              //   href: 'https://github.com/ant-design/ant-design-pro',
              //   blankTarget: true,
              // },
              // {
              //   key: 'Ant Design',
              //   title: 'Ant Design',
              //   href: 'http://ant.design',
              //   blankTarget: true,
              // },
            ]}
            copyright={
              <Fragment>
                Copyright <Icon type='copyright' /> 2018 {process.env.companyname} 出品
              </Fragment>
            }
          />
        </Footer>

      </div>
    )
  }
}
