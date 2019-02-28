import React, {Component} from 'react'
import { Modal, Form, Input } from 'antd'

const FormItem = Form.Item

const SubEditForm = Form.create()(
  class extends Component {
    render () {
      const {getFieldDecorator} = this.props.form
      return (
        <Modal title='修改子数据' visible maskClosable={false}
          onOk={this.props.handleEditOk} onCancel={this.props.handleEditCancel}>
          <Form type='vertical'>
            <FormItem label='子数据编码'>
              {getFieldDecorator('paramCode', {
                rules: [{ required: true, whitespace: true, message: '子数据编码不能为空' },
                  { max: 19, message: '子数据编码长度超过限制' },
                  { pattern: /^(0|[1-9]\d*)$/, message: '子数据编码必须为非负整数' },
                  { validator: this.props.sourceSubCodeUniqueCheck }
                ],
                initialValue: this.props.selectedItem.paramCode.toString()
              })(
                <Input placeholder='子数据编码' autoComplete='off' />
              )}
            </FormItem>
            <FormItem label='子数据名称'>
              {getFieldDecorator('paramName', {
                rules: [{
                  required: true,
                  message: '子数据名称不能为空',
                  whitespace: true
                }, {
                  max: 100, message: '子数据名称长度超过限制'
                }, {
                  validator: this.props.sourceSubNameUniqueCheck
                }],
                initialValue: this.props.selectedItem.paramName
              })(
                <Input placeholder='子数据名称' autoComplete='off' />
              )}
            </FormItem>
          </Form>
        </Modal>
      )
    }
  }
)

export default SubEditForm
