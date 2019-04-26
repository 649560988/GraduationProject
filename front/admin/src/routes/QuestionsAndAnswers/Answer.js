
import React from 'react'
import {List, Avatar,Icon,Divider,Comment,Button,Input,Form,message } from 'antd';
import MyMenu from '../Menu/MyMenu';
import TableLayout from '../../layouts/TableLayout'
import moment from 'moment';
import request from '../../utils/request';
const IconText = ({ type, text }) => (
    <span>
      <Icon type={type} style={{ marginRight: 8 }} />
      {text}
    </span>
  );
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
class Answer extends React.Component {
   
  
    constructor(props) {
        super(props)
        this.state = {
            data:[],
              usercomment:'',
              value: '',
              comments: [],
              submitting: false,
              id:this.props.match.params.id,
              user:'',
              visable:'none',
        }
    }

    componentWillMount(){
      this.getCurrentUser()
      this.getCurrentQuestion()
      this.getCurrentCommit()
    }
    handOnClick=()=>{
      if(this.state.visable=='none'){
          this.setState({
              visable:'block',
          })
      }else{
          this.setState({
              visable:'none',
          })
      }
     
  }
    //获取当前问题
    getCurrentQuestion=()=>{
      let url=`/v1/wyw/question/selectOne/${this.state.id}`
      request(url,{
        method:'GET'
      }).then((res)=>{
        if(res.message=='成功'){
          console.log('评论',res.data)
          this.setState({
            data:res.data
          })
        }
      })
    }
  //获取当前人登陆信息
  getCurrentUser = () => {
		let url = '/v1/sysUserDomin/getAuth'
		request(url, {
			method: 'GET'
		}).then((res) => {
			if (res.message === '成功') {
        console.log("getCurrentUser",res.data)
				this.setState({
          user:res.data
				})
			} else {
				console.log(err)
			}
		}).catch(() => {})
}
    //获取答案
getCurrentCommit=()=>{
  let url=`/v1/wyw/answer/selectAll/${this.state.id}`
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
  //发表答案
	postComment=()=>{
    let data={
      userId: this.state.user.id,
      userName:this.state.user.userName,
      questionId:this.state.id,
      content:this.state.value
    }
		let url=`/v1/wyw/answer/insertOne`
		request(url, {
      method: 'POST',
      body: data
	}).then((res) => {
			if (res.message === '成功') {
        message.success("回答成功成功")
        this.getCurrentCommit()
			} else {
				console.log('获取当前登录人信息失败');
			}
	}).catch((err) => {
			console.log(err)
	})
  }
    /**
     * 点击页面返回按钮
     */
    handleClickBackBtn = (e) => {
      e.stopPropagation()
      this.linkToChange(`/question`)
  }

  /***
   *   路径跳转
   */
  linkToChange = url => {
      const { history } = this.props
      history.push(url)
  }
  /**
   * 提交按钮
   */
	handleSubmit = () => {
		if (!this.state.value) {
		  return;
		}
		this.postComment();
		this.setState({
      submitting: true,
      // usercomment:[...value]
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
    render() {
      let myDiv=null
        return (
            <div style={{ padding: 20, overflowY: 'auto', flex: 1,marginLeft:'30px',marginRight:'5px' }}>
            <MyMenu></MyMenu>
            <TableLayout
            title={'答案'}
            showBackBtn
            onBackBtnClick={this.handleClickBackBtn}
        >
           <div style={{marginLeft:'10%',marginRight:'10%',background:' #fff'}}>
         <div style={{marginLeft:'5px'}}>
         <h1>{this.state.data.description}</h1>
         <Divider />
         {
           
            this.state.data.content==null?
            <h2>未添加详细描述</h2>
            :
            <h2>{this.state.data.content}</h2>
       
         }
          <Divider />
           {this.state.data.userName}
           <Divider type="vertical" />
           {this.state.data.createdTime}
            <Divider type="vertical" />
            <a href="#">Link</a>
         </div>
        <span  onClick={this.handOnClick.bind(this)}>点我回答</span> 
        <div style={{display:this.state.visable}}>
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

           <div style={{marginTop:'20px'}}>
             <h1>回答</h1>
				<List className = "comment-list"
                    header = {`${this.state.usercomment.length} 条回答`}
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
                    {/* < div > {this.state.comments.length > 0 && < CommentList comments = {this.state.comments}/>}</div> */}
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

export default Answer;