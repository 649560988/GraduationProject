import React, { Fragment } from 'react'
import { Icon, Layout, Menu, Card, Avatar, List, Carousel, Button,Popover } from 'antd'
import GlobalFooter from '../../components/GlobalFooter'
import request from '../../utils/request'
import Ellipsis from 'components/Ellipsis';
import Address from '../Address/Address'
import { number } from 'prop-types';
import MyMenu from '../Menu/MyMenu';
const { Footer, Content } = Layout
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
export default class Welcome extends React.Component {
  constructor(props){
    super(props);
    this.state={
      buildingList: [],
      rentHouseList:[],
      data: {},
      src:'0ae66068-146e-4984-ba80-b0419141c1f6.jpg'
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
  //获取所有楼盘
  getBuildingList=()=>{
    let url = '/v1/wyw/building/selectAll'
    request(url,{
      method: 'GET'
    }).then((res) => {
      if(res.message === '查询成功'){
        let children = []
        for(let i of res.data){
          let src=[]
          children.push(i);

        }
       this.setState({
       buildingList: children,
       });
       console.log(this.state.buildingList)

      }else{
        console.log("用户信息获取失败")
      }
    })
  }
  //获取所有出租房
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
      <MyMenu></MyMenu>
    {/* <Carousel autoplay>
     <div><h3>1</h3></div>
     <div><h3>2</h3></div>
     <div><h3>3</h3></div>
      <div><h3>4</h3></div>
    </Carousel>
    <div style={{backgroundColor:'black',width:'100%',borderWidth:'2px',borderStyle:'solid',}}>
    <Menu  theme='dark' mode='horizontal' style={{marginLeft:'10%'}} >
       <Menu.Item>
    <a href= " http://localhost:9090/#/myhome"><span style={{fontSize:'15px',color:'white'}}><strong>首页</strong></span></a>
      </Menu.Item>
      <Menu.SubMenu title={<span style={{fontSize:'15px',color:'white'}}><strong>新房</strong></span>}>
       <Menu.Item>
      <a href= " "><span style={{fontSize:'15px'}}><strong>楼讯</strong></span></a>
      </Menu.Item>
      <Menu.Item>
      <a href= " "><span style={{fontSize:'15px'}}><strong>问答</strong></span></a>
      </Menu.Item>
      </Menu.SubMenu>
     <Menu.SubMenu title={<span style={{fontSize:'15px',color:'white'}}><strong>租房</strong></span>}>
     <Menu.Item>
     <a href= " http://localhost:9090/#/renthouse"><span style={{fontSize:'15px'}}><strong>首页</strong></span></a>
     </Menu.Item>
     <Menu.Item>
     <a href= " "><span style={{fontSize:'15px'}}><strong>地图找房</strong></span></a>
     </Menu.Item>
     <Menu.Item>
     <a href= " "><span style={{fontSize:'15px'}}><strong>品牌公寓</strong></span></a>
     </Menu.Item>
     </Menu.SubMenu>
      <Menu.Item>
      <a href=""><span style={{fontSize:'15px',color:'white'}}><strong>二手房</strong></span></a>
      </Menu.Item>
    
     <Menu.Item>
     <a href="">写字楼</a>
     </Menu.Item>
     <Menu.Item>
     <a href="http://localhost:9090/#/edit-html">楼讯</a>
     </Menu.Item>
     <Menu.Item>
      <a href="">问答</a>
     </Menu.Item>
    </Menu> 
    </div> */}
    <div style={{marginLeft:'10%'}}>
    <h1>热门楼盘</h1>
        <List
            rowKey="id"
            grid={{ gutter: 24, lg: 4, md: 2, sm: 1, xs: 1 }}
            dataSource={this.state.buildingList}
            renderItem={item => (
                <List.Item key={item.id} onClick={() => this.getCurrentBuildingItem(item)} >
                  <Card hoverable style={{ width: 300 }} 
                  cover={<img alt=""   size="large" src={`http://localhost:80/${item.srcs[0].src}`} style={{height:200 
                    ,width:300}}/>}
                  >
                    <Card.Meta
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
      </div>
    )
  }
}
