import React from 'react'
import { Modal, Input, Form, Button, Row, Col, Select } from 'antd'
// import styles from './UpdateUserInfo.css'
import {connect} from 'dva/index'
import axios from 'axios/index'
import TableLayout from '../../layouts/TableLayout'

const FormItem = Form.Item
const Option = Select.Option

@Form.create()
@connect(({ user }) => ({
  user: user
}))
class UpdateUserInfo extends React.Component {
  /**
   * id        用户id
   * oId       公司id
   * flag:1    更新
   * flag:0    添加
   * @type {{id: number, flag: number, data: {}}}
   */
  state = {
    roleOptions: [],
    language: [],
    children: [],
    organizationId: 0,
    id: 0,
    oId: 0,
    noId: 1,
    nRoleId: [],
    flag: -1,
    data: {},
    corporateName: '',
    roleName: [],
    enabled: '',
    locked: '',
    objectVersionNumber: -1
  };

  /***
 *保存成功弹窗
 */
  success () {
    Modal.success({
      title: '保存成功',
      content: '保存成功'
    })
  // setTimeout(() => modal.destroy(), 1000);
  }
  /***
 *保存失败弹窗
 */
  errorMess (mess) {
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
      id: parseInt(this.props.match.params.userId),
      oId: parseInt(this.props.match.params.oId),
      noId: parseInt(this.props.match.params.oId),
      flag: parseInt(this.props.match.params.flag)
    })
  }

  /**
   * 根据用户名和真实姓名查询角色
   * 并获取所有角色
   */
  roleNameSearch =() => {
    let roleArry = []
    let roles = []
    let rolesId = []
    let _this = this
    this.setState({
      roleName: []
    }, () => {
      axios({
        method: 'get',
        url: '/iam-ext/v1/roles/queryAllRolesInCurrentOrgForSuperAdmin'
        // async:false,
      }).then((res) => {
        console.log(res)
        for (let i = 0; i < res.data.length; i++) {
          roleArry.push(<Option key={res.data[i].id} value={res.data[i].name}>{res.data[i].name}</Option>)
        }
        if (this.state.flag === 1) {
          _this.setState({
            roleOptions: roleArry
          })
          axios({
            method: 'post',
            url: '/iam-ext/v1/memberRole/searchList/' + this.props.match.params.userId,
            data: {},
            async: false
          }).then((res) => {
            console.log(res)
            if (res.failed) {
              _this.errorMess(res.message)
            } else {

            }
            if (res.data.length !== 0) {
              for (let i = 0; i < res.data.length; i++) {
                roles.push(res.data[i].name)
                rolesId.push(res.data[i].id)
              }
            } else {
              roles = []
              rolesId = []
            }
            _this.setState({
              roleOptions: roleArry,
              roleName: roles,
              nRoleId: rolesId
            }, () => {
              roles = []
              rolesId = []
            })
          }).catch((err) => {
            console.log(err)
          })
        } else {
          _this.setState({
            roleOptions: roleArry
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    })
  };

  /**
   * 查询所有语言
   */
  allLanguage =() => {
    let _this = this
    let languages = []
    axios({
      method: 'get',
      url: '/iam/v1/languages/list',
      data: {}
      // async:false,
    }).then((res) => {
      _this.setState({
        language: []
      })
      for (let i = 0; i < res.data.length; i++) {
        languages.push(<Option key={res.data[i].code} value={res.data[i].code}>{res.data[i].code}</Option>)
      }
      _this.setState({
        language: languages
      })
    }).catch((err) => {
      console.log(err)
    })
  };

  /**
   * 更新前从后台读取用户数据
   */
  componentDidMount () {
    if (this.state.flag === 1) {
      axios({
        method: 'get',
        url: 'iam/v1/organizations/' + this.state.oId + '/users/' + this.state.id,
        data: {}
      }).then((res) => {
        console.log(res)
        this.setState({
          objectVersionNumber: res.data.objectVersionNumber
        })
        if (res.data.enabled === false) {
          this.setState({
            enabled: '禁用'
          })
        } else if (res.data.enabled === true) {
          this.setState({
            enabled: '启用'
          })
        }
        if (res.data.locked === false) {
          this.setState({
            locked: '否'
          })
        } else if (res.data.locked === true) {
          this.setState({
            locked: '是'
          })
        }
        this.addToForm(res.data)
        this.allLanguage()
      }).catch((err) => {
        console.log(err)
      })
    } else {
      this.addToForm({})
      this.allLanguage()
    }
  }

  /***
   * 将读取的数据添加到form表单数据源
   * @param result
   */
  addToForm = (result) => {
    if (this.state.flag === 1) {
      this.setState({
        data: result
      }, () => {
        this.roleNameSearch()
      })
    } else {
      this.roleNameSearch()
    }
  }

  /**
   * 检验用户名是否重复
   */

  /***
   * form表单提交
   */
  handleSubmit = (e) => {
    e.preventDefault()

    this.props.form.validateFields((err, fieldsValue) => {
      const loginName = fieldsValue['loginName']
      if (this.state.flag === 0) {
        let url = 'iam/v1/organizations/' + this.state.oId + '/users/check'
        axios({
          method: 'post',
          url: url,
          data: {
            loginName: loginName
          },
          async: false
        }).then((res) => {
          if (res.data.message === '用户名已存在') {
            this.errorMess(res.data.message)
            return false
          }
        }).catch((err) => {
          console.log(err)
        })
      }
      if (!err) {
        const values = {
          ...fieldsValue
        }
        // console.log('Received values of form: ', values);
        // 根据传入的id判断插入还是更新记录，0是添加，1更新
        if (this.state.flag === 0) {
          // 添加
          this.insertUserInfo(values)
        } else if (this.state.flag === 1) {
          // 更新
          this.updateUSerInfo(values)
        }
      }
    })
  }

  /***
   * 添加
   */
  insertUserInfo = (data) => {
    var enable, lock
    if (data.enabled === '禁用') {
      enable = false
    } else {
      enable = true
    }
    if (data.locked === '否') {
      lock = false
    } else {
      lock = true
    }
    // console.log(this.props.user.currentUser)
    // let url = 'iam/v1/organizations/' + this.state.noId + '/users/'
    let url = 'iam/v1/organizations/' + this.props.user.currentUser.organizationId + '/users'
    axios({
      method: 'post',
      url: url,
      data: {
        imageUrl: '',
        ldap: true,
        admin: false,
        loginName: data.loginName,
        email: data.email,
        enabled: enable,
        language: data.language,
        locked: lock,
        phone: data.phone,
        realName: data.realName,
        organizationId: this.state.noId,
        timeZone: 'CTT',
        password: '012345678'
      }
    }).then((res) => {
      console.log(res)
      if (res.data.failed) {
        this.errorMess('用户名或邮箱不能重复')
        return false
      } else {
        this.setState({
          id: res.data.id
        })
        this.addUserRole()
        this.success()
        // 跳转到基础信息页
        this.linkToChange(`/setting/user-manage`)
      }
    }).catch((err) => {
      console.log(err)
    })
  };

  /***
   * 更新
   */
  updateUSerInfo = (data) => {
    let enable, lock
    if (data.enabled === '禁用') {
      enable = false
    } else {
      enable = true
    }
    if (data.locked === '否') {
      lock = false
    } else {
      lock = true
    }
    // console.log("update");
    let url = 'iam/v1/organizations/' + this.state.noId + '/users/' + this.state.id
    // 更新数据
    axios({
      method: 'put',
      url: url,
      data: {
        loginName: data.loginName,
        email: data.email,
        enabled: enable,
        language: data.language,
        locked: lock,
        phone: data.phone,
        realName: data.realName,
        organizationId: this.state.noId,
        objectVersionNumber: this.state.objectVersionNumber
      }
    }).then((res) => {
      // console.log(res);
      if (res.data.failed) {
        this.errorMess('用户名或邮箱不能重复')
      } else {
        this.addUserRole()
        this.success()
        // 跳转到基础信息页
        this.linkToChange(`/setting/user-manage`)
      }
    }).catch((err) => {
      console.log(err)
    })
  };

  /**
   * 增加或修改用户-----角色信息
   */
  addUserRole =() => {
    let info = []
    let _this = this
    for (let i = 0; i < this.state.nRoleId.length; i++) {
      info.push(
        {
          'memberType': 'user',
          'roleId': this.state.nRoleId[i],
          'sourceId': 0,
          'sourceType': 'site'
        }
      )
    }
    axios({
      method: 'post',
      url: '/iam/v1/site/role_members?is_edit=true&member_ids=' + this.state.id,
      data: info
    }).then((res) => {
      // console.log(res);
      if (res.data.failed) {
        _this.errorMess('用户角色信息更新失败')
      }
    }).catch((err) => {
      console.log(err)
    })
    this.setState({
      nRoleId: [],
      roleName: []
    })
  }

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
    if (!str || str === 'undefined' || str === 'null') {
      return ''
    }
    return str
  }

  /**
   * 获取组织id
   */
  handleChange=(value, obj) => {
    // alert(obj.key);
    this.setState({
      noId: obj.key
    })
  };
  /**
   * 选择或去除用户对应的角色
   * 根据角色获取角色id
   */
  roleChoose =(value, obj) => {
    let roles = []
    let rolesId = []
    for (let i = 0; i < obj.length; i++) {
      roles.push(obj[i].props.value)
      rolesId.push(obj[i].key)
    }
    // console.log(rolesId);
    this.setState({
      nRoleId: rolesId,
      role: roles
    })
  };

  /***
   * 返回上一个页面
   * @param result
   */
  handleClickBackBtn = (e) => {
    this.linkToChange(`/setting/user-manage`)
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      style: {width: 500, marginBottom: 15},
      labelCol: {
        span: 24
        // xs: { span: 24 },
        // sm: { span: 8 }
      },
      wrapperCol: {
        span: 24
        // xs: { span: 24 },
        // sm: { span: 16 }
      }
    }
    let title = ''
    if (this.props.match.params.flag === '0') {
      title = '创建用户'
    } else if (this.props.match.params.flag === '1') {
      title = '编辑用户'
    }
    return (
      <TableLayout
        title={title}
        showBackBtn
        onBackBtnClick={this.handleClickBackBtn}
        className='container'>
        <div className='container-item'>
          <div className='content'>
            <Form layout='inline'>
              <Row>
                <Col span={10}>
                  <FormItem {...formItemLayout} label='用户名'>
                    {getFieldDecorator('loginName', {
                      initialValue: this.state.data.loginName,
                      rules: [{ required: true, whitespace: true, message: '请输入用户名!' }]
                    })(
                      <Input placeholder={'请输入用户名'} />
                    )}
                  </FormItem>
                </Col>
              </Row>
              {/* <Row>
                <Col span={10}>
                  <FormItem {...formItemLayout} label='公司'>
                    {getFieldDecorator('corporateName', {initialValue: (this.state.flag === 1) ? this.state.corporateName : null,
                      rules: [{ required: true, whitespace: true, message: '请输入公司名称!' }]
                    })(
                      <Select
                        className={'select'}
                        showSearch
                        placeholder={'请输入公司名称'}
                        optionFilterProp='children'
                        defaultActiveFirstOption={false}
                        onSearch={this.companySearch}
                        onChange={this.handleChange}
                      >
                        {this.state.children}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row> */}
              <Row>
                <Col span={10}>
                  <FormItem {...formItemLayout} label='邮箱'>
                    {getFieldDecorator('email', {
                      initialValue: this.state.data.email,
                      rules: [{required: true, type: 'email', whitespace: true, message: '请输入正确的邮箱地址!'}]
                    })(
                      <Input placeholder={'请输入邮箱'} />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={10}>
                  <FormItem {...formItemLayout} label='真实姓名'>
                    {getFieldDecorator('realName', {initialValue: this.state.data.realName,
                      rules: [{ required: true, whitespace: true, message: '请输入真实姓名!' }]
                    })(
                      <Input placeholder={'请输入真实姓名'} />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={10}>
                  <FormItem {...formItemLayout} label='手机号码'>
                    {getFieldDecorator('phone', {initialValue: this.state.data.phone,
                      rules: [
                        { required: true, whitespace: true, message: '请输入手机号码!' },
                        { validator: this.checkTel }
                      ]
                    })(
                      <Input placeholder={'请输入手机号码'} />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={10}>
                  <FormItem {...formItemLayout} label='语言'>
                    {getFieldDecorator('language', {initialValue: this.state.data.language,
                      rules: [{ required: true, whitespace: true, message: '请输入语言!' }]
                    })(
                      <Select placeholder={'请选择语言'} style={{textAlign: 'center'}} >
                        {this.state.language}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={10}>
                  <FormItem {...formItemLayout} label='角色'>
                    {getFieldDecorator('role', {initialValue: this.state.roleName,
                      rules: [
                      // {required: false, whitespace: true, message: '请选择用户角色!' }
                        { validator: (rule, value, callback) => {
                          if (value.length === 0) return callback(new Error('请选择用户角色!'))
                          callback()
                        }}
                      ]
                    })(
                      <Select
                        placeholder={'请选择角色'}
                        defaultActiveFirstOption={false}
                        mode={'multiple'}
                        onChange={this.roleChoose}
                        style={{textAlign: 'center'}} >
                        {this.state.roleOptions}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={10}>
                  <FormItem {...formItemLayout} label='用户是否启用' >
                    {getFieldDecorator('enabled', {initialValue: this.state.enabled,
                      rules: [{ required: true, whitespace: true, message: '请选择是否启用!' }]
                    })(
                      <Select placeholder={'请选择'} style={{textAlign: 'center', marginLeft: 2}} >
                        <Option value={'启用'}>启用</Option>
                        <Option value={'禁用'}>禁用</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={10}>
                  <FormItem {...formItemLayout} label='是否锁定账户'>
                    {getFieldDecorator('locked', {initialValue: this.state.locked,
                      rules: [{ required: true, whitespace: true, message: '请选择是否锁定!' }]
                    })(
                      <Select placeholder={'请选择'} style={{textAlign: 'center'}} >
                        <Option value={'true'}>是</Option>
                        <Option value={'false'}>否</Option>
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

export default Form.create()(UpdateUserInfo)
