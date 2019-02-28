import React, {Component} from 'react'
import {Table, Select, Form, Row, Col, Input, Button, Tooltip, Icon, message} from 'antd'
import styles from './MenuManage.less'
import axios from 'axios'
// import { FormattedMessage } from 'react-intl'
import TableLayout from '../../layouts/TableLayout'

const FormItem = Form.Item
const Option = Select.Option
const InputGroup = Input.Group
const Search = Input.Search

@Form.create()
class MenuManageList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      keyword: 'name',
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      }
    }
  }

  fetch = (name, code) => {
    const { pagination } = this.state
    axios.post('/iam-ext/v1/menus/listByNameAndCode?page=' +
      (pagination.current - 1) + '&size=' + pagination.pageSize, {'name': name, 'code': code}).then(res => {
      const data = res.data.content
      const pagination = {
        current: res.data.number + 1,
        pageSize: res.data.size,
        total: res.data.totalElements
      }
      this.setState({data, pagination})
    }).catch(err => {
      console.log(err)
      message.error('请求失败')
    })
  }

  componentDidMount () {
    this.fetch()
  }

  // 处理表单提交
  handleSearch = (e) => {
    if (e && e.preventDefault) e.preventDefault()
    const {form} = this.props
    form.validateFields((err, values) => {
      if (err) return

      const pagination = {
        current: 1,
        pageSize: 10
      }
      this.setState({ pagination }, () => {
        this.fetch(values.name, values.code)
      })
    })
  }
   // 根据keyword选择查询
   handleChange = (value) => {
     value === 'name'
       ? this.setState({
         keyword: 'name'
       }) : this.setState({
         keyword: 'code'
       })
   }
  // 处理重置表单
  // handleResetSearchForm = () => {
  //   this.props.form.resetFields()
  //   const pagination = {
  //     current: 1,
  //     pageSize: 10
  //   }
  //   this.setState({pagination}, () => {
  //     this.fetch()
  //   })
  // }

  // 渲染查询表单
  renderSearchForm = () => {
    const {getFieldDecorator} = this.props.form

    return (
      <Form layout='inline'>
        {/* <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label='菜单名称'>
              {getFieldDecorator('name')(<Input placeholder='菜单名称' autoComplete='off' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label='菜单标识'>
              {getFieldDecorator('code')(<Input placeholder='菜单标识' autoComplete='off' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span>
              <Button type='primary' htmlType='submit'>查询</Button>
              <Button style={{marginLeft: 8}} onClick={this.handleResetSearchForm}>重置</Button>
            </span>
          </Col>
        </Row> */}
        <Row type='flex' style={{ justifyContent: 'space-between' }}>
          <Col />
          <Col>
            <Row type='flex'>
              <InputGroup compact>
                <Select defaultValue='name' onChange={this.handleChange}>
                  <Option value='name'>菜单名称</Option>
                  <Option value='code'>菜单标识</Option>
                </Select>
                <FormItem
                style={{marginRight: 10}}
                wrapperCol={{ span: 24 }}
              >
                {getFieldDecorator(this.state.keyword, {})(
                  <Search placeholder='请输入关键词' onSearch={this.handleSearch}  onPressEnter={this.handleSearch} style={{width:200}} />
                )}
              </FormItem>
              </InputGroup>
              
              {/* <FormItem
                style={{marginRight: 10}}
              >
                <Button
                  type='primary'
                  htmlType='submit'
                >搜索</Button>
              </FormItem> */}
            </Row>
          </Col>
        </Row>
      </Form>
    )
  }

  // 跳转到“菜单添加”页面
  handleAddMenu = () => {
    // this.props.history.push("/setting/menu-add");
    this.props.history.push('/setting/menu-manage-add')
  }

  // 渲染菜单列表
  renderMenuTable = () => {
    const columns = [
      {
        title: '序号',
        key: 'no',
        width: 50,
        align: 'center',
        render: (text, record, index) => index + 1
      },
      {
        title: '菜单名称',
        key: 'name',
        dataIndex: 'name',
        width: 120,
        render: (text, record, index) => (
          <Tooltip placement='bottom' title={record.name}> {record.name}</Tooltip>
        )
      },
      {
        title: '菜单标识',
        key: 'code',
        dataIndex: 'code',
        width: 200,
        render: (text, record, index) => (
          <Tooltip placement='bottom' title={record.code} overlayClassName={styles.longTooltip}>{record.code}</Tooltip>
        )
      },
      {
        title: '路由',
        key: 'route',
        dataIndex: 'route',
        width: 200,
        render: (text, record, index) => (
          <Tooltip placement='bottom' title={record.route} overlayClassName={styles.longTooltip}>{record.route}</Tooltip>
        )

      },
      {
        title: '图标',
        key: 'icon',
        dataIndex: 'icon',
        width: 60,
        align: 'center',
        render: (text, record, index) => (
          <Tooltip placement='bottom' title={record.icon}><Icon type={record.icon} /></Tooltip>)
      },
      {
        title: '父级菜单',
        key: 'parentName',
        dataIndex: 'parentName',
        width: 120,
        render: (text, record, index) => (
          <Tooltip placement='bottom' title={record.parentName}>{record.parentName || '无'}</Tooltip>
        )
      },
      {
        title: '类型',
        key: 'type',
        dataIndex: 'type',
        align: 'center',
        width: 60
      },
      {
        title: '排序',
        key: 'sort',
        dataIndex: 'sort',
        width: 60,
        align: 'center'
      },
      {
        title: '操作',
        key: 'action',
        width: 120,
        render: (text, record, index) => {
          const isMenu = record.type === 'menu'
          return (
            <div>
              <Tooltip placement='bottom' title='编辑'>
                <Button onClick={() => this.handleEditMenu(record.id)} style={{marginRight: 8}}>
                  <Icon type='edit' /></Button>
              </Tooltip>
              {
                !isMenu && <Tooltip placement='bottom' title='创建子菜单'>
                  <Button onClick={() => this.handleAddByPid(record.id)}><Icon type='link' /></Button>
                </Tooltip>
              }
            </div>
          )
        }
      }
    ]
    const pagination = {
      current: this.state.pagination.current,
      pageSize: this.state.pagination.pageSize,
      total: this.state.pagination.total,
      onChange: (current, pageSize) => this.handlePaginationChange(current, pageSize),
      onShowSizeChange: (current, pageSize) => this.handlePaginationChange(1, pageSize),
      showQuickJumper: true,
      showSizeChanger: true
    }
    return (
      <Table className={styles.menuTable} rowKey={record => record.id} dataSource={this.state.data}
        filterBar={false} columns={columns} size='middle' pagination={pagination} />
    )
  }

  // 处理菜单项编辑
  handleEditMenu = (id) => {
    this.props.history.push(`/setting/menu-manage-edit/${id}`)
  }

  // 处理基于已有菜单创建子菜单
  handleAddByPid = (pid) => {
    this.props.history.push(`/setting/menu-manage-add-by-pid/${pid}`)
  }

  // 处理分页条件改变
  handlePaginationChange = (current, pageSize) => {
    const pagination = {
      current,
      pageSize
    }

    const {name, code} = this.props.form.getFieldsValue()
    this.setState({pagination}, () => this.fetch(name, code))
  }

  render () {
    return (
      <TableLayout
        title={'菜单配置'}
        renderTitleSide={() => (
          <div style={{textAlign: 'right'}}>
            <Button type='primary' ghost icon='plus' style={{border: 0, fontWeight: 'bold'}} onClick={(e) => { this.handleAddMenu(e) }}><span style={{fontSize: 16, fontFamily: '微软雅黑'}}>添加</span></Button>
          </div>
        )}
      >
        <div>
          <Row className={styles.CardHeader}>
            <Col>
              <div>
                <div>{this.renderSearchForm()}</div>
              </div>
            </Col>
          </Row>
          {this.renderMenuTable()}
        </div>
      </TableLayout>
    )
  }
}

export default MenuManageList
