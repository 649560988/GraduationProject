import React, { Fragment } from 'react'
import { Icon, Layout, Menu, Card, Avatar, List, Carousel, Button,Popover } from 'antd'
import GlobalFooter from '../../components/GlobalFooter'
import request from '../../utils/request'
import Ellipsis from 'components/Ellipsis';
import MyMenu from '../Menu/MyMenu';
import TableLayout from '../../layouts/TableLayout'
const { Footer, Content } = Layout
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
// const { Content, Header } = Layout
export default class RentHouse extends React.Component {
  constructor(props){
    super(props);
    this.state={
      buildingList: [],
      rentHouseList:[],
      data: {},
      type:'0',
      src:'0ae66068-146e-4984-ba80-b0419141c1f6.jpg',
    }
  }
  componentDidMount(){
    this.getRentHouseList()
}

/** 
 * 
 * 
 * 
 */

// handleNoticeVisibleChange = visible => {
//   const { dispatch } = this.props
//   if (visible) {
//     dispatch({
//       type: 'global/fetchNotices'
//     })
//   }
// };

/** 
 * 
 * 
 * 
 */


handclick=(aa)=>{
  // alert("111")
  console.log(aa.id)
}
  //点击跳转
  getCurrentRentHouseItem=(item)=>{
    this.linkToChange(`/renthouse-detail/${item.id}`)
  }

  // getCurrentBuildingItem=(item)=>{
  //   this.linkToChange(`/building-detail/${item.id}`)
  // }
  linkToChange = url => {
    const { history } = this.props
    history.push(url)
  };
  //获取所有出租房
  getRentHouseList=()=>{
    let url= `/v1/wyw/renthouse/selectAll/${this.state.type}`
    request(url,{
      method: 'GET'
    }).then((res)=>{
      if(res.message=== '查询成功'){
        
        let rentHouse=[]
        for(let i of res.data){
          rentHouse.push(i)
        }
        this.setState({
          rentHouseList:rentHouse
        })
      }
    })
  }

    // const imgStyle
    // getCurrentUser = () => {
    //   let url = '/v1/sysUserDomin/getAuth'
    //   request(url, {
    //       method: 'GET'
    //   }).then((res) => {
    //       if (res.message === '成功') {
    //         let list=[]
    //       res.data.sysRoles.map((item,index)=>{
    //       list.push(item.name)
    //       })
    //       this.setState({
    //         list
    //       })
    //       } else {
    //           console.log(err)
    //       }
    //   }).catch(() => {})
    // }
    render () {
      const { Meta } = Card;
    return (
      <div style={{ padding: 20, overflowY: 'auto', flex: 1 }}>
      <MyMenu></MyMenu>
      <TableLayout
      title={'推荐好屋'}
  >
    <div style={{marginLeft:'10%'}}>
           <List
            rowKey="id"
            grid={{ gutter: 24, lg: 4, md: 2, sm: 1, xs: 1 }}
            dataSource={this.state.rentHouseList}
            renderItem={item => (
                <List.Item key={item.id} onClick={() => this.getCurrentRentHouseItem(item)}>
                  <Card hoverable style={{ width: 300 }} 
                  cover={<img alt=""  size="large" src={`http://localhost:80/${item.srcs[0].src}`} style={{height:200 
                    ,width:300}}/>}
                  >
                    <Card.Meta
                      title={<a href="">{item.communityName}&nbsp;{item.communityName}</a>} 
                      description={
                        <Ellipsis  lines={2}>
                          {item.houseDescription}
                        </Ellipsis>
                      }
                    />
                  </Card>
                </List.Item>
                // </Popover>
              ) 
            }
          />
          
        <Footer style={{ padding: 0 }}>
          <GlobalFooter
            links={[
              {
                key: 'Pro 首页',
                title: 'Pro 首页',
                href: 'http://pro.ant.design',
                blankTarget: true,
              },
              {
                key: 'github',
                title: <Icon type="github" />,
                href: 'https://github.com/ant-design/ant-design-pro',
                blankTarget: true,
              },
              {
                key: 'Ant Design',
                title: 'Ant Design',
                href: 'http://ant.design',
                blankTarget: true,
              },
            ]}
            copyright={
              <Fragment>
                Copyright <Icon type='copyright' /> 2018 {process.env.companyname} 出品
              </Fragment>
            }
          />
        </Footer>
        </div>
        /</TableLayout>
      </div>
    )
  }
}