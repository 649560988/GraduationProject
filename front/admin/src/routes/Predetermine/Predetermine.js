import React,{Component} from 'react'
import request from '../../utils/request';
import MyMenu from '../Menu/MyMenu';
import TableLayout from '../../layouts/TableLayout'
import {
    Form, Row, Col, Input, Button, Icon,message
  } from 'antd';
class Predetermine extends Component{
    constructor(props){
        super(props)
        this.state={
            rentHouseId:this.props.match.params.id,
            type:this.props.match.params.type,
            rentHouse:'',
            building:'',
            user:'',
            rentHouseAdmin:'',
        }
    }
    componentWillMount(){
            this.getCurrentRentHouse()
        this.getCurrentUser()
    }
     //获取当前出租屋信息
  getCurrentRentHouse=()=>{
    let url=`/v1/wyw/renthouse/${this.state.rentHouseId}`
    request(url,{
			method: "GET"
		}).then((res)=>{
			if(res.message=='查询成功'){
            this.getAdmin(res.data.userId)
			this.setState({
				rentHouse:res.data,
      })
    this.getAdmin(res.data.userId)
			}
		})
  }
  //获取当前房屋主人信息
  getAdmin=(id)=>{
    let url=`/v1/sysuser/${id}`
    request(url, {
      method: 'GET',
  }).then((res) => {
      if (res.message === '成功') {
        this.setState({
          rentHouseAdmin:res.data
        })
      } else {
        console.log('获取当前登录人信息失败');
      }
  }).catch((err) => {
      console.log(err)
  })
  }
  //获取登陆人信息
  getCurrentUser = () => {
    let url = '/v1/sysUserDomin/getAuth'
    request(url, {
        method: 'GET'
    }).then((res) => {
        if (res.message === '成功') {
            this.setState({
           user:res.data
            })
        } else {
            console.log(err)
        }
    }).catch(() => {})
}
//创建订单
/**
   * 
   * 确定按钮
   */
  myHandleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.createOrder(values)
      }else{
        
      }
    });
  }
  //订单创建
  createOrder=(values)=>{
    let url=`/v1/wyw/rentOrder/insertOne`
    values.type=this.state.type
    values.phone=this.state.rentHouse.contactInformation
    console.log('订单创建的值',values)
    request(url,{
            method: "POST",
            body: values
		}).then((res)=>{
			if(res.message=='成功'){
                message.success('订单已创建，等待屋主确认')
                this.linkToChange('/myhome')
			}
		})
  }
  linkToChange = url => {
    const { history } = this.props
    history.push(url)
  };
    render(){
        const {getFieldDecorator} = this.props.form;
        return(
            <div style={{ padding: 20, overflowY: 'auto', flex: 1 }}>
            <MyMenu></MyMenu>
            <TableLayout
            title={'订单'}
             >
         <div style={{marginLeft:'10%',marginRightL:'10%'}}>
         <Form onSubmit={this.myHandleSubmit}>
             <h1>卖家信息</h1>
             <Row>
                 <Col span={12}>
                 <Form.Item  label={'卖家ID'}>
                        {getFieldDecorator('userId', {
                            initialValue: this.state.rentHouseAdmin.id,
                            rules: [{
                                required: true
                            }]
                        })(
                            <Input  disabled='disabled' />
                        )}
                    </Form.Item>
                 </Col>
                 <Col span={12}>
                 <Form.Item  label={'卖家姓名'}>
                        {getFieldDecorator('userName', {
                            initialValue: this.state.rentHouseAdmin.realName,
                            rules: [{
                                required: true
                            }]
                        })(
                            <Input  disabled='disabled' />
                        )}
                    </Form.Item>
                 </Col>
             </Row>
             <h1>房屋信息</h1>
             <Row>
                 <Col span={12}>
                 <Form.Item  label={'房屋ID'}>
                        {getFieldDecorator('houseId', {
                            initialValue: this.state.rentHouse.id,
                            rules: [{
                                required: true
                            }]
                        })(
                            <Input  disabled='disabled' />
                        )}
                    </Form.Item>
                 </Col>
                 <Col span={12}>
                 <Form.Item  label={'房屋名称'}>
                        {getFieldDecorator('houseName', {
                            initialValue: this.state.rentHouse.communityName,
                            rules: [{
                                required: true
                            }]
                        })(
                            <Input  disabled='disabled' />
                        )}
                    </Form.Item>
                 </Col>
             </Row>

             <Row>
                 <Col span={12}>
                 <Form.Item  label={'户型'}>
                        {getFieldDecorator('houseStyle', {
                            initialValue: this.state.rentHouse.houseStyle
                        })(
                            <Input  disabled='disabled' />
                        )}
                    </Form.Item>
                 </Col>
                 <Col span={12}>
                 <Form.Item  label={'房屋地址'}>
                        {getFieldDecorator('area', {
                            initialValue: this.state.rentHouse.province+this.state.rentHouse.city+this.state.rentHouse.area,
                            rules: [{
                                required: true
                            }]
                        })(
                            <Input  disabled='disabled' />
                        )}
                    </Form.Item>
                 </Col>
             </Row>

             <Row>
                 <Col span={12}>
                 <Form.Item  label={'装修'}>
                        {getFieldDecorator('decoration', {
                            initialValue: this.state.rentHouse.decoration
                        })(
                            <Input  disabled='disabled' />
                        )}
                    </Form.Item>
                 </Col>
                 <Col span={12}>
                 <Form.Item  label={'租金'}>
                        {getFieldDecorator('money', {
                            initialValue: this.state.rentHouse.rent,
                            rules: [{
                                required: true
                            }]
                        })(
                            <Input  disabled='disabled' />
                        )}
                    </Form.Item>
                 </Col>
             </Row>
             <h1>买家信息</h1>
             <Row>
                 <Col span={12}>
                 <Form.Item  label={'出租id'}>
                        {getFieldDecorator('rentUserId', {
                            initialValue: this.state.user.id
                        })(
                            <Input  disabled='disabled' />
                        )}
                    </Form.Item>
                 </Col>
                 <Col span={12}>
                 <Form.Item  label={'租赁人姓名'}>
                        {getFieldDecorator('rentUserName', {
                            initialValue: this.state.user.realName,
                            rules: [{
                                required: true
                            }]
                        })(
                            <Input  disabled='disabled' />
                        )}
                    </Form.Item>
                 </Col>
             </Row>
             <Form.Item >
            <Button type = "primary"
            htmlType = "submit" >
            发布
            </Button> 
            </Form.Item> 
             </Form>
         </div>
           </TableLayout>
           </div>
        )
    }
}
export default Form.create()(Predetermine); 