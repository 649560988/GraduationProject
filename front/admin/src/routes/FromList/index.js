import React,{ Component } from 'react'
import  axios from 'axios'
import {withRouter} from 'dva/router'
import { Table, Button ,Input  } from 'antd';

// const { Column, ColumnGroup } = Table;


class Tanchen extends Component{
  constructor(props){
    super(props);
    this.state={
      data :[]
    }
  }

  columns=[
    {
      width:'30%',
      align:'center',
      title:"序号",
      dataIndex:"firstName",
    },
    {
      width:'70%',
      align:'center',
      title:"简历",
      dataIndex:"SecondName",
      render:(text, record) =>{
        if (text) {
          if (text.length > 6) {
            text = text.toString().substring(0, 6) + '...'
          }
        }  
        return(
          <span title={record.SecondName}>
            <a href="#/base-info-defend/external-consultant-resume/1" >{text}</a>
          </span>
        )
      }
    }

  ];

  render(){
    return(
      <div>
        <div style={{marginBottom:'10px'}}>
          <Input placeholder="请输入简历名称" style={{width:'200px'}}/>
          <Button type="primary" >查询</Button>
          <Button type="primary" style={{float:'right'}} onClick={(e) => { this.handleClick(e) }}>创建简历</Button>
        </div>

        <Table
          size={'small'}
          style={{textAlign: 'center'}}
          dataSource={this.state.data}
          columns={this.columns}
          pagination={false}
        />

      </div>
    )

  }

  handleClick(e){
    const { history } = this.props
    e.stopPropagation()
    history.push(`/base-info-defend/external-consultant-create`)
  }

  // 查询具体简历
  selectDetail(){
    let url = 'resume/v1/ompResume/allByUserId/'+ this.props.userId
    axios({
      method: 'get',
      url: url
    }).then((res)=>{
      this.setState({
        data:res.data.content
      })
    }).catch(()=>{
      console.log('error')
    })
  }

  // 查询简历列表
  selectAll(){
    let url = 'resume/v1/ompResume/allByUserId/'+ this.props.userId
    axios({
      method: 'get',
      url: url
    }).then((res)=>{
      this.setState({
        data:res.data.content
      })
    }).catch(()=>{
      console.log('error')
    })
  }

  componentDidMount(){
    this.selectAll()
  }

}

export default withRouter(Tanchen);
