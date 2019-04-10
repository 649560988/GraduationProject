import React, {Component, Fragment} from 'react'
import Building from './Building';
import moment from 'moment';
import request from '../../utils/request';
import {Layout,Carousel, Row, Col,Divider,Tabs,
    Avatar,
    Form,
    InputNumber,
    Radio,
    Button,
    Comment,
    List,
    Input} from 'antd'
import styles from './style.css'
 const TextArea = Input.TextArea;
 const CommentList = ({
        comments
    }) => (
    <List 
        dataSource = {comments}
        header = {`我的${comments.length} 条评论`}
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
			usercomment:''
		}
	}
	componentWillMount(){
		this.getCurrentUser()
		this.getCurrentBuilding()
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
	 //时间转换
// 	 timestampToTime = (timestamp) => {
// 		var date = new Date(timestamp); //timestamp 为10位需*1000，timestamp 为13位的话不需乘1000
// 		var Y = date.getFullYear() + '-';
// 		var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
// 		var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
// 		var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
// 		var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
// 		var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
// 		return Y + M + D + h + m + s;
// }
	//发表评论
	postComment=()=>{
		let url=`/v1/wyw/comment/insertcomment/${this.state.Uid}/${this.state.Bid}/${this.state.type}/${this.state.value}`
		request(url, {
			method: 'GET',
	}).then((res) => {
			if (res.message === '添加成功') {
				console.log('添加成功')
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
				this.setState({
					Uid:res.data.id
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
    render(){
		// const { comments, submitting, value } = this.state;
        return(
			<div style={{ padding: 20, overflowY: 'auto', flex: 1,marginLeft:'30px',marginRight:'90px' }}>
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

			/**
			显示评论信息
			 */
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
                                // author = {item.username}
                                avatar = {this.state.avatar }
                                // content = {item.context}
                                // datetime = {this.timestampToTime(item.comment_time)}
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
export default BuildingDetail