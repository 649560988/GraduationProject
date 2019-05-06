import React, { Fragment } from 'react'
import { Icon, Layout, Menu, Card, Avatar, List, Carousel, Button,Popover } from 'antd'
import GlobalFooter from '../../components/GlobalFooter'
import request from '../../utils/request'
import Ellipsis from 'components/Ellipsis';
import MyMenu from '../Menu/MyMenu';
import TableLayout from '../../layouts/TableLayout'
const { Footer } = Layout
export default class ApartMent extends React.Component {
  constructor(props){
    super(props);
    this.state={
      buildingList: [],
      rentHouseList:[],
      data: {},
      type:'1',
      src:'0ae66068-146e-4984-ba80-b0419141c1f6.jpg',
    }
  }
  componentDidMount(){
    this.getRentHouseList()
}

handclick=(aa)=>{
  // alert("111")
  console.log(aa.id)
}
  getCurrentRentHouseItem=(item)=>{
    this.linkToChange(`/apartment-detail/${item.id}`)
  }
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
    render () {
      const { Meta } = Card;
    return (
      <div style={{ padding: 20, overflowY: 'auto', flex: 1 }}>
      <MyMenu></MyMenu>
      <TableLayout
      title={'精品公寓'}
  >
    <div style={{marginLeft:'10%'}}>
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
        </TableLayout>
      </div>
    )
  }
}