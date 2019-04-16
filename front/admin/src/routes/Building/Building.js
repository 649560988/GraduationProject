import React, {Component, Fragment} from 'react';
import { Card, Cascader, Button, Menu , List} from 'antd';
import request from '../../utils/request'
import Address from '../Address/Address';
import Ellipsis from 'components/Ellipsis';
import MyMenu from '../Menu/MyMenu';
import Data from '../../City'
class Building extends Component {
    constructor(props){
        super(props);
        this.state={
            cuttentItem: 'sy' ,
            buildingList:[] ,
        }
    }
    getCurrentBuildingItem=(item)=>{
      this.linkToChange(`/building-detail/${item.id}`)
    }
    linkToChange = url => {
      const { history } = this.props
      history.push(url)
    };
    buildingClick=(e)=>{
      console.log('江苏省',e.target.mitem)
    }
    handClick=(e)=>{
        console.log("click",e.key)
        this.setState({
          cuttentItem:e.key
        })
      }
    getBuildingList(province,city,area){
      let url =`/v1/wyw/building/selectBy/${province}/${city}/${area}`
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
            <Fragment>
              <MyMenu></MyMenu>
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
         <div >
             <Cascader style={{width: 300 }}  matchInputWidth options={Data.diagnoseReport} onChange={this.onChange} placeholder="Please select" 
             />
               <Button type="primary" onClick={this.onClick}>Primary</Button>
            </div>
         <List
            grid={{ gutter: 24, lg: 4, md: 2, sm: 1, xs: 1 }}
            dataSource={this.state.buildingList}
            renderItem={(mitem,index) => (
                <List.Item key={mitem.id} onClick={() => this.getCurrentBuildingItem(mitem)}>
                <div onClick={this.buildingClick} >
                  <Card hoverable style={{ width: 300 }} 
                  cover={<img alt=""  size="large" src={`http://localhost:80/${mitem.srcs[0]}`} style={{height:200 
                    ,width:300}} href='/setting/user-update/${flag}/${id}'/>}
                  >
                    <Card.Meta
                      title={<a href="">{mitem.name}&nbsp;{mitem.city}</a>} 
                      description={
                        <Ellipsis  lines={2}>
                          {mitem.description}
                        </Ellipsis>
                      }
                    />
                  </Card>
                  </div>
                </List.Item>
              ) 
            }
          />
          </Fragment>
        );
    }
}
export default Building;