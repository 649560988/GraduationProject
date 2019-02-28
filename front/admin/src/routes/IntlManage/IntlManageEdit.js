import React from 'react'
import { connect } from 'dva'
import TableLayout from '../../layouts/TableLayout'
import { Redirect } from 'dva/router'
import { Button, Input, Form, Row, Col, message } from 'antd'

@connect(
  ({intl, loading}) => ({
    list: intl.list,
    selectedItem: intl.selectedItem,
    loading: loading.effects['intl/update']
  })
)
@Form.create()
class IntlManageEdit extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      saveBtnDisable: true
    }
  }

  componentDidMount(){
    this.nameInputRef.focus()
  }

  handleNameChange = (value) => {
    const selectedItemInfo = this.props.list[this.props.selectedItem]
    if(value === selectedItemInfo.name){
      this.setState({saveBtnDisable: true})
    }else{
      this.setState({saveBtnDisable: false})
    }
  }

  handleSaveChange = () => {
    this.props.form.validateFields((err, values) => {
      if(!err){
        const { dispatch } = this.props
        dispatch({
          type: 'intl/update',
          payload: values,
          callback: (result) => {
            if(result === true){
              message.success(`修改成功`)
              this.props.history.push(`/setting/intl-manage`)
            }else{
              message.error(`修改失败：${result.message}`)
            }
          }
        })
      }
    })
  }

  handleResetForm = () => {
    this.props.form.resetFields()
  }

  renderEditForm = () => {
    const selectedItemInfo = this.props.list[this.props.selectedItem]
    if(!selectedItemInfo){
      return <Redirect to={`/setting/intl-manage`}/>
    }
    const { getFieldDecorator } = this.props.form
    return (
      <Row>
        <Col span={10}>
          <Form>
            <Form.Item label={`语言`} required={true}>
              {
                getFieldDecorator(`lang`,
                  {initialValue: selectedItemInfo.lang}
                )(
                  <Input autoComplete={`off`} disabled={true}/>
                )
              }
            </Form.Item>
            <Form.Item label={`编码`} required={true}>
              {
                getFieldDecorator(`code`,
                  {initialValue: selectedItemInfo.code}
                )(
                  <Input autoComplete={`off`} disabled={true}/>
                )
              }
            </Form.Item>
            <Form.Item label={`名称`}>
              {
                getFieldDecorator(`name`, {
                  initialValue: selectedItemInfo.name,
                  rules: [
                    {required: true, whitespace: true, message: `名称不能为空`}
                  ]
                }
                )(
                  <Input autoComplete={`off`} placeholder={`请输入名称`}
                         onChange={e => this.handleNameChange(e.target.value)}
                         ref={ref => this.nameInputRef = ref}/>
                )
              }
            </Form.Item>
            <Form.Item>
              <Button type={'primary'} onClick={this.handleSaveChange}
                      loading={this.props.loading} disabled={this.state.saveBtnDisable}>保存</Button>
              <Button onClick={this.handleResetForm} style={{marginLeft:10}}>重置</Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    )
  }

  render(){
    return (
      <TableLayout title={`修改多语言项`} showBackBtn={true} onBackBtnClick={()=>this.props.history.goBack()}>
        {
          this.renderEditForm()
        }
      </TableLayout>
    )
  }
}

export default IntlManageEdit
