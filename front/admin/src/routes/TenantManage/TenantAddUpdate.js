import React from 'react'
import { Modal, Input, Form, Button, Row, Col, Select } from 'antd'
import {connect} from 'dva/index'
import axios from 'axios/index'
import TableLayout from '../../layouts/TableLayout'

// import { FormattedMessage } from 'react-intl'
const FormItem = Form.Item
const Option = Select.Option

@Form.create()
@connect(({ user }) => ({
  user: user
}))
class AddUpdateTenant extends React.Component {
  /**
   * id        租户id
   * userId    管理员id
   * flag:1    编辑
   * flag:0    添加
   * @type {{id: number, flag: number, data: {}}}
   */
  state = {
    id: 0,
    flag: -1,
    data: {},
    allDatas: {},
    code: '',
    name: '',
    enabled: '',
    userId: 0
  };

/***
 *保存成功弹窗
 */
success = () => {
  Modal.success({
    title: '保存成功',
    content: '保存成功'
  })
  this.linkToChange(`/setting/tenantmanage`)
}

/***
 *保存失败弹窗
 */
errorMess = (mess) => {
  Modal.error({
    title: '保存失败',
    content: mess
  })
}

  /**
   * 路径标志用户id和flag
   * flag:1   更新
   * flag:0   添加
   */
componentWillMount () {
  this.setState({
    id: parseInt(this.props.match.params.id),
    flag: parseInt(this.props.match.params.flag)
  })
  if (parseInt(this.props.match.params.flag) === 1) {
    this.getTenantInfo(parseInt(this.props.match.params.id))
  }
}

getTenantInfo = (id) => {
  let data = {}
  // console.log(id)
  axios({
    method: 'get',
    url: '/organizationManager/v1/OrgUserExt/' + id
  }).then((res) => {
    // console.log(res.data)
    data.code = res.data.fdOrganizationDO.code
    data.name = res.data.fdOrganizationDO.name
    data.loginName = res.data.iamUserDO.loginName
    data.realName = res.data.iamUserDO.realName
    data.email = res.data.iamUserDO.email
    data.language = res.data.iamUserDO.language
    data.timeZone = res.data.iamUserDO.timeZone
    data.userId = res.data.iamUserDO.id
    data.phone = res.data.iamUserDO.phone
    this.setState({
      userId: res.data.iamUserDO.id,
      data: data,
      allDatas: res.data
    })
  }).catch((err) => {
    console.log(err)
  })
}

  /***
   * form表单提交
   */
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        const values = {
          ...fieldsValue
        }
        // console.log(values)
        if (this.state.flag === 1) {
          this.updateUSerInfo(values)
        } else if (this.state.flag === 0) {
          this.insertUserInfo(values)
        }
      }
    })
  }

  /***
   * 添加
   * flag = 0
   */
  insertUserInfo = (data) => {
    // console.log('添加')
    axios({
      method: 'post',
      url: '/organizationManager/v1/main/insertOrgToUser',
      data: {
        'code': data.code,
        'name': data.name,
        'userDTO': {
          'admin': true,
          'loginName': data.loginName,
          'password': data.password,
          'email': data.email,
          'enabled': true,
          'language': data.language,
          'timeZone': data.timeZone,
          'realName': data.realName,
          'phone': data.phone
        }
      }
    }).then((res) => {
      // console.log(res.data)
      this.success()
    }).catch((err) => {
      this.errorMess('租户编码或管理员账号或管理员邮箱重复！')
      console.log(err)
    })
  };

  /***
   * 更新
   * flag = 1
   */
  updateUSerInfo = (data) => {
    // console.log('更新')
    // console.log(data)
    // console.log(this.state.id)
    // console.log(this.state.userId)
    axios({
      method: 'post',
      url: '/organizationManager/v1/OrgUserExt/' + this.state.userId + '/' + this.state.id,
      data: {
        'fdOrganizationDO': {
          'code': data.code,
          'name': data.name
        },
        'fdOrganizationExtDO': {
        },
        'iamUserDO': {
          'language': data.language,
          'timeZone': data.timeZone
        },
        'iamUserExtDO': {
        }
      }
    }).then((res) => {
      // console.log(res)
      if (res.data === true) {
        this.success()
      } else if (res.data.failed) {
        this.errorMess('租户编码或管理员账号或管理员邮箱重复！')
      }
    }).catch((err) => {
      console.log(err)
    })
  };

  /***
   *   路径跳转
   */
  linkToChange = url => {
    const { history } = this.props
    history.push(url)
  };

  /***
   * 返回上一个页面
   * @param result
   */
  handleClickBackBtn = (e) => {
    this.linkToChange(`/setting/tenantmanage`)
  }

  /**
   * 去除两端空格
   * @param str
   * @returns {*}
   * @constructor
   */
  Trim = (str) => {
    return str.replace(/(^\s*)|(\s*$)/g, '')
  }

  /**
   * 转换字符串，undefined,null等转化为""
   * @param str
   * @returns {*}
   */
  praseStrEmpty = (str) => {
    if (!str || str === 'undefined' || str === 'null') {
      return ''
    }
    return str
  }

  /**
   * 校验密码
   * @param rule
   * @param value
   * @param callback
   */
  checkPassword = (rule, value, callback) => {
    var re = /(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}/

    if (this.Trim(this.praseStrEmpty(value)) !== '') {
      if (re.test(value)) {
        callback()
      } else {
        callback(new Error('密码格式不正确！'))
      }
    } else {
      callback()
    }
  };

  /**
   * 校验手机号
   * @param rule
   * @param value
   * @param callback
   */
  checkTel = (rule, value, callback) => {
    // var re = /(^1[3|5|8|4|7][0-9]{9}$)/;
    let re = /^(?=\d{11}$)^1(?:3\d|4[57]|5[^4\D]|66|7[^249\D]|8\d|9[89])\d{8}$/
    if (this.Trim(this.praseStrEmpty(value)) !== '') {
      if (re.test(value)) {
        callback()
      } else {
        callback(new Error('手机号码格式不正确！'))
      }
    } else {
      callback()
    }
  };

  render () {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      style: {width: 500, marginBottom: 20},
      labelCol: {
        span: 24
      },
      wrapperCol: {
        span: 24
      }
    }
    let password = ''
    let title = ''
    let create = true
    if (this.props.match.params.flag === '0') {
      title = '创建供应商'
      create = true
      password = <Row>
        <Col span={10}>
          <FormItem {...formItemLayout} label={<p style={{display: 'inline', fontWeight: 'bold'}}>登录密码</p>}>
            {getFieldDecorator('password', {initialValue: this.state.data.phone,
              rules: [
                { required: true, whitespace: true, message: '请输入登录密码!' },
                { validator: this.checkPassword }
              ]
            })(
              <Input placeholder={'请输入登录密码'} />
            )}
          </FormItem>
        </Col>
      </Row>
    } else if (this.props.match.params.flag === '1') {
      title = '编辑供应商'
      create = false
      password = null
    }
    return (
      <TableLayout
        title={title}
        showBackBtn
        onBackBtnClick={this.handleClickBackBtn}>
        <div className='container-item'>
          <div className='content'>
            <Form layout='inline'>
              <Row>
                <Col span={10}>
                  <FormItem {...formItemLayout} label={<p style={{display: 'inline', fontWeight: 'bold'}}>编码</p>}>
                    {getFieldDecorator('code', {
                      initialValue: this.state.data.code,
                      rules: [{ required: true, whitespace: true, message: '请输入编码!' }]
                    })(
                      <Input placeholder={'请输入编码'} />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={10}>
                  <FormItem {...formItemLayout} label={<p style={{display: 'inline', fontWeight: 'bold'}}>名称</p>}>
                    {getFieldDecorator('name', {initialValue: this.state.data.name,
                      rules: [{ required: true, whitespace: true, message: '请输入名称!' }]
                    })(
                      <Input placeholder={'请输入名称'} />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={10}>
                  <FormItem {...formItemLayout} label={<p style={{display: 'inline', fontWeight: 'bold'}}>供应商租户编码</p>}>
                    {getFieldDecorator('loginName', {initialValue: this.state.data.loginName
                    })(
                      <Input disabled={!create} placeholder={'请输入供应商租户编码'} />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={10}>
                  <FormItem {...formItemLayout} label={<p style={{display: 'inline', fontWeight: 'bold'}}>描述</p>}>
                    {getFieldDecorator('realName', {initialValue: this.state.data.realName                      
                    })(
                      <Input disabled={!create} placeholder={'请输入描述'} />
                    )}
                  </FormItem>
                </Col>
              </Row>
              {password}
              <Row>
                <Col>
                  <FormItem {...formItemLayout} label={<p style={{display: 'inline', fontWeight: 'bold'}}>管理员邮箱</p>}>
                    {getFieldDecorator('email', {
                      initialValue: this.state.data.email,
                      rules: [{required: true, type: 'email', whitespace: true, message: '请输入格式正确的管理员邮箱!'}]
                    })(
                      <Input disabled={!create} placeholder={'请输入管理员邮箱'} />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormItem {...formItemLayout} label={<p style={{display: 'inline', fontWeight: 'bold'}}>管理员手机号码</p>}>
                    {getFieldDecorator('phone', {
                      initialValue: this.state.data.phone,
                      rules: [
                        { validator: this.checkTel }
                      ]
                    })(
                      <Input disabled={!create} placeholder={create ? '请输入管理员手机号码' : ''} />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={10}>
                  <FormItem {...formItemLayout} label={<p style={{display: 'inline', fontWeight: 'bold'}}>语言</p>}>
                    {getFieldDecorator('language', {initialValue: this.state.data.language,
                      rules: []
                    })(
                      <Select
                        placeholder={'请选择语言'}
                        defaultActiveFirstOption={false}>
                        <Option key={'en_US'}>en_US</Option>
                        <Option key={'zh_CN'}>zh_CN</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={10}>
                  <FormItem {...formItemLayout} label={<p style={{display: 'inline', fontWeight: 'bold'}}>时区</p>}>
                    {getFieldDecorator('timeZone', {initialValue: this.state.data.timeZone,
                      rules: []
                    })(
                      <Select
                        placeholder={'请选择时区'}
                        defaultActiveFirstOption={false}>
                        <Option key={'en_US'}>CTT</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row style={{marginTop: 30}}>
                <Col span={10}>
                  <FormItem >
                    <Button type='primary' onClick={this.handleSubmit}>数据保存</Button>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </TableLayout>
    )
  }
}

export default Form.create()(AddUpdateTenant)
