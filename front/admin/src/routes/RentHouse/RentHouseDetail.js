import React,{Component} from 'react'
import {Carousel, Row, Col,Divider,Tabs,Icon,message,
    Avatar,Form,Button, Comment,List,  Input,   Drawer,Select, Modal
  } from 'antd';
import moment from 'moment';
import request from '../../utils/request';
import styles from './style.css'
import MyMenu from '../Menu/MyMenu';
import TableLayout from '../../layouts/TableLayout'
const TextArea = Input.TextArea;
const CommentList = ({
       comments
   }) => (
   <List 
       dataSource = {comments}
       itemLayout = "horizontal"
       renderItem = {props => 
       <Comment {...props}/>}
       />);
const Editor = ({
   onChange,
   onSubmit,
   submitting,
   value,}) => ( 
       <div >
           <Form.Item >
           <TextArea rows = {4} onChange = {onChange} value = {value}/>  
           </Form.Item > 
           <Form.Item> 
               <Button htmlType = "submit"
                       loading = {submitting}
                       onClick = {onSubmit}
                       type = "primary">发表评论 </Button> 
           </Form.Item > 
       </div>
       );
class RentHouseDetail extends Component{
    constructor(props){
        super(props)
        this.state={
          rentHouse:{},
          pictures:[],
          Rid:this.props.match.params.id,
		      Uid:'',
		      value: '',
		      comments: [],
		      submitting: false,
          type: 0,
          user:'',
          contenet:[
            {name:'database',zh_name:'洗衣机'},{name:'credit-card',zh_name:'电视'},{name:'idcard',zh_name:'空调'}
        ],
        usercomment:'',
        Uname:'',
        visible:false,
        houseStyleList:[1],
        rentHouseAdmin:'',
        able:true
		}
    }
    componentWillMount(){
    this.getCurrentRentHouse()
    // 
  }
  //获取当前出租屋信息
  getCurrentRentHouse=()=>{
    let url=`/v1/wyw/renthouse/${this.state.Rid}`
    request(url,{
			method: "GET"
		}).then((res)=>{
			if(res.message=='查询成功'){
        var map = new BMap.Map("orderDetailMap");      
        // map.centerAndZoom('江苏省常州市钟楼区', 11);     
        map.centerAndZoom(res.data.province + res.data.city + res.data.area, 11);       
        var local = new BMap.LocalSearch(map, {      
            renderOptions:{map: map}      
        });      
        local.search(res.data.province + res.data.city + res.data.area + res.data.communityName);
        console.log('查询结果',local)
        this.getCurrentUser(res.data.userId)
			this.setState({
				rentHouse:res.data,
				pictures:res.data.srcs
      })
    this.getAdmin(res.data.userId)
			}
		})
  }
  //举报栏目
  onClose = () => {
    // this.myHandleSubmit()
    this.setState({
      visible: false,
    });
  };
  predetermine=()=>{
    var r=confirm('由于交易金额过大，请谨慎交易，依据平台交易进程规则有保障，祝您生活愉快')
    if(r){
      this.linkToChange(`/predetermine/${this.state.rentHouse.id}/${this.state.type}`)
    }
  }
  //举报按钮
  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };
    //点击跳转
    linkToChange = url => {
      const { history } = this.props
      history.push(url)
    };
  //发表评论
	postComment=()=>{
		let url=`/v1/wyw/comment/insertcomment/${this.state.Uid}/${this.state.Rid}/${this.state.type}/${this.state.value}`
		request(url, {
			method: 'GET',
	}).then((res) => {
			if (res.message === '添加成功') {
        message.success("评论成功")
        this.getCurrentCommit()
			} else {
				console.log('获取当前登录人信息失败');
			}
	}).catch((err) => {
			console.log(err)
	})
  }
  
	 callback=(key)=> {
		console.log(key);
    }
    //当前记录信息
    getAdmin=(id)=>{
      let url=`/v1/sysuser/${id}`
      request(url, {
        method: 'GET',
    }).then((res) => {
        if (res.message === '成功') {
          console.log('获取当前记录信息',res.data);
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
    //获取当前人登陆信息
	  getCurrentUser = (id) => {
		let url = '/v1/sysUserDomin/getAuth'
		request(url, {
			method: 'GET'
		}).then((res) => {
			if (res.message === '成功') {
        if(id==res.data.id){
					this.setState({
						able:false
					})
				}
				this.setState({
          Uid:res.data.id,
          user:res.data
				})
			} else {
				console.log(err)
			}
		}).catch(() => {})
}
//获取评论
getCurrentCommit=()=>{
  let url=`/v1/wyw/comment/selectcommentlist/${this.state.type}/${this.state.Rid}`
  request(url,{
    method:'GET'
  }).then((res)=>{
    if(res.message=='成功'){
      console.log('评论',res.data)
      this.setState({
        usercomment:res.data
      })
    }
  })
}

	handleSubmit = () => {
		if (!this.state.value) {
		  return;
		}
		this.postComment();
		this.setState({
		  submitting: true,
		});

		setTimeout(() => {
		  this.setState({
			submitting: false,
			value: '',
			comments: [
			  {
				author: 'Han Solo',
				avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
				content: <p>{this.state.value}</p>,
				datetime: moment().fromNow(),
			  },
			  ...this.state.comments,
			],
		  });
		}, 1000);
	  }
	  handleChange = (e) => {
		this.setState({
		  value: e.target.value,
		});
    }
    myHandleSubmit=(e)=>{
      this.onClose()
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
          console.log('Received values of form: ', values);
          if(!err){
            let url=`/v1/wyw/signedreport/InsertSignedReport/${this.state.rentHouse.userId}/${this.state.Uid}/${this.state.type}/${this.state.Rid}`
            request(url,{
              method:'POST',
              body: values
            }).then((res)=>{
              if(res.message=='成功'){
                message.success('举报成功')
              }
            })
          }
      });
    }
    render(){
      const {
        getFieldDecorator
      } = this.props.form;
        return(
          <div style={{ padding: 20, overflowY: 'auto', flex: 1 }}>
          <MyMenu></MyMenu>
          <TableLayout
          title={'详细信息'}
      >
			     <img className={styles.mimg} src="http://localhost:80/111.jpg"></img>
            <strong><h1 style={{marginLeft:'30px',marginTop:'5px'}}>{this.state.rentHouse.houseDescription}</h1></strong> 
            <Row>
            <Col span={16} >
            <Tabs defaultActiveKey="1" onChange={this.callback} tabPosition="left">
            <Tabs.TabPane tab="室内图片" key="1">
            <div className={styles.div1}>
                <Carousel autoplay>
                {
                    this.state.pictures.map((item,index)=>{
                        return <div className={styles.carousel}>
                        	<img alt=""   size="large" src={`http://localhost:80/${item.src}`} style={{height:'100%' 
                    ,width:'100%'}}/>
                        </div>
                    })
                }
               </Carousel>
             </div>
            </Tabs.TabPane>
             <Tabs.TabPane tab="户型图" key="2">
             <div className={styles.div1}>
            {
              this.state.houseStyleList.map((item)=>{
                if(this.state.rentHouse.houseStyle==1){
                return <div><h3></h3>一室一厅 <img alt=""   size="large" src={`http://localhost:80/111.jpg`} style={{height:'100%' 
                    ,width:'100%'}}/></div>
                }
                 if(this.state.rentHouse.houseStyle==2){
                  return  <div><h3></h3>二室一厅 <img alt=""   size="large" src={`http://localhost:80/211.jpg`} style={{height:'100%' 
                  ,width:'100%'}}/></div>
                } 
                if(this.state.rentHouse.houseStyle==3){
                  return  <div><h3></h3>三室一厅 <img alt=""   size="large" src={`http://localhost:80/311.jpg`} style={{height:'100%' 
                  ,width:'100%'}}/></div>
                } 
                if(this.state.rentHouse.houseStyle==4){
                  return <div><h3></h3>三室二厅 <img alt=""   size="large" src={`http://localhost:80/121.jpg`} style={{height:'100%' 
                  ,width:'100%'}}/></div>
                }
                 if(this.state.rentHouse.houseStyle==5){
                  return  <div><h3></h3>一室一厅 <img alt=""   size="large" src={`http://localhost:80/111.jpg`} style={{height:'100%' 
                  ,width:'100%'}}/></div>
                }
              })
            }
           <img alt=""   size="large" src={`http://localhost:80/111.jpg`} style={{height:'100%' 
        ,width:'100%'}}/>
             </div>
             </Tabs.TabPane>
            </Tabs>
            </Col>
            <Col span={8} >
            <Row>
              <Col span={12}>
              <div style={{marginLeft:'20%',marginTop:'10px'}}><img style={{width:'50%',height:'50%'}} src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/></div></Col>
              <Col span={12}>
              <div style={{marginTop:'30%'}}>
              <h2>房东： {this.state.rentHouseAdmin.userName}  </h2>
              <p>注册时间 {this.state.rentHouseAdmin.creationDate}</p>
              </div>
              </Col>
            </Row>
            <div >
            </div>
            <h3></h3>
            <span> <h3> 小区名：{this.state.rentHouse.communityName}    地址：{this.state.rentHouse.province} {this.state.rentHouse.city}  {this.state.rentHouse.area}</h3></span>
            
            <Divider />  
          <div style={{marginTop:'8px',marginLeft:'20px'}}>
           <div style={{display:'inline-block',width:'30%'}}>
           <table style={{height:'60px',borderColor:'red',borderLeftStyle:'solid',borderWidth:'2px',marginRight:'10px'}}>
           <tr><td valign="top"></td></tr>
           <div style={{marginLeft:'10px'}}>
           <h2>房件面积</h2>
           <h3>{this.state.rentHouse.houseArea}平方米</h3>
           </div>
           </table>
           </div>
           <div style={{display:'inline-block',width:'30%'}}>
           <table style={{height:'60px',borderColor:'red',borderLeftStyle:'solid',borderWidth:'2px'}}>
           <tr><td valign="top"></td></tr>
           <div style={{marginLeft:'10px'}}>
          <h2>租金</h2>
          <h3>{this.state.rentHouse.rent}</h3>
           </div>
           </table>
           </div>
           <div style={{display:'inline-block',width:'30%'}}>
           <table style={{height:'60px',borderColor:'red',borderLeftStyle:'solid',borderWidth:'2px'}}>
           <tr><td valign="top"></td></tr>
           <div style={{marginLeft:'10px'}}>
           <h2>出租要求</h2>
           <h3>{this.state.rentHouse.rentalRequest}</h3>
           </div>
           </table>
           </div>
           <div style={{display:'inline-block'}}>
           <table style={{height:'60px',borderColor:'red',borderLeftStyle:'solid',borderWidth:'2px'}}>
           <tr><td valign="top"></td></tr>
           </table>
           </div>
            </div>
            <span ><h1 style={{background:'red',width:'60%',marginLeft:'20%',marginTop:'10px'}}><Icon type="mobile" />电话{this.state.rentHouse.contactInformation}</h1></span>
           
            <div style={{marginLeft:'10%'}}>
            {
              this.state.able?<div><Button type="primary" onClick={this.showDrawer}>
              举报
              </Button>
              <Button onClick={this.predetermine}>预定</Button></div>:<p></p>
            }
              
              <Drawer
              title="举报"
              placement="right"
              closable={false}
              onClose={this.onClose}
              visible={this.state.visible}
              width='30%'
              >
              <p>请勿恶意举报</p>
              <Form onSubmit={this.myHandleSubmit.bind(this)}>
              <Form.Item label = {'被举报人'}>
              {getFieldDecorator('againstUsername', {
                initialValue: this.state.rentHouse.userName,
                rules: [
                     {
                    required: true,
                  }
                ]
              })(<Input size='large'  disabled='disabled' />)}
              </Form.Item>
              <Form.Item  label={'举报人'}>
                          {getFieldDecorator('informerUsername', {
                              initialValue: this.state.user.userName,
                              rules: [{
                                  required: true, message: '请输入用户名'
                              }]
                          })(
                              <Input placeholder={'请输入用户名'} disabled='disabled' />
                          )}
                      </Form.Item>
              
              <Form.Item label={'举报类型'}>
              {getFieldDecorator('violationType', {
                rules: [
                  {
                    required: true,
                    message: '请输入用户名！'
                  }
                ]
              })(
              <Select>
                <Select.Option value="信息错误">
                信息错误
                </Select.Option>
                <Select.Option value="暴力倾向">
                暴力倾向
                  </Select.Option>
                  <Select.Option  value="烟雨误会">
                  烟雨误会
                  </Select.Option>
              </Select>
              )}
              </Form.Item>  
              <Form.Item label={'举报描述'}>
              {getFieldDecorator('violationContent', {
                rules: [
                  {
                    required: true,
                    message: '请输入用户名！'
                  }
                ]
              })(<TextArea prefix = {< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)'} }/>}
              placeholder="请输入举报描述" />)}
              </Form.Item>
              <Form.Item >
              <Button type = "primary"
              htmlType = "submit" >
              Log in
              </Button> 
              </Form.Item> 
              </Form>
              </Drawer>
              </div>
        <div style={{marginLeft:'40%',marginTop:'20%'}}><h3> 编号：{this.state.rentHouse.id}    发布时间：{this.state.rentHouse.createdTime}</h3></div>
            </Col>
           </Row>
           <div style={{marginTop:'10px'}}>
            <h1 >房屋信息</h1>
            <Divider /> 
           <Row>
           <Col span={8}>
           <h2>户型：{this.state.rentHouse.houseStyle}</h2> 
           <h2>楼层：{this.state.rentHouse.floor}</h2>
           <h2>小区：{this.state.rentHouse.communityName}</h2>
           </Col>
           <Col span={8}>
           <h2>面积：{this.state.rentHouse.houseArea}</h2>
           <h2>装修：{this.state.rentHouse.decoration}</h2>
           <h2>要求：{this.state.rentHouse.rentalRequest}</h2>
           </Col>
           <Col span={8}>
           <h2>朝向：{this.state.rentHouse.oriented}</h2>
           <h2>类型:{this.state.rentHouse.paymentType}</h2>
           </Col>
           </Row>
           </div>
           <Divider /> 
           <h1 style={{ marginTop:'15px'}}>房源概况</h1>
           <h2>{this.state.rentHouse.houseDescription}</h2>
           {/* <div>
           <Tag {...this.props} checked={this.state.checked} onChange={this.handleChange}>111</Tag>
  </div> */}
           <Divider /> 
           {/* <h1 style={{ marginTop:'15px'}} >配套设施</h1>
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
           } */}
          
          <h1>附近地图</h1>
          <div id="orderDetailMap" style={{width:'100%',height:'500px'}}></div>
          
          
          
           {/* <div style={{marginLeft:'10%',marginRight:'10%'}}><Address province={province} city={this.state.rentHouse.city }area={this.state.rentHouse.city} name={this.state.rentHouse.communityName}></Address></div> */}
             <div>
             <h1>评论</h1>
				<List className = "comment-list"
                    header = {`${this.state.usercomment.length} 条评论`}
                    itemLayout = "horizontal"
                    dataSource = {
                        this.state.usercomment
                    }
                    renderItem = {
                        (item, index) => ( 
                            <Comment 
                                author = {item.userName}
                                avatar= "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                                content = {item.content}
                                datetime = {item.createdTime}
                            />)
                    }
                    />
				</div>
		< div > {this.state.comments.length > 0 && < CommentList comments = {this.state.comments}/>}</div>
        <Comment
          avatar={(
            <Avatar
              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              alt="Han Solo"
            />
          )}
          content={(
            <Editor
              onChange={this.handleChange}
              onSubmit={this.handleSubmit}
              submitting={this.submitting}
              value={this.state.value}
            />
          )}
        />
      </TableLayout>
           </div>
        )
    }
}
export default Form.create()(RentHouseDetail);