import React, { Fragment } from 'react'
import { Icon, Layout, Menu, Card, Avatar, List,message } from 'antd'
import GlobalFooter from '../../components/GlobalFooter'
import request from '../../utils/request'
import Ellipsis from 'components/Ellipsis';
import MyMenu from '../Menu/MyMenu';
import TableLayout from '../../layouts/TableLayout'
const { Footer, Content } = Layout
// const { Content, Header } = Layout
export default class Welcome extends React.Component {
  constructor(props){
    super(props);
    this.state={
      buildingList: [],
      rentHouseList:[],
      apartmentList:[],
      data: {},
      src:'0ae66068-146e-4984-ba80-b0419141c1f6.jpg',
      rentHouseType:'0',
      apartment:'1',
      able:false
    }
  }
  componentDidMount(){
    this. getBuildingList()
    this.getRentHouseList()
    this.getapartmentList()
    this.getCurrentUser()
}
	//获取当前用户
  getCurrentUser = () => {
let url = '/v1/sysUserDomin/getAuth'
request(url, {
method: 'GET'
}).then((res) => {
if (res.message === '成功') {
        this.setState({
          able:true
        })
        console.log('this.state.able',this.state.able)
} else {
  this.setState({
    able:false
  })
}
}).catch(() => {})
}
  getCurrentRentHouseItem=(item)=>{
    
    if(this.state.able){
      this.linkToChange(`/renthouse-detail/${item.id}`)
    }else{
      var r=confirm('您还未登录，是否登录？')
      if(r){
        this.linkToChange(`/user/login`)
      }
    }
  }
  getCurrentBuildingItem=(item)=>{
    
    if(this.state.able){
      this.linkToChange(`/building-detail/${item.id}`)
    }else{
      var r=confirm('您还未登录，是否登录？')
      if(r){
        this.linkToChange(`/user/login`)
      }
    }
  }
  getCurrentApartmentItem=(item)=>{
    
    if(this.state.able){
      this.linkToChange(`/apartment-detail/${item.id}`)
    }else{
      var r=confirm('您还未登录，是否登录？')
      if(r){
        this.linkToChange(`/user/login`)
      }
    }
  }
  linkToChange = url => {
    const { history } = this.props
    history.push(url)
  };
  //获取所有楼盘
 //获取所有楼盘
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
     })
     console.log(this.state.buildingList)

    }else{
      console.log("用户信息获取失败")
    }
  })
}
  //获取所有出租房
  getRentHouseList=()=>{
    let url= `/v1/wyw/renthouse/selectAll/${this.state.rentHouseType}`
    request(url,{
      method: 'GET'
    }).then((res)=>{
      if(res.message=== '查询成功'){
        console.log('所有粗组我',res.data)
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
  //获取所有公寓
  getapartmentList=()=>{
    let url= `/v1/wyw/renthouse/selectAll/${this.state.apartment}`
    request(url,{
      method: 'GET'
    }).then((res)=>{
      if(res.message=== '查询成功'){
        
        let rentHouse=[]
        for(let i of res.data){
          rentHouse.push(i)
        }
        this.setState({
          apartmentList:rentHouse
        })
      }
    })
  }
    render () {
      const { Meta } = Card;
    return (
      <div style={{ padding: 20, overflowY: 'auto', flex: 1 }}>
          <MyMenu></MyMenu>
          {
        this.state.able?<p></p>:
        <a href='http://localhost:9090/#/user/login'><p style={{fontSize:'15px',color:'black'}}>还未登录，点击登录</p></a>
      }
            <TableLayout
            title={'首页'}
        >
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
            rowKey="createdTime"
            grid={{ gutter: 24, column:4 }}
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
                        <Ellipsis  lines={1}>
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
          <h1 >品牌公寓</h1>
           <List
            rowKey="id"
            grid={{ gutter: 24, lg: 4, md: 2, sm: 1, xs: 1 }}
            dataSource={this.state.apartmentList}
            renderItem={item => (
                <List.Item key={item.id} onClick={() => this.getCurrentApartmentItem(item)}>
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
        </TableLayout>
      </div>
    )
  }
}
