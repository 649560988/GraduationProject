import React, { Component } from 'react'
import { Col, Row, Form, Button, Radio, Select, Input, Modal, Table, message, Tooltip, Popconfirm, Icon } from 'antd'
import styles from './DynamicFieldSource.less'
import AddForm from './Modal/AddForm'
import EditForm from './Modal/EditForm'
import DetailForm from './Modal/DetailForm'
import { connect } from 'dva'
import axios from 'axios'
import TableLayout from '../../layouts/TableLayout'

const FormItem = Form.Item
const { Option } = Select
const InputGroup = Input.Group
const Search = Input.Search

// 定义字段类型集合
const fieldType = {
  data: [
    {value: '', text: '全部'},
    {value: '3', text: '下拉选择框'},
    {value: '4', text: '单选按钮'},
    {value: '5', text: '多选框'}
  ]
}

@connect(({ dynamicFieldSource }) => ({ dynamicFieldSource }))

@Form.create()
class DynamicFieldSource extends Component {
  constructor (props) {
    super(props)
    this.state = this.getInitState()
  }

  // 获取初始化state
  getInitState = () => {
    return {
      data: [], // 数据
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      }, // 分页信息
      btnDeleteBatchLoading: false, // 批量删除按钮loading状态
      toBeDeletedIds: [], // 待批量删除的数据源id集合
      selectedId: null, // 被选中的数据源id
      searchText: '', // 查询信息
      fieldTypeId: '', // 字段类型id[string型]
      editModalVisible: false, // 编辑模态框显示状态
      addModalVisible: false, // 添加模态框显示状态
      detailModalVisible: false // 子数据模态框显示状态
    }
  }

  componentDidMount () {
    this.fetch()
  }

  // fetch()获取最新数据
  fetch = () => {
    // const {dispatch , dynamicFieldSource } = this.props;
    // const { fieldTypeId,searchText} = this.state;
    // dispatch({
    //   type:'dynamicFieldSource/fetch',
    //   payload:{
    //     page:dynamicFieldSource.pagination.current - 1,
    //     size:dynamicFieldSource.pagination.pageSize,
    //     fieldTypeId,
    //     sourceName: searchText,
    //   }
    // })

    const { fieldTypeId, searchText, pagination } = this.state
    axios.get('/attr/v1/sources', {
      params: {
        page: pagination.current - 1,
        size: pagination.pageSize,
        fieldTypeId,
        sourceName: searchText
      }
    }).then((res) => {
      this.setState({
        data: res.data.content,
        pagination: {
          current: res.data.number + 1,
          pageSize: res.data.size,
          total: res.data.totalElements
        }
      })
    }).catch((err) => {
      console.log(err)
      message.error('请求失败')
    })
  }

  // 左侧tab处理查询数据源信息
  handleSourceSearch = (e) => {
    if (e && e.preventDefault) e.preventDefault()
    const { form } = this.props
    form.validateFields((err, values) => {
      if (err) return
      if(e.target.value === ''){
        e.target.value = ''
        this.setState({
          fieldTypeId: e.target.value,
          searchText: values.sourceName,
          pagination: {
            current: 1,
            pageSize: 10
          }
        }, () => {
          this.fetch()
        })
      }else if(e && e.target.value) {
        this.setState({
          fieldTypeId: e.target.value,
          searchText: values.sourceName,
          pagination: {
            current: 1,
            pageSize: 10
          }
        }, () => {
          this.fetch()
        })
      }
    })
  }

  // 处理查询数据源信息
  handleSearch = (e) => {
    if (e && e.preventDefault) e.preventDefault()
    const { form } = this.props
    form.validateFields((err, values) => {
      if (err) return
      this.setState({
        fieldTypeId: values.fieldTypeId,
        searchText: values.sourceName,
        pagination: {
          current: 1,
          pageSize: 10
        }
      }, () => {
        this.fetch()
      })
    })
  }

  // 处理重置数据源查询表单
  handleResetSourceSearchForm = () => {
    const { form } = this.props
    form.resetFields()
    this.setState({
      fieldTypeId: '',
      searchText: ''
    })
  };

  // 渲染查询表单
  renderSearchForm = ()=> {
    const { getFieldDecorator } = this.props.form

    return (
      <Form className={styles.CardHeader} onSubmit={this.handleSearch} layout='inline'>
        <Row type='flex' style={{ justifyContent: 'space-between' }}>
          <Col>
          <FormItem>
            
              <Radio.Group value={this.state.fieldTypeId} onChange={this.handleSourceSearch}>
              {
                fieldType.data.map(
                  (item, index) => (<Radio.Button value={item.value}>{item.text}</Radio.Button>)
                )
              }
              </Radio.Group>
           
          </FormItem>
            
          </Col>
          <Col>
            <Row type='flex' style={{ justifyContent: 'space-between' }}>          
              <InputGroup compact>
                <Select defaultValue='name'>
                  <Option value='name'>数据源名称</Option>
                </Select>
                <FormItem style={{marginRight: 10}}
                wrapperCol={{ span: 24 }}>
                  {getFieldDecorator('sourceName', {})(
                    <Search placeholder='请输入关键词' onSearch={this.handleSearch}  onPressEnter={this.handleSearch} style={{width:200}} />
                  )}
                </FormItem>
              </InputGroup>
            </Row>
          </Col>
          </Row>
      </Form>
    )
  }

  // 显示添加数据源的模态框
  handleShowAddModal = () => {
    this.setState({addModalVisible: true})
  }

  // 显示批量删除数据源确认框
  showBatchDeleteModal = () => {
    Modal.confirm({
      title: '批量删除数据源',
      content: '确认删除所有选中的数据源?',
      okText: '确定',
      cancelText: '取消',
      onOk: () => this.handleBatchDelete()
    })
  }

  // 批量删除数据源
  handleBatchDelete = () => {
    this.setState({btnDeleteBatchLoading: true})

    axios.delete('/attr/v1/sources/deleteBatch', {
      params: {
        ids: this.state.toBeDeletedIds.toString()
      }
    }).then((res) => {
      if (res.data === true) {
        message.success('批量删除成功')
        // 关闭“批量删除”按钮loading状态，清除待删除id数组
        this.setState({btnDeleteBatchLoading: false, toBeDeletedIds: []}, () => {
          this.fetch()
        })
      } else {
        message.error(res.data.message)
        this.setState({btnDeleteBatchLoading: false})
      }
    }).catch((err) => {
      console.log(err)
      message.error('请求失败')
      this.setState({btnDeleteBatchLoading: false})
    })
  }

  // 处理刷新请求
  handleRefresh = () => {
    const initState = this.getInitState()
    // 避免data为空数组时刷新页面闪烁问题
    initState.data = this.state.data
    this.handleResetSourceSearchForm()
    this.setState(initState, () => {
      this.fetch()
    })
  }

  // 渲染数据源列表
  renderSourceTable = () => {
    const columns = [
      {
        title: '字段类型',
        key: 'fieldTypeId',
        dataIndex: 'fieldTypeId',
        render: (text, record, index) => {
          const fieldTypeItem = fieldType.data.find(item => item.value === record.fieldTypeId)
          return (<span>{fieldTypeItem ? fieldTypeItem.text : null }</span>)
        }
      },
      {
        title: '数据源名称',
        key: 'sourceName',
        dataIndex: 'sourceName'
      },
      {
        title: '操作',
        key: 'actions',
        width: 200,
        render: (text, record, index) => (

          <span>
            <Tooltip placement='bottom' title='编辑'>
              <Button onClick={() => this.showEditModal(record.id)} style={{marginRight: 8}}>
                <Icon type='edit' /></Button>
            </Tooltip>
            <Tooltip placement='bottom' title='移除'>
              <Popconfirm title='确定删除该条记录？' onConfirm={() => this.handleDeleteSource(record.id)}
                placement='top'>
                <Button type='danger' style={{marginRight: 8}}><Icon type='delete' /></Button>
              </Popconfirm>
            </Tooltip>
            <Tooltip placement='bottom' title='详细信息'>
              <Button onClick={() => this.showDetailModal(record.id)}>
                <Icon type='info-circle' /></Button>
            </Tooltip>
          </span>
        )
      }
    ]

    const rowSelection = {
      selectedRowKeys: this.state.toBeDeletedIds,
      onChange: this.handleDeleteChange
    }

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
      <Table rowKey={record => record.id} dataSource={this.state.data}
        filterBar={false} columns={columns} rowSelection={rowSelection}
        size='middle' pagination={pagination} />
    )
  }

  // 显示数据源编辑模态框
  showEditModal = (id) => {
    this.setState({selectedId: id, editModalVisible: true})
  }

  // 显示数据源删除询问框
  showDeleteModal = (id) => {
    Modal.confirm({
      title: '删除数据源',
      content: `确认删除数据源"${this.state.data.find(item => item.id === id).sourceName}"?`,
      okText: '确定',
      cancelText: '取消',
      onOk: () => this.handleDeleteSource(id)
    })
  }

  // 处理删除单条数据源记录
  handleDeleteSource = (id) => {
    // ajax请求
    axios.delete(`/attr/v1/sources/${id}`).then((res) => {
      if (res.data === true) {
        message.success('删除成功')
        this.fetch()
      } else {
        message.error(res.data.message)
      }
    }).catch((err) => {
      console.log(err)
      message.error('请求失败')
    })
  }

  // 显示数据源详细信息模态框
  showDetailModal = (id) => {
    this.setState({selectedId: id, detailModalVisible: true})
  }

  // 处理批量删除项变化
  handleDeleteChange = (selectedRowKeys) => {
    // console.log(selectedRowKeys);
    this.setState({toBeDeletedIds: selectedRowKeys})
  }

  // 处理分页条件的改变
  handlePaginationChange = (current, pageSize) => {
    // console.log(`current:${current}   pageSize: ${pageSize}`);
    this.setState({pagination: {current, pageSize}}, () => {
      this.fetch()
    })
  }

  // 获取 添加数据源表单 的ref
  saveAddFormRef = (formRef) => {
    this.addFormRef = formRef
  }

  // 处理添加数据源
  handleAddOk = () => {
    const form = this.addFormRef.props.form
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }

      let sourceSubList = []
      if (values.sourceSubNameList && values.sourceSubCodeList) {
        for (let i = 0; i < values.sourceSubNameList.length; i++) {
          sourceSubList.push({
            sourceSubCode: values.sourceSubCodeList[i],
            sourceSubName: values.sourceSubNameList[i]
          })
        }
      }

      // ajax处理添加数据源
      axios.post('/attr/v1/sources', {
        fieldTypeId: values.fieldTypeId,
        sourceName: values.sourceName,
        sourceSubList: sourceSubList
      }).then((res) => {
        if (res.data === true) {
          message.success('数据源添加成功')
          this.addFormRef.props.form.resetFields()
          this.handleRefresh()
        } else {
          message.error(res.data.message)
        }
      }).catch((err) => {
        console.log(err)
        message.error('请求失败')
      })
    })
  }

  // 处理取消添加数据源
  handleAddCancel = () => {
    const form = this.addFormRef.props.form
    form.resetFields()
    this.setState({addModalVisible: false})
  }

  // 获取 编辑数据源表单 的ref
  saveEditFormRef = (formRef) => {
    this.editFormRef = formRef
  }

  // 处理更新数据源
  handleEditOk = () => {
    const form = this.editFormRef.props.form
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
      let selectedItem = this.state.data.find(item => item.id === this.state.selectedId)
      if (selectedItem.fieldTypeId === values.fieldTypeId && selectedItem.sourceName === values.sourceName) {
        message.warning('没有任何改动，无需更新')
        this.setState({editModalVisible: false, selectedId: undefined})
        return
      }
      // console.log(`${this.state.selectedId}-${values.fieldTypeId}-${values.sourceName}`);
      // ajax处理更新数据源
      axios.put(`/attr/v1/sources/${this.state.selectedId}`, {
        fieldTypeId: values.fieldTypeId,
        sourceName: values.sourceName
      }).then((res) => {
        if (res.data === true) {
          message.success('数据源信息更新成功')
          // 更新数据源data
          const index = this.state.data.indexOf(selectedItem)
          selectedItem.fieldTypeId = values.fieldTypeId
          selectedItem.sourceName = values.sourceName
          let newData = this.state.data
          newData[index] = selectedItem
          this.setState({data: newData, editModalVisible: false, selectedId: null})
        } else {
          message.error(res.data.message)
        }
      }).catch((err) => {
        console.log(err)
        message.error('请求失败')
      })
    })
  }

  // 处理取消更新数据源
  handleEditCancel = () => {
    const form = this.editFormRef.props.form
    form.resetFields()
    this.setState({editModalVisible: false, selectedId: null})
  }

  // 隐藏详细信息modal
  hideDetailModal = () => {
    this.setState({detailModalVisible: false, selectedId: null})
  }

  render () {
    const hasSelected = this.state.toBeDeletedIds.length > 0
    const selectedItem = this.state.data.find(item => item.id === this.state.selectedId)

    return (
      <TableLayout
        id='no'
        title={'动态字段数据源管理'}
        renderTitleSide={() => (
          <div className={styles.tableListOperator}>
            <Button type='primary' icon='plus' onClick={this.handleShowAddModal}>添加</Button>
            <Button type='danger' icon='delete' disabled={!hasSelected}
              loading={this.state.btnDeleteBatchLoading} onClick={this.showBatchDeleteModal}>移除</Button>
            <Button icon='reload' onClick={this.handleRefresh}>刷新</Button>
          </div>
        )}
      >
        <div className={styles.tableList}>
          <div className={styles.stableListForm}>{this.renderSearchForm()}</div>
          
        </div>
        {this.renderSourceTable()}

        {/* 添加动态字段modal */}
        <AddForm visible={this.state.addModalVisible} fieldType={fieldType}
          handleAddOk={this.handleAddOk} handleAddCancel={this.handleAddCancel}
          wrappedComponentRef={this.saveAddFormRef} />

        {/* 编辑动态字段modal */}
        <EditForm visible={this.state.editModalVisible} fieldType={fieldType}
          handleEditOk={this.handleEditOk} handleEditCancel={this.handleEditCancel}
          wrappedComponentRef={this.saveEditFormRef} selectedItem={selectedItem} />

        {/* 查看详细信息modal */}
        {
          this.state.detailModalVisible ? <DetailForm fieldType={fieldType}
            visible={this.state.detailModalVisible}
            hideDetailModal={this.hideDetailModal}
            selectedItem={selectedItem} /> : null
        }
      </TableLayout>
    )
  }
}

export default DynamicFieldSource
