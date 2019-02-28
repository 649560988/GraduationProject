import React from 'react'
import { Modal, Input, Form, Button, Row, Col, Select, TreeSelect } from 'antd'
// import styles from './UpdateUserInfo.css's
// import TreeSelect from 'rc-tree-select'
// import 'rc-tree-select/assets/index.css'
import { connect } from 'dva/index'
import axios from 'axios/index'
import TableLayout from '../../layouts/TableLayout'
import styles from './UpdateUserInfo.less';
// import { RuleWalker } from 'tslint';
// import { convertRuleOptions } from 'tslint/lib/configuration';
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
   * data: 查询结果
   */
  state = {
    data: {},
    roleOptions: [],
    domainOptions: [],
    domains: [],
    roles: [],
    showSupplier: 0,
    allSupplierList: [],
    showSupplierList: [],
    supplierId: 0,
    allDept: [],
    leaderList: [],
    selectedLeaderId: 0,
    initialLeader: '',
    deptId: undefined
  };

  /***
 *保存成功弹窗
 */
  success() {
    Modal.success({
      title: '保存成功',
      content: '保存成功'
    })
    // setTimeout(() => modal.destroy(), 1000);
    this.linkToChange(`/setting/usermanage`)
  }
  /***
 *保存失败弹窗
 */
  errorMess(mess) {
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
  componentDidMount() {
    // console.log(this.props.match)
    // console.log(this.props.user.currentUser)
    if (this.props.match.params.flag === '1') {
      this.selectData()
    } else if (this.props.match.params.flag === '0') {
      // this.insertUserInfo()
      this.getAllSupplierInfo()
    }
    this.getAllDept()
    this.allRole()
    this.allDomain()
    this.selectLeader({realName: ''})
  }

  /**
   * 分页获取登录人的所有可能的领导
   * 模糊匹配
   */
  selectLeader = (searchContent) => {
    // console.log(searchContent)
    let leaders = []
    let option = ''
    let url = '/iam-ext/v1/organizations/organizationAdmin/' + this.props.user.currentUser.organizationId + '?page=0&size=40'
    axios({
      method: 'post',
      url: url,
      data: searchContent
    }).then((res) => {
      // console.log(res)
      res.data.content.map((item) => {
        option = <Option key={item.id} value={item.id}><div style={{display: 'inline', float: 'left', marginRight: '20px'}}>工号：{item.jobNumber}</div><div style={{width: '50%', display: 'inline', float: 'right'}}>真实姓名：{item.realName}</div></Option>
        leaders.push(option)
      })
      this.setState({
        leaderList: leaders
      })
    }).catch((err) => {
      console.log(err)
    })
  };


  /**
   * 获取筛选领导的内容
   */
  getLeaderContent = (value) => {
    this.selectLeader({realName: value})
  }

  /**
   * 选取的领导的id
   */
  leaderChoose = (value, obj) => {
    // console.log(value)
    // console.log(obj.key)
    this.setState({
      selectedLeaderId: obj.key
    }, () => {
      this.selectLeader({realName: ''})
    })
  }

  /**
   * 当select失焦时(领导选择面板关闭)重新筛选所有领导
   */
  handleOnBlur = () => {
    this.selectLeader({realName: ''})
  }

  /**
   * 获取所有部门
   */
  getAllDept = () => {
    axios({
      method: 'get',
      url: '/iam-ext/v1/departments/queryListByPidLoop/0'
    }).then((res) => {
      // console.log(res.data)
      this.setState({
        allDept: this.handleDept(res.data)
      })
    }).catch((err) => {
      console.log(err)
    })
  }

  /**
   * 解析所有部门数据将deptName(部门名称),id(部门id)以父子关系呈现出来
   */
  handleDept = (data) => {
    let dept = []
    for (let i = 0; i < data.length; i++) {
      let deptObj = {}
      deptObj.key = data[i].id
      deptObj.value = data[i].deptName
      deptObj.title = data[i].deptName
      // deptObj.deptName = data[i].deptName
      // deptObj.id = data[i].id
      if (data[i].departmentEList.length > 0) {
        deptObj.children = this.handleDept(data[i].departmentEList)
      }
      dept.push(deptObj)
    }
    return dept
  }

  /**
   * 当树形选择器选择变化时获取部门id
   */
  handleTreeChange = (value,label,extra) => {
    this.setState({ 
      deptId:extra.triggerNode.props.eventKey
    });
  }


  /**
   * 搜索用户信息
   */
  selectData = () => {
    // console.log('搜索信息')
    console.log(this.props.match.params.userId)
    let url = '/iam-ext/v1/userext/' + this.props.match.params.userId
    // console.log(url)
    let _this = this
    axios({
      method: 'get',
      url: url,
      data: {}
    }).then((res) => {
      _this.addToForm(res.data)
    }).catch((err) => {
      console.log(err)
    })
  }

  /**
   * 根据查询出的leaderId去获取领导的信息
   */
  getLeaderInfo = (id) => {
    // axios({
    //   method: 'get',
    //   url: '/iam-ext/v1/userext/' + id,
    //   data: {}
    // }).then((res) => {
    //   return res
    // }).catch((err) => {
    //   console.log(err)
    // })
    return axios.get('/iam-ext/v1/userext/' + id)
  }

  /**
   * 查询所有角色
   */
  allRole = (flag) => {
    let roles = []
    axios({
      method: 'get',
      url: '/iam-ext/v1/roles/queryAllRolesInCurrentOrgForTenantAdmin',
      data: {}
    }).then((res) => {
      // console.log(res.data.content)
      for (let i = 0; i < res.data.length; i++) {
        roles.push(<Option value={res.data[i].name} key={res.data[i].id}>{res.data[i].name}</Option>)
      }
      this.setState({
        roleOptions: roles
      })
    }).catch((err) => {
      console.log(err)
    })
  };

  /**
   * 查询所有地区
   */
  allDomain = () => {
    let domains = []
    axios({
      method: 'get',
      url: '/iam-ext/v1/domain/list',
      data: {}
    }).then((res) => {
      // console.log(res.data.content)
      for (let i = 0; i < res.data.content.length; i++) {
        domains.push(<Option value={res.data.content[i].domainName} key={res.data.content[i].id}>{res.data.content[i].domainName}</Option>)
      }
      this.setState({
        domainOptions: domains
      })
    }).catch((err) => {
      console.log(err)
    })
  }

  /***
   * 将读取的数据添加到form表单数据源
   * @param result
   */
  addToForm = (result) => {
    // console.log('将搜索结果添加到表单中')
    // console.log(result)
    let showSupplier = 0
    let userData = {}
    let roles = []
    let rolesId = []
    let domains = []
    let domainsId = []
    userData.realName = result.realName
    userData.deptName = result.userExtDO.deptName
    userData.leaderId = result.userExtDO.leaderId
    userData.phone = result.phone
    userData.email = result.email
    userData.jobNumber = result.userExtDO.jobNumber
    userData.loginName = result.loginName
    userData.supplierId = result.userExtDO.supplierId
    userData.supplier = ''
    for (let i = 0; i < result.roles.length; i++) {
      roles.push(result.roles[i].name)
      rolesId.push(result.roles[i].id)
    }
    for (let i = 0; i < result.domainDOs.length; i++) {
      domains.push(result.domainDOs[i].domainName)
      domainsId.push(Number(result.domainDOs[i].id))
    }
    for (let i = 0; i < rolesId.length; i++) {
      if (rolesId[i] === 16 || rolesId[i] === 17) {
        showSupplier = 1
      } else {
        showSupplier = 0
      }
    }
    userData.roles = roles
    userData.domainId = domains
    if (result.userExtDO.leaderId !== null) {
      this.getLeaderInfo(result.userExtDO.leaderId).then((resolved, reject) => {
        if (resolved.data !== "") {
          this.setState({
            roles: rolesId,
            domains: domainsId,
            data: userData,
            showSupplier: showSupplier,
            supplierId: result.userExtDO.supplierId,
            deptId: result.userExtDO.deptId === null ? undefined : result.userExtDO.deptId,
            selectedLeaderId: result.userExtDO.leaderId,
            initialLeader: '工号：' + resolved.data.userExtDO.jobNumber + '　　　' + '真实姓名：' + resolved.data.realName
          }, () => {
            // console.log(this.state.roles)
            this.getAllSupplierInfo()
          })
        } else {
          this.setState({
            roles: rolesId,
            domains: domainsId,
            data: userData,
            showSupplier: showSupplier,
            supplierId: result.userExtDO.supplierId,
            selectedLeaderId: result.userExtDO.leaderId,
            deptId: result.userExtDO.deptId === null ? undefined : result.userExtDO.deptId,
          }, () => {
            // console.log(this.state.roles)
            this.getAllSupplierInfo()
          })
        }
        
      })
    } else {
      this.setState({
        roles: rolesId,
        domains: domainsId,
        data: userData,
        showSupplier: showSupplier,
        supplierId: result.userExtDO.supplierId,
        selectedLeaderId: result.userExtDO.leaderId,
      }, () => {
        // console.log(this.state.roles)
        this.getAllSupplierInfo()
      })
    }
  }

  /***
   * form表单提交
   * 获取表单所有数据以json格式
   */
  handleSubmit = (e) => {
    // console.log(this.props.form.getFieldsValue())
    e.preventDefault()
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        const values = {
          ...fieldsValue
        }
        // console.log(values)
        if (this.props.match.params.flag === '1') {
          this.updateUSerInfo(values)
        } else if (this.props.match.params.flag === '0') {
          this.insertUserInfo(values)
        }
      }
    })
  }

  /***
   * 添加
   */
  insertUserInfo = (data) => {
    // console.log('添加用户')
    let _this = this
    // let roleId = []
    // let domainId = []
    let datas = {}
    // console.log(this.state.roles)
    // for (let i = 0; i < this.state.roles.length; i++) {
    // roleId.push(parseInt(this.state.roles[i].id))
    // }
    // for (let i = 0; i < this.state.domains.length; i++) {
    // domainId.push(parseInt(this.state.domains[i].id))
    // }
    datas.deptName = data.deptName
    datas.deptId = Number(this.state.deptId)
    datas.roleIds = this.state.roles
    datas.domainIds = this.state.domains
    datas.organizationId = this.props.user.currentUser.organizationId
    datas.loginName = data.loginName
    datas.realName = data.realName
    datas.phone = data.phone
    datas.email = data.email
    datas.jobNumber = data.jobNumber
    datas.password = data.password
    datas.supplierId = parseInt(this.state.supplierId)
    datas.leaderId = Number(data.leaderId)
    // console.log(datas)
    axios({
      method: 'post',
      url: '/iam-ext/v1/userext/create',
      data: datas
    }).then((res) => {
      // console.log(res)
      if (res.data === true) {
        _this.success()
      }
      if (res.data.failed) {
        _this.errorMess(res.data.message)
      }
      // console.log(res.data.content
    }).catch((err) => {
      console.log(err)
    })
  };

  /***
   * 更新
   */
  updateUSerInfo = (data) => {
    // console.log('更新用户信息')
    // console.log(data)
    // let roleId = []
    // let domainId = []
    // for (let i = 0; i < this.state.roles.length; i++) {
    // roleId.push(parseInt(this.state.roles[i].id))
    // }
    // for (let i = 0; i < this.state.domains.length; i++) {
    // domainId.push(parseInt(this.state.domains[i].id))
    // }
    // console.log(this.state.roles)
    // console.log(this.state.domains)
    let _this = this
    axios({
      method: 'post',
      url: '/iam-ext/v1/userext/update/' + this.props.match.params.userId,
      data: {
        realName: data.realName,
        roleIds: this.state.roles,
        domainIds: this.state.domains,
        deptName: data.deptName,
        deptId: Number(this.state.deptId),
        phone: data.phone,
        email: data.email,
        jobNumber: data.jobNumber,
        loginName: data.loginName,
        supplierId: parseInt(this.state.supplierId),
        leaderId: parseInt(this.state.selectedLeaderId)

      }
    }).then((res) => {
      // console.log(res)
      if (res.data === true) {
        _this.success()
      } else {
        _this.errorMess(res.data.message)
      }
    }).catch((err) => {
      console.log(err)
    })
  };

  /**
   * 校验手机号
   * @param rule
   * @param value
   * @param callback
   */
  checkTel = (rule, value, callback) => {
    let re = /^(?=\d{11}$)^1(?:3\d|4[57]|5[^4\D]|66|7[^249\D]|8\d|9[89])\d{8}$/

    if (this.Trim(this.praseStrEmpty(value)) !== '') {
      if (re.test(value)) {
        callback()
      } else {
        callback(new Error('手机号格式不正确！'))
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
   * 选择或去除用户对应的角色
   * 根据角色获取角色id
   */
  roleChoose = (value, obj) => {
    let roles = []
    let showSupplier = 0
    for (let i = 0; i < obj.length; i++) {
      // let role = {}
      // console.log(obj[i].key)
      // console.log(obj[i].props.value)
      // role.id = obj[i].key
      // role.name = obj[i].props.value
      // console.log(role)
      if (obj[i].key === "16" || obj[i].key === "17") {
        showSupplier = 1
      }
      roles.push(obj[i].key)
    }
    // console.log(showSupplier)
    // console.log(roles)
    this.setState({
      roles: roles,
      showSupplier: showSupplier
    })
  };

  /**
   * 选择或去除区域
   */
  domainChoose = (value, obj) => {
    let domains = []
    for (let i = 0; i < obj.length; i++) {
      // let domain = {}
      // domain.id = obj[i].key
      // domain.domainName = obj[i].props.value
      // domains.push(domain)
      domains.push(Number(obj[i].key))
    }
    // console.log(domains)
    this.setState({
      domains: domains
    })
  }

  /**
   * 匹配筛选用户输入的供应商信息
   */
  // supplierSearch = (value) => {
  //   console.log('此时文本为：'+ value)
  //   let resultId = []
  //   for (let i = 0; i < this.state.allSupplierStringList.length; i++) {
  //     if (this.state.allSupplierStringList[i].name.toString().indexOf(value) >= 0 || this.state.allSupplierStringList[i].code.toString().indexOf(value) >= 0) {
  //       resultId.push(this.state.allSupplierStringList[i].id)
  //       console.log(resultId)
  //     }
  //   }
  //   this.getSupplierSearchResult(resultId)
  // }

  /**
   * 显示前台筛选出的供应商
   */
  // getSupplierSearchResult = (ids) => {
  //   let supplierResult = []
  //   for (let i = 0; i < ids.length; i++) {
  //     for (let j = 0; j < this.state.allSupplierList.length; j++) {
  //       if (ids[i] === this.state.allSupplierList[j].id) {
  //         supplierResult.push(<Option key={this.state.allSupplierList[j].id}>供应商编码：{this.state.allSupplierList[j].code}<Divider style={{backgroundColor: 'gray'}} type={'vertical'}/>供应商姓名：{this.state.allSupplierList[j].name}</Option>)
  //       }
  //     }
  //   }
  //   this.setState({
  //     showSupplierList: supplierResult
  //   }, () => {
  //     console.log(this.state.showSupplierList)
  //   })
  // }

  /**
   * 获取所有供应商信息
   */
  getAllSupplierInfo = () => {
    let _this = this
    // console.log(this.state.data.supplierId)
    axios({
      method: 'get',
      url: 'iam-ext/v1/suppliers',
      data: {
        name: '',
        code: ''
      }
    }).then((res) => {
      // console.log(res.data)
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].id === _this.state.data.supplierId) {
          //  _this.state.data.supplier = '供应商编码：' + res.data[i].code + '<Divider type={'+ 'vertical' + '} />' + '供应商姓名：' + res.data[i].name
          // _this.state.data.supplier = (
          //   <span>供应商编码：{res.data[i].code}
          //     <Divider 
          //       style={{ backgroundColor: 'gray' }} 
          //       type={'vertical'} 
          //     />
          //     供应商姓名：{res.data[i].name}
          //   </span>
          // )
          _this.state.data.supplier = '供应商编码：' + res.data[i].code + '　　' + '供应商姓名：' + res.data[i].name
        }
      }
      _this.setState({
        allSupplierList: res.data,
        data: _this.state.data
      }, () => {
        _this.addToSupplierSelect(res.data)
      })
    }).catch((err) => {
      console.log(err)
    })
  };

  /**
   * 将供应商信息添加到下拉列表中
   */
  addToSupplierSelect = (data) => {
    let supplierArr = []
    for (let i = 0; i < data.length; i++) {
      // supplierArr.push(<Option key={data[i].id} value={data[i].id.toString()}>供应商编码：{data[i].code}<Divider style={{ backgroundColor: 'gray' }} type={'vertical'} />供应商姓名：{data[i].name}</Option>)
      supplierArr.push(<Option key={data[i].id} value={'供应商编码：' + data[i].code + '　　' + '供应商姓名：' + data[i].name}>供应商编码：{data[i].code}　　供应商姓名：{data[i].name}</Option>)
    }
    this.setState({
      showSupplierList: supplierArr
    })
  }

  /**
   * 获取用户选中的
   */
  handleSupplierChoose = (value, obj) => {
    console.log('选中了' + obj.key)
    this.setState({
      supplierId: obj.key
    })
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

  /***
   * 返回上一个页面
   * @param result
   */
  handleClickBackBtn = (e) => {
    this.linkToChange(`/setting/usermanage`)
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      style: { width: 500, marginBottom: 15 },
      labelCol: {
        span: 24
      },
      wrapperCol: {
        span: 24
      }
    }
    let title = ''
    let disable = true
    let password = ''
    let supplierChoose = ''
    if (this.props.match.params.flag === '0') {
      title = '创建用户'
      disable = false
      password = <Row>
        <Col span={10}>
          <FormItem {...formItemLayout} label={<p style={{ display: 'inline', fontWeight: 'bold' }}>登录密码</p>}>
            {getFieldDecorator('password', {
              initialValue: this.state.data.password,
              rules: [
                { required: true, whitespace: true, message: '请输入登录密码!' },
                { validator: this.checkPassword }
              ]
            })(
              <Input disabled={disable} placeholder={'请输入登录密码'} />
            )}
          </FormItem>
        </Col>
      </Row>
    } else if (this.props.match.params.flag === '1') {
      title = '编辑用户'
      disable = true
      password = ''
    }
    if (this.state.showSupplier === 1) {
      supplierChoose = <Row>
        <Col span={24}>
          <FormItem {...formItemLayout} label='供应商'>
            {getFieldDecorator('supplier', {
              initialValue: this.state.data.supplier,
              rules: [{
                validator: (rule, value, callback) => {
                  if (value.length === 0) return callback(new Error('请选择供应商!'))
                  callback()
                }
              }]
            })(
              <Select
                placeholder={'请选择供应商'}
                showSearch
                // onSearch={this.supplierSearch}
                onChange={this.handleSupplierChoose}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children[1].toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.props.children[3].toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {this.state.showSupplierList}
              </Select>
            )}
          </FormItem>
        </Col>
      </Row>
    } else if (this.state.showSupplier === 0) {
      supplierChoose = ''
    }
// console.log(this.state.initialLeader)
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
                <Col span={24}>
                  <FormItem {...formItemLayout} label='姓名'>
                    {getFieldDecorator('realName', {
                      initialValue: this.state.data.realName,
                      rules: [{ required: true, whitespace: true, message: '请输入姓名!' }]
                    })(
                      <Input placeholder={'请输入真实姓名'} />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={10}>
                  <FormItem {...formItemLayout} label='角色'>
                    {getFieldDecorator('role', {
                      initialValue: this.state.data.roles,
                      rules: [
                        // {required: true},
                        {
                          validator: (rule, value, callback) => {
                            if (value.length === 0) return callback(new Error('请选择角色!'))
                            callback()
                          }
                        }
                      ]
                    })(
                      <Select
                        placeholder={'请选择角色'}
                        defaultActiveFirstOption={false}
                        mode={'multiple'}
                        onChange={this.roleChoose}
                        style={{ textAlign: 'center' }} >
                        {this.state.roleOptions}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              {supplierChoose}
              <Row>
                <Col span={10}>
                  <FormItem {...formItemLayout} label='区域'>
                    {getFieldDecorator('domainId', {
                      initialValue: this.state.data.domainId,
                      rules: [
                        {
                          validator: (rule, value, callback) => {
                            if (value) if (value.length === 0) return callback(new Error('请选择区域!'))
                            callback()
                          }
                        }
                      ]
                    })(
                      <Select
                        placeholder={'请选择区域'}
                        defaultActiveFirstOption={false}
                        mode={'multiple'}
                        onChange={this.domainChoose}
                        style={{ textAlign: 'center' }} >
                        {this.state.domainOptions}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={10}>
                  <FormItem {...formItemLayout} label='部门'>
                    {getFieldDecorator('deptName', {
                      initialValue: this.state.data.deptName,
                      rules: [{ required: true, whitespace: true, message: '请输入部门!' }]
                    })(
                      // <Input placeholder={'请输入部门'} />
                      <TreeSelect
                        showSearch
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        placeholder="请选择部门"
                        searchPlaceholder={'请输入关键词搜索'}
                        allowClear
                        // treeDefaultExpandAll
                        treeData={this.state.allDept}
                        onChange={this.handleTreeChange}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={10}>
                  <FormItem {...formItemLayout} label='领导'>
                    {getFieldDecorator('leaderId', {
                      initialValue: this.state.initialLeader === '' ? '' : this.state.initialLeader,
                      rules: [{ required: true, message: '请选择领导!' }]
                    })(
                      <Select
                        className={styles.leaderChoose}
                        placeholder={'请选择输入领导姓名进行筛选'}
                        showSearch
                        onSearch={(value) => this.getLeaderContent(value)}
                        onChange={this.leaderChoose}
                        filterOption={false}
                        defaultActiveFirstOption={false}
                        onBlur={this.handleOnBlur}
                      >
                        {this.state.leaderList}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormItem {...formItemLayout} label={<p style={{ display: 'inline', fontWeight: 'bold' }}>手机号码</p>}>
                    {getFieldDecorator('phone', {
                      initialValue: this.state.data.phone,
                      rules: [{ required: false },
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
                  <FormItem {...formItemLayout} label='邮箱'>
                    {getFieldDecorator('email', {
                      initialValue: this.state.data.email,
                      rules: [{ required: false, type: 'email', whitespace: true, message: '请输入格式正确的邮箱地址!' }]
                    })(
                      <Input placeholder={'请输入邮箱'} />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={10}>
                  <FormItem {...formItemLayout} label='工号'>
                    {getFieldDecorator('jobNumber', {
                      initialValue: this.state.data.jobNumber,
                      rules: [
                        { required: true, whitespace: true, message: '请输入工号!' }
                      ]
                    })(
                      <Input disabled={disable} placeholder={'请输入工号'} />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <FormItem {...formItemLayout} label='登录名'>
                    {getFieldDecorator('loginName', {
                      initialValue: this.state.data.loginName,
                      rules: [{ required: true, whitespace: true, message: '请输入登录名!' },
                      {
                        validator: (rule, value, callback) => {
                          if (value) if (value.length > 128) return callback(new Error('登录名最大长度为128!'))
                          callback()
                        }
                      }]
                    })(
                      <Input disabled={disable} placeholder={'请输入登录名'} />
                    )}
                  </FormItem>
                </Col>
              </Row>
              {password}
              <Row style={{ marginTop: 30 }}>
                <Col span={10}>
                  <FormItem >
                    <Button type='primary' htmlType={'submit'} onClick={this.handleSubmit}>数据保存</Button>
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
