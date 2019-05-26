import React, {Component, Fragment} from 'react'
import moment from 'moment';
import request from '../../utils/request';
import TableLayout from '../../layouts/TableLayout'
import {Layout,Carousel, Row, Col,Divider,Tabs,
    Avatar,
    Form,
    Button,
    Comment,
    List,
    Input,message, Drawer,Select,Icon} from 'antd'
import styles from './style.css'
import MyMenu from '../Menu/MyMenu';
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
class BuildingDetail extends Component{
    constructor(props){
        super(props)
        this.state={
			pictures:[],
			Bid:this.props.match.params.id,
			Uid:'',
			value: '',
			comments: [],
			submitting: false,
			type:1,
			usercomment:'',
			Uname:'',
			submitting: false,
			visible:false,
			rentHouseAdmin:'',
			building:{},
			houseStyles:[]
		}
	}
	componentWillMount(){
		this.getCurrentBuilding()
		this.getCurrentUser()
		this.getCurrentCommit()
	}
	onClose = () => {
    // this.myHandleSubmit()
    this.setState({
      visible: false,
    });
  };
  showDrawer = () => {
    this.setState({
      visible: true,
    });
	};
	getAdmin=(id)=>{
		let url=`/v1/sysuser/${id}`
		console.log('获取当前id',id);
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
	myHandleSubmit=(e)=>{
		this.onClose()
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err, values) => {
				console.log('Received values of form: ', values);
				if(!err){
					let url=`/v1/wyw/signedreport/InsertSignedReport/${this.state.building.userId}/${this.state.Uid}/${this.state.type}/${this.state.Bid}`
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
	//获取当前楼盘信息
	getCurrentBuilding=()=>{
		let url=`/v1/wyw/building/${this.state.Bid}`
		request(url,{
			method: "GET"
		}).then((res)=>{
			if(res.message=='查询成功'){
				var map=new BMap.Map("orderDetailMap")
				map.centerAndZoom(res.data.province + res.data.city + res.data.area, 11);       
        var local = new BMap.LocalSearch(map, {      
            renderOptions:{map: map}      
        });      
        local.search(res.data.province + res.data.city + res.data.area + res.data.communityName);
				this.getAdmin(res.data.userId)
			this.setState({
				building: res.data,
				pictures: res.data.srcs,
				houseStyles: res.data.houseStyles
			})
			}
		})
	}
	//获取当前的评论
	getCurrentCommit=()=>{
		let url=`/v1/wyw/comment/selectcommentlist/${this.state.type}/${this.state.Bid}`
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

	//发表评论
	postComment=()=>{
		let url=`/v1/wyw/comment/insertcomment/${this.state.Uid}/${this.state.Bid}/${this.state.type}/${this.state.value}`
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
		//预定
		predetermine=()=>{
			var r=confirm('由于交易金额过大，请谨慎交易，在未辨别真假前，请勿轻易付款给对方！')
			if(r){
				this.linkToChange(`/predetermine/${this.state.Bid}/${this.state.type}`)
			}
		}
		   //点击跳转
			 linkToChange = url => {
				const { history } = this.props
				history.push(url)
			};
		//获取当前用户
	  getCurrentUser = () => {
		let url = '/v1/sysUserDomin/getAuth'
		request(url, {
			method: 'GET'
		}).then((res) => {
			if (res.message === '成功') {
				console.log('获取当前用户',res.data)
				this.setState({
					Uid:res.data.id,
					Uname:res.data.userName
				})
			} else {
				console.log(err)
			}
		}).catch(() => {})
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
				author: <p>{this.state.Uname}</p>,
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
    render(){
			const {
        getFieldDecorator
      } = this.props.form;
		// const { comments, submitting, value } = this.state;
        return(
			    <div style={{ padding: 20, overflowY: 'auto', flex: 1 }}>
            <MyMenu></MyMenu>
            <TableLayout
            title={'详细信息'}
        >
			<img className={styles.mimg} src="http://localhost:80/3.jpg"></img>
			<div>
			<Row>
             <Col span={12} >
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
			 </Col>
             <Col span={12} >
						 <Row>
              <Col span={12}>
              <div style={{marginLeft:'30%',marginTop:'10px'}}><img style={{width:'30%',height:'30%'}} src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/></div></Col>
              <Col span={12}>
              <div style={{marginTop:'5px'}}>
              <h2>接待人员 {this.state.rentHouseAdmin.userName}  </h2>
              <p>注册时间 {this.state.rentHouseAdmin.creationDate}</p>
              </div>
              </Col>
            </Row>
			 <h1 style={{marginTop:'5px'}}>楼盘名称：{this.state.building.name}</h1>
			 <span> <h3>    地址：{this.state.building.province} {this.state.building.city}  {this.state.building.area}</h3></span>
			 <Divider />
			 {/* <b  style={{fontSize:'250%',lineHeight:'30%',color:'red',marginLeft:'30px'}}>{this.state.building.id}</b> */}
	          <div style={{marginTop:'8px',marginLeft:'20px'}}>
			<div style={{display:'inline-block',width:'30%'}}>
            <table style={{height:'60px',borderColor:'red',borderLeftStyle:'solid',borderWidth:'2px',marginRight:'10px'}}>
			<tr><td valign="top"></td></tr>
			<div style={{marginLeft:'10px'}}>
			<h1>开发商</h1>
			 <h1>{this.state.building.developer}</h1>
			</div>
			</table>
			</div>
			<div style={{display:'inline-block',width:'30%'}}>
			<table style={{height:'60px',borderColor:'red',borderLeftStyle:'solid',borderWidth:'2px'}}>
			<tr><td valign="top"></td></tr>
			<div style={{marginLeft:'10px'}}>
			<h1>物业公司</h1>
			 <h1>{this.state.building.anagementCompany}</h1>
			</div>
			</table>
			</div>
			<div style={{display:'inline-block',width:'30%'}}>
			<table style={{height:'60px',borderColor:'red',borderLeftStyle:'solid',borderWidth:'2px'}}>
			<tr><td valign="top"></td></tr>
			<div style={{marginLeft:'10px'}}>
			<h1>开盘时间</h1>
			 <h1>{this.state.building.openingTime}</h1>
			</div>
			</table>
			</div>
			<div style={{display:'inline-block'}}>
			<table style={{height:'90px',borderColor:'red',borderLeftStyle:'solid',borderWidth:'2px'}}>
			<tr><td valign="top"></td></tr>
			</table>
			</div>
             </div>
						 <div>
            <Button type="primary" onClick={this.showDrawer}>
          举报
         </Button>
				 <Button onClick={this.predetermine}>预定</Button>
         <Drawer
          title="举报r"
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
              initialValue: this.state.building.userName,
              rules: [
                {
                  required: true,
                }
              ]
            })(<Input size='large'  disabled='disabled' />)}
          </Form.Item>
          <Form.Item  label={'举报人'}>
                        {getFieldDecorator('informerUsername', {
                            initialValue: this.state.Uname,
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
                  message: '请输入举报描述！'
                }
              ]
            })(<TextArea prefix = {< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)'} }/>}
            placeholder="请输入举报描述" />)}
          </Form.Item>
          <Form.Item >
          <Button type = "primary"
          htmlType = "submit" >
          举报
          </Button> 
          
          </Form.Item> 
          </Form>
        </Drawer>
				</div>
				<div style={{marginLeft:'40%',marginTop:'5%'}}><h3> 编号：{this.state.building.id}    发布时间：{this.state.building.createdTime}</h3></div>
      
			 </Col>
            </Row>
						
			<div>
			<Tabs defaultActiveKey="1" onChange={this.callback} >
            <Tabs.TabPane tab="周边地图" key="1">
						<div id="orderDetailMap" style={{width:'100%',height:'500px'}}></div>
						</Tabs.TabPane>
             <Tabs.TabPane tab="户型图" key="2">
						 {
							 this.state.houseStyles.map((item,index)=>{
								if(item.id==1){
									return <div key={index} style={{width:'500px',height:'500px'}}><h3></h3>一室一厅 <img alt=""   size="large" src={`http://localhost:80/111.jpg`} style={{height:'100%' 
											,width:'100%'}}/></div>
									}
									 if(item.id==2){
										return  <div key={index}  style={{width:'500px',height:'500px'}}><h3></h3>二室一厅 <img alt=""   size="large" src={`http://localhost:80/211.jpg`} style={{height:'100%' 
										,width:'100%'}}/></div>
									} 
									if(item.id==3){
										return  <div key={index}  style={{width:'500px',height:'500px'}}><h3></h3>三室一厅 <img alt=""   size="large" src={`http://localhost:80/311.jpg`} style={{height:'100%' 
										,width:'100%'}}/></div>
									} 
									if(item.id==4){
										return <div key={index}  style={{width:'500px',height:'500px'}}><h3></h3>三室二厅 <img alt=""   size="large" src={`http://localhost:80/121.jpg`} style={{height:'100%' 
										,width:'100%'}}/></div>
									}
									 if(item.id==5){
										return  <div key={index}  style={{width:'500px',height:'500px'}}><h3></h3>一室一厅 <img alt=""   size="large" src={`http://localhost:80/111.jpg`} style={{height:'100%' 
										,width:'100%'}}/></div>
									}
							 })
						 }
						 </Tabs.TabPane>
            <Tabs.TabPane tab="Tab 3" key="3">Content of Tab Pane 3</Tabs.TabPane>
            </Tabs>,	
			  </div>
			</div>
			<div>
				<div>
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
		<div > {this.state.comments.length > 0 && < CommentList comments = {this.state.comments}/>}</div>
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
      </div>
			</TableLayout>
			</div>
        )
    }
}
export default Form.create()(BuildingDetail);