import React, { Component } from 'react'
import {Dropdown, Icon, Steps, Menu, Select, Button, message, Input, Form} from 'antd'
import { connect } from 'dva'
import styles from './ProcessMake.css'
import axios from 'axios/index'

const Option = Select.Option
const FormItem = Form.Item

@connect(({ process: {list} }) => {
  if (list) {
    return (
      {
        content: list.content
      })
  }
}
)
class ProcessMake extends Component {
  state = {
    stepsList: [],
    approverList: [],
    currentStep: 0,
    stepNum: 0,
    SourceList: []
  };

  componentDidMount () {
    this.init(this.props.match.params.id)
    this.initSource()
    // this.initNodeList(demoString);
    // this.initApprover(owner);
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

  init=(id) => {
    axios({
      method: 'post',
      url: '/process/v1/ocms/process/searchById?id=' + id + '&companyId=' + this.props.match.params.companyId
    }).then((res) => {
      const data = res.data
      if (data) {
        const stepsList = []
        for (const item of data) {
          stepsList.push(
            {
              key: item.processSubId,
              title: item.processSubName,
              approver: ''
            }
          )
        }
        this.setState({
          data,
          processName: data[0].processName,
          stepsList: stepsList,
          resourcesId: data[0].resourcesId
        })
      }
    }).catch((err) => {
      console.log(err)
    })
  }

  /**
   * 添加节点
   */
  addNode=() => {
    const { stepsList } = this.state
    const length = stepsList.length + 1
    stepsList.push({
      key: length,
      title: length,
      approver: ''
    })
    this.setState({stepsList})
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

  setCurrent=(e) => {
    const { value } = e.target
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      if (value >= 1 && this.state.stepsList.length >= value || value === '') {
        if (value !== '') {
          this.setState({
            currentStep: value - 1
          })
        }
      } else {
        message.error('输入存在的节点号')
      }
    } else {
      message.error('输入数字')
    }
  }

  initSource=() => {
    const sourceList = []
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

  updateProcess=(e) => {
    e.preventDefault()
    let count = 0
    let exitEmpty = 1
    const updateData = []
    let resourcesId
    this.props.form.validateFields((err, values) => {
      if (!isNaN(values)) {
        resourcesId = Number(values.resource)
      } else {
        resourcesId = this.state.resourcesId
      }
      console.log(resourcesId)
      if (!err) {
        axios({
          method: 'put',
          url: '/process/v1/ocms/process/' + this.props.match.params.id,
          data: {processName: this.state.processName},
          resourcesId: resourcesId
        }).then((res) => {
        }).catch((err) => {
          console.log(err)
        })
        for (const item of this.state.stepsList) {
          if (item.title === '' || item.title === null) {
            exitEmpty = 0
          }
        }
        if (exitEmpty) {
          for (const item of this.state.stepsList) {
            const params = {
              id: item.key,
              processSubName: item.title,
              resourcesId: resourcesId
            }
            updateData.push(params)
          }
          axios({
            method: 'post',
            url: '/process/v1/ocms/process/updateSubName',
            data: updateData
          }).then((res) => {
            if (res.data) {
              count += 1
              if (count === this.state.stepsList.length) {
                message.success('更新成功', 1)
              }
              ;
            }
          }).catch((err) => {
            console.log(err)
            message.error('更新失败', 1)
          })
        } else {
          message.error('流程节点名称不能为空')
        }
      }
    })
  }

  onChangeProcessName = (e) => {
    this.setState({ processName: e.target.value })
  }

  handleMenuClick=(e) => {

  }

  render () {
    let sourceSubName
    const { getFieldDecorator } = this.props.form
    const { stepsList, currentStep, sourceList } = this.state
    if (sourceList) {
      for (const item of sourceList) {
        if (item.sourceSubCode === this.state.resourcesId) {
          sourceSubName = item.sourceSubName
        }
      }
    }
    console.log(sourceSubName)
    const {content} = this.props
    return (
      <div>
        <div className={styles.process_main}>
          <Form layout='inline' onSubmit={this.updateProcess}>
            <FormItem label='流程名称：'>
              {getFieldDecorator('processName',
                {initialValue: this.state.processName,
                  rules: [{
                    required: true, message: '请输入流程名称!'
                  }]})
              (<Input
                placeholder='请输入流程名称'
                onChange={this.onChangeProcessName}
              />)
              }
            </FormItem>
            <FormItem label='资源类型'>
              {getFieldDecorator('resource',
                {
                  initialValue: sourceSubName,
                  rules: [{
                    required: true, message: '请选择资源类型!'
                  }]
                }
              )
              (<Select
                showSearch
                style={{ width: 200 }}
                placeholder='选择资源类型'
                onChange={this.selectDemoType}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                { sourceList ? sourceList.map(item => <Option key={item.sourceSubCode} id={item.sourceSubCode}>{item.sourceSubName}</Option>) : ''}
              </Select>)
              }
            </FormItem>
            <FormItem>
              <Button type='primary' htmlType='submit'>更新流程</Button>
            </FormItem>
          </Form>
        </div>
        <div >
          <div >
            <div >
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
            <div style={{width: '130px', float: 'right'}}><span>直接跳转至:<Input style={{width: '40px', marginLeft: '12px'}}onChange={this.setCurrent} /></span></div>
          </div>
          <div className={styles.nodeList} style={{marginTop: '14px'}}>
            <Steps current={currentStep}>
              {stepsList ? stepsList.map(item => <Steps.Step key={item.key} title={item.title} />) : ''}</Steps>
          </div>
          {stepsList.length > 0 &&
          <div className={styles.content}>
            <div>
              <span>流程节点名称:</span>
              <input style={{width: '200px', marginLeft: '12px'}}
                value={stepsList[currentStep].title} onChange={this.handleInputChange} />
            </div>
          </div>}
        </div>
      </div>
    )
  }
}

export default Form.create()(ProcessMake)
