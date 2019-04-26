
import React from 'react'
import {List, Avatar,Icon } from 'antd';
import MyMenu from '../Menu/MyMenu';
import request from '../../utils/request';
import TableLayout from '../../layouts/TableLayout'
const IconText = ({ type, text }) => (
    <span>
      <Icon type={type} style={{ marginRight: 8 }} />
      {text}
    </span>
  );
class Questions extends React.Component {
  componentWillMount(){
    this.getQuestion()
  }
    getAnswer=(item)=>{
        this.linkToChange(`/answer/${item.id}`)
    }
      linkToChange=url=>{
          const {history}=this.props;
          history.push(url)
      }
    constructor(props) {
        super(props)
        this.state = {
            data:[],
        }
    }
    // //获取回答总数
    // countQuestion=()=>{
    //   this.state.data.map((item)=>{
    //     let url=`/v1/wyw/answer/count/${item.id}`
    //     request(url,{
    //       method:'GET'
    //     }).then((res)=>{
    //       if(res.message=='成功'){
    //         this.setState({
    //           data:res.data
    //         })
    //         this.countQuestion()
    //       }
    //     })
    //   })
    // }
    //获取问题列表
    getQuestion=()=>{
      let url= `/v1/wyw/question/selectAll`
      request(url,{
        method:'GET'
      }).then((res)=>{
        if(res.message=='成功'){
          this.setState({
            data:res.data
          })
        }
      })
    }
    render() {
        return (
          <div style={{ padding: 20, overflowY: 'auto', flex: 1 }}>
          <MyMenu></MyMenu>
          <TableLayout
          title={'问题'}
      >
           <div style={{marginLeft:'10px'}}>
           
            <List
            itemLayout="horizontal"
            dataSource={this.state.data}
            renderItem={item => (
              <List.Item key={item.id} onClick={()=>this.getAnswer(item)}
            //   actions={ }
              >
                <List.Item.Meta
                  avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                  title={<a href="https://ant.design">{item.createdTime}</a>}
                  description={item.description}
                />
                <IconText type="message" text={item.countAnswer} />
              </List.Item>
            )}
          />
          </div>
          </TableLayout>
          </div>
        )
    }
}

export default Questions;