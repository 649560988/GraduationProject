import React, {Component, Fragment} from 'react';
import { Card, Icon, Avatar, Menu , List} from 'antd';
import request from '../../utils/request'
import Address from '../Address/Address';
import Ellipsis from 'components/Ellipsis';
class Building extends Component {
    componentWillMount(){
        this.getBuildingList()
    }
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
       province='江苏省'
       city='常州市'
       area='天宁区'
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
            grid={{ gutter: 24, lg: 4, md: 2, sm: 1, xs: 1 }}
            dataSource={this.state.buildingList}
            renderItem={(mitem,index) => (
                <List.Item key={mitem.id} onClick={() => this.getCurrentBuildingItem(mitem)}>
                <div onClick={this.buildingClick} >
                  <Card hoverable style={{ width: 300 }} 
                  cover={<img alt=""  size="large" src="http://localhost:80/${mime.src}" style={{height:200 
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