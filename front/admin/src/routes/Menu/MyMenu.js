import React, {Component,Fragment} from 'react';
import {  Menu,  Carousel } from 'antd'
class MyMenu extends Component{
    constructor(props){
      super(props);
      this.state={
         
      }
  }
  render(){
      return(
          <Fragment>
        <Carousel autoplay>
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
          <a href= "http://localhost:9090/#/building "><span style={{fontSize:'15px'}}><strong>热门楼盘</strong></span></a>
          </Menu.Item>
           <Menu.Item>
          <a href= "http://localhost:9090/#/html-show"><span style={{fontSize:'15px'}}><strong>楼讯</strong></span></a>
          </Menu.Item>
          <Menu.Item>
          <a href= " "><span style={{fontSize:'15px'}}><strong>问答</strong></span></a>
          </Menu.Item>
          </Menu.SubMenu>
         <Menu.SubMenu title={<span style={{fontSize:'15px',color:'white'}}><strong>租房</strong></span>}>
         <Menu.Item>
         <a href= " http://localhost:9090/#/renthouse"><span style={{fontSize:'15px'}}><strong>推荐好屋</strong></span></a>
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
         <a href="http://localhost:9090/#/html-show">楼讯</a>
         </Menu.Item>
         <Menu.Item>
          <a href="">问答</a>
         </Menu.Item>
        </Menu> 
        </div>
        </Fragment>
      )
  }
}
export default MyMenu