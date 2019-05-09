import React, {Component, Fragment} from 'react';
import { Card, Cascader, Button, Menu , List,message} from 'antd';
import request from '../../utils/request'
import Ellipsis from 'components/Ellipsis';
import MyMenu from '../Menu/MyMenu';
import Data from '../../City'
import TableLayout from '../../layouts/TableLayout'
class SerachRentHouse extends Component{
  constructor(props){
    super(props);
    this.state={
        cuttentItem: 'sy' ,
        buildingList:[] ,
        address:[],
        apertment:[]
    }
}
            componentWillMount(){
               
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
              let url =`/v1/wyw/renthouse/selectBy/${province}/${city}/${area}`
              request(url,{
                  method: 'GET'
              }).then((res) => {
                  if(res.message == '查询成功'){
                    let rentHouse = []
                    let apertment = []
                    for(let i of res.data){
                     if(i.type=='0'){
                         rentHouse.push(i)
                     }
                     if(i.type=='1'){
                         apertment.push(i)
                     }
                    }
                   this.setState({
                   buildingList: rentHouse,
                   apertment:apertment
                   });
                  }
              }
        
              )
              .catch(error=>console.error(error))
            }
            onChange=(value) => {
              this.setState({
                address:value
              })
            }
            onClick=() =>{
           
              if(this.state.address==''){
                message.success('请输入')
              }else{
                let province=this.state.address[0]
                let city=this.state.address[1]
                let area=this.state.address[2]
                this.getBuildingList(province,city,area)
              }
            }
            render(){
            const { Meta } = Card;
              return (
                <div style={{ padding: 20, overflowY: 'auto', flex: 1 }}>
                <MyMenu></MyMenu>
                <TableLayout
                title={'搜索'}
                
            >
                <div >
             <Cascader style={{width: 300 }}  matchInputWidth options={Data.diagnoseReport} onChange={this.onChange} placeholder="Please select" 
             />
               <Button type="primary" onClick={this.onClick}>Primary</Button>
            </div>
            <h1>出租房</h1>
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
                  <h1>公寓</h1>
                <List
                    rowKey="id"
                    grid={{ gutter: 24, lg: 4, md: 2, sm: 1, xs: 1 }}
                    dataSource={this.state.apertment}
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
                  </TableLayout>
                  </div>
        )
    }
}

export default SerachRentHouse ;