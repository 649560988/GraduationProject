import React, {Component, Fragment} from 'react'
import Building from './Building';
import moment from 'moment';
import request from '../../utils/request';
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
			building:'',
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
			visible:false
		}
	}
	componentWillMount(){
		this.getCurrentUser()
		this.getCurrentBuilding()
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
			this.setState({
				building:res.data,
				pictures:res.data.srcs
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
			<div style={{ padding: 20, overflowY: 'auto', flex: 1,marginLeft:'30px',marginRight:'5px' }}>
			<MyMenu></MyMenu>
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
						 <div>
            <Button type="primary" onClick={this.showDrawer}>
          Open
         </Button>
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
          Log in
          </Button> 
          
          </Form.Item> 
          </Form>
        </Drawer>
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
			</div>
        )
    }
}
export default Form.create()(BuildingDetail);