import React, { Fragment } from 'react'
import { Icon, Layout, Menu, Card, Avatar, List, Carousel, Button,Popover } from 'antd'
import GlobalFooter from '../../components/GlobalFooter'
import request from '../../utils/request'
import Ellipsis from 'components/Ellipsis';
import Address from '../Address/Address'
const { Footer, Content } = Layout
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const requireContext = require.context("E:/img",true, /^\.\/.*\.jpg$/);
const projectImgs = requireContext.keys().map(requireContext);
export default class Welcome extends React.Component {
  constructor(props){
    super(props);
    this.state={
      buildingList: [],
      rentHouseList:[],
      data: {},
      src:[]
    }
  }
  componentDidMount(){
    this. getBuildingList()
    this.getRentHouseList()
}
handclick=(aa)=>{
  // alert("111")
  console.log(aa.id)
}
  getCurrentRentHouseItem=(item)=>{
    this.linkToChange(`/renthouse-detail/${item.id}`)
  }
  getCurrentBuildingItem=(item)=>{
    this.linkToChange(`/building-detail/${item.id}`)
  }
  linkToChange = url => {
    const { history } = this.props
    history.push(url)
  };
  getBuildingList=()=>{
    let url = '/v1/wyw/building/selectAll'
    request(url,{
      method: 'GET'
    }).then((res) => {
      if(res.message === '查询成功'){
        let children = []
        for(let i of res.data){
          children.push(i);
        }
       this.setState({
       buildingList: children,
       src:projectImgs
       });
       for(let i = 0;i<this.state.buildingList.length;i++)
          {
            this.state.buildingList[i].srcs=this.state.src[i];
          }
      }else{
        console.log("用户信息获取失败")
      }
    })
  }
  getRentHouseList=()=>{
    let url= '/v1/wyw/renthouse/selectAll'
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
   
    render () {
      const { Meta } = Card;
    return (
      <div style={{ padding: 20, overflowY: 'auto', flex: 1 }}>
        <Carousel autoplay>
     <div><h3>1</h3></div>
     <div><h3>2</h3></div>
     <div><h3>3</h3></div>
      <div><h3>4</h3></div>
    </Carousel>
    <h1>热门楼盘</h1>
        <List
            rowKey="id"
            grid={{ gutter: 24, lg: 4, md: 2, sm: 1, xs: 1 }}
            dataSource={this.state.buildingList}
            renderItem={item => (
                <List.Item key={item.id} onClick={() => this.getCurrentBuildingItem(item)} >
                  <Card hoverable style={{ width: 300 }} 
                  cover={<img alt=""  size="large" src={item.srcs} style={{height:200 
                    ,width:300}}/>}
                  >
                    <Card.Meta
                    //  avatar={ <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                      title={<a href="">{item.name}&nbsp;{item.city}</a>} 
                      description={
                        <Ellipsis  lines={2}>
                          {item.description}
                          <Button onClick={this.handclick} >oo</Button>
                        </Ellipsis>
                      }
                    />
                  </Card>
                </List.Item>
              ) 
            }
          />
          <h1 >推荐好屋</h1>
           <List
            rowKey="id"
            grid={{ gutter: 24, lg: 4, md: 2, sm: 1, xs: 1 }}
            dataSource={this.state.rentHouseList}
            renderItem={item => (
              // <Popover >
                <List.Item key={item.id} onClick={() => this.getCurrentRentHouseItem(item)}>
                  <Card hoverable style={{ width: 300 }} 
                  cover={<img alt=""  size="large" src={item.srcs} style={{height:200 
                    ,width:300}}/>}
                  >
                    <Card.Meta
                    //  avatar={ <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                      title={<a href="">{item.name}&nbsp;{item.city}</a>} 
                      description={
                        <Ellipsis  lines={2}>
                          {item.description}
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
    )
  }
}
