import React, { Fragment } from 'react'
import request from '../../utils/request'
import { Button} from 'antd'
export default class home extends React.Component{
    constructor(props){
        super(props)
        this.state={
           user:false,
           admin:false
        }
      }
      componentWillMount(){
    this.getCurrentUser()
  }
 getCurrentUser(){
    console.log('进入函数')
    let url = '/v1/sysUserDomin/getAuth'
   request(url, {
        method: 'GET'
    }).then((res) => {
      if (res.message === '成功') {
          
        res.data.sysRoles.map((item,index)=>{
            console.log('home获取的111111111111',item)
        if(item.name=='building_user'){
            console.log('building_user',item)
          this.setState({
            user:true
          })
        }
        if(item.name=='admin'){
            console.log('admin',admin)
          this.setState({
            admin:true
          })
        }
        })
      } 
      else 
      {
      }
    }).catch(() => {
    
    })
  }
    //点击跳转
    // linkToChange = url => {
    //     const { history } = this.props
    //     history.push(url)
    //   };
//   handClick=()=>{
//     //   if(){
//         this.linkToChange(`/myhome`)

//     //   }else{
//         // this.linkToChange(`/home`)
//     //   }
   
//   }
    render () {
        return(
            <div style={{marginLeft:'20%'}}>
                
                <h1 style={{fontSize:'50px'}}>欢迎来到RentAndSell房屋出租出售信息发布系统</h1>
                {this.state.user
                ?
                <a href= "http://localhost:9090/#/myhome"><span style={{fontSize:'30px'}}><strong>跳转首页</strong></span></a>
:
<p></p>
                }
                    {/* <Button onClick={this.handClick()}>进入首页</Button> */}
            </div>
        )
    }
}