import React from 'react'
import TableLayout from '../../layouts/TableLayout'
import { Form, Input, Row, Col, Button, message } from 'antd'
import { connect } from 'dva'

@connect(
  ({ intl, loading }) => ({
    list: intl.list,
    loading: loading.effects['intl/add']
  })
)
@Form.create()
class IntlManageAdd extends React.Component{

  constructor(props){
    super(props)
  }

  componentDidMount(){
    this.langInputRef.focus()
  }

  handleUniqueCheck = (rule, value, callback) => {
    if(rule.field === 'lang'){
      this.props.form.setFields({
        code:{
          value: this.props.form.getFieldValue('code'),
          errors: null
        }
      })
    }else{
      this.props.form.setFields({
        lang:{
          value: this.props.form.getFieldValue('lang'),
          errors: null
        }
      })
    }
    const {lang, code} = this.props.form.getFieldsValue(['lang','code']);
    if(lang && code) {
      //发送异步验证请求
      const { dispatch } = this.props
      dispatch({
        type: 'intl/checkUnique',
        payload: {lang, code},
        callback: (result) => {
          if(result === false){
            callback(`该 语言-编码 组合已经存在`)
          }else{
            callback()
          }
        }
      })
    }else{
      callback()
    }
  }

  handleResetForm = () => {
    this.props.form.resetFields()
  }

  renderAddForm = () =>{
    const { getFieldDecorator } = this.props.form
    return (
      <Row>
        <Col span={10}>
          <Form>
            <Form.Item label={`语言`}>
              {
                getFieldDecorator('lang',{
                  rules:[
                    {required: true, whitespace: true, message: '语言不能为空'},
                    {validator: this.handleUniqueCheck}
                  ]
                })(
                  <Input placeholder={`请输入语言`} autoComplete={'off'} ref={ref => this.langInputRef = ref}/>
                )
              }
            </Form.Item>
            <Form.Item label={`编码`}>
              {
                getFieldDecorator('code',{
                  rules:[
                    {required: true, whitespace: true, message: '编码不能为空'},
                    {validator: this.handleUniqueCheck}
                  ]
                })(
                  <Input placeholder={`请输入编码`} autoComplete={'off'}/>
                )
              }
            </Form.Item>
            <Form.Item label={`名称`}>
              {
                getFieldDecorator('name',{
                  rules:[
                    {required: true, whitespace: true, message: '名称不能为空'}
                  ]
                })(
                  <Input placeholder={`请输入名称`} autoComplete={'off'}/>
                )
              }
            </Form.Item>
            <Form.Item>
              <Button type={'primary'} onClick={this.handleAddSubmit} loading={this.props.loading}>添加</Button>
              <Button style={{marginLeft:10}} onClick={this.handleResetForm}>重置</Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>

    )
  }

  handleAddSubmit = () => {
    this.props.form.validateFields((err, values)=>{
      if(!err){
        const { dispatch } = this.props
        dispatch({
          type: 'intl/add',
          payload: values,
          callback: (result) => {
            if(result === true){
              message.success(`添加成功`)
              this.props.history.push(`/setting/intl-manage`)
            }else{
              message.error(`添加失败：${result.message}`)
            }
          }
        })
      }
    })
  }

  render(){
    return (
      <TableLayout title={`添加多语言项`} showBackBtn={true} onBackBtnClick={()=>this.props.history.goBack()}>
        {
          this.renderAddForm()
        }
      </TableLayout>
    )
  }
}

export default IntlManageAdd
