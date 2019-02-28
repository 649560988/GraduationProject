import React from 'react'
import { Modal, Input, Form, Button, Row, Col, TreeSelect, Select, message } from 'antd'

import {connect} from 'dva/index'
import axios from 'axios/index'
import TableLayout from '../../layouts/TableLayout'
import styles from './UpdateUserInfo.less';

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
    id: 0,
    deptId: 0,
    data:{},
    flag: -1,
    treeData: [],
    eventKey:0,
    leaderList: [],
    selectedLeaderId: 0,
    initialLeader: '',
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
    this.getAllDept()
    this.selectLeader({realName: ''})
  }
  

  onChange = (value,label,extra) => {
    this.setState({ 
      value, eventKey:extra.triggerNode.props.eventKey
    });
  }

  /**
   * 获取所有部门
   */
  getAllDept = () => {
    axios({
      method: 'get',
      url: '/iam-ext/v1/departments/queryListByPidLoop/0'
    }).then((res) => {
      this.setState({
        treeData: this.handleDept(res.data)
      }, () => {
      })
    }).catch((err) => {
      console.log(err)
    })
  }

/**
 * 将部门以父子关系存放
 */
  handleDept = (data) => {
    let dept = []
    for (let i = 0; i < data.length; i++) {
      let deptObj = {}
      deptObj.key = data[i].id
      deptObj.value = data[i].deptName
      deptObj.title = data[i].deptName
      if (data[i].departmentEList.length > 0) {
        deptObj.children = this.handleDept(data[i].departmentEList)
      }
      dept.push(deptObj)
    }
    return dept
  }


  /**
   * 更新前从后台读取用户数据
   */
  componentDidMount () {
    this.getInfo()
  }

  getInfo(){
    if(this.state.flag === 1){
      axios({
        method: 'get',
        url: '/iam-ext/v1/outsourcer/' + this.state.id,
      }).then((res) => {
        let {data} = res
        let dataObj = {}
        if(this.state.id!==0){
            dataObj.login_name = data.login_name
            dataObj.dept_name = data.dept_name
            dataObj.email = data.email
            dataObj.real_name = data.real_name
            dataObj.phone = data.phone
            dataObj.job_number = data.id
            dataObj.leader_id = Number(data.leader_id)
        }
        this.setState({
            data:dataObj    
        })
        if (data.leader_id !== null) {
          this.getLeaderInfo(data.leader_id).then((resolved, reject) => {
            if (resolved.data !== "") {
              this.setState({
                initialLeader: '工号：' + resolved.data.id + '　　　' + '真实姓名：' + resolved.data.realName
              }, () => {
                console.log(this.state.initialLeader)
              })
            }
          })
        }
        }).catch((err) => {
          console.log(err)
        })
    }
  }

    /**
   * 根据查询出的leaderId去获取领导的信息
   */
  getLeaderInfo = (id) => {
    return axios.get('/iam-ext/v1/userext/' + id)
  }

  /***
   * form表单提交
   */
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        console.log('Received values of form: ', fieldsValue);
      }
      fieldsValue.dept_id = this.state.eventKey
      fieldsValue.id = parseInt(fieldsValue.id)
      //添加
      if (this.state.flag === 0) {
        let url = 'iam-ext/v1/outsourcer'
        axios({
          method: 'post',
          url: url,
          data:fieldsValue,
          async: false
        }).then((res) => {
          if(res.data.message){
            message.error(res.data.message)
            return
          }
          if(res.loginName !== ''){
            this.success() 
          }
        }).catch((err) => {
          console.log(err)
        })
      }
      //更新
      if (this.state.flag === 1) {
        let url = 'iam-ext/v1/outsourcer/' + this.state.id
        axios({
          method: 'put',
          url: url,
          data:fieldsValue,
          async: false
        }).then((res) => {
          if(res.data.message){
            message.error(res.data.message)
            return
          }
          if(res.loginName !== ''){
            this.success() 
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    })
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
   * 获取筛选领导的内容
   */
  getLeaderContent = (value) => {
    this.selectLeader({realName: value})
  }

    /**
   * 分页获取登录人的所有可能的领导
   * 模糊匹配
   */
  selectLeader = (searchContent) => {
    // console.log(searchContent)
    let leaders = []
    let option = ''
    let url = '/iam-ext/v1/organizations/orgAdmin/' + this.props.user.currentUser.organizationId + '?page=0&size=40'
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
   * 当select失焦时(领导选择面板关闭)重新筛选所有领导
   */
  handleOnBlur = () => {
    this.selectLeader({realName: ''})
  }

  /***
   * 返回上一个页面
   * @param result
   */
  handleClickBackBtn = (e) => {
    this.linkToChange(`/project/personmanage`)
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      style: {width: 500, marginBottom: 15},
      labelCol: {
        span: 24
      },
      wrapperCol: {
        span: 24
      }
    }
    let title = ''
    let jobNumber = ''
    if (this.props.match.params.flag === '0') {
      title = '创建外包人员'
      jobNumber = ''
    } else if (this.props.match.params.flag === '1') {
      title = '编辑外包人员'
      jobNumber = <Row>
      <Col span={10}>
        <FormItem {...formItemLayout} label='工号'>
          {getFieldDecorator('id', {
            initialValue: this.state.data.job_number ? this.state.data.job_number.toString() : '',
            rules: [{ required: true, whitespace: true, message: '请输入工号!' }]
          })(
            <Input disabled={true} placeholder={'请输入工号'} />
          )}
        </FormItem>
      </Col>
    </Row>
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
                    {getFieldDecorator('login_name', {
                      initialValue: this.state.data.login_name,
                      rules: [{ required: true, whitespace: true, message: '请输入用户名!' }]
                    })(
                      <Input placeholder={'请输入用户名'} />
                    )}
                  </FormItem>
                </Col>
              </Row>
              
              <Row>
                <Col span={10}>
                  <FormItem {...formItemLayout} label='部门'>
                    {getFieldDecorator('dept_name', {
                      initialValue: this.state.data.dept_name,
                      rules: [{ required: true, whitespace: true, message: '请输入部门!' }]
                    })(
                      <TreeSelect
                        style={{ width: 500 }}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={this.state.treeData}
                        placeholder="请选择部门"
                        treeDefaultExpandAll
                        onChange={this.onChange}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={10}>
                  <FormItem {...formItemLayout} label='领导'>
                    {getFieldDecorator('leader_id', {
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
              
              {jobNumber}
              
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
                    {getFieldDecorator('real_name', {initialValue: this.state.data.real_name,
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
