import React, {Component} from 'react'
import { Form, Select, Input, Button, message } from 'antd'
import styles from './MenuManage.less'
import PermissionTable from './PermisssionTable'
import PermissionModal from './PermissionModal'
import axios from 'axios'
import TableLayout from '../../layouts/TableLayout'

const FormItem = Form.Item
const {Option, OptGroup} = Select

@Form.create()
class MenuAddForm extends Component {
  constructor (props) {
    super(props)
    this.parentId = this.props.match.params.parentId
    this.state = {
      parentSelectDisabled: false,
      routeInputDisabled: true,
      parentSelectDataSource: [],
      parentSelectDisplayDataSource: [],
      type: ['root', 'dir', 'menu'],
      iconDataSource: [],
      permissionModalVisible: false,
      permissionModalDataSource: [],
      permissionTableDataSource: [],
      permissionTableSelectedRowKeys: []
    }
  }

  // 获取所有可以作为父级菜单的记录集合
  fetchParentMenus = () => {
    return axios.get(`/iam-ext/v1/menus/getParentMenuInfo`)
  }

  // 获取所有权限记录
  fetchAllPermissions = () => {
    return axios.get(`/iam-ext/v1/permissions/getAllPermissions`)
  }

  componentDidMount () {
    const _this = this
    axios.all([this.fetchParentMenus(), this.fetchAllPermissions()])
      .then(axios.spread(function (pms, perms) {
        // 两个请求现在都执行完成
        const parentSelectDataSource = pms.data
        const permissionModalDataSource = perms.data

        if (_this.parentId) {
          const parentItem = parentSelectDataSource.find(item => _this.parentId === item.id.toString())
          _this.props.form.setFieldsValue({parentId: parentItem.name})
          let type = _this.state.type
          if (parentItem.type === 'root') {
            type = type.filter(item => item !== 'root')
          }
          if (parentItem.type === 'dir') {
            type = type.filter(item => item === 'menu')
          }
          _this.setState({ parentSelectDisabled: true, type, permissionModalDataSource, parentSelectDataSource })
        } else {
          _this.setState({
            permissionModalDataSource,
            parentSelectDataSource,
            parentSelectDisplayDataSource: parentSelectDataSource
          })
        }
      })).catch(err => {
        console.log(err)
        message.error('请求失败')
      })
  }

  // 创建按钮点击事件
  handleCreateMenu = (e) => {
    e.preventDefault()
    // console.log(this.props.form.getFieldValue('permissionList'));
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (this.parentId) {
          values.parentId = parseInt(this.parentId)
        }
        if (!values.parentId) {
          values.parentId = 0
        }
        values.permissionList = values.permissionList.selectedRowKeys
        const permissions = []
        values.permissionList.map(item => {
          permissions.push({
            code: item
          })
        })
        values.permissions = permissions
        // console.log('Received values of form: ', values);

        axios.post(`/iam-ext/v1/menus/createdMenuObject`, {
          name: values.name,
          code: values.code,
          type: values.type,
          parentId: values.parentId,
          route: values.route,
          sort: parseInt(values.sort),
          icon: values.icon,
          level: 'site',
          isDefault: 0,
          permissions: values.permissions
        }).then(res => {
          if (res.data === true) {
            message.success('添加成功!')
            this.props.form.resetFields()
            if (this.parentId) {
              const parentItem = this.state.parentSelectDataSource.find(item => this.parentId === item.id.toString())
              this.props.form.setFieldsValue({parentId: parentItem.name})
            }
          } else {
            message.error(res.data)
          }
        }).catch(err => {
          message.error('请求失败，请重试')
          console.log(err)
        })
      }
    })
  }

  // 菜单名称唯一性验证
  handleNameUniqueCheck = (rule, value, callback) => {
    if (!value) {
      callback()
    } else {
      axios.get(`/iam-ext/v1/menus/nameCheck`, {
        params: {
          name: value
        }
      }).then(res => {
        if (res.data === false) {
          // callback('菜单名称已存在')
        } else {
          callback()
        }
      }).catch(err => {
        console.log('菜单名称校验失败', err)
      })
    }
  }

  // 菜单标识唯一性验证
  handleCodeUniqueCheck = (rule, value, callback) => {
    if (!value) {
      callback()
    } else {
      axios.get(`/iam-ext/v1/menus/codeCheck`, {
        params: {
          code: value
        }
      }).then(res => {
        if (res.data === false) {
          // callback('菜单标识已存在')
        } else {
          callback()
        }
      }).catch(err => {
        console.log('菜单标识校验失败', err)
      })
    }
  }

  checkParentMenu = (rule, value, callback) => {
    if (!value && this.props.form.getFieldValue('type') !== 'root') {
      // callback('父级菜单不能为空')
    }
    callback()
  }

  handleRouteCheck =(rule, value, callback) => {
    const type = this.props.form.getFieldValue('type')
    if (type === 'menu' && !value) {
      // callback('menu类型菜单的路由不能为空')
    }
    callback()
  }

  // 菜单类型改变事件
  handleTypeSelectChange = (value) => {
    const { parentSelectDataSource } = this.state

    if (value === 'menu') {
      this.setState({routeInputDisabled: false})
    } else {
      this.setState({routeInputDisabled: true})
    }
    this.props.form.setFieldsValue({'route': undefined})

    if (this.parentId) {
      return
    }
    this.props.form.setFieldsValue({'parentId': undefined})
    if (value === 'root') {
      this.setState({parentSelectDisabled: true})
    } else {
      let parentSelectDisplayDataSource = []
      if (value === 'dir') {
        parentSelectDisplayDataSource = parentSelectDataSource.filter(item => item.type === 'root')
      } else {
        parentSelectDisplayDataSource = parentSelectDataSource
      }
      this.setState({parentSelectDisabled: false, parentSelectDisplayDataSource})
    }
  }

  // 确认添加权限按钮
  handleAddPermission = (selectedRowKeys) => {
    const { permissionModalDataSource } = this.state
    const permissionTableDataSource = permissionModalDataSource.filter(item => selectedRowKeys.indexOf(item.code) !== -1)
    this.setState({
      permissionTableDataSource,
      permissionTableSelectedRowKeys: selectedRowKeys,
      permissionModalVisible: false})
  }

  // 显示添加权限模态框
  handleShowModal =() => {
    this.setState({permissionModalVisible: true})
  }

  // 隐藏添加权限模态框
  handleHideModal = () => {
    this.setState({permissionModalVisible: false})
  }

  // 处理已分配权限列表 复选框改变事件
  handleSelectedKeysChange = (selectedRowKeys) => {
    this.handleAddPermission(selectedRowKeys)
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { permissionTableDataSource, permissionTableSelectedRowKeys } = this.state
    const formItemLayout = {
      labelCol: { xs: { span: 24 }, sm: { span: 3 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 12 } }
    }
    return (
      <TableLayout
        showBackBtn
        onBackBtnClick={() => window.history.back()}
        title={<h4 style={{marginBottom: 0}}>
      添加菜单项</h4>}>

        <div>
          <Form className={styles.customLabel}>
            <FormItem label='菜单名称' {...formItemLayout}>
              {getFieldDecorator(`name`, {
                rules: [
                  { required: true, message: '菜单名称不能为空' },
                  {max: 128, message: '菜单名称长度超过限制'},
                  {validator: this.handleNameUniqueCheck}
                ]
              })(
                <Input placeholder='菜单名称（唯一）' autoComplete='off' />
              )}
            </FormItem>
            <FormItem label='菜单标识' {...formItemLayout}>
              {getFieldDecorator(`code`, {
                rules: [
                  { required: true, message: '菜单标识不能为空' },
                  {max: 128, message: '菜单标识长度超过限制'},
                  {pattern: /^[a-z]([-.a-z0-9]*[a-z0-9])$/,
                    message: '菜单标识只能包含小写字母、数字或符号 "-", ".",且以小写字母开头，不能以"-", "."结尾'},
                  {validator: this.handleCodeUniqueCheck}
                ]
              })(
                <Input placeholder='菜单标识（唯一）' autoComplete='off' />
              )}
            </FormItem>
            <FormItem label='菜单类型' {...formItemLayout}>
              {getFieldDecorator(`type`, {
                rules: [
                  { required: true, message: '菜单类型不能为空' }
                ]
              })(
                <Select placeholder='请选择' onChange={this.handleTypeSelectChange}>
                  {this.state.type.map(item => {
                    return (<Option key={item} value={item}>{item}</Option>)
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem label='父级菜单' {...formItemLayout}>
              {getFieldDecorator(`parentId`, {
                initialValue: this.parentId,
                rules: [
                  {validator: this.checkParentMenu}
                ]
              })(
                <Select placeholder='请选择' style={{width: '100%'}}
                  disabled={this.state.parentSelectDisabled} >
                  <OptGroup label='root 级别菜单'>
                    {this.state.parentSelectDisplayDataSource.map(item => {
                      if (item.type === 'root') {
                        return (
                          <Option key={item.id} value={item.id}>{item.name}</Option>
                        )
                      }
                    })}
                  </OptGroup>
                  <OptGroup label='dir 级别菜单'>
                    {this.state.parentSelectDisplayDataSource.map(item => {
                      if (item.type === 'dir') {
                        return (
                          <Option key={item.id} value={item.id}>{item.name}</Option>
                        )
                      }
                    })}
                  </OptGroup>
                </Select>
              )}
            </FormItem>
            <FormItem label='菜单路由' {...formItemLayout}>
              {getFieldDecorator(`route`, {
                rules: [
                  {max: 128, message: '菜单路由长度超过限制'},
                  {validator: this.handleRouteCheck}
                ]
              })(
                <Input placeholder='菜单对应的路由' autoComplete='off' disabled={this.state.routeInputDisabled} />
              )}
            </FormItem>
            <FormItem label='排序' {...formItemLayout}>
              {getFieldDecorator(`sort`, {
                rules: [
                  { required: true, message: '排序字段不能为空' },
                  { pattern: /^([1-9]\d*)$/, message: '排序字段必须为正整数' },
                  {max: 19, message: '排序字段长度超过限制'}
                ]
              })(
                <Input placeholder='显示优先级（正整数，数字越小，优先级越高）' autoComplete='off' />
              )}
            </FormItem>
            <FormItem label='图标' {...formItemLayout}>
              {getFieldDecorator(`icon`, {
              })(
                <Input placeholder='菜单图标' autoComplete='off' />
              )}
            </FormItem>
            <FormItem label='已分配权限' {...formItemLayout}>
              {getFieldDecorator('permissionList', {
                initialValue: { dataSource: permissionTableDataSource, selectedRowKeys: permissionTableSelectedRowKeys },
                rules: []
              })(<PermissionTable showAddModal={this.handleShowModal}
                handleSelectedKeysChange={this.handleSelectedKeysChange}
                dataSource={permissionTableDataSource}
                selectedRowKeys={permissionTableSelectedRowKeys} />)}
            </FormItem>
            <FormItem label=' ' colon={false} {...formItemLayout}>
              <Button type='primary' onClick={this.handleCreateMenu}>创建</Button>
              <Button style={{marginLeft: 20}} onClick={() => window.history.back()}>返回</Button>
            </FormItem>
          </Form>

          {this.state.permissionModalVisible &&
          <PermissionModal onOk={this.handleAddPermission} onCancel={this.handleHideModal}
            dataSource={this.state.permissionModalDataSource}
            selectedRowKeys={this.state.permissionTableSelectedRowKeys} />}
        </div>
      </TableLayout>
    )
  }
}

export default MenuAddForm
