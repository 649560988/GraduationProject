import React, { Component } from 'react'
import {Popconfirm, Tooltip, Icon, Steps, Menu, Select, Button, message, Input} from 'antd'
import { connect } from 'dva'
import styles from './ProcessMake.css'
import axios from 'axios/index'
import {stringify} from 'qs'

const Option = Select.Option

@connect(({ process: {list}, user }) => {
  if (list && user) {
    return (
      {
        currentUser: user.currentUser,
        content: list.content
      })
  }
}
)
class ProcessMake extends Component {
  state = {
    stepsList: [],
    approverList: [],
    demoList: [],
    sourceList: [],
    currentStep: 0,
    stepNum: 0,
    exitApprover: false,
    buttonPower: true,
    processName: ''
  };

  componentDidMount () {
    this.initDemoList()
    // this.initNodeList(demoString);
    this.initApprover()
    this.initSource()
  }
  /**
   * 进度条的前进后退
   */
  next () {
    const currentStep = this.state.currentStep + 1
    this.setState({
      currentStep,
      currentApprover: this.state.stepsList[currentStep].approver
    })
  }

  prev () {
    const currentStep = this.state.currentStep - 1
    this.setState({
      currentStep,
      currentApprover: this.state.stepsList[currentStep].approver
    })
  }

  /**
   * 设置审批人员
   * @param owner
   * @returns {Array}
   */
  initApprover = () => {
    // role_id= 10  外协顾问角色id
    // 无全部查询  设置为2000
    let approverList = []
    axios({
      method: 'get',
      url: 'iam-ext/v1/users/getUsersWithoutAdminProperty/' + this.props.currentUser.organizationId,
      data: {}
    }).then((res) => {
      if (res.data) {
        console.log(res.data)
        for (const item of res.data) {
          item.value = item.realName + ' ' + item.loginName
          approverList.push(item)
        }
        console.log(approverList)
        this.setState({approverList})
      }
    })
  };
  /**
 * 初始化资源类型
 */
  initSource=() => {
    axios({
      method: 'get',
      url: 'attr/v1/source/subs/searchAll'
    }).then((res) => {
      this.setState({
        sourceList: res.data
      })
    }).catch((err) => {
      console.log(err)
    })
  }

  initDemoList=() => {
    const data = {page: 0, size: 10000}
    this.props.dispatch({
      type: 'process/fetch',
      payload: data
    })
  }

  setApprover=() => {
    console.log(this.state.companyId)
    let approverIdTrue = 1
    let processSubIds = []
    let processUserIds = []
    for (let item of this.state.stepsList) {
      if (item.approverId) {
        processSubIds.push(item.key)
        processUserIds.push(item.approverId)
      } else {
        approverIdTrue = 0
      }
    }
    if (approverIdTrue) {
      const params = {
        processSubIds: processSubIds,
        processUserIds: processUserIds,
        resourcesId: this.state.resourcesId,
        relationId: this.state.companyId
      }
      console.log(params)
      axios({
        method: 'post',
        url: 'process/v1/ocms/process/processOperatorSet',
        data: params
      }).then((res) => {
        if (res.data) {
          message.success('设置审批人成功', 1)
          this.setState({
            exitApprover: true,
            selectDisable: true
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    } else {
      message.error('请设置所有审批人', 1.5)
    }
  }

  updateApprover=() => {
    let approverIdTrue = 1
    let processSubIds = []
    let processUserIds = []
    for (let item of this.state.stepsList) {
      if (item.approverId) {
        processSubIds.push(item.key)
        processUserIds.push(item.approverId)
      } else {
        approverIdTrue = 0
      }
    }
    if (approverIdTrue) {
      const params = {
        processSubIds: processSubIds,
        processUserIds: processUserIds,
        resourcesId: this.state.resourcesId,
        relationId: this.state.companyId
      }
      axios({
        method: 'post',
        url: 'process/v1/ocms/process/updateByUserId?processSubId=' +
              processSubIds.toString() + '&operatorId=' +
              processUserIds.toString() + '&relationId=' +
              this.state.companyId + '&resourcesId=' + this.state.resourcesId
      }).then((res) => {
        if (res.data) {
          message.success('更新审批人成功', 1)
          this.setState({
            exitApprover: true,
            selectDisable: true
          })
        }
      }).catch((err) => {
        message.error('更新审批人失败', 1)
        console.log(err)
      })
    } else {
      message.error('请设置所有审批人', 1.5)
    }
  }

  selectApprover=(value, option) => {
    let stepsList = this.state.stepsList
    stepsList[this.state.currentStep].approver = value
    stepsList[this.state.currentStep].approverId = option.props.id
    const currentApprover = value
    this.setState({stepsList, currentApprover})
  }

  setCurrent=(e) => {
    const { value } = e.target
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      if (value >= 1 && this.state.stepsList.length >= value || value === '') {
        if (value !== '') {
          this.setState({
            currentStep: value - 1,
            currentApprover: this.state.stepsList[value - 1].approver
          })
        }
      } else {
        message.error('输入存在的节点号')
      }
    } else {
      message.error('输入数字')
    }
  }

  selectDemoType=(value) => {
    let exitApprover = false
    let currentApprover
    axios({
      method: 'post',
      url: '/process/v1/ocms/process/searchById?id=' + value + '&companyId=' + this.props.currentUser.organizationId
    }).then((res) => {
      const data = res.data
      console.log(data)
      if (data) {
        const stepsList = []
        for (const item of data) {
          if (item.operatorId != '' && item.operatorId != null) {
            exitApprover = true
          }
          let approver, description
          for (const operator of this.state.approverList) {
            if (operator.id === data[0].operatorId) {
              currentApprover = operator.value
            }
            if (operator.id === item.operatorId) {
              approver = operator.value
            }
          }
          stepsList.push(
            {
              key: item.processSubId,
              title: item.processSubName,
              approverId: item.operatorId,
              approver: approver
            }
          )
        }
        this.setState({
          data,
          exitApprover,
          processName: data[0].processName,
          stepsList: stepsList,
          currentApprover: currentApprover,
          resourcesId: data[0].resourcesId,
          companyId: this.props.currentUser.organizationId,
          buttonPower: false
        })
      }
    }).catch((err) => {
      console.log(err)
    })
  }
  selectSourceType=(value, option) => {
    axios({
      method: 'get',
      url: '/process/v1/ocms/process/search?companyId=' + this.props.currentUser.organizationId + '&resourcesId=' + value + '&isDel=0',
      data: {page: 0, size: 2000}
    }).then((res) => {
      if (res.data) {
        axios({
          method: 'get',
          url: '/process/v1/ocms/process/template?resourcesId=' + value + '&companyId=' + this.props.currentUser.organizationId
        }).then((res1) => {
          let selectDisable = false
          console.log(res1.data)
          if (res1.data.id) {
            this.selectDemoType(res1.data.id)
            selectDisable = true
          }
          this.setState({
            demoList: res.data.content,
            selectDisable: selectDisable,
            resourcesId: value
          })
        }).catch((err) => {
          message.error('获取模板失败 请检查网络连接', 1)
          console.log(err)
        })
      }
    }).catch((err) => {
      message.error('获取模板失败 请检查网络连接', 1)
      console.log(err)
    })
  }
/**
 * 流程的禁用
 */
handleDisableProcess=() => {
  axios({
    method: 'put',
    url: 'process/v1/ocms/process/disable?relationId=' + this.props.currentUser.organizationId + '&resourcesId=' + this.state.resourcesId
  }).then((res) => {
    if (res.data) {
      message.success('禁用成功', 1)
      this.setState({
        selectDisable: false
      })
    }
  }).catch((err) => {
    message.error('禁用失败', 1)
    console.log(err)
  })
}

render () {
  const { stepsList, currentStep, approverList, sourceList, demoList, processName} = this.state
  return (
    <div>
      <div className={styles.process_main}>
        <div style={{width: '80%', display: 'inline-block'}}>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder='选择资源类型'
            optionFilterProp='children'
            onChange={this.selectSourceType}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {sourceList ? sourceList.map(item => <Option key={item.sourceSubCode}>{item.sourceSubName}</Option>) : ''}
          </Select>
          <Select
            showSearch
            disabled={this.state.selectDisable}
            style={{ width: 200, marginLeft: 20}}
            value={processName}
            placeholder='选择样板'
            optionFilterProp='children'
            onChange={this.selectDemoType}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {demoList ? demoList.map(item => <Option key={item.id}>{item.processName}</Option>) : ''}
          </Select>
          {this.state.selectDisable
            ? <Popconfirm title='该流程将被禁用'
              onConfirm={(e) => { this.handleDisableProcess() }} okText='确定' cancelText='取消'>
              <Tooltip title='禁用当前使用流程才能选择新的流程！' >
                <Button style={{ marginLeft: '20px'}}
                  onClick={this.setSelectEnable}
                >
                禁用当前流程
                </Button>
              </Tooltip>
            </Popconfirm>
            : <Button style={{ marginLeft: '20px'}}
              onClick={this.setSelectEnable}
              disabled
            >
                禁用当前流程
            </Button>
          }
          {this.state.exitApprover
            ? <Button style={{ marginLeft: '20px'}}
              onClick={this.updateApprover}
              disabled={this.state.buttonPower}
            >
                更新审批人
            </Button>
            : <Button style={{ marginLeft: '20px'}}
              onClick={this.setApprover}
              disabled={this.state.buttonPower}
            >
                完成制定
            </Button>
          }
        </div>
      </div>
      <div >
        <div>{this.state.resourcesId != null
          ? <div style={{marginLeft: 17, marginBottom: 10}}>{this.state.selectDisable
            ? <span style={{color: 'rgb(24, 144, 255)'}}>当前使用流程： {processName}</span>
            : <span style={{color: 'rgb(24, 144, 255)'}}>当前无使用的流程</span>}</div>
          : ''
        }
        <div style={{marginRight: '20px', width: '30%', display: 'inline-block', marginLeft: 10}}>
            {
            currentStep > 0 &&
                (
                  <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                    上一节点
                  </Button>
                )
          }
            {
            currentStep < stepsList.length - 1 &&
            <Button type='primary' style={{ marginLeft: 8 }} onClick={() => this.next()}>下一节点</Button>
          }
          </div>
        {this.state.stepsList.length > 0
          ? <div style={{width: '130px', float: 'right'}}>
            <span>直接跳转至:<Input style={{width: '40px', marginLeft: '12px'}}onChange={this.setCurrent} /></span>
          </div>
          : ''}
        </div>
        <div className={styles.nodeList}>
          <Steps current={currentStep}>
            {stepsList.map(item => <Steps.Step key={item.key} title={item.title} description={item.approver ? item.approver.slice(0, item.approver.indexOf(' ')) : ''} />)}</Steps>
        </div>
        {stepsList.length > 0 &&
          <div className={styles.content}>
            <div >
              <span>审批人</span>
              <Select label='审批人:'
                value={this.state.currentApprover}
                showSearch
                placeholder='请选择审批人'
                allowClear style={{ width: 200, marginLeft: 12 }}
                optionFilterProp='children'
                onSelect={this.selectApprover}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {approverList ? approverList.map(item => <Option key={item.id} id={item.id} value={item.value}>{item.value}</Option>) : ''}
              </Select>
            </div>
          </div>}
      </div>
    </div>
  )
}
}

export default ProcessMake
