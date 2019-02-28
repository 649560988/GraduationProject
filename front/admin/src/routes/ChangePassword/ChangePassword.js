import React from 'react';
import { Form,Input } from 'antd';

const FormItem = Form.Item;


class ChangePassword extends React.Component {

  state={
    errorInfo1:"",
    errorInfo2:"",
    errorInfo3:"",
    pwd1:"",
    pwd2:"",
    flag1:false,
    flag2:false,
    flag3:false,
    flag:1,
  };


  /**
   * 判断新旧密码是否相同
   * 判断用户两次输入是否相同
   */
  handleConfirm=()=>{
    let pwd1 = document.getElementsByClassName("pwd")[0].value;//原始密码
    let pwd2 = document.getElementsByClassName("pwd")[1].value;//新密码1
    let pwd3 = document.getElementsByClassName("pwd")[2].value;//新密码2
    let error1 = "";
    let error2 = "";
    let error3 = "";
    let flag1 = true;
    let flag2 = true;
    let flag3 = true;
    if(pwd2!==""){
      let re = /(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}/;
      if(pwd2.length < 8 || pwd2.length > 16 || !re.test(pwd2)){
        error3 = "密码长度为8-16位，数字和字母组合";
        flag3 = false;
      }else{
        error3 = "";
        flag3 = true;
      }
    }

    //新旧密码比对
    if(pwd1 === "" || pwd2 === ""){
      error1 = "";
      flag1 = false;
    }else{
      if(pwd1 === pwd2){
        error1 = "新密码与原始密码相同!!"
        flag1 = false
      }else if(pwd1 !== pwd2){
        error1 = "";
        flag1 = true;
      }
    }
    //两次新密码比对
    if(pwd2 === "" || pwd3 === ""){
      error2 = "";
      flag2 = false;
    }else{
      if(pwd2 === pwd3){
        error2 = "";
        flag2 = true;
      }else{
        error2 = "两次新密码输入不一致";
        flag2 = false;
      }
    }
    this.setState({
      errorInfo1:error1,
      errorInfo2:error2,
      errorInfo3:error3,
      flag1: flag1,
      flag2: flag2,
      flag3: flag3,
    },()=>{
      //最终比对
      if(this.state.flag2 === true && this.state.flag1 === true && this.state.flag3 === true){
        this.setState({
          flag:1
        },()=>{
          this.props.getPasswpord(pwd1,pwd2,this.state.flag);
        })
      }else{
        this.setState({
          flag:0
        },()=>{
          this.props.getErrorMessage(error1,error2,error3);
          this.props.getPasswpord(pwd1,pwd2,this.state.flag);
        })
      }
    });
  };


  render() {
    return (
      <Form layout="inline">
        <div>
          <div id="errInfo1" >{this.state.errorInfo1}</div>
          <div id="errInfo1" >{this.state.errorInfo2}</div>
          <div id="errInfo2" >{this.state.errorInfo3}</div>
          <FormItem label={"原始密码"}>
            {/*<p>原始密码</p>*/}
            <Input className="pwd" type="password" placeholder="请输入原始密码" style={{ width: 200, marginLeft:16 }}  onBlur={this.handleConfirm}/>
          </FormItem>
          <FormItem style={{marginTop : 20}} label={"新密码"}>
            {/*<p>新密码</p>*/}
            <Input className="pwd" type="password" placeholder="请输入新密码" style={{ width: 200 ,marginLeft:29 }} onBlur={this.handleConfirm}/>
          </FormItem>
          <br/>
          <FormItem style={{marginTop : 20}} label={"重复新密码"}>
            {/*<p>重复新密码</p>*/}
            <Input className="pwd" type="password" placeholder="请再次输入新密码" style={{ width: 200,marginLeft:2 }} onBlur={this.handleConfirm}/>
          </FormItem>
          <br/>
        </div>
      </Form>
    )
  }
}

export default ChangePassword;
