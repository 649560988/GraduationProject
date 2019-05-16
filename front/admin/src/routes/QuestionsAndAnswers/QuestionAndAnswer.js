
import React from 'react'
import {Form,Button,message} from 'antd'
import styles from './styles.css'
import TextArea from 'antd/lib/input/TextArea';
import MyMenu from '../Menu/MyMenu';
import TableLayout from '../../layouts/TableLayout'
import request from '../../utils/request'
class QuestionsAndAnswer extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            visable:'none',
            user:''
        }
    }
    componentWillMount(){
        this.getCurrentUser()
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
    handSubmit=(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
              let url='/v1/wyw/question/insertOne'
           let data={
               description:values.description,
               content:values.content,
               userName:this.state.user.userName,
               userId:this.state.user.id,
           }
           request(url, {
            method: 'POST',
            body:data
        }).then((res) => {
            if (res.message === '成功') {
                message.success('发布成功')
            } else {
                console.log(err)
            }
        }).catch(() => {})
          }
        });
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
      /**
     * 点击页面返回按钮
     */
    handleClickBackBtn = (e) => {
        e.stopPropagation()
        this.linkToChange(`/myhome`)
    }

    /***
     *   路径跳转
     */
    linkToChange = url => {
        const { history } = this.props
        history.push(url)
    }
    render() {
        let title = '我要提问'
        const {getFieldDecorator} = this.props.form;
        return (
            <div style={{ padding: 20, overflowY: 'auto', flex: 1 }}>
            <MyMenu></MyMenu>
            <TableLayout
            title={title}
            showBackBtn
            onBackBtnClick={this.handleClickBackBtn}
        >
            <div className={styles.partentDiv}>
           
            <h2>请输入您的问题</h2>
            <Form onSubmit={this.handSubmit}>
            <Form.Item>
            {getFieldDecorator('description', {
            rules: [{
              required: true,
              message: '问题不能为空',
            }, {
            max:35,
            message: '长度不可大于35个字符',
            }],
            })(
               <TextArea  placeholder="请控制在35字符内"></TextArea>
           )}
            </Form.Item>
            
            <span  style={{color:'red'}} onClick={this.handOnClick.bind(this)}>问题补充</span>
            <div style={{display:this.state.visable}}>
            <Form.Item >
            {getFieldDecorator('content', {
            rules: [{
              required: false,
              message: '密码不能为空',
            }],
            })(
               <TextArea></TextArea>
           )}
            </Form.Item>  
            </div>
            <Form.Item >
            <Button type = "primary"
            htmlType = "submit" style={{marginTop:'20px'}}>
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

export default Form.create()(QuestionsAndAnswer);