import React from 'react'
import { Modal, Input, Form, Button, Row, Col } from 'antd'
import {connect} from 'dva/index'
import axios from 'axios/index'
import TableLayout from '../../layouts/TableLayout'

// import { FormattedMessage } from 'react-intl'
const FormItem = Form.Item

@Form.create()
@connect(({ user }) => ({
  user: user
}))
class SupplierMaintenanceDetail extends React.Component {
  state = {
    id: 0,
    data: {}
  };

/***
 *保存成功弹窗
 */
success = () => {
  const modal = Modal.success({
    title: '保存成功',
    content: '保存成功'
  })
  this.linkToChange(`/setting/suppliercontroller`)
  setTimeout(() => modal.destroy(), 1000)
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
   * 路径标志用户id
   */
componentWillMount () {
  this.setState({
    id: parseInt(this.props.match.params.id)
  })
}
componentDidMount () {
    if (this.state.id !== 0) {
      this.getTenantInfo(this.state.id)
    }
  }

getTenantInfo = (id) => {
  let data = {}
  console.log(id)
  axios({
    method: 'get',
    url: '/iam-ext/v1/suppliers/' + id
  }).then((res) => {
    console.log(res.data)
    data.code = res.data.code
    data.name = res.data.name
    data.relationOrganizationCode = res.data.relationOrganizationCode
    data.description = res.data.description
    this.setState({
      data: data,
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
        if (this.state.id === 0) {
          this.insertUserInfo(values)
        } else {
          this.updateUSerInfo(values)
        }
      }
    })
  }

  /***
   * 添加
   */
  insertUserInfo = (values) => {
    axios({
      method: 'post',
      url: '/iam-ext/v1/suppliers',
      data: values
    }).then((res) => {
      console.log(res.data)
      if (res.data.failed === true) {
        this.errorMess(res.data.message)
      } else {
        this.success()
      }
    }).catch((err) => {
      console.log(err)
    })
  };

  /***
   * 更新
   */
  updateUSerInfo = (values) => {
    axios({
      method: 'put',
      url: '/iam-ext/v1/suppliers/' + this.state.id,
      data: values
    }).then((res) => {
      console.log(res)
      if (res.data.failed === true) {
        this.errorMess(res.data.message)
      } else {
        this.success()
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
    this.linkToChange(`/setting/suppliercontroller`)
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
    let title = ''
    if (this.state.id === '0') {
      title = '创建供应商'
      
    } else  {
      title = '编辑供应商'
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
                    {getFieldDecorator('relationOrganizationCode', {initialValue: this.state.data.relationOrganizationCode
                    })(
                      <Input placeholder={'请输入供应商租户编码'} />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={10}>
                  <FormItem {...formItemLayout} label={<p style={{display: 'inline', fontWeight: 'bold'}}>描述</p>}>
                    {getFieldDecorator('description', {initialValue: this.state.data.description                      
                    })(
                      <Input placeholder={'请输入描述'} />
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

export default Form.create()(SupplierMaintenanceDetail)



