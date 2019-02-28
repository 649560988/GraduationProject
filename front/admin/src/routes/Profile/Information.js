import React from 'react'
import { Input, Form, Button, message } from 'antd'
import { connect } from 'dva'
import axios from 'axios'
import TableLayout from '../../layouts/TableLayout'
import AvatarUpload from './AvatarUpload'
import PromiseView from '../../components/PromiseView'

const FormItem = Form.Item

@Form.create()
@connect(({ user }) => ({
  currentUser: user.currentUser,
  roleNameList: user.currentUser.roleNameList
}))
export default class Information extends React.Component {
  state = {
    changed: false
  }

  onFormSubmit = (e) => {
    const { currentUser, dispatch } = this.props
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (err) {
        return message.error(err.message)
      }
      this.setState({
        onSubmitPromiseChange: (state, data) => {
          if (state === 'rejected') {
            message.error(data.message)
          } else if (state === 'resolved') {
            message.success('更新成功')
            dispatch({
              type: 'user/saveCurrentUser',
              payload: {
                ...currentUser,
                ...values,
                objectVersionNumber: data.objectVersionNumber
              }
            })
            this.setState({ changed: false })
          }
        },
        submitPromise: (async () => {
          const res = await axios.put(`/iam/v1/users/${currentUser.id}/info`, {
            objectVersionNumber: currentUser.objectVersionNumber,
            realName: values.realName,
            imageUrl: values.imageUrl
          })
          if (res.data.failed) throw new Error(res.data.message || '失败')
          return res.data
        })()
      })
    })
  }

  onFormChange = () => {
    this.setState({ changed: true })
  }

  onFormReset = () => {
    this.props.form.resetFields()
    this.setState({ changed: false })
  }

  render () {
    const { roleNameList, currentUser } = this.props
    const { getFieldDecorator } = this.props.form
    return (
      <TableLayout title='基本信息' >
        <div>
        你的个人信息中<strong>角色</strong>由管理员进行设置，其他信息可以根据你的需要进行修改。
        </div>
        <Form
          onChange={this.onFormChange}
          onSubmit={this.onFormSubmit}
          style={{ width: '100%', maxWidth: 440 }}
          onReset={this.onFormReset}
        >
          <FormItem
            label='姓名'
            style={{marginRight: 10}}
            wrapperCol={{ span: 24 }}
          >
            {getFieldDecorator('realName', {
              initialValue: currentUser.realName,
              rules: [{ required: true }]
            })(
              <Input placeholder='姓名' />
            )}
          </FormItem>

          <FormItem
            label='邮箱'
            style={{marginRight: 10}}
            wrapperCol={{ span: 24 }}
          >
            {getFieldDecorator('email', {
              initialValue: currentUser.email
            })(
              <Input disabled placeholder='邮箱' />
            )}
          </FormItem>

          <FormItem
            label='手机号码'
            style={{marginRight: 10}}
            wrapperCol={{ span: 24 }}
          >
            {getFieldDecorator('phone', {
              initialValue: currentUser.phone
            })(
              <Input disabled placeholder='手机号码' />
            )}
          </FormItem>

          <FormItem
            label='角色'
            style={{marginRight: 10}}
            wrapperCol={{ span: 24 }}
          >
            {getFieldDecorator('role', {
              initialValue: roleNameList.join(' / ')
            })(
              <Input disabled placeholder='角色' />
            )}
          </FormItem>

          <FormItem
            label='头像'
            style={{marginRight: 10}}
            wrapperCol={{ span: 24 }}
          >
            {getFieldDecorator('imageUrl', {
              initialValue: currentUser.imageUrl
            })(
              <AvatarUpload
                getUploadHeaders={() => ({
                  Authorization: `Bearer ${localStorage.getItem('antd-pro-token')}`
                })}
                userId={currentUser.id}
                server={process.env.server}
              />
            )}
          </FormItem>
          <FormItem
            style={{marginRight: 10}}
          >
            <PromiseView promise={this.state.submitPromise} onStateChange={this.state.onSubmitPromiseChange}>
              {(status) => (
                <Button
                  loading={status === 'pending'}
                  type='primary'
                  htmlType='submit'
                  disabled={
                    status === 'rejected'
                      ? false
                      : !this.state.changed || status === 'pending'
                  }
                  style={{marginRight: 10}}
                >保存</Button>
              )}
            </PromiseView>

            <Button
              type='secondary'
              htmlType='reset'
            >重置</Button>
          </FormItem>

        </Form>
      </TableLayout>
    )
  }
}
