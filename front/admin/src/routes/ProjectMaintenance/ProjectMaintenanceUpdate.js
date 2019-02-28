import React from 'react'
import { Form, Select, Input, Button, DatePicker, message, TreeSelect } from 'antd'
import moment from 'moment'
import TableLayout from '../../layouts/TableLayout'
import axios from 'axios'
import styles from './project.less'
import { connect } from 'dva/index'

const FormItem = Form.Item
const Option = Select.Option

@Form.create()
@connect(({ user }) => ({
  user: user
}))
class ProjectMaintenanceUpdate extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      //根据传进来的参数确定标题名称
      oprFlag: this.props.match.params.opr,
      optionItems: [],
      domainList: [],
      updateInitData: {},
      /**
       * 判断projectNo这个字段是否可以编辑
       * false : 可以编辑
       * true : 不可编辑
       */
      isEdit: false,
      sourceSubList: [],
      allDept: [],
      projectTypeId: 0,
      domainId: 0,
      startDate: '',
      endDate: '',
      dateFlag: 0,
      projectManagerList: [],
      selectedManagerId: 0,
      selectedManagerRealName: 0,
      managerJobNumber: '',
      deptId: undefined
    }


  }

  /**
   * 修改页面根据id带入数据
   */
  initUpdate = (id, sourceSubList) => {
    axios({
      method: 'get',
      url: '/omp-projectmanage/v1/project?id=' + id,
    }).then((res) => {
      this.getDatasById(res.data, sourceSubList)
    }).catch((err) => {
      console.log(err)
    })
  }

  /**
   * 根据区域id，项目类型code获取区域名称，项目类型
   */
  getDatasById = (data, sourceSubList) => {
    let projectInfo = {}
    // console.log(data)
    projectInfo.projectName = data.projectName
    projectInfo.projectNo = data.projectNo
    projectInfo.deptName = data.deptName
    projectInfo.projectManager = data.projectManager
    projectInfo.projectManagerId = data.projectManagerId
    projectInfo.contractAmount = data.contractAmount
    projectInfo.creationDate = data.creationDate
    projectInfo.lastUpdateDate = data.lastUpdateDate
    projectInfo.objectStartDate = data.objectStartDate
    projectInfo.objectEndDate = data.objectEndDate
    for (let i = 0; i < sourceSubList.length; i++) {
      if (data.projectTypeId === sourceSubList[i].sourceSubCode) {
        projectInfo.projectType = sourceSubList[i].sourceSubName
      }
    }
    axios({
      method: 'get',
      url: '/iam-ext/v1/domain/' + data.domainId
    }).then((res) => {
      projectInfo.domainName = res.data.domainName
      if (!(data.projectManagerId)) {
        this.setState({
          updateInitData: projectInfo,
          projectTypeId: data.projectTypeId,
          domainId: data.domainId,
          selectedManagerId: data.projectManagerId,
          selectedManagerRealName: data.projectManager,
          deptId: data.deptId === null ? undefined : data.deptId
        })
      } else {
        this.selectData(data.projectManagerId, projectInfo, data)
      }
    }).catch((err) => {
      console.log(err)
    })
  }

  /**
  * 根据经理的id去获取经理的所有信息，主要是获取工号
  */
  selectData = (projectManagerId, projectInfo, data) => {
    let url = '/iam-ext/v1/userext/' + projectManagerId
    axios({
      method: 'get',
      url: url,
      data: {}
    }).then((res) => {
      // console.log(res.data)
      this.setState({
        updateInitData: projectInfo,
        projectTypeId: data.projectTypeId,
        domainId: data.domainId,
        selectedManagerId: data.projectManagerId,
        selectedManagerRealName: data.projectManager,
        managerJobNumber: res.data.userExtDO.jobNumber
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
    this.linkToChange(`/project/maintenance`)
  }

  /**
  * 路径跳转
  */
  linkToChange = url => {
    const { history } = this.props
    history.push(url)
  };

  /**
   * 新增项目
   */
  addProject = (values) => {
    values.deptId = this.state.deptId
    axios.post(`/omp-projectmanage/v1/project/create`, {
      ...values
    }).then(res => {
      if (res.data === true) {
        message.success('添加成功!')
        this.props.form.resetFields()
        this.props.history.push('/project/maintenance')
        // setTimeout(() => { this.props.history.push('/project/maintenance') }, 2000)
      } else {
        message.error(res.data.message)
        return false
      }
    }).catch(err => {
      message.error('请求失败，请重试')
      console.log(err)
    })
  }

  /**
   * 修改项目
   */
  updateProject = (values, projectNo) => {
    values.projectTypeId = this.state.projectTypeId
    values.domainId = this.state.domainId
    values.deptId = this.state.deptId
    axios.put(`/omp-projectmanage/v1/project/` + this.state.oprFlag + `/` + projectNo, {
      ...values
    }).then(res => {
      if (res.data.failed === true) {
        message.error(res.data.message)
        return false
      } else {
        message.success('修改成功!')
        this.props.form.resetFields()
        this.props.history.push('/project/maintenance')
        // setTimeout(() => { this.props.history.push('/project/maintenance') }, 2000)
      }
    }).catch(err => {
      message.error('请求失败，请重试')
      console.log(err)
    })
  }

  /**
   * Form表单提交
   */
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      // console.log('Received values of form: ', values)
      if (values.objectStartDate && values.objectEndDate) {
        values.objectStartDate = values.objectStartDate.format('YYYY-MM-DD 00:00:00')
        values.objectEndDate = values.objectEndDate.format('YYYY-MM-DD 23:59:59')
      }
      if (err) {
        return false
      } else {
        if (this.state.dateFlag === 1) {
          message.error('开始日期不得大于结束日期')
          return false
        }
        // console.log('Received values of form: ', values)
        values.projectManagerId = Number(this.state.selectedManagerId)
        values.projectManager = this.state.selectedManagerRealName
        values.contractAmount = Number(values.contractAmount)
      }
      // console.log('Received values of form: ', values)

      this.state.oprFlag === 'Add' ? this.addProject(values) : this.updateProject(values, this.state.updateInitData.projectNo)
    })
  }

  // 获取所属区域下拉框
  fetchDomainData = () => {
    return axios.get('/iam-ext/v1/domain/list')
  }

  // 获取项目类型下拉框
  fetchProjectTypeData = () => {
    return axios.get('/attr/v1/sources/queryBySourceName', { params: { sourceName: '项目类型' } })
  }

  componentDidMount() {
    const { optionItems } = this.state
    const { domainList } = this.state
    this.getAllDept()
    this.selectProjectManager({ realName: '' })
    axios.all([this.fetchDomainData(), this.fetchProjectTypeData()])
      .then(
        axios.spread((resDomain, resProjectType) => {
          const { sourceSubList } = resProjectType.data
          const { content } = resDomain.data
          content.map(item => { domainList.push({ key: item.id, value: item.domainName }) })
          sourceSubList.map(item => { optionItems.push({ key: item.sourceSubCode, value: item.sourceSubName }) })
          this.setState({
            optionItems,
            domainList,
            sourceSubList
          })
          if (this.state.oprFlag !== 'Add') {
            this.state.isEdit = true
            this.initUpdate(this.state.oprFlag, sourceSubList)
          }
        })
      ).catch(err => {
        console.log(err)
        message.error('请求失败')
      })
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

  handleTreeChange = (value,label,extra) => {
    this.setState({ 
      deptId:extra.triggerNode.props.eventKey
    });
  }

  /**
   * 获取项目类型id
   */
  handleChange = (value) => {
    this.setState({
      projectTypeId: value
    })
  }

  /**
   * 获取区域id
   */
  handleDomainChange = (value) => {
    this.setState({
      domainId: value
    })
  }

  /**
   * 选取的经理的id
   */
  managerChoose = (value, obj) => {
    this.setState({
      selectedManagerId: obj.key,
      selectedManagerRealName: obj.props.title
    }, () => {
      this.selectProjectManager({ realName: '' })
    })
  }

  /**
   * 当select失焦时(经理选择面板关闭)重新筛选所有经理
   */
  handleOnBlur = () => {
    this.selectProjectManager({ realName: '' })
  }

  /**
   * 获取筛选经理的内容
   */
  getProjrctManagerContent = (value) => {
    this.selectProjectManager({ realName: value })
  }

  /**
   * 分页获取登录人的所在组织下的所有用户
   * 模糊匹配
   */
  selectProjectManager = (searchContent) => {
    // console.log(searchContent)
    let projectManager = []
    let option = ''
    let url = '/iam-ext/v1/organizations/organizationAdmin/' + this.props.user.currentUser.organizationId + '?page=0&size=40'
    axios({
      method: 'post',
      url: url,
      data: searchContent
    }).then((res) => {
      res.data.content.map((item) => {
        option = <Option key={item.id} title={item.realName} value={item.id}><div style={{ display: 'inline', float: 'left', marginRight: '20px' }}>工号：{item.jobNumber}</div><div style={{ width: '50%', display: 'inline', float: 'right' }}>真实姓名：{item.realName}</div></Option>
        projectManager.push(option)
      })
      this.setState({
        projectManagerList: projectManager
      })
    }).catch((err) => {
      console.log(err)
    })
  };

  /**
   * 获取项目开始日期并于结束日期比较
   * 0:正确
   * 1:错误
   */
  handleStarDate = (dateMoment, dateString) => {
    let flag = 0
    if (moment(dateString, 'YYYY-MM-DD') > moment(this.state.endDate, 'YYYY-MM-DD')) {
      message.error('开始日期不得大于结束日期')
      flag = 1
    } else {
      flag = 0
    }
    this.setState({
      startDate: dateString,
      dateFlag: flag
    })
  }

  /**
   * 获取项目结束日期并与开始日期比较
   * 0:正确
   * 1:错误
   */
  handleEndDate = (dateMoment, dateString) => {
    let flag = 0
    if (moment(dateString, 'YYYY-MM-DD') < moment(this.state.startDate, 'YYYY-MM-DD')) {
      message.error('开始日期不得大于结束日期')
      flag = 1
    } else {
      flag = 0
    }
    this.setState({
      endDate: dateString,
      dateFlag: flag
    })
  }


  render() {
    const { getFieldDecorator } = this.props.form
    //设置标题
    let title = ''
    this.state.oprFlag === 'Add'
      ? title = '添加项目'
      : title = '修改项目'
    return (
      <TableLayout title={title} showBackBtn onBackBtnClick={this.handleClickBackBtn}>
        <div>
          <Form style={{ width: '100%', maxWidth: 440 }} onSubmit={this.handleSubmit}>
            <FormItem
              label='项目名称'
            >
              {getFieldDecorator('projectName', {
                initialValue: this.state.updateInitData.projectName,
                rules: [{
                  required: true, message: '请输入项目名称'
                }, {
                  max: 50, message: '项目名称最大长度为50'
                }]
              })(
                <Input placeholder={'请输入项目名称'} />
              )}
            </FormItem>
            <FormItem
              label='项目编号'
            >
              {getFieldDecorator('projectNo', {
                initialValue: this.state.updateInitData.projectNo,
                rules: [{
                  type: '', message: ''
                }, {
                  required: true, message: '请输入项目编号'
                }, {
                  max: 50, message: '项目编号最大长度为50'
                }]
              })(
                <Input placeholder={'请输入项目编号'} disabled={this.state.isEdit} />
              )}
            </FormItem>
            <FormItem
              label='所属区域'
            >
              {getFieldDecorator('domainId', {
                initialValue: this.state.updateInitData.domainName,
                rules: [{
                  required: true, message: '请选择所属区域'
                }]
              })(
                <Select placeholder={'请选择所属区域'} onChange={this.handleDomainChange}>
                  {this.state.domainList.map(item => (<Option key={item.key} value={item.key}>{item.value}</Option>))}
                </Select>
              )}
            </FormItem>
            <FormItem
              label='部门'
            >
              {getFieldDecorator('deptName', {
                initialValue: this.state.updateInitData.deptName,
                rules: [{
                  required: true, message: '请输入部门'
                }, {
                  max: 20, message: '部门最大长度为20'
                }]
              })(
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
            <FormItem
              label='项目经理'
            >
              {getFieldDecorator('projectManager', this.state.selectedManagerId === 0 ?
                {
                  rules: [{ required: true, message: '请选择项目经理' }]
                } : {
                  initialValue: '工号:' + this.state.managerJobNumber + '　　' + '真实姓名:' + this.state.updateInitData.projectManager,
                  rules: [{ required: true, message: '请选择项目经理' }]}
                )(
                  <Select
                    className={styles.managerSelect}
                    placeholder={'请选择输入项目经理姓名进行筛选'}
                    showSearch
                    onSearch={(value) => this.getProjrctManagerContent(value)}
                    onChange={this.managerChoose}
                    filterOption={false}
                    defaultActiveFirstOption={false}
                    onBlur={this.handleOnBlur}
                  >
                    {this.state.projectManagerList}
                  </Select>
                )}
            </FormItem>
            <FormItem
              label='项目类型'
            >
              {getFieldDecorator('projectTypeId', {
                initialValue: this.state.updateInitData.projectType,
                rules: [{
                  required: true, message: '请选择项目类型'
                }]
              })(
                <Select placeholder={'请选择项目类型'} onChange={this.handleChange}>
                  {this.state.optionItems.map(item => (<Option key={item.key} value={item.key}>{item.value}</Option>))}
                </Select>
              )}
            </FormItem>
            <FormItem
              label='合同金额'
            >
              {getFieldDecorator('contractAmount', {
                initialValue: this.state.updateInitData.contractAmount,
                rules: [{ pattern: /^-?\d+\.?\d{0,2}$/, message: '请输入正确的格式' }]
              })(
                <Input placeholder={'请输入合同金额'} />
              )}
            </FormItem>
            <FormItem
              label='开始日期' required
            >
              {getFieldDecorator('objectStartDate', this.state.updateInitData.objectStartDate ?
                {
                  initialValue: moment(this.state.updateInitData.objectStartDate, 'YYYY-MM-DD'),
                  rules: [{
                    required: true, message: '请选择开始日期'
                  }]
                } : {
                  rules: [{
                    required: true, message: '请选择开始日期'
                  }]
                })(<DatePicker onChange={this.handleStarDate} style={{ width: '440px' }} format='YYYY-MM-DD' />
                )}
            </FormItem>
            <FormItem
              label='结束日期'
            >
              {getFieldDecorator('objectEndDate', this.state.updateInitData.objectEndDate ?
                {
                  initialValue: moment(this.state.updateInitData.objectEndDate, 'YYYY-MM-DD'),
                  rules: [{
                    required: true, message: '请选择结束日期'
                  }]
                } : {
                  rules: [{
                    required: true, message: '请选择结束日期'
                  }]
                })(<DatePicker style={{ width: '440px' }} onChange={this.handleEndDate} format='YYYY-MM-DD' />
                )}
            </FormItem>
            <FormItem label=''>
              <Button type='primary' htmlType='submit'>保存</Button>
              <Button style={{ marginLeft: 20 }} onClick={() => this.props.history.goBack()}>取消</Button>
            </FormItem>
          </Form>
        </div>

      </TableLayout>
    );
  }
}

export default ProjectMaintenanceUpdate