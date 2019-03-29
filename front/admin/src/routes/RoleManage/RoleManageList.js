import React, {Component} from 'react'
import {Table, Form, Row, Col, Input, Button, Tooltip, Icon, message, Select} from 'antd'
import styles from './RoleManage.less'
import axios from 'axios'
import TableLayout from '../../layouts/TableLayout'
import request from '../../utils/request'

const FormItem = Form.Item
const Option = Select.Option
const Search = Input.Search
const ButtonGroup = Button.Group
const InputGroup = Input.Group

@Form.create()
class RoleManageList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      isDel:'',
      name:''
    }
  }
      /**
     * 将信息填入表格
     */
    addToTable = (data) => {
      let dataSource = []
      console.log(data)
      data.list.map((item, index) => {
        item.order = index + 1
        let record = item
        dataSource.push(record)
      })
      this.setState({
          data: dataSource,
          current: data.pageNum,
          total: data.total
      })
  }

  fetch = () => {
   request('/v1/sysrole/pagerole?pageNo='+this.state.pagination.current+'&pageSize='+this.state.pagination.pageSize,{
      method: 'GET',
      // credentials:'omit',
      // headers: new Headers({
      //   'Content-Type': 'application/json'
      // }),
      // data:{
      //   isDel:this.state.isDel,
      //   name:this.state.name
      // }
    }).then((res)=>{
      if(res.message === '成功'){
        this.addToTable(res.data)
      }
    })
    .catch(error=>console.error(error))
  }

  componentDidMount () {
    this.fetch()
  }

  // 处理表单提交
  handleSearch = (e) => {
    const {form} = this.props
    form.validateFields((err, values) => {
      if (err) return
      const pagination = {
        current: 1,
        pageSize: 10
      }
      if (values.searchType === 'name') {
        this.setState({ pagination }, () => {
          this.fetch(values.keyword, null, null)
        })
      }
      if (values.searchType === 'code') {
        this.setState({ pagination }, () => {
          this.fetch(null, values.keyword, null)
        })
      }
    })
  }

  // 处理重置表单
  handleResetSearchForm = () => {
    this.props.form.resetFields()
    const pagination = {
      current: 1,
      pageSize: 10
    }
    this.setState({pagination}, () => {
      this.fetch()
    })
  }

  // 渲染查询表单
  renderSearchForm = () => {
    const {getFieldDecorator} = this.props.form
    return (
      <Form layout='horizontal'>
        <div>
          <Row type='flex' style={{ justifyContent: 'space-between' }}>
            <Col>
              <Row type='flex'>
                <FormItem
                  wrapperCol={{ span: 24 }}
                >
                  <ButtonGroup>
                    <Button onClick={this.fetch.bind(this, null, null, null)}>全部</Button>
                    <Button onClick={this.fetch.bind(this, null, null, 1)}>启用</Button>
                    <Button onClick={this.fetch.bind(this, null, null, 0)}>禁用</Button>
                  </ButtonGroup>
                </FormItem>
              </Row>
            </Col>
            <Col>
              <Row type='flex'>
                <InputGroup compact>
                  {getFieldDecorator('searchType', {initialValue: 'name', rules: []})(
                    <Select onChange={this.getType}>
                      <Option value={'name'} key={'name'}>角色名称</Option>
                    </Select>
                  )}
                  <FormItem
                    style={{marginRight: 10}}
                    wrapperCol={{ span: 24 }}
                  >
                  {getFieldDecorator('keyword', {})(
                    <Search placeholder='请输入关键词' onSearch={this.handleSearch} />
                  )}
                  </FormItem>
                  </InputGroup>
              </Row>
            </Col>
          </Row>
        </div>
      </Form>
    )
  }

  // 跳转到“角色添加”页面
  handleAddRole = (id) => {
    this.props.history.push(`/setting/role-manage-add/${id}`)
  }

  // 渲染角色列表
  renderRoleTable = () => {
    const columns = [
      {
        title: '序号',
        dataIndex: 'no',
        render: (text, record, index) => index + 1,
        width: '20%'
      },
      {
        title: '名称',
        key: 'name',
        dataIndex: 'name',
        width: '30%'
      },
      {
        title: '状态',
        key: 'isEnabled',
        dataIndex: 'isEnabled',
        width: '30%',
        render: (text, record, index) => (record.isDel === 0 ? '启用' : '停用')
      },
      {
        title: '操作',
        key: 'action',
        width: '20%',
        render: (text, record, index) => {
          return (
            <div>
              <Tooltip placement='bottom' title='编辑'>
                <Button onClick={() => this.handleAddRole(record.id,'edit')} style={{marginRight: 8}}>
                  <Icon type='edit' /></Button>
              </Tooltip>
              {
                record.isDel === 0
                  ? <Tooltip placement='bottom' title='停用'>
                    <Button type='danger' onClick={() => this.handleDisableRole(record.id,record.isDel)}>
                      <Icon type='minus-circle-o' /></Button>
                  </Tooltip>
                  : <Tooltip placement='bottom' title='启用'>
                    <Button onClick={() => this.handleEnableRole(record.id,record.isDel)} className={styles.enableBtn}>
                      <Icon type='check-circle-o' /></Button>
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
      <Table className={styles.roleTable} rowKey={record => record.id} dataSource={this.state.data}
        filterBar={false} columns={columns} size='middle' pagination={pagination} />
    )
  }

  // 停用角色
  handleDisableRole =(id,isDel) => {
    request(`/v1/sysrole/delete/${id}/${isDel}`,{
      method:'GET',
      credentials:'omit',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    }).then(res=>{
      message.success('操作成功')
      this.fetch()
    })
    .catch(error=>console.error(error))
  }

  // 启用角色
  handleEnableRole = (id,isDel) => {
    request(`/v1/sysrole/delete/${id}/${isDel}`,{
      method:'GET',
      credentials:'omit',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    }).then(res=>{
      message.success('操作成功')
      this.fetch()
    })
    .catch(error=>console.error(error))
  }

  // 处理分页条件改变
  handlePaginationChange = (current, pageSize) => {
    const pagination = {
      current,
      pageSize
    }
    const { name, code, isEnabled } = this.props.form.getFieldsValue()
    this.setState({pagination}, () => this.fetch(name, code, isEnabled))
  }

  render () {
    return (
      <TableLayout
        title={'角色信息'}
        renderTitleSide={() => (
          <Button type='primary'
            ghost icon='plus'
            onClick={()=>this.handleAddRole(-1)}
            style={{border: 0, fontWeight: 'bold'}}
          ><span style={{fontSize: 16, fontFamily: 'heiti'}}>添加</span></Button>
        )}
      >
        {this.renderSearchForm()}
        {this.renderRoleTable()}
        {/* <Table
                    size={'middle'}
                    columns={this.state.columns}
                    dataSource={this.state.data}
                    rowKey={'id'}
                    pagination={{
                        pageSize: this.state.pageSize,
                        current: this.state.current,
                        onChange: this.handlePageChange,
                        total: this.state.total,
                        showQuickJumper: true,
                        showSizeChanger: true,
                        onShowSizeChange: this.handlePageChange
                    }}
                /> */}
      </TableLayout>

    )
  }
}

export default RoleManageList
