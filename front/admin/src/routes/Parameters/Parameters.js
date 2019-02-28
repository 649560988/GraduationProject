import React, { Component } from 'react'
import { Col, Row, Form, Button, Radio, Select, Input, Modal, Table, message, Tooltip, Popconfirm, Icon } from 'antd'
import styles from './Parameters.less'
import AddForm from './Modal/AddForm'
import EditForm from './Modal/EditForm'
import DetailForm from './Modal/DetailForm'
import { connect } from 'dva'
import axios from 'axios'
import TableLayout from '../../layouts/TableLayout'
import request from '../../utils/request'
import { FormattedMessage } from 'react-intl'

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
      type: 'paramCode',
      btnDeleteBatchLoading: false, // 批量删除按钮loading状态
      toBeDeletedIds: [], // 待批量删除的数据源id集合
      selectedId: null, // 被选中的数据源id
      searchText: '', // 查询信息
      paramCode: '', // 字段类型id[string型]
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
    // const { paramCode, searchText, pagination } = this.state
    let url = '/v1/sysParam/selectAllParam'
    request(url).then((res) => {
      let order = 1
      res.data.content = res.data.map((val) => {
        val.order = order++
        return val
      })
      this.setState({
        data: res.data
        // pagination: {
        //   current: res.data.number + 1,
        //   pageSize: res.data.size,
        //   total: res.data.totalElements
        // }
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
          paramCode: e.target.value,
          searchText: values.paramName,
          pagination: {
            current: 1,
            pageSize: 10
          }
        }, () => {
          this.fetch()
        })
      }else if(e && e.target.value) {
        this.setState({
          paramCode: e.target.value,
          searchText: values.paramName,
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

  // 显示添加数据源的模态框
  handleShowAddModal = () => {
    this.setState({addModalVisible: true})
  }

  // 处理查询数据源信息
  handleSearch = (e) => {
    if (e && e.preventDefault) e.preventDefault()
    const { form } = this.props
    form.validateFields((err, values) => {
      if (err) return
      console.log(values)
      // this.setState({
      //   paramCode: values.paramCode,
      //   searchText: values.paramName,
      //   pagination: {
      //     current: 1,
      //     pageSize: 10
      //   }
      // }, () => {
      //   this.fetch()
      // })
      let url = '/v1/sysParam/selectParamByNameAndCode'
      const { searchType,keyword } = values
      let params = {}
      if(!keyword){
        params = {}
      }else if(searchType == 'paramCode'){
        params = {
          paramCode: keyword
        }
      }else{
        params = {
          paramName: keyword
        }
      }
      request(url,{
        method: 'POST',
        body: params
      }).then(res => {
        if(res.message == '查询成功'){
          message.success('查询成功')
          let order = 1
          res.data.content = res.data.map((val) => {
            val.order = order++
            return val
          })
          this.setState({
            data: res.data
            // pagination: {
            //   current: res.data.number + 1,
            //   pageSize: res.data.size,
            //   total: res.data.totalElements
            // }
          })
        }
      }).catch(() => {

      })
    })
  }

  // 处理重置数据源查询表单
  handleResetSourceSearchForm = () => {
    const { form } = this.props
    form.resetFields()
    this.setState({
      paramCode: '',
      searchText: ''
    })
  };

  /**
   * 获取筛选条件，code或者name
   */
  getType = (value) => {
    this.setState({
      type: value
    })
  }

  // 渲染查询表单
  renderSearchForm = ()=> {
    const { getFieldDecorator } = this.props.form

    return (
      <Form className={styles.CardHeader} onSubmit={this.handleSearch} layout='inline'>
        <Row type='flex' style={{ justifyContent: 'space-between' }}>
          <Col>
            <Button type='primary' icon='plus' onClick={this.handleShowAddModal}>添加</Button>
          </Col>
          <Col>
            <Row type='flex' style={{ justifyContent: 'space-between' }}>          
              <InputGroup compact>
              {getFieldDecorator('searchType', {initialValue: 'paramCode', rules: []})(
                <Select onChange={this.getType}>
                  <Option value='paramCode' key='paramCode'>数据源编码</Option>
                  <Option value='paramName' key='paramName'>数据源名称</Option>
                </Select>
                )}
                <FormItem style={{marginRight: 10}}
                wrapperCol={{ span: 24 }}>
                  {getFieldDecorator('keyword', {})(
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

  // 渲染数据源列表
  renderSourceTable = () => {
    const columns = [
      {
        title: '序号',
        dataIndex: 'order',
        width: '5%',
        align: 'center',
        backgroundColor: 'white'
      },
      {
        title: '数据源编码',
        width: '25%',
        key: 'paramCode',
        dataIndex: 'paramCode',
        render: (text, record) => {
          let content = text
          if (content.toString().length > 20) {
            content = text.toString().substring(0, 19) + '...'
          }
          return (
            <span title={record.code}>{content}</span>
          )
        }
      },
      {
        title: '数据源名称',
        key: 'paramName',
        dataIndex: 'paramName',
        render: (text, record) => {
          let content = text
          if (content.toString().length > 20) {
            content = text.toString().substring(0, 19) + '...'
          }
          return (
            <span title={record.code}>{content}</span>
          )
        }
      },
      {
        title: '操作',
        key: 'actions',
        align: 'center',
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
              <Button onClick={(e) => this.handleLinkToDetail(e,record.id)}>
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
        filterBar={false} columns={columns}
        size='middle' pagination={pagination}
        rowKey='id'
        onRow={(record) => {
          return {
            onDoubleClick: (e) => { this.handleLinkToDetail(e,record.id) }
          }
        }
      } />
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
      content: `确认删除数据源"${this.state.data.find(item => item.id === id).paramName}"?`,
      okText: '确定',
      cancelText: '取消',
      onOk: () => this.handleDeleteSource(id)
    })
  }

  // 处理删除单条数据源记录
  handleDeleteSource = (id) => {
    let url = '/v1/sysParam/deleteParam/' + id
    // ajax请求
    request(url, {
      method: 'DELETE'
    }).then((res) => {
      // 等后端解决删除接口的问题加上
      // if (res.message == '删除成功') {
      //   message.success('删除成功')
      //   this.fetch()
      // } else {
      //   message.error(res.data.message)
      // }
      this.fetch()
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
    this.setState({toBeDeletedIds: selectedRowKeys})
  }

  // 处理分页条件的改变
  handlePaginationChange = (current, pageSize) => {
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
            paramCode: values.sourceSubCodeList[i],
            paramName: values.sourceSubNameList[i]
          })
        }
      }

      // ajax处理添加数据源
      let url = '/v1/sysParam/addParam'
      request(url, {
        method: 'POST',
        body: values
      }).then((res) => {
        // 等后端确认好返回信息
        if (res.data) {
          message.success('数据源添加成功')
          this.addFormRef.props.form.resetFields()
          this.fetch()
          this.setState({addModalVisible: false})
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

    /**
   * flag为1：编辑
   * flag为0：创建
   */
  handleLinkToDetail = (e,id) => {
    e.stopPropagation();
    this.linkToChange(`/setting/parametersDetail/${id}`)
  }

    /***
   *   路径跳转
   */
  linkToChange = url => {
    const { history } = this.props
    history.push(url)
  };

  // 处理更新数据源
  handleEditOk = () => {
    const form = this.editFormRef.props.form
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
      let selectedItem = this.state.data.find(item => item.id === this.state.selectedId)
      if (selectedItem.paramCode === values.paramCode && selectedItem.paramName === values.paramName) {
        message.warning('没有任何改动，无需更新')
        this.setState({editModalVisible: false, selectedId: undefined})
        return
      }
      // ajax处理更新数据源
      let url = '/v1/sysParam/updateParam'
      request(url, {
        method: 'PUT',
        body: {
          id: selectedItem.id,
          paramCode: selectedItem.paramCode,
          paramName: selectedItem.paramName
        }
      }).then((res) => {
        if (res.data === true) {
          message.success('数据源信息更新成功')
          // 更新数据源data
          const index = this.state.data.indexOf(selectedItem)
          selectedItem.paramCode = values.paramCode
          selectedItem.paramName = values.paramName
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
        title={'数据源管理'}
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
