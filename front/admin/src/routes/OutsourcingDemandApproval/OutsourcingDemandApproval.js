/***
 * created by zhuganghui on 2018/7/20
 *
 * 外协需求审批页面
 *  查看外协需求申请基本信息及审批记录
 *  如果当前id和登录id一致，才能进行审批
 *  审批后插一条数据到后台
 *
 *  已实现功能：
 *  1.processInfo的url relationId和resourcesId取到的是未setState之前的值
 *  2.addToSteps names 由于第一遍渲染的时候是空，第二遍才有数据，所以人名没显示出来
 *  3.双击进去能改数据，这是一个隐藏的bug
 *  4.公司信息的背景色一改就报错
 *  5.button跳转老是跳首页 #/dashboard
 *  6.戴庆喜的接口还没写好
 *  7.admin可以修改删除公司信息吗，明天问清楚公司的权限，能不能看到所有公司的信息，还是只能看到自己公司的
 *  8.魏孟的接口，公司管理员只可以查看修改删除自己公司的信息，admin可以看修删所有的公司,
 *  9.返回的路径的问题
 *  10.审批记录只显示一条
 *  11.流程信息的接口403
 *  12.getSelfCompanyInfo不是可以获取吗，怎么还要用 根据组织id（organizationId）查询公司信息
 *  13.流程信息 报名列表 审批记录放到外协需求申请页面
 *  14.接口换成solr的
 *  15.没数据的时候是if(result!==null) 还是if(result!=undefined) list 260行
 *  16.只显示审批中审批完成审批失败，创建不显示。现在只显示审批完成和审批中的，失败的不显示了，显示的分页数据和上一页重复
 *  18.审批通过了之后，要调用solr的接口
 *  19.审批拒绝之后，还是显示审批中
 *  20.保存成功和失败的弹窗长度变短
 *  21.项目经基础信息中项目开始和结束时间col不够
 *  22.修改审批人，再修改回来，没改成功
 *  23.外协申请的编号有重复
 *  24.报名列表链接到外协顾问信息页面
 *
 *
 *  待实现功能：
 *  17.浏览器关了，重新打开，登录状态不变，应该退出登录
 *
 */
import React from 'react'
import { Steps, Input, Table, Form, Button, Row, Col, Modal, Icon } from 'antd'
import styles from './OutsourcingDemandApproval.css'
import axios from 'axios/index'
import { connect } from 'dva'
const FormItem = Form.Item
const Step = Steps.Step
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
function error (reason) {
  Modal.error({
    title: '保存失败',
    content: reason
  })
}
@Form.create()
@connect(({ user }) => ({
  user: user
}))
class OutsourcingDemandApproval extends React.Component {
  columns = [
    {
      title: '审批人',
      dataIndex: 'createdBy'
    },
    {
      title: '审批日期',
      dataIndex: 'creationDate'
    },
    {
      title: '审批结果',
      dataIndex: 'isPass'
    },
    {
      title: '审批意见',
      dataIndex: 'auditOpinion'
    }
  ];
  SignColumns = [
    {
      title: '外协申请号',
      dataIndex: 'id'
    },
    {
      title: '联系电话',
      dataIndex: 'mobile'
    },
    {
      title: '报名日期',
      dataIndex: 'creationDate'
    }
  ];

  state = {
    demandId: 0,
    processSubId: 0,
    relationId: 0,
    resourcesId: 0,
    current: 0,
    enterState: 0,
    id: 0,
    stat: 0,
    data: {},
    info: [],
    steps: [],
    signData: []
  }
  componentWillMount () {
    this.setState({
      id: this.props.match.params.id,
      stat: this.props.match.params.stat
    })
  }
  /***
   * 登录id不是外协专员id时，按钮不显示
   */
  // TODO: 改成通过是否有权限判断(user.currentUser.permissions)
  componentDidMount () {
    let isadmin = this.props.user.currentUser.admin
    if (isadmin == true || this.state.stat == 0) {
      this.setState({
        enterState: 1
      })
    }
    // 读取外协需求申请基本信息
    this.demandBaseInfo()
  }

  /***
   * 读取外协需求申请基本信息
   */
  demandBaseInfo=() => {
    if (this.state.id != 0) {
      let url = '/base-info/resume/ocmsDemand/getDemand/id?id='
      url += this.state.id
      // 查数据
      axios({
        method: 'get',
        url: url
      }).then((res) => {
        // console.log(res.data);
        this.setState({
          relationId: res.data.ocmsCompanyId,
          demandId: res.data.id
        }, () => {
          // 读取审批记录
          this.approvalInfo()
          // 读取报名列表
          this.signUpInfo()
        })

        // 将数据添加到表单里
        this.addToForm(res.data)
      }).catch((err) => {
        console.log(err)
      })
    }
  }

  /***
   * form表单提交
   */
  handleSubmitPass = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        this.updateApprovalInfo(this.props.user.currentUser.id, this.state.id, values, 1)
      }
    })
  }
  handleSubmitRefuse = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        this.updateApprovalInfo(this.props.user.currentUser.id, this.state.id, values, 0)
      }
    })
  }

  /***
   * 更新审批信息
   */
  updateApprovalInfo = (currentid, id, value, isPass) => {
    let dataa = {
      'auditOpinion': value.requirementDescription,
      'currentOperateUserId': currentid,
      'id': id,
      'isApprove': isPass
    }
    console.log(dataa)

    // 更新数据
    axios({
      method: 'post',
      url: '/base-info/resume/ocmsDemand/submitAudit',
      data: dataa
    }).then((res) => {
      console.log(res)
      if (res.data.success === true) {
        // solr
        axios({
          method: 'post',
          url: '/search/resume/solr/demand/deltaImport',
          data: {}
        }).then((res) => {
          if (res.status == 200) {
            console.log('更新成功')
            success()
            // 跳转到基础信息页
            this.linkToChange(`/external-demand/approval`)
          }
        }).catch((err) => {
          console.log(err)
          error(err)
        })
      } else {
        error(res.data.msg)
      }
    }).catch((err) => {
      console.log(err)
    })
  }
  /***
   *   路径跳转
   */
  linkToChange = url => {
    const { history } = this.props
    history.push(url)
  };

  /***
   * 读取报名列表
   */
  signUpInfo=() => {
    if (this.state.id != 0) {
      let url = '/base-info/resume/ocmsResume/demand/'
      url += this.state.demandId
      console.log(url)
      // 查数据
      axios({
        method: 'get',
        url: url
      }).then((res) => {
        console.log(res.data)

        this.addToSignTable(res.data)
      }).catch((err) => {
        console.log(err)
      })
    }
  }

  /***
   * 读取审批记录
   */
  approvalInfo=() => {
    if (this.state.id != 0) {
      let url = '/process/v1/ocms/process/account?relationId='
      url += this.state.id
      // 查数据
      axios({
        method: 'get',
        url: url
      }).then((res) => {
        console.log(res.data)
        this.setState({
          resourcesId: res.data[0].resourcesId,
          processSubId: res.data[0].processSubId,
          current: res.data.length - 1
        }, () => {
          // 读取流程信息
          this.processInfo()
        })
        // 将数据添加到表格里
        this.addToTable(res.data)
      }).catch((err) => {
        console.log(err)
      })
    }
  }

  /***
   * 读取流程信息
   */
  processInfo=() => {
    if (this.state.id != 0) {
      let url = '/process/v1/ocms/process/sub/node?processSubId='
      url += this.state.processSubId + '&relationId=' + this.state.relationId + '&resourcesId=' + this.state.resourcesId
      console.log(url)
      // 查数据
      axios({
        method: 'get',
        url: url
      }).then((res) => {
        console.log(res.data)
        // 将数据添加到步骤条里
        this.addToSteps(res.data)
      }).catch((err) => {
        console.log(err)
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
   * 将读取的数据添加到Table
   * @param result
   */
  addToTable = (result) => {
    let datas = []
    let ids = []
    let names = []

    // 获取ids
    result.forEach(function (value) {
      if (value.createdBy != null) {
        ids.push(value.createdBy)
      }
    })

    // 用接口获取姓名
    axios({
      method: 'post',
      url: '/iam-ext/v1/users/ids',
      data: ids
    }).then((res) => {
      // console.log(res);
      res.data.forEach(function (value) {
        if (value.realName != null) {
          names.push(value.realName)
        }
      })
      // 把数据放入表格
      result.map(function (value, i) {
        let item = {}
        item.createdBy = names[i]
        item.creationDate = value.creationDate
        if (value.isPass === 1) {
          item.isPass = '通过'
        }
        if (value.isPass === 0) {
          item.isPass = '未通过'
        }
        item.auditOpinion = value.auditOpinion
        datas.push(item)
      })
    }).catch((err) => {
      console.log(err)
    })

    // 将datas 添加到state中
    this.setState({
      info: datas
    })
  }

  /***
   * 将读取的数据添加到Table
   * @param result
   */
  addToSignTable = (result) => {
    let datas = []
    result.forEach(function (value) {
      let item = {}
      item.id = value.id
      item.mobile = value.mobile
      item.creationDate = value.creationDate

      datas.push(item)
    })

    // 将datas 添加到state中
    this.setState({
      signData: datas
    })
  }

  /***
   * 将读取的数据添加到Steps
   * @param result
   */
  addToSteps=(result) => {
    // 根据id获取审批人姓名
    let ids = []
    let names = []
    result.forEach(function (value) {
      if (value.operatorId != null) {
        ids.push(value.operatorId)
      }
    })
    // 调用后台的接口
    axios({
      method: 'post',
      url: '/iam-ext/v1/users/ids',
      data: ids
    }).then((res) => {
      // console.log(res);
      res.data.forEach(function (value) {
        if (value.realName != null) {
          names.push(value.realName)
        }
      })
      // console.log(names);
      this.setState({
        steps: result.map(function (res, i) {
          console.log(i)
          return {
            title: res.processSubName,
            content: names[i]
          }
        })
      })
    }).catch((err) => {
      console.log(err)
    })
  }

  /***
   * 返回上一个页面
   * @param result
   */
  handleClickBackBtn = (e) => {
    this.linkToChange(`/external-demand/approval`)
  }

  /**
   *   跳转到明细页面
   */
  handleLinkToAdvisor = (e, id) => {
    e.stopPropagation()
    this.linkToChange(`/base-info-defend/external-consultant-resume/${id}`)
  }

  render () {
    const { current } = this.state
    const { getFieldDecorator } = this.props.form
    const { TextArea } = Input
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
          <div className={styles.OutsourcingDemandApproval__title} >
            外协需求申请基本信息
          </div>
          <div className='content'>
            <Form layout='inline' style={{marginLeft: '50px'}}>
              <Row>
                <Col span={10} offset={2}>
                  <FormItem {...formItemLayout} label='外协申请编号'>
                    {getFieldDecorator('demandNo', {initialValue: this.state.data.demandNo })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col span={10}>
                  <FormItem {...formItemLayout} label='申请状态'>
                    {getFieldDecorator('status', {initialValue: this.state.data.status === 0 ? '有效' : '无效'})(<Input disabled />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={10} offset={2}>
                  <FormItem {...formItemLayout} label='项目名称'>
                    {getFieldDecorator('objectName', {initialValue: this.state.data.objectName})(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col span={10}>
                  <FormItem {...formItemLayout} label='项目所属公司'>
                    {getFieldDecorator('companyNo', {initialValue: this.state.data.companyNo})(<Input disabled />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={10} offset={2}>
                  <FormItem {...formItemLayout} label='项目经理'>
                    {getFieldDecorator('createBy_String', {initialValue: this.state.data.createBy_String})(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col span={10}>
                  <FormItem {...formItemLayout} label='申请日期'>
                    {getFieldDecorator('applicationDate', {initialValue: this.state.data.applicationDate})(<Input disabled />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={10} offset={2}>
                  <FormItem {...formItemLayout} label='联系电话'>
                    {getFieldDecorator('tel', {initialValue: this.state.data.tel})(<Input disabled />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={10} offset={2}>
                  <FormItem {...formItemLayout} label='系统'>
                    {getFieldDecorator('type', {initialValue: this.state.data.type})(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col span={10}>
                  <FormItem {...formItemLayout} label='模块'>
                    {getFieldDecorator('modular', {initialValue: this.state.data.modular})(<Input disabled />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={10} offset={2}>
                  <FormItem {...formItemLayout} label='从业年限'>
                    {getFieldDecorator('employmentTime', {initialValue: this.state.data.employmentTime})(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col span={10}>
                  <FormItem {...formItemLayout} label='工作地点'>
                    {getFieldDecorator('workAddress', {initialValue: this.state.data.workAddress})(<Input disabled />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={10} offset={2}>
                  <FormItem {...formItemLayout} label='需求开始日期'>
                    {getFieldDecorator('remandStartDate', {initialValue: this.state.data.remandStartDate})(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col span={10}>
                  <FormItem {...formItemLayout} label='需求周期（月）'>
                    {getFieldDecorator('remandCycle', {initialValue: this.state.data.remandCycle })(<Input disabled />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={10} offset={2}>
                  <FormItem {...formItemLayout} label='价格'>
                    {getFieldDecorator('price', {initialValue: this.state.data.price})(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col span={10}>
                  <FormItem {...formItemLayout} label='价格单位'>
                    {getFieldDecorator('priceUnit_String', {initialValue: this.state.data.priceUnit_String})(<Input disabled />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={10} offset={2}>
                  <FormItem {...formItemLayout} label='需求顾问角色'>
                    {getFieldDecorator('demandConsultantRole_String', {initialValue: this.state.data.demandConsultantRole_String })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col span={10}>
                  <FormItem {...formItemLayout} label='是否包住宿'>
                    {getFieldDecorator('isBoard', {initialValue: this.state.data.isBoard})(<Input disabled />)}
                  </FormItem>
                </Col>
              </Row>
              <Row style={{marginBottom: 30}}>
                <Col span={30}>
                  <FormItem label='详细需求描述' style={{width: '99%', marginLeft: 60}}
                    labelCol={{span: 3}} wrapperCol={{span: 15}}>
                    {getFieldDecorator('requirementDescription', {initialValue: this.state.data.requirementDescription})(
                      <TextArea rows={6} disabled />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
        <div className='container-item'>
          <div className={styles.OutsourcingDemandApproval__title} >
            流程信息
          </div>
          <div className='content'>
            <Form layout='inline' style={{marginLeft: '15%'}}>
              <Row style={{marginBottom: 30}}>
                {
                  this.state.steps.length > 0
                    ? <Col span={19}>
                      <Steps current={current}>
                        {this.state.steps.map(item => <Step key={item.title} title={item.title} description={item.content} />)}
                      </Steps>
                    </Col>
                    : <Col span={5} offset={8}><label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;暂无流程信息</label></Col>
                }
              </Row>
            </Form>
          </div>
        </div>
        <div className='container-item'>
          <div className={styles.OutsourcingDemandApproval__title} >
            报名列表
          </div>
          <div className='content'>
            <Form layout='inline' style={{marginLeft: '15%'}}>
              <Row style={{marginBottom: 30}}>
                <Col span={19}>
                  <Table
                    columns={this.SignColumns}
                    dataSource={this.state.signData}
                    rowKey='id'
                    onRow={(record) => {
                      return {
                        onDoubleClick: (e) => { this.handleLinkToAdvisor(e, record.id) }
                      }
                    }}
                  />
                </Col>
              </Row>
            </Form>
          </div>
        </div>
        <div className='container-item'>
          <div className={styles.OutsourcingDemandApproval__title} >
            审批记录
          </div>
          <div className='content'>
            <Form layout='inline' style={{marginLeft: '15%'}}>
              <Row style={{marginBottom: 30}}>
                <Col span={19}>
                  <Table columns={this.columns} dataSource={this.state.info} rowKey='createdBy' />
                </Col>
              </Row>
              <Row style={{marginBottom: 30}}>
                {this.state.enterState == 0
                  ? <Col span={30}>
                    <FormItem label='审批意见' style={{width: '100%'}}
                      labelCol={{span: 2}} wrapperCol={{span: 17}}>
                      {getFieldDecorator('requirementDescription', {initialValue: ''})(
                        <TextArea rows={6} />
                      )}
                    </FormItem>
                  </Col>
                  : <Col />
                }
              </Row>
              <Row>
                {this.state.enterState == 0
                  ? <Col span={5} offset={7}>
                    <FormItem>
                      <Button type='primary' id='btnPass' onClick={this.handleSubmitPass}>通过</Button>
                    </FormItem>
                  </Col>
                  : <Col />
                }
                {this.state.enterState == 0
                  ? <Col span={5}>
                    <FormItem>
                      <Button type='primary' id='btnRefuse' onClick={this.handleSubmitRefuse}>拒绝</Button>
                    </FormItem>
                  </Col>
                  : <Col />
                }
              </Row>
            </Form>
          </div>
        </div>
      </div>
    )
  }
}

export default OutsourcingDemandApproval
