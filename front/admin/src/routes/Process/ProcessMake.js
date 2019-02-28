import React, { Component } from 'react'
import {Dropdown, Icon, Steps, Menu, Select, Button, message, Input, Form} from 'antd'
import { connect } from 'dva'
import styles from './ProcessMake.css'
import axios from 'axios/index'

const demoString = '流程节点'
const FormItem = Form.Item
const Option = Select.Option
let currentUser

@Form.create()
@connect(({ user }) => ({
  user: user
}))
class ProcessMake extends Component {
  state = {
    stepsList: [],
    approverList: [],
    currentStep: 0,
    stepNum: 0,
    sourceList: []
  };

  componentDidMount () {
    // this.initDemoList();
    this.initNodeList(demoString)
    this.initSource()
    currentUser = this.props.user.currentUser
  }

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

  /**
   * 进度条的前进后退
   */
  next () {
    const currentStep = this.state.currentStep + 1
    this.setState({ currentStep })
  }

  prev () {
    const currentStep = this.state.currentStep - 1
    this.setState({ currentStep })
  }

  initDemoList=() => {
    const data = {page: 0, size: 10000}
    this.props.dispatch({
      type: 'process/fetch',
      payload: data
    })
  }
  /**
   * 设置节点  生成timeLine
   * @param demoString
   */
  initNodeList = (demoString) => {
    const nodeList = demoString.split(',')
    const stepsList = []
    for (const item of nodeList) {
      stepsList.push(
        {
          key: item,
          title: item,
          approver: ''
        }
      )
    }
    this.setState({
      stepsList: stepsList
    })
  };
  /**
   * 添加节点
   */
  addNode=() => {
    let { stepsList, currentStep } = this.state
    const length = stepsList.length + 1
    currentStep++
    stepsList.push({
      key: length,
      title: '',
      approver: ''
    })
    this.setState({stepsList, currentStep})
  }
  /**
   * 删除节点
   */
  delNode=() => {
    let { stepsList, currentStep } = this.state
    stepsList.splice(currentStep, 1)
    if (currentStep > stepsList.length - 1) {
      currentStep--
    }
    this.setState({stepsList, currentStep})
  }

  /**
   *更改节点描述
   * @param e
   */
  handleInputChange= e => {
    const {stepsList, currentStep} = this.state
    stepsList[currentStep].title = e.target.value
    this.setState({stepsList})
  }

  stringConnect=(a, b) => {
    if (a != '' && a != null) { return a + ',' + b } else { return b }
  }

  createProcess=(e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      console.log(values)
      let resourcesId = Number(values.resource)
      let exitEmpty = 1
      let organizationId = currentUser.organizationId
      if (!err) {
        let processSub = ''
        console.log(this.state.stepsList)
        for (let item of this.state.stepsList) {
          if (item.title === '' || item === null) {
            exitEmpty = 0
          }
          processSub = this.stringConnect(processSub, item.title)
        }
        if (currentUser.admin) {
          organizationId = 0
        }
        const params = {
          processSub: processSub,
          processName: this.state.processName,
          resourcesId: resourcesId,
          companyId: organizationId
        }
        if (exitEmpty) {
          axios({
            method: 'post',
            url: '/process/v1/ocms/process/processCreateAdmin',
            data: params
          }).then((res) => {
            message.success('创建成功', 2.5)
          }).catch((err) => {
            console.log(err)
          })
        } else {
          message.error('请先设置所有节点名称')
        }
      }
    })
  }

  onChangeProcessName = (e) => {
    this.setState({ processName: e.target.value })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { stepsList, currentStep, sourceList } = this.state
    return (
      <div>
        <Form layout='inline' onSubmit={this.createProcess}>
          <FormItem label='流程名称：'>
            {getFieldDecorator('processName', {rules: [{
              required: true, message: '请输入流程名称!'
            }]})
            (<Input
              placeholder='请输入流程名称'
              onChange={this.onChangeProcessName}
            />)
            }
          </FormItem>
          <FormItem label='资源类型'>
            {getFieldDecorator('resource', {
              rules: [{
                required: true, message: '请选择资源类型!'
              }]
            }
            )
            (<Select
              style={{width: '200px'}}
              showSearch
              style={{ width: 200 }}
              placeholder='选择资源类型'
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {sourceList ? sourceList.map(item => <Option key={item.sourceSubCode}>{item.sourceSubName}</Option>) : ''}
            </Select>)
            }
          </FormItem>
          <FormItem>
            <Button type='primary' htmlType='submit'>创建流程</Button>
          </FormItem>
        </Form>
        <div >
          <div style={{marginTop: 20}} >
            <div style={{display: 'inline-block', marginLeft: '20px'}}>
              {
                stepsList.length > 1 && <Button type='primary' onClick={() => this.delNode()}>删除节点</Button>
              }
              <Button type='primary' style={{marginLeft: '12px'}} onClick={() => this.addNode()}>添加节点</Button>
            </div>
            <div style={{float: 'right', marginRight: '20px'}}>
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
          </div>
          <div className={styles.nodeList}>
            <Steps current={currentStep}>
              {stepsList.map(item => <Steps.Step key={item.key} title={item.title} />)}</Steps>
          </div>
          {stepsList.length > 0 &&
          <div className={styles.content}>
            <div>
              <span>流程节点名称：</span>
              <input style={{width: '200px', marginLeft: 12}}
                value={stepsList[currentStep].title} onChange={this.handleInputChange} />
            </div>
          </div>}
        </div>
      </div>
    )
  }
}

export default (ProcessMake)
