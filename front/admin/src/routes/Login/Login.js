import React from 'react'
import { Form, Icon, Input, Button, Checkbox } from 'antd'

import styles from './Login.css'
import {connect} from 'dva/index'

const FormItem = Form.Item

@connect(({ ocmslogin }) => ({ocmslogin}))
class NormalLoginForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
      }
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <div className={styles.Login}>
        <div className={styles.Login__title}>
          <p>{process.env.titlename}</p>
        </div>
        <Form onSubmit={this.handleSubmit} className={styles.Login__form}>
          <div className={styles.Login__form__title}>
            <p>招聘管理平台</p>
          </div>
          <FormItem>
            {getFieldDecorator('userName', {
              rules: [{ required: true, message: '请输入账号!' }]
            })(
              <Input prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder='账号' />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码!' }]
            })(
              <Input prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />} type='password' placeholder='密码' />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true
            })(
              <Checkbox>记住密码111</Checkbox>
            )}
            <a className={styles.Login__form__forgot} href=''>忘记密码</a>
            <Button type='primary' htmlType='submit' className={styles.Login__form__button}>
              登录
            </Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}

export default Form.create()(NormalLoginForm)
