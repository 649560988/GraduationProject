import React,{Component} from 'react'
import {Layout,Carousel, Row, Col,Divider,Tabs,Icon,Tag} from 'antd'
import styles from './style.css'
class RentHouseDetail extends Component{
    constructor(props){
        super(props)
        this.state={
            building:{
                name:'江苏',
                id:'碧桂园',
                bname:'至尊',
                description:'万达旁，精装修，灵宝记住'
			},
			picture:[
				'wyw','qdqw','qwdq'
            ],
            facility:[
                {

                }
            ],
            contenet:[
                {name:'database',zh_name:'洗衣机'},{name:'credit-card',zh_name:'电视'},{name:'idcard',zh_name:'空调'}
            ]
		}
    }
    render(){
        return(
            <div style={{ padding: 20, overflowY: 'auto', flex: 1,marginLeft:'30px',marginRight:'90px' }}>
			<img className={styles.mimg} src="http://localhost:80/3.jpg"></img>
            <strong><h1 style={{marginLeft:'30px',marginTop:'5px'}}>{this.state.building.description}</h1></strong> 
            <Row>
            <Col span={16} >
            <Tabs defaultActiveKey="1" onChange={this.callback} tabPosition="left">
            <Tabs.TabPane tab="室内图片" key="1">
            <div className={styles.div1}>
                <Carousel autoplay>
                {
                    this.state.picture.map((item,index)=>{
                        return <div className={styles.carousel}><h3>{item}</h3></div>
                    })
                }
               </Carousel>
             </div>
            </Tabs.TabPane>
             <Tabs.TabPane tab="Tab 2" key="2">Content of Tab Pane 2</Tabs.TabPane>
            <Tabs.TabPane tab="Tab 3" key="3">Content of Tab Pane 3</Tabs.TabPane>
            </Tabs>
            </Col>
            <Col span={8} >
            <b  style={{fontSize:'250%',lineHeight:'30%',color:'red',marginLeft:'30px'}}>{this.state.building.id}</b>
            <span> <h3>地址：{this.state.building.name}</h3></span>
            <h3>小区名：{this.state.building.name}</h3>
            <Divider />  
          <div style={{marginTop:'8px',marginLeft:'20px'}}>
           <div style={{display:'inline-block',width:'30%'}}>
           <table style={{height:'60px',borderColor:'red',borderLeftStyle:'solid',borderWidth:'2px',marginRight:'10px'}}>
           <tr><td valign="top"></td></tr>
           <div style={{marginLeft:'10px'}}>
           <h2>房件面积</h2>
           <h3>{this.state.building.name}平方米</h3>
           </div>
           </table>
           </div>
           <div style={{display:'inline-block',width:'30%'}}>
           <table style={{height:'60px',borderColor:'red',borderLeftStyle:'solid',borderWidth:'2px'}}>
           <tr><td valign="top"></td></tr>
           <div style={{marginLeft:'10px'}}>
          <h2>租金</h2>
          <h3>{this.state.building.name}</h3>
           </div>
           </table>
           </div>
           <div style={{display:'inline-block',width:'30%'}}>
           <table style={{height:'60px',borderColor:'red',borderLeftStyle:'solid',borderWidth:'2px'}}>
           <tr><td valign="top"></td></tr>
           <div style={{marginLeft:'10px'}}>
           <h2>出租要求</h2>
           <h3>{this.state.building.name}</h3>
           </div>
           </table>
           </div>
           <div style={{display:'inline-block'}}>
           <table style={{height:'60px',borderColor:'red',borderLeftStyle:'solid',borderWidth:'2px'}}>
           <tr><td valign="top"></td></tr>
           </table>
           </div>
            </div>
            <span ><h1 style={{background:'red',width:'60%',marginLeft:'20%',marginTop:'10px'}}><Icon type="mobile" />电话{this.state.building.name}</h1></span>
            </Col>
           </Row>
           <div style={{marginTop:'10px'}}>
            <h1 >房屋信息</h1>
            <Divider /> 
           <Row>
           <Col span={8}>
           <h2>户型：{this.state.building.name}</h2> 
           <h2>楼层：{this.state.building.name}</h2>
           <h2>小区：{this.state.building.name}</h2>
           </Col>
           <Col span={8}>
           <h2>面积：{this.state.building.name}</h2>
           <h2>装修：{this.state.building.name}</h2>
           <h2>要求：{this.state.building.name}</h2>
           </Col>
           <Col span={8}>
           <h2>朝向：{this.state.building.name}</h2>
           <h2>类型:{this.state.building.name}</h2>
           </Col>
           </Row>
           </div>
           <Divider /> 
           <h1 style={{ marginTop:'15px'}}>房源概况：</h1>
           {/* <div>
           <Tag {...this.props} checked={this.state.checked} onChange={this.handleChange}>111</Tag>
  </div> */}
           <Divider /> 
           <h1 style={{ marginTop:'15px'}} >配套设施</h1>
           <Icon type={this.state.contenet} style={{ fontSize: '16px', color: '#08c' }} />
           {
               this.state.contenet.map((item,index)=>{
                   return <div style={{display:'inline-block'}}>
                   <div>
                   <p><Icon type={item.name} style={{ fontSize: '30px', color: '#08c' ,marginLeft:'15px'}} /> </p>
                   <p style={{ marginLeft:'15px'}} >{item.zh_name}</p>
                   </div>
                    </div> 
               })
           }
           </div>
        )
    }
}
export default RentHouseDetail