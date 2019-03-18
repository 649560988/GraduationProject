import React, {Component, Fragment} from 'react'
import Building from './Building';
import {Layout,Carousel, Row, Col,Divider,Tabs} from 'antd'
import styles from './style.css'
const {
    Header, Footer, Sider, Content,
  } = Layout;
class BuildingDetail extends Component{
    constructor(props){
        super(props)
        this.state={
            building:{
                name:'江苏',
                id:'碧桂园',
                bname:'至尊'
			},
			picture:[
				'wyw','qdqw','qwdq'
			]
		}
		console.log(styles)
	}
	 callback=(key)=> {
		console.log(key);
	  }
    render(){
        return(
			<div style={{ padding: 20, overflowY: 'auto', flex: 1,marginLeft:'30px',marginRight:'90px' }}>
			<img className={styles.mimg} src="http://localhost:80/3.jpg"></img>
			<div>
			<Row>
             <Col span={12} >
			 <div className={styles.div1}>
		         <Carousel autoplay>
		         {
		         	this.state.picture.map((item,index)=>{
		         		return <div className={styles.carousel}><h3>{item}</h3></div>
		         	})
		         }
                </Carousel>
			  </div>
			 </Col>
             <Col span={12} >
			 <h1 style={{textAlign:'center',marginTop:'5px'}}>{this.state.building.name}</h1>
			 <Divider />
			 <b  style={{fontSize:'250%',lineHeight:'30%',color:'red',marginLeft:'30px'}}>{this.state.building.id}</b>
	          <div style={{marginTop:'8px',marginLeft:'20px'}}>

			<div style={{display:'inline-block',width:'30%'}}>
            <table style={{height:'60px',borderColor:'red',borderLeftStyle:'solid',borderWidth:'2px',marginRight:'10px'}}>
			<tr><td valign="top"></td></tr>
			<div style={{marginLeft:'10px'}}>
			<h1>Link</h1>
			 <h1>Link</h1>
			</div>
			</table>
			</div>
			<div style={{display:'inline-block',width:'30%'}}>
			<table style={{height:'60px',borderColor:'red',borderLeftStyle:'solid',borderWidth:'2px'}}>
			<tr><td valign="top"></td></tr>
			<div style={{marginLeft:'10px'}}>
			<h1>Link</h1>
			 <h1>Link</h1>
			</div>
			</table>
			</div>
			<div style={{display:'inline-block',width:'30%'}}>
			<table style={{height:'60px',borderColor:'red',borderLeftStyle:'solid',borderWidth:'2px'}}>
			<tr><td valign="top"></td></tr>
			<div style={{marginLeft:'10px'}}>
			<h1>Link</h1>
			 <h1>Link</h1>
			</div>
			</table>
			</div>
			<div style={{display:'inline-block'}}>
			<table style={{height:'90px',borderColor:'red',borderLeftStyle:'solid',borderWidth:'2px'}}>
			<tr><td valign="top"></td></tr>
			</table>
			</div>
             </div>
			 </Col>
            </Row>
			<div>
			<Tabs defaultActiveKey="1" onChange={this.callback} >
            <Tabs.TabPane tab="Tab 1" key="1">Content of Tab Pane 1</Tabs.TabPane>
             <Tabs.TabPane tab="Tab 2" key="2">Content of Tab Pane 2</Tabs.TabPane>
            <Tabs.TabPane tab="Tab 3" key="3">Content of Tab Pane 3</Tabs.TabPane>
            </Tabs>,	
			  </div>
			</div>
			</div>
        )
    }
}
export default BuildingDetail