import React, { Component } from 'react'
import { Form, Modal, Select, Input } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

const EditForm = Form.create({
  mapPropsToFields (props) {
    return {
      paramCode: Form.createFormField({
        ...props.selectedItem,
        value: props.selectedItem ? props.selectedItem.paramCode : undefined
      }),
      paramName: Form.createFormField({
        ...props.selectedItem,
        value: props.selectedItem ? props.selectedItem.paramName : undefined
      })
    }
  }
})(
  class extends Component {
    render () {
      const { getFieldDecorator } = this.props.form

      return (
        <Modal title='修改动态字段' visible={this.props.visible} maskClosable={false}
          onOk={this.props.handleEditOk} onCancel={this.props.handleEditCancel}>
          <Form layout='vertical' onSubmit={this.handleSubmit}>
            <FormItem label='数据源编码' >
            {getFieldDecorator('paramCode', {
                rules: [{
                  required: true,
                  message: '数据源编码不能为空',
                  whitespace: true
                }, {
                  max: 100, message: '数据源编码长度超过限制'
                }]
              })(
                <Input placeholder='数据源编码' style={{width: '100%'}} autoComplete='off' />
              )}
            </FormItem>
            <FormItem label='数据源名称'>
              {getFieldDecorator('paramName', {
                rules: [{
                  required: true,
                  message: '数据源名称不能为空',
                  whitespace: true
                }, {
                  max: 100, message: '数据源名称长度超过限制'
                }]
              })(
                <Input placeholder='数据源名称' style={{width: '100%'}} autoComplete='off' />
              )}
            </FormItem>
          </Form>
        </Modal>
      )
    }
  }
)

export default EditForm
