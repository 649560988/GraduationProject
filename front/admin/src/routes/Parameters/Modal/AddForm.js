import React, { Component } from 'react'
import { Form, Select, Input, Modal, Button, Icon, Row, Col } from 'antd'

// const SidebarModal = Modal.Sidebar;
const FormItem = Form.Item
const Option = Select.Option

let uuid = 0

const AddForm = Form.create()(
  class extends Component {
    // 确定添加数据源记录
    handleAddOk= () => {
      this.props.handleAddOk()
    }

    // 取消添加，关闭添加数据源的模态框
    handleAddCancel = () => {
      this.props.handleAddCancel()
    }

    // 子数据移除按钮事件
    remove = (k) => {
      const { form } = this.props
      const keys = form.getFieldValue('keys')
      form.setFieldsValue({
        keys: keys.filter(key => key !== k)
      })
    }

    // 子数据添加按钮事件
    add = () => {
      const { form } = this.props
      const keys = form.getFieldValue('keys')
      const nextKeys = keys.concat(uuid)
      uuid++
      form.setFieldsValue({
        keys: nextKeys
      })
    }

    // 判断数据源子数据唯一性
    sourceSubNameUniqueCheck = (rule, value, callback) => {
      let sourceSubNameList = this.props.form.getFieldValue('sourceSubNameList')
      if (sourceSubNameList.length > 1) {
        sourceSubNameList.sort()
        for (let i = 0; i < sourceSubNameList.length; i++) {
          if (sourceSubNameList[i] === sourceSubNameList[i + 1]) {
            callback('子数据名称已存在')
          }
        }
      }
      callback()
    }

    sourceSubCodeUniqueCheck = (rule, value, callback) => {
      let sourceSubCodeList = this.props.form.getFieldValue('sourceSubCodeList')
      if (sourceSubCodeList.length > 1) {
        sourceSubCodeList.sort()
        for (let i = 0; i < sourceSubCodeList.length; i++) {
          if (sourceSubCodeList[i] === sourceSubCodeList[i + 1]) {
            callback('子数据编码已存在')
          }
        }
      }
      callback()
    }

    render () {
      const { getFieldDecorator, getFieldValue } = this.props.form

      // getFieldDecorator('keys', { initialValue: [] })
      // const keys = getFieldValue('keys')
      // const formItems = keys.map((k, index) => {
      //   return (
      //     <Row key={k} >
      //       <Col span={9}>
      //         <FormItem label={`子数据 ${index + 1} 名称`} >
      //           {getFieldDecorator(`sourceSubNameList[${index}]`, {
      //             validateTrigger: ['onChange', 'onBlur'],
      //             rules: [{ required: true, whitespace: true, message: '子数据名称不能为空'
      //             }, { max: 100, message: '子数据名称长度超过限制' }, { validator: this.sourceSubNameUniqueCheck }
      //             ]
      //           })(<Input placeholder='子数据名称' autoComplete='off' />)}
      //         </FormItem>
      //       </Col>
      //       <Col span={9} offset={1}>
      //         <FormItem label={`子数据 ${index + 1} 编码`} >
      //           {getFieldDecorator(`sourceSubCodeList[${index}]`, {
      //             validateTrigger: ['onChange', 'onBlur'],
      //             rules: [{ required: true, whitespace: true, message: '子数据编码不能为空' },
      //               { max: 19, message: '子数据编码长度超过限制' },
      //               { pattern: /^(0|[1-9]\d*)$/, message: '子数据编码必须为非负整数'},
      //               { validator: this.sourceSubCodeUniqueCheck }
      //             ]
      //           })(<Input placeholder='子数据编码(非负整数)' autoComplete='off' />)}
      //         </FormItem>
      //       </Col>
      //       <Col span={2} offset={1}>
      //         <Icon type='delete' onClick={() => this.remove(k)} style={{cursor: 'pointer', lineHeight: '32px', marginTop: '28px'}} />
      //       </Col>
      //     </Row>
      //   )
      // })
      return (
        <Modal title='添加数据源' maskClosable={false}
          visible={this.props.visible}
          onOk={this.handleAddOk}
          onCancel={this.handleAddCancel}>
          <Form layout='vertical' onSubmit={this.handleSubmit}>
            <FormItem label='数据源编码'>
              {getFieldDecorator('paramCode', {
                rules: [{
                  required: true,
                  message: '数据源编码不能为空',
                  whitespace: true
                }, {
                  max: 100, message: '数据源编码长度超过限制'
                }]
              })(
                <Input placeholder='数据源编码' autoComplete='off' />
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
                <Input placeholder='数据源名称' autoComplete='off' />
              )}
            </FormItem>

            {/* {formItems} */}

            {/* <FormItem>
              <Button type='primary' onClick={this.add}>
                <Icon type='add' />添加子数据
              </Button>
            </FormItem> */}
          </Form>
        </Modal>
      )
    }
  })

export default AddForm
