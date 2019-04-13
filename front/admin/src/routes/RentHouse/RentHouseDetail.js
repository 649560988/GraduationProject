import React,{Component} from 'react'
import {Carousel, Row, Col,Divider,Tabs,Icon,message,
    Avatar,Form,Button, Comment,List,  Input,   Drawer,
  } from 'antd';
  import moment from 'moment';
import request from '../../utils/request';
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
class RentHouseDetail extends Component{
    constructor(props){
        super(props)
        this.state={
          rentHouse:'',
          pictures:[],
          Rid:this.props.match.params.id,
		      Uid:'',
		      value: '',
		      comments: [],
		      submitting: false,
          type:0,
          contenet:[
            {name:'database',zh_name:'洗衣机'},{name:'credit-card',zh_name:'电视'},{name:'idcard',zh_name:'空调'}
        ],
        usercomment:'',
        Uname:'',
        visible:false
		}
    }
    componentWillMount(){
    this.getCurrentUser()
    this.getCurrentRentHouse()
  }
  //获取当前出租屋信息
  getCurrentRentHouse=()=>{
    let url=`/v1/wyw/renthouse/${this.state.Rid}`
    request(url,{
			method: "GET"
		}).then((res)=>{
			if(res.message=='查询成功'){
			this.setState({
				rentHouse:res.data,
				pictures:res.data.srcs
			})
			}
		})
  }
  //举报栏目
  onClose = () => {
    this.setState({
      visible: false,
    });
  };
  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };
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
    render(){
        return(
            <div style={{ padding: 20, overflowY: 'auto', flex: 1,marginLeft:'30px',marginRight:'5px' }}>
            <MyMenu></MyMenu>
			<img className={styles.mimg} src="http://localhost:80/3.jpg"></img>
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
             <Tabs.TabPane tab="Tab 2" key="2">
             <div className={styles.div1}>
             </div>
             </Tabs.TabPane>
            <Tabs.TabPane tab="Tab 3" key="3">
            <div className={styles.div1}>
             </div>
            </Tabs.TabPane>
            </Tabs>
            </Col>
            <Col span={8} >
            <b  style={{fontSize:'250%',lineHeight:'30%',color:'red',marginLeft:'30px'}}>{this.state.rentHouse.id}</b>
            <span> <h3>地址：{this.state.rentHouse.province}</h3></span>
            <h3>小区名：{this.state.rentHouse.communityName}</h3>
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
         
        </Drawer>
        </div>
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
      </div>
           </div>
        )
    }
}
export default RentHouseDetail