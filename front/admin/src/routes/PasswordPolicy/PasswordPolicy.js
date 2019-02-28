import React from 'react';
import TableLayout from '../../layouts/TableLayout'
import {Button, Icon, Row, Col, Form, Switch, Input, InputNumber, message} from 'antd'
import {connect} from 'dva'


class StringSwitch extends React.Component {
  render(){
    return (
      <Switch
        checked={this.props.value === 'checked'}
        onChange={e =>this.props.onChange(e ?'checked':'unchecked')}
      />
    )
  }
}

@connect(
  ({passwordPolicy, user}) => ({
    passwordPolicyInfo: passwordPolicy.passwordPolicyInfo,
    currentUser: user.currentUser
  })
)
@Form.create()
class PasswordPolicy extends React.Component{

  constructor(props){
    super(props)
  }

  componentDidMount(){
    this.fetch()
    // console.log(this.props.currentUser);

  }

  fetch = () => {
    const {dispatch} = this.props
    dispatch({
      type: 'passwordPolicy/fetch',
      payload: {
        organizationId: this.props.currentUser.organizationId,
      }
    })
  }

  /**
   * 刷新,重置表单
   */
  handleRefresh = () => {
    this.props.form.resetFields()
  }

  handleSubmit = () => {
    this.props.form.validateFields((err,value)=>{
      if(!err){
        // console.log('value',value)
        let data = this.handleSubmitData(value)
        // console.log('data',data)

        const {dispatch} = this.props
        dispatch({
          type: 'passwordPolicy/update',
          payload: {
            organizationId: this.props.currentUser.organizationId,
            id: this.props.currentUser.id,
            data: data,
          },
          callback: (res) => {
            // console.log(res);
            if(res.failed){
              message.error(`修改失败：${res.message}`)
            }else {
              message.success(`修改成功！`)
              this.fetch()
            }
          },
        })

      }
    })
  }

  /***
   * 处理提交数据
   * @returns {*}
   */
  handleSubmitData = (value) => {
    let data = {}

    if(value.enablePassword === 'checked'){
      data.enablePassword = true
    }else {
      data.enablePassword = false
    }
    if(value.originalPassword !== ""){
      data.originalPassword = value.originalPassword
    }
    if(value.minLength !== ""){
      data.minLength = value.minLength
    }
    if(value.maxLength !== ""){
      data.maxLength = value.maxLength
    }
    if(value.digitsCount !== ""){
      data.digitsCount = value.digitsCount
    }
    if(value.lowercaseCount !== ""){
      data.lowercaseCount = value.lowercaseCount
    }
    if(value.uppercaseCount !== ""){
      data.uppercaseCount = value.uppercaseCount
    }
    if(value.specialCharCount !== ""){
      data.specialCharCount = value.specialCharCount
    }
    if(value.notRecentCount !== ""){
      data.notRecentCount = value.notRecentCount
    }
    if(value.regularExpression !== ""){
      data.regularExpression = value.regularExpression
    }

    return data
  }

  renderPolicyForm = () => {

    const {getFieldDecorator} = this.props.form
    let passwordPolicyInfo = this.props.passwordPolicyInfo

// console.log('flag',this.props.passwordPolicyInfo.enablePassword)

    return (
      <div>
        <h3>密码安全策略是设置密码时的密码规则。选择启用并保存，策略将生效。</h3>
        <Row>
          <Col span={12}>
            <Form>
              <Form.Item label={'是否启用'}>
                {
                 getFieldDecorator('enablePassword',{
                   initialValue: passwordPolicyInfo.enablePassword
                                  ? 'checked' : 'unchecked',
                 })(
                   <StringSwitch />
                 )
                }
              </Form.Item>
              <Form.Item label={'新用户初始密码'}>
                {
                  getFieldDecorator('originalPassword',{
                    initialValue: passwordPolicyInfo.originalPassword!=null
                                  ? passwordPolicyInfo.originalPassword
                                  : "",
                  })(
                    <Input autoComplete={`off`}/>
                  )
                }
              </Form.Item>
              <Form.Item label={'最小密码长度'}>
                {
                  getFieldDecorator('minLength',{
                    initialValue: passwordPolicyInfo.minLength!=null
                                  ? passwordPolicyInfo.minLength
                                  : "",
                  })(
                    <InputNumber autoComplete={`off`} style={{width: '100%'}} min={0}/>
                  )
                }
              </Form.Item>
              <Form.Item label={'最大密码长度'}>
                {
                  getFieldDecorator('maxLength',{
                    initialValue: passwordPolicyInfo.maxLength!=null
                                  ? passwordPolicyInfo.maxLength
                                  : "",
                  })(
                    <InputNumber autoComplete={`off`} style={{width: '100%'}} min={0}/>
                  )
                }
              </Form.Item>
              <Form.Item label={'最少数字数'}>
                {
                  getFieldDecorator('digitsCount',{
                    initialValue: passwordPolicyInfo.digitsCount!=null
                                  ? passwordPolicyInfo.digitsCount
                                  : "",
                  })(
                    <InputNumber autoComplete={`off`} style={{width: '100%'}} min={0}/>
                  )
                }
              </Form.Item>
              <Form.Item label={'最少小写字母数'}>
                {
                  getFieldDecorator('lowercaseCount',{
                    initialValue: passwordPolicyInfo.lowercaseCount!=null
                                  ? passwordPolicyInfo.lowercaseCount
                                  : "",
                  })(
                    <InputNumber autoComplete={`off`} style={{width: '100%'}} min={0}/>
                  )
                }
              </Form.Item>
              <Form.Item label={'最少大写字母数'}>
                {
                  getFieldDecorator('uppercaseCount',{
                    initialValue: passwordPolicyInfo.uppercaseCount!=null
                                  ? passwordPolicyInfo.uppercaseCount
                                  : "",
                  })(
                    <InputNumber autoComplete={`off`} style={{width: '100%'}} min={0}/>
                  )
                }
              </Form.Item>
              <Form.Item label={'最少特殊字符数'}>
                {
                  getFieldDecorator('specialCharCount',{
                    initialValue: passwordPolicyInfo.specialCharCount!=null
                                  ? passwordPolicyInfo.specialCharCount
                                  : "",
                  })(
                    <InputNumber autoComplete={`off`} style={{width: '100%'}} min={0}/>
                  )
                }
              </Form.Item>
              <Form.Item label={'最大近期密码数'}>
                {
                  getFieldDecorator('notRecentCount',{
                    initialValue: passwordPolicyInfo.notRecentCount!=null
                                  ? passwordPolicyInfo.notRecentCount
                                  : "",
                  })(
                    <InputNumber autoComplete={`off`} style={{width: '100%'}} min={0}/>
                  )
                }
              </Form.Item>
              <Form.Item label={'密码正则表达式'}>
                {
                  getFieldDecorator('regularExpression',{
                    initialValue: passwordPolicyInfo.regularExpression!=null
                                  ? passwordPolicyInfo.regularExpression
                                  : "",
                  })(
                    <Input autoComplete={`off`}/>
                  )
                }
              </Form.Item>
              <Form.Item>
                <Button type={'primary'} onClick={this.handleSubmit}>保存</Button>
                <Button style={{marginLeft:10}} onClick={this.handleRefresh}>取消</Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }

  render(){
    // console.log(this.props.passwordPolicyInfo)
    return(
      <TableLayout title={'密码策略'}
                   renderTitleSide={() => (
                     <Button onClick={this.handleRefresh}><Icon type="reload" theme="outlined" />刷新</Button>
                   )}
      >
        {this.renderPolicyForm()}
      </TableLayout>
    )
  }
}

export default PasswordPolicy;
