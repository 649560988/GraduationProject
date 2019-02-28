/***
 * created by zhuganghui on 2018/7/20
 *
 * 项目信息明细页面
 *  修改信息和删除
 */
import React from 'react'
import { Modal, DatePicker, Input, Form, Button, Row, Col, Select, Icon } from 'antd'
import styles from './ProjectInfoUpdate.css'
import moment from 'moment'
import axios from 'axios/index'
import { connect } from 'dva'
const FormItem = Form.Item
const Option = Select.Option

/***
 *保存成功弹窗
 */
function success () {
  const modal = Modal.success({
    title: '保存成功',
    content: '保存成功'
  })
  setTimeout(() => modal.destroy(), 1000)
}
/***
 *保存失败弹窗
 */
function error () {
  Modal.error({
    title: '保存失败',
    content: '结束日期不能在开始日期之前'
  })
}
@Form.create()
@connect(({ user }) => ({
  user: user
}))
class ProjectInfoUpdate extends React.Component {
  state = {
    enterState: 0,
    id: 0,
    data: {}
  }
  componentWillMount () {
    this.setState({
      id: this.props.match.params.id
    })
  }

  /***
   *
   */
  componentDidMount () {
    // 根据url传入的id调用后台接口查询数据
    if (this.state.id !== 0) {
      let url = '/base-info/resume/ocmsObject/'
      url += this.state.id
      // 查数据
      axios({
        method: 'get',
        url: url
      }).then((res) => {
        // 使用状态
        if (res.data.status === 0) {
          res.data.status = '0'
        } else if (res.data.status === 1) {
          res.data.status = '1'
        }
        // 将数据添加到表单里
        this.addToForm(res.data)
      }).catch((err) => {
        console.log(err)
      })
    } else {
      let timestamp = new Date()
      let year = timestamp.getFullYear()
      let month = (timestamp.getMonth() + 1 < 10) ? '0' + (timestamp.getMonth() + 1) : (timestamp.getMonth() + 1)
      let day = timestamp.getDay()
      let hours = (timestamp.getHours() < 10) ? ('0' + timestamp.getHours()) : (timestamp.getHours())
      let min = (timestamp.getMinutes() < 10) ? ('0' + timestamp.getMinutes()) : (timestamp.getMinutes())
      let sec = (timestamp.getSeconds() < 10) ? ('0' + timestamp.getSeconds()) : (timestamp.getSeconds())
      let time = '' + year + month + day + hours + min + sec
      // console.log('hours:' + hours + ' min:' + min + ' sec:' + sec)

      let url = '/base-info/v1/company/' + this.props.user.currentUser.organizationId
      if (this.props.user.currentUser.id !== undefined) {
        axios({
          method: 'get',
          url: url
        }).then((res) => {
          // console.log(res.data)
          let info = {
            'objectNo': res.data.customerNo + time,
            'companyName': res.data.corporateName,
            'telephone': res.data.contactsTel,
            'objectManager': this.props.user.currentUser.realName
          }
          this.addObjectInfo(info)
        }).catch((err) => {
          console.log(err)
        })
      }

      this.setState({
        enterState: 1
      })
    }
  }

  /***
   * 将读取的数据添加到form表单
   * @param result
   */
  addToForm = (result) => {
    this.setState({
      data: result
    })
  }
  /***
   * 将读取的数据添加到form表单
   * @param result
   */
  addObjectInfo = (result) => {
    this.setState({
      data: result
    })
  }

  /***
   * form表单提交
   */
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, fieldsValue) => {
      const fromMoment = fieldsValue['objectStartDate']
      const toMoment = fieldsValue['objectEndDate']
      // 结束如期必须必起始日期大
      if (fromMoment !== undefined || toMoment !== undefined) {
        if (toMoment.isBefore(fromMoment, 'day')) {
          error()
          return
        }
      }
      if (!err) {
        let url = '/base-info/v1/company/' + this.props.user.currentUser.organizationId
        if (this.props.user.currentUser.id != undefined) {
          axios({
            method: 'get',
            url: url
          }).then((res) => {
            // console.log(res.data)
            const values = {
              ...fieldsValue,
              'objectStartDate': fieldsValue['objectStartDate'].format('YYYY-MM-DD HH:mm:ss'),
              'objectEndDate': fieldsValue['objectEndDate'].format('YYYY-MM-DD HH:mm:ss'),
              'companyId': res.data.id,
              'companyNo': res.data.customerNo,
              'createdBy': this.props.user.currentUser.id
            }
            // console.log('Received values of form: ', values)
            // 根据传入的id判断插入还是更新记录，0是插入，!0更新
            if (this.state.id == 0) {
              // 插入一条新记录
              this.insertCompanyInfo(values)
            } else {
              // 更新记录
              this.updateProjectInfo(this.state.id, values)
            }
          }).catch((err) => {
            console.log(err)
          })
        }
      }
    })
  }

  /***
   * 插入项目信息
   */
  insertCompanyInfo = (data) => {
    let url = '/base-info/resume/ocmsObject'
    // 插入数据
    axios({
      method: 'post',
      url: url,
      data: data
    }).then((res) => {
      console.log(res)
      if (res.data.failed === true) {
        // console.log('项目编号重复')
      } else if (res.data === true) {
        axios({
          method: 'post',
          url: '/search/resume/solr/Object/deltaImport',
          data: data
        }).then((res) => {
          if (res.status === 200) {
            // console.log('插入成功')
            success()
            // 跳转到基础信息页
            this.linkToChange(`/base-info-defend/project`)
          }
        }).catch((err) => {
          console.log(err)
          error(err)
        })
      }
    }).catch((err) => {
      console.log(err)
    })
  }

  /***
   * 更新项目信息
   */
  updateProjectInfo = (id, data) => {
    // console.log('update')
    let url = '/base-info/resume/ocmsObject/'
    url += id
    // 更新数据
    axios({
      method: 'post',
      url: url,
      data: data
    }).then((res) => {
      if (res.data === true) {
        axios({
          method: 'post',
          url: '/search/resume/solr/Object/deltaImport',
          data: data
        }).then((res) => {
          if (res.status === 200) {
            // console.log('更新成功')
            success()
            // 跳转到基础信息页
            this.linkToChange(`/base-info-defend/project`)
          }
        }).catch((err) => {
          console.log(err)
          error(err)
        })
      } else {
        // console.log('更新失败')
        error()
      }
    }).catch((err) => {
      console.log(err)
      error(err)
    })
  }

  /**
   * 校验手机号
   * @param rule
   * @param value
   * @param callback
   */
  checkTel = (rule, value, callback) => {
    var re = /(^1[3|5|8|4|7][0-9]{9}$)/

    if (this.Trim(this.praseStrEmpty(value)) !== '') {
      if (re.test(value)) {
        callback()
      } else {
        callback('手机号不正确！')
      }
    } else {
      callback()
    }
  };

  /***
   *   路径跳转
   */
  linkToChange = url => {
    const { history } = this.props
    history.push(url)
  };

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
    if (!str || str == 'undefined' || str == 'null') {
      return ''
    }
    return str
  }

  /***
   * 返回上一个页面
   * @param result
   */
  handleClickBackBtn = (e) => {
    this.linkToChange(`/base-info-defend/project`)
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const dateFormat = 'YYYY-MM-DD'
    const formItemLayout = {
      style: {width: 300, marginBottom: 15},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    }
    return (
      <div className='container'>
        <Button onClick={this.handleClickBackBtn} style={{marginBottom: 15}}>
          <Icon type='left' />返回
        </Button>
        <div className='container-item'>
          <div className={styles.ProjectInfoUpdate__title} >
            项目基本信息
          </div>
          <div className='content'>
            <Form layout='inline' style={{marginLeft: '50px'}}>
              <Row>
                <Col span={10} offset={2}>
                  <FormItem {...formItemLayout} label='项目编号'>
                    {getFieldDecorator('objectNo', {
                      initialValue: this.state.data.objectNo,
                      rules: [{ required: true, whitespace: true, message: '请输入项目编号!' }]
                    })(
                      <Input disabled />
                    )}
                  </FormItem>
                </Col>
                {this.state.enterState == 0
                  ? <Col span={10}>
                    <FormItem {...formItemLayout} label='使用状态'>
                      {getFieldDecorator('status', {
                        initialValue: this.state.data.status,
                        rules: [{ required: true, whitespace: true, message: '请选择使用状态!' }]
                      })(
                        <Select placeholder='请选择使用状态'>
                          <Option value='0'>有效</Option>
                          <Option value='1'>无效</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  : <Col />
                }
              </Row>
              <Row>
                <Col span={10} offset={2}>
                  <FormItem {...formItemLayout} label='项目所属公司'>
                    {getFieldDecorator('companyName', {initialValue: this.state.data.companyName}
                    )(
                      <Input disabled />
                    )}
                  </FormItem>
                </Col>
                <Col span={10}>
                  <FormItem {...formItemLayout} label='项目经理'>
                    {getFieldDecorator('objectManager', {initialValue: this.state.data.objectManager,
                      rules: [{ required: true, whitespace: true, message: '请输入项目经理!' }]
                    })(
                      <Input />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={10} offset={2}>
                  <FormItem {...formItemLayout} label='项目名称'>
                    {getFieldDecorator('objectName', {initialValue: this.state.data.objectName,
                      rules: [{ required: true, whitespace: true, message: '请输入项目名称!' }]
                    })(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col span={10}>
                  <FormItem {...formItemLayout} label='联系电话'>
                    {getFieldDecorator('telephone', {initialValue: this.state.data.telephone,
                      rules: [
                        { required: true, whitespace: true, message: '请输入联系电话!' },
                        { validator: this.checkTel }
                      ]
                    })(
                      <Input />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={10} offset={2}>
                  <FormItem {...formItemLayout} label='项目开始日期'
                    labelCol={{span: 9}} wrapperCol={{span: 9}} style={{marginLeft: -17}}>
                    {getFieldDecorator('objectStartDate', this.state.data.objectStartDate
                      ? {initialValue: moment(this.state.data.objectStartDate, dateFormat),
                        rules: [{ required: true, message: '请输入项目开始日期' }]
                      } : {initialValue: this.state.data.objectStartDate,
                        rules: [{ required: true, message: '请输入项目开始日期' }] })(
                      <DatePicker style={{width: 200}} />
                    )}
                  </FormItem>
                </Col>
                <Col span={10}>
                  <FormItem {...formItemLayout} label='项目结束日期'
                    labelCol={{span: 9}} wrapperCol={{span: 9}} style={{marginLeft: -17}}>
                    {getFieldDecorator('objectEndDate', this.state.data.objectEndDate
                      ? {initialValue: moment(this.state.data.objectEndDate, dateFormat),
                        rules: [{ required: true, message: '请输入项目结束日期' }]
                      } : {initialValue: this.state.data.objectEndDate,
                        rules: [{ required: true, message: '请输入项目结束日期' }] })(
                      <DatePicker style={{width: 200}} />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row style={{ marginTop: 30 }}>
                <Col span={10} offset={10}>
                  <FormItem >
                    <Button type='primary' onClick={this.handleSubmit}>数据保存</Button>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </div>
    )
  }
}

export default ProjectInfoUpdate
