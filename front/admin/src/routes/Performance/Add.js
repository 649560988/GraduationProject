// 业绩管理 - 添加项目

import React from 'react'
import { Form, Select, Input, Button, DatePicker, message, TreeSelect } from 'antd'
import TableLayout from '../../layouts/TableLayout'
import axios from 'axios'

const FormItem = Form.Item
const Option = Select.Option

@Form.create()
export default class Performance extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      startValue: null,
      endValue: null,
      optionItems: [],
      domainList: [],
      treeData: [],
    }
  }

  // 表单提交
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (values.objectStartDate && values.objectEndDate) {
        values.objectStartDate = values.objectStartDate.format('YYYY-MM-DD')
        values.objectEndDate = values.objectEndDate.format('YYYY-MM-DD')
      }
      // console.log('Received values of form: ', values)
      if (err) {
        return false
      } else {
        console.log('Received values of form: ', values)
      }
      axios.post(`/omp-projectmanage/v1/project/create`, {
        ...values
      }).then(res => {
        if (res.data === true) {
          message.success('添加成功!')
          this.props.form.resetFields()
          setTimeout(() => { this.props.history.push('/project/performance') }, 2000)
        } else {
          message.error(res.data.message)
          return false
        }
      }).catch(err => {
        message.error('请求失败，请重试')
        console.log(err)
      })
    })
  }

  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue
    if (!startValue || !endValue) {
      return false
    }
    return startValue.valueOf() > endValue.valueOf()
  }

  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue
    if (!endValue || !startValue) {
      return false
    }
    return endValue.valueOf() <= startValue.valueOf()
  }

  onChange = (field, value) => {
    this.setState({
      [field]: value
    })
  }

  onEndChange = (value) => {
    this.onChange('endValue', value)
    console.log(value)
  }

  onStartChange = (value) => {
    this.onChange('startValue', value)
  }

  handleChange = (value) => {
    console.log(`selected ${value}`)
  }

  // 获取所属区域下拉框
  fetchDomainData = () => {
    return axios.get('/iam-ext/v1/domain/list')
  }

  // 获取项目类型下拉框
  fetchProjectTypeData = () => {
    return axios.get('/attr/v1/sources/queryBySourceName', { params: { sourceName: '项目类型' } })
  }

  // 获取部门树下拉框
  fetchTreeData = () => {
    return axios.get('/iam-ext/v1/departments/queryListByPidLoop/0')
  }

  // 遍历部门树
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

  componentDidMount () {
    const { optionItems } = this.state
    const { domainList } = this.state
    axios.all([this.fetchDomainData(), this.fetchProjectTypeData(), this.fetchTreeData()])
      .then(
        axios.spread((resDomain, resProjectType, resTree) => {
          const { sourceSubList } = resProjectType.data
          const { content } = resDomain.data
          const treeData = resTree.data 
          content.map(item => { domainList.push({ key: item.id, value: item.domainName }) })
          sourceSubList.map(item => { optionItems.push({ key: item.sourceSubCode, value: item.sourceSubName }) })
          this.setState({
            optionItems,
            domainList,
            treeData: this.handleDept(treeData)
          })
        })
      ).catch(err => {
        console.log(err)
        message.error('请求失败')
      })
  }

  render () {
    const { getFieldDecorator } = this.props.form

    return (
      <TableLayout
        title='添加项目'
        showBackBtn
        onBackBtnClick={() => this.props.history.goBack()}
      >
        <div>
          <Form style={{ width: '100%', maxWidth: 440 }} onSubmit={this.handleSubmit}>
            <FormItem
              label='项目名称'
            >
              {getFieldDecorator('projectName', {
                rules: [{
                  required: true, message: '请输入项目名称'
                }, {
                  max: 50, message: '项目名称最大长度为50'
                }]
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              label='项目编号'
            >
              {getFieldDecorator('projectNo', {
                rules: [{
                  type: '', message: ''
                }, {
                  required: true, message: '请输入项目编号'
                }, {
                  max: 50, message: '项目编号最大长度为50'
                }]
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              label='所属区域'
            >
              {getFieldDecorator('domainId', {
                rules: [{
                  required: true, message: '请选择所属区域'
                }]
              })(
                <Select>
                  {this.state.domainList.map(item => (<Option key={item.key} value={item.key}>{item.value}</Option>))}
                </Select>
              )}
            </FormItem>
            <FormItem
              label='部门'
            >
              {getFieldDecorator('deptName', {
                rules: [{
                  required: true, message: '请选择部门'
                }]
              })(
                <TreeSelect
                  style={{ width: 440 }}
                  value={this.state.value}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={this.state.treeData}
                  placeholder="请选择部门"
                  treeDefaultExpandAll
                  onChange={this.onChange} 
                />
              )}
            </FormItem>
            <FormItem
              label='项目经理'
            >
              {getFieldDecorator('projectManager', {
                rules: [{
                  type: '', message: ''
                }, {
                  required: true, message: '请输入项目经理'
                }, {
                  max: 10, message: '项目经理最大长度为10'
                }]
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              label='项目类型'
            >
              {getFieldDecorator('projectTypeId', {
                rules: [{
                  required: true, message: '请选择项目类型'
                }]
              })(
                <Select onChange={this.handleChange}>
                  {this.state.optionItems.map(item => (<Option key={item.key} value={item.key}>{item.value}</Option>))}
                </Select>
              )}
            </FormItem>
            <FormItem
              label='合同金额'
            >
              {getFieldDecorator('contractAmount', {
                rules: [{ pattern: /^-?\d+\.?\d{0,2}$/, message: '请输入正确的格式' }]
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              label='开始日期' required
            >
              {getFieldDecorator('objectStartDate', {
                rules: [{
                  required: true, message: '请选择开始日期'
                }]
              })(
                <DatePicker disabledDate={this.disabledStartDate} onChange={this.onStartChange} style={{ width: '440px' }} format='YYYY-MM-DD' />
              )}
            </FormItem>
            <FormItem
              label='结束日期'
            >
              {getFieldDecorator('objectEndDate', {
                rules: [{
                  required: true, message: '请选择结束日期'
                }]
              })(
                <DatePicker disabledDate={this.disabledEndDate} onChange={this.onEndChange} style={{ width: '440px' }} format='YYYY-MM-DD' />
              )}
            </FormItem>
            <FormItem label=''>
              <Button type='primary' htmlType='submit'>保存</Button>
              <Button style={{marginLeft: 20}} onClick={() => this.props.history.goBack()}>取消</Button>
            </FormItem>
          </Form>
        </div>
      </TableLayout>
    )
  }
}
