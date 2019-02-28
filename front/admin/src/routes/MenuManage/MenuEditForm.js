import React, {Component} from 'react'
import { Form, Select, Input, Button, message } from 'antd'
import PermissionTable from './PermisssionTable'
import PermissionModal from './PermissionModal'
import styles from './MenuManage.less'
import axios from 'axios'
import { IconSelect } from 'handcz-react'
import TableLayout from '../../layouts/TableLayout'

const FormItem = Form.Item
const {Option, OptGroup} = Select

@Form.create()
class MenuEditForm extends Component {
  constructor (props) {
    super(props)
    this.id = this.props.match.params.id
    this.state = {
      editItem: undefined,
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

  // 获取待编辑的菜单的信息
  fetchItemInfo =() => {
    return axios.get(`/iam-ext/v1/menus/queryByIdWithPermissions/${this.id}`)
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
    axios.all([this.fetchParentMenus(), this.fetchAllPermissions(), this.fetchItemInfo()])
      .then(axios.spread(function (pms, perms, item) {
        // 三个请求现在都执行完成
        const parentSelectDataSource = pms.data
        const permissionModalDataSource = perms.data
        const editItem = item.data

        const permissionTableDataSource = editItem.permissions
        const permissionTableSelectedRowKeys = editItem.permissions.map(item => item.code)

        const routeInputDisabled = editItem.type !== 'menu'
        _this.setState({
          editItem,
          routeInputDisabled,
          permissionModalDataSource,
          parentSelectDataSource,
          parentSelectDisplayDataSource: parentSelectDataSource,
          permissionTableDataSource,
          permissionTableSelectedRowKeys
        }, () => {
          _this.handleTypeSelectChange(editItem.type)
        })
      })).catch(err => {
        console.log(err)
        message.error('请求失败')
      })
  }

  // 菜单名称唯一性验证
  handleNameUniqueCheck = (rule, value, callback) => {
    if (!value || value === this.state.editItem.name) {
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
    if (!value || value === this.state.editItem.code) {
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

  // 菜单类型改变事件
  handleTypeSelectChange = (value) => {
    const { parentSelectDataSource, editItem } = this.state
    let routeInputDisabled = true

    if (value !== editItem.type) {
      this.props.form.setFieldsValue({'parentId': undefined, 'route': undefined})
    } else {
      this.props.form.setFieldsValue({'parentId': editItem.parentId, 'route': editItem.route})
    }
    if (value === 'root') {
      this.props.form.setFieldsValue({parentId: undefined})
      this.setState({parentSelectDisabled: true})
    } else {
      let parentSelectDisplayDataSource = []
      if (value === 'dir') {
        parentSelectDisplayDataSource = parentSelectDataSource.filter(item => item.type === 'root')
      } else {
        parentSelectDisplayDataSource = parentSelectDataSource
        routeInputDisabled = false
      }
      this.setState({parentSelectDisabled: false, parentSelectDisplayDataSource})
    }
    this.setState({routeInputDisabled})
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

  // 确认添加权限按钮
  handleAddPermission = (selectedRowKeys) => {
    const { permissionModalDataSource } = this.state
    const permissionTableDataSource = permissionModalDataSource.filter(item => selectedRowKeys.indexOf(item.code) !== -1)
    this.setState({
      permissionTableDataSource,
      permissionTableSelectedRowKeys: selectedRowKeys,
      permissionModalVisible: false})
  }

  // 确定按钮点击事件
  handleConfirmUpdate = (e) => {
    e.preventDefault()
    // console.log(this.props.form.getFieldValue('permissionList'));
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (!values.parentId) {
          values.parentId = 0
        }
        const permissions = []
        values.permissionList.selectedRowKeys.map(item => {
          permissions.push({
            code: item
          })
        })
        values.permissions = permissions
        values.sort = parseInt(values.sort)
        const { editItem } = this.state
        if (values.name === editItem.name && values.code === editItem.code &&
           values.type === editItem.type && values.parentId === editItem.parentId &&
           values.route === editItem.route && values.sort === editItem.sort &&
           values.icon === editItem.icon && this.hasSamePermissions(values, editItem)) {
          message.info('没有改动，无需更新')
          return
        }

        axios.post(`/iam-ext/v1/menus/updateMenuObject/${editItem.id}`, {
          name: values.name,
          code: values.code,
          type: values.type,
          parentId: values.parentId,
          route: values.route,
          sort: parseInt(values.sort),
          icon: values.icon,
          level: editItem.level,
          isDefault: editItem.isDefault,
          permissions: permissions
        }).then(res => {
          if (res.data === true) {
            message.success('更新成功!')
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

  hasSamePermissions = (values, editItem) => {
    if (values.permissions.length === editItem.permissions.length) {
      let codes = []
      values.permissions.map(item => {
        codes.push(item.code)
      })
      editItem.permissions.map(item => {
        if (codes.indexOf(item.code) === -1) {
          return false
        }
      })
      return true
    } else {
      return false
    }
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { permissionTableDataSource, permissionTableSelectedRowKeys, editItem } = this.state
    const formItemLayout = {
      labelCol: { xs: { span: 24 }, sm: { span: 3 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 12 } }
    }
    return (
      <TableLayout
        showBackBtn
        onBackBtnClick={() => window.history.back()}
        title={<h4 style={{marginBottom: 0}}>
      修改菜单项</h4>}>

        <div>
          <Form className={styles.customLabel}>
            <FormItem label='菜单名称' {...formItemLayout}>
              {getFieldDecorator(`name`, {
                initialValue: editItem && editItem.name,
                rules: [
                  {required: true, message: '菜单名称不能为空'},
                  {max: 128, message: '菜单名称长度超过限制'},
                  {validator: this.handleNameUniqueCheck}
                ]
              })(
                <Input placeholder='菜单名称（唯一）' autoComplete='off' />
              )}
            </FormItem>
            <FormItem label='菜单标识' {...formItemLayout}>
              {getFieldDecorator(`code`, {
                initialValue: editItem && editItem.code,
                rules: [
                  {required: true, message: '菜单标识不能为空'},
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
                initialValue: editItem && editItem.type,
                rules: [
                  {required: true, message: '菜单类型不能为空'}
                ]
              })(
                <Select placeholder='请选择' onChange={this.handleTypeSelectChange} disabled>
                  {this.state.type.map(item => {
                    return (<Option key={item} value={item}>{item}</Option>)
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem label='父级菜单' {...formItemLayout}>
              {getFieldDecorator(`parentId`, {
                initialValue: editItem && editItem.parentId !== 0 ? editItem.parentId : undefined,
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
                initialValue: editItem && editItem.route,
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
                initialValue: editItem && editItem.sort.toString(),
                rules: [
                  {required: true, message: '排序字段不能为空'},
                  {pattern: /^([1-9]\d*)$/, message: '排序字段必须为正整数'},
                  {max: 19, message: '排序字段长度超过限制'}
                ]
              })(
                <Input placeholder='显示优先级（正整数，数字越小，优先级越高）' autoComplete='off' />
              )}
            </FormItem>
            <FormItem label='图标' {...formItemLayout}>
              {getFieldDecorator(`icon`, {
                initialValue: editItem && editItem.icon
              })(
                <IconSelect placeholder='菜单图标' style={{ width: '100%' }} />
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
              <Button type='primary' onClick={this.handleConfirmUpdate}>确定</Button>
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

export default MenuEditForm
