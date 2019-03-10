import React, { Component } from 'react'
import { connect } from 'dva'
import { routerRedux, Link } from 'dva/router'
import request from '../../utils/request'
import {
  Form,
  Input,
  Button,
  Select,
  // Row,
  // Col,
  Popover,
  Progress
} from 'antd'
import styles from './Register.less'

const FormItem = Form.Item
const { Option } = Select
const InputGroup = Input.Group

const passwordStatusMap = {
  ok: <div className={styles.success}>强度：强</div>,
  pass: <div className={styles.warning}>强度：中</div>,
  poor: <div className={styles.error}>强度：太短</div>
}

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception'
}

export default @connect(({ register, loading }) => ({
  register,
  submitting: loading.effects['register/submit']
}))
@Form.create()
class Register extends Component {
  state = {
    count: 0,
    confirmDirty: false,
    visible: false,
    help: '',
    prefix: '86'
  };

  componentWillReceiveProps (nextProps) {
    const { form, dispatch } = this.props
    const account = form.getFieldValue('mail')
    if (nextProps.register.status === 'ok') {
      dispatch(
        routerRedux.push({
          pathname: 'user/register-result',
          state: {
            account
          }
        })
      )
    }
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  onGetCaptcha = () => {
    let count = 59
    this.setState({ count })
    this.interval = setInterval(() => {
      count -= 1
      this.setState({ count })
      if (count === 0) {
        clearInterval(this.interval)
      }
    }, 1000)
  };

  getPasswordStatus = () => {
    const { form } = this.props
    const value = form.getFieldValue('password')
    if (value && value.length > 9) {
      return 'ok'
    }
    if (value && value.length > 5) {
      return 'pass'
    }
    return 'poor'
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
        console.log('Received values of form: ', values.userName);
        if(!err){
          this.createUser(values)
        }
    });
  }
      /**
     * 创建新用户
     */
    createUser= (values) => {
      console.log(values)
      request('/v1/sysuser/register',{
        method: 'POST',
        body: values
      }
      ).then((res) =>{
        if (res.message === '成功') {
          // message.success('创建成功')
          console.log("创建成功")
          // this.linkToChange('/setting/users')
      } else {
          // message.error(res.message)
          console.log("创建失败")
      }
      }).catch((err) => {
        console.log(err)
      })
    }

  handleConfirmBlur = e => {
    const { value } = e.target
    const { confirmDirty } = this.state
    this.setState({ confirmDirty: confirmDirty || !!value })
  };

  // checkConfirm = (rule, value, callback) => {
  //   const { form } = this.props
  //   if (value && value !== form.getFieldValue('password')) {
  //     callback(new Error('两次输入的密码不匹配!'))
  //   } else {
  //     callback()
  //   }
  // };

  checkPassword = (rule, value, callback) => {
    if (!value) {
      this.setState({
        help: '请输入密码！',
        visible: !!value
      })
      callback(new Error('error'))
    } else {
      this.setState({
        help: ''
      })
      const { visible, confirmDirty } = this.state
      if (!visible) {
        this.setState({
          visible: !!value
        })
      }
      if (value.length < 6) {
        callback(new Error('error'))
      } else {
        const { form } = this.props
        if (value && confirmDirty) {
          form.validateFields(['confirm'], { force: true })
        }
        callback()
      }
    }
  };

  changePrefix = value => {
    this.setState({
      prefix: value
    })
  };

  renderPasswordProgress = () => {
    const { form } = this.props
    const value = form.getFieldValue('password')
    const passwordStatus = this.getPasswordStatus()
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null
  };

  render () {
    const { form, submitting } = this.props
    const { getFieldDecorator } = form
    const { count, prefix, help, visible } = this.state
    return (
      <div className={styles.main}>
        <h3>注册</h3>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('userName', {
              rules: [
                {
                  required: true,
                  message: '请输入用户名！'
                }
              ]
            })(<Input size='large' placeholder='用户名' />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('realName', {
              rules: [
                {
                  required: true,
                  message: '请输入姓名！'
                }
              ]
            })(<Input size='large' placeholder='姓名' />)}
          </FormItem>
          <FormItem help={help}>
            <Popover
              content={
                <div style={{ padding: '4px 0' }}>
                  {passwordStatusMap[this.getPasswordStatus()]}
                  {this.renderPasswordProgress()}
                  <div style={{ marginTop: 10 }}>
                    请至少输入 6 个字符。请不要使用容易被猜到的密码。
                  </div>
                </div>
              }
              overlayStyle={{ width: 240 }}
              placement='right'
              visible={visible}
            >
              {getFieldDecorator('password', {
                rules: [
                  {
                    validator: this.checkPassword
                  }
                ]
              })(<Input size='large' type='password' placeholder='至少6位密码，区分大小写' />)}
            </Popover>
          </FormItem>
          {/* <FormItem>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: '请确认密码！'
                },
                {
                  validator: this.checkConfirm
                }
              ]
            })(<Input size='large' type='password' placeholder='确认密码' />)}
          </FormItem> */}
          <FormItem>
            <InputGroup compact>
              <Select
                size='large'
                value={prefix}
                onChange={this.changePrefix}
                style={{ width: '20%' }}
              >
                <Option value='86'>+86</Option>
              </Select>
              {getFieldDecorator('telphone', {
                rules: [
                  {
                    required: true,
                    message: '请输入手机号！'
                  },
                  {
                    pattern: /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/,
                    message: '手机号格式错误！'
                  }
                ]
              })(<Input size='large' style={{ width: '80%' }} placeholder='11位手机号' />)}
            </InputGroup>
          </FormItem>
          {/* <FormItem>
            <Row gutter={8}>
              <Col span={16}>
                {getFieldDecorator('captcha', {
                  rules: [
                    {
                      required: true,
                      message: '请输入验证码！'
                    }
                  ]
                })(<Input size='large' placeholder='验证码' />)}
              </Col>
              <Col span={8}>
                <Button
                  size='large'
                  disabled={count}
                  className={styles.getCaptcha}
                  onClick={this.onGetCaptcha}
                >
                  {count ? `${count} s` : '获取验证码'}
                </Button>
              </Col>
            </Row>
          </FormItem> */}
          <FormItem>
            <Button
              size='large'
              loading={submitting}
              className={styles.submit}
              type='primary'
              htmlType='submit'
              // href=' http://localhost:9090/#/user/register-result'
            >
              注册
            </Button>
            <Link className={styles.login} to='/user/login'>
              使用已有账户登录
            </Link>
          </FormItem>
        </Form>
      </div>
    )
  }
}
