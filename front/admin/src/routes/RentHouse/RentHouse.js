import React, {Component, Fragment} from 'react';
import { Card, Icon, Avatar, Menu , List} from 'antd';
import request from '../../utils/request'
import Address from '../Address/Address';
import Ellipsis from 'components/Ellipsis';
class RentHouse extends Component{
  constructor(props){
    super(props);
    this.state={
        cuttentItem: 'sy' ,
        buildingList:[] 
    }
}
            // <div>{this.props.previewImage}</div>
            componentWillMount(){
                this.getBuildingList()
            }
            getCurrentRentHouseItem=(item)=>{
              this.linkToChange(`/renthouse-detail/${item.id}`)
            }
            linkToChange = url => {
              const { history } = this.props
              history.push(url)
            };
         
            handClick=(e)=>{
                console.log("click",e)
                this.setState({
                  cuttentItem:e.key
                })
              }
            getBuildingList(province,city,area){
               province='江苏省'
               city='常州市'
               area='天宁区'
              let url =`/v1/wyw/renthouse/selectBy/${province}/${city}/${area}`
              request(url,{
                  method: 'GET'
              }).then((res) => {
                  if(res.message == '查询成功'){
                    console.log(res.data)
                    let children = []
                    for(let i of res.data){
                      children.push(i);
                    }
                   this.setState({
                   buildingList: children,
                   });
                  }
              }
        
              )
              .catch(error=>console.error(error))
            }
            render(){
            const { Meta } = Card;
                return (
                    <Fragment>
            <Menu  onClick={this.handClick} selectedKeys={[this.state.cuttentItem]} mode='horizontal' >
               <Menu.Item>
               首页
              </Menu.Item>
              <Menu.Item>
            <a href="">楼讯</a>
              </Menu.Item>
              <Menu.Item>
            <a href="">问答</a>
             </Menu.Item>
           </Menu> 
           <Address></Address>
           <List
                    rowKey="id"
                    grid={{ gutter: 24, lg: 4, md: 2, sm: 1, xs: 1 }}
                    dataSource={this.state.buildingList}
                    renderItem={item => (
                        <List.Item key={item.id} onClick={() => this.getCurrentRentHouseItem(item)}>
                          <Card hoverable style={{ width: 300 }} 
                          cover={<img alt=""  size="large" src={item.srcs[0]} style={{height:200 
                            ,width:300}}/>}
                          >
                            <Card.Meta
                              // avatar={ <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
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
                  
                  </Fragment>
        )
    }
}

export default RentHouse ;