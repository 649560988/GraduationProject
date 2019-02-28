import React from 'react'
import ReactDom from 'react-dom';
import { Form, Modal, Select, Input, Row, Col, message, Button, Table, Tooltip, Icon, Popconfirm } from 'antd'
import SubAddForm from './SubModal/SubAddForm'
import SubEditForm from './SubModal/SubEditForm'
import styles from './DetailForm.less'
import {connect} from 'dva/index'
import axios from 'axios/index'
import request from '../../utils/request'
import TableLayout from '../../layouts/TableLayout'
import E from 'wangeditor'

// import { FormattedMessage } from 'react-intl'
const FormItem = Form.Item
const Option = Select.Option
const Search = Input.Search

@Form.create()
@connect(({ user }) => ({
  user: user
}))
class SupplierMaintenanceDetail extends React.Component {
  constructor (props) {
    super(props)
    this.state = this.getInitState()
  }

  getInitState = () => {
    return {
      sourceSubList: [], // 数据源的子数据集合
      pagination: {
        current: 1,
        pageSize: 5,
        total: 0
      }, // 分页信息
      btnDeleteBatchLoading: false, // 批量删除按钮loading状态
      toBeDeletedIds: [], // 待批量删除的子数据id集合
      addModalVisible: false, // 添加模态框显示状态
      editModalVisible: false, // 编辑模态框显示状态
      selectedId: null, // 传来的父参数id
      sonId: null,   // 被选中的子数据id
      searchText: '', // 查询信息
      paramCode: '', //父参数的数据源编码
      paramName: '',   ////父参数的数据源名称
    }
  }

/***
 *保存成功弹窗
 */
success = () => {
  const modal = Modal.success({
    title: '保存成功',
    content: '保存成功'
  })
  this.linkToChange(`/setting/parameters`)
  setTimeout(() => modal.destroy(), 1000)
}
/***
 *保存失败弹窗
 */
errorMess = (mess) => {
  Modal.error({
    title: '保存失败',
    content: mess
  })
}

  /**
   * 路径标志用户id
   */
componentWillMount () {
  this.setState({
    selectedId: this.props.match.params.id
  },() => {
    this.fetchParams()
  })
}
componentDidMount () {
  this.fetch()
}

fetchParams(){
  let url = '/v1/sysParam/selectParamById/' + this.state.selectedId
  request(url,{
    method: 'GET'
  }).then(res => {
    if(res.message == '查询成功'){
      this.setState({
        paramCode: res.data.paramCode,
        paramName: res.data.paramName
      },() => {
        
      })
    }
  }).catch(() => {
    message.error('请求失败')
  })
}


  /***
   * form表单提交
   */
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        const values = {
          ...fieldsValue
        }
        if (this.state.id === 0) {
          this.insertUserInfo(values)
        } else {
          this.updateUSerInfo(values)
        }
      }
    })
  }

  /***
   * 添加
   */
  insertUserInfo = (values) => {
    axios({
      method: 'post',
      url: '/iam-ext/v1/suppliers',
      data: values
    }).then((res) => {
      if (res.data.failed === true) {
        this.errorMess(res.data.message)
      } else {
        this.success()
      }
    }).catch((err) => {
      console.log(err)
    })
  };

  /***
   * 更新
   */
  updateUSerInfo = (values) => {
    axios({
      method: 'put',
      url: '/iam-ext/v1/suppliers/' + this.state.id,
      data: values
    }).then((res) => {
      if (res.data.failed === true) {
        this.errorMess(res.data.message)
      } else {
        this.success()
      }
    }).catch((err) => {
      console.log(err)
    })
  };

  /***
   *   路径跳转
   */
  linkToChange = url => {
    const { history } = this.props
    history.push(url)
  };

  /***
   * 返回上一个页面
   * @param result
   */
  handleClickBackBtn = (e) => {
    this.linkToChange(`/setting/parameters`)
  }

  // 显示添加子数据的模态框
  showAddModal = () => {
    this.setState({addModalVisible: true})
  }

  // 处理刷新请求
  handleRefresh = () => {
    const initState = this.getInitState()
    // 避免sourceSubList为空数组时刷新页面闪烁问题
    initState.sourceSubList = this.state.sourceSubList
    this.setState(initState, () => {
      this.fetch()
    })
  }

  // 获取列表的数据
  fetch = () => {
    const {pagination, searchText} = this.state

    // ajax获取该数据源id的子数据
    let url = '/v1/sysParamChildren/getChildParam/' + this.state.selectedId
    request(url, {
      method: 'GET',
    }).then((res) => {
      this.setState({
        sourceSubList: res.data,
        pagination: {
          // current: res.data.number + 1,
          // pageSize: res.data.size,
          total: res.data.length
        }
      })
    }).catch((err) => {
      console.log(err)
      message.error('请求失败')
    })
  }

  // 处理查询值改变事件
  handleInputChange = (e) => {
    this.setState({searchText: e.target.value})
  }

  // 清空搜索框内容
  clearSearchText = () => {
    this.setState({searchText: ''})
  }

  // 处理查询数据源子数据
  handleSearch = () => {
    // this.setState({
    //   pagination: {
    //     current: 1,
    //     pageSize: 5
    //   }
    // }, () => {
    //   this.fetch()
    // })
    let params = {}
    if(this.state.searchText){
      params = {
        paramName: this.state.searchText,
        sysParamId: this.state.selectedId
      }
    }else{
      params = {
        sysParamId: this.state.selectedId
      }
    }
    let url = '/v1/sysParamChildren/selectChildParamByIdAndName'
    request(url,{
      method: 'POST',
      body: params
    }).then((res) => {
      if(res.message == '查询成功'){
        message.success('查询成功')
        this.setState({
          sourceSubList: res.data,
          pagination: {
            // current: res.data.number + 1,
            // pageSize: res.data.size,
            total: res.data.length
          }
        })
      }else{
        message.error('请求失败')
      }
      
    }).catch((err) => {
      console.log(err)
      message.error('请求失败')
    })
  }

  // 渲染数据源子数据列表
  renderSourceSubTable = () => {
    const columns = [
      {title: '子数据编码', key: 'paramCode', dataIndex: 'paramCode'},
      {title: '子数据名称', key: 'paramName', dataIndex: 'paramName'},
      {title: '操作',
        key: 'actions',
        width: 90,
        render: (text, record, index) => (
          <span>
            <Tooltip placement='bottom' title='编辑'>
              <Button size='small' onClick={() => this.showEditModal(record.id)} style={{marginRight: 8}}>
                <Icon type='edit' /></Button>
            </Tooltip>
            <Tooltip placement='bottom' title='移除'>
              <Popconfirm title='确定删除该条记录？' onConfirm={() => this.handleDeleteSourceSub(record.id)}
                placement='topRight'>
                <Button size='small' type='danger'><Icon type='delete' /></Button>
              </Popconfirm>
            </Tooltip>
          </span>
        )} ]

    const rowSelection = {
      selectedRowKeys: this.state.toBeDeletedIds,
      onChange: this.handleDeleteChange
    }

    const pagination = {
      current: this.state.pagination.current,
      pageSize: this.state.pagination.pageSize,
      total: this.state.pagination.total,
      pageSizeOptions: ['5', '10', '15', '20'],
      onChange: (current, pageSize) => this.handlePaginationChange(current, pageSize),
      onShowSizeChange: (current, pageSize) => this.handlePaginationChange(1, pageSize),
      showSizeChanger: true
    }

    return (
      <Table rowKey={record => record.id} dataSource={this.state.sourceSubList}
        columns={columns} rowSelection={rowSelection}
        size='small' pagination={pagination} style={{padding: '10px 0'}} />
    )
  }

  // 显示 子数据修改 模态框
  showEditModal = (id) => {
    this.setState({sonId: id, editModalVisible: true})
  }

  // 处理删除数据源子数据记录
  handleDeleteSourceSub = (id) => {
    // ajax请求
    let url = '/v1/sysParamChildren/deleteParamChild/' + id
    request(url,{
      method: 'DELETE'
    }).then((res) => {
      // if (res.code == '204') {
      //   message.success('删除成功')
      //   this.fetch()
      // } else {
      //   message.error(res.data.message)
      // }
      message.success('删除成功')
      this.fetch()
    }).catch((err) => {
      console.log(err)
      message.error('请求失败')
    })
  }

  // 处理批量删除项变化
  handleDeleteChange = (selectedRowKeys) => {
    this.setState({toBeDeletedIds: selectedRowKeys})
  }

  // 处理分页条件改变
  handlePaginationChange = (current, pageSize) => {
    this.setState({pagination: {current, pageSize}}, () => {
      this.fetch()
    })
  }

  // 处理确认添加子数据
  handleAddOk = () => {
    const form = this.addFormRef.props.form
    form.validateFields((err, values) => {
      if (err) {
        console.log(err)
        return
      }
      values.sysParamId = this.state.selectedId
      console.log(values)
      // ajax
      let url = '/v1/sysParamChildren/addParamChild'
      request(url, {
        method: 'POST',
        body: values
      }).then((res) => {
        if (res.data) {
          message.success('添加成功')
          // this.setState({addModalVisible: false}, () => {
          //   this.handleRefresh()
          // })
          this.setState({addModalVisible: false})
          this.fetch()
        } else {
          message.error(res.data.message)
        }
      }).catch((err) => {
        console.log(err)
        message.error('请求失败')
      })
    })
  }

  // 处理取消添加子数据
  handleAddCancel = () => {
    this.setState({addModalVisible: false})
  }

  // 处理确认更新子数据
  handleEditOk = () => {
    const form = this.editFormRef.props.form
    form.validateFields((err, values) => {
      if (err) {
        return
      }

      let selectedItem = this.state.sourceSubList.find(item => item.id === this.state.sonId)
      if (selectedItem.paramName === values.paramName && selectedItem.paramCode.toString() === values.paramCode) {
        message.warning('没有更改，无需更新')
        this.setState({editModalVisible: false, selectedId: null})
        return
      }

      values.id = this.state.sonId
      values.sysParamId = this.state.selectedId
      console.log(values)
      // ajax更新子数据信息
      let url = '/v1/sysParamChildren/updateParamChild'
      request(url, {
        method: 'PUT',
        body: values
      }).then((res) => {
        if (res.data === true) {
          message.success('更新成功')
          // 更新数据源data
          const index = this.state.sourceSubList.indexOf(selectedItem)
          selectedItem.paramName = values.paramName
          let newData = this.state.sourceSubList
          newData[index] = selectedItem
          this.setState({sourceSubList: newData, editModalVisible: false, selectedId: null})
        } else {
          message.error(res.data.message)
        }
      }).catch((err) => {
        console.log(err)
        message.error('请求失败')
      })
    })
  }

  // 处理取消更新子数据
  handleEditCancel = () => {
    this.setState({editModalVisible: false, selectedId: null})
  }

  // 数据源子数据名称唯一性检查
  paramNameUniqueCheck = (rule, value, callback) => {
    if (value === '') {
      callback()
      return
    }
    let sourceSubItem = {
      fieldTypeSourceId: this.props.match.params.id,
      paramName: value
    }
    if (this.state.selectedId) {
      sourceSubItem.id = this.state.selectedId
    }
    axios.get('/attr/v1/source/subs/isUniqueSubName',
      {params: sourceSubItem}).then((res) => {
      if (res.data === false) {
        callback('子数据名称已存在')
      } else {
        callback()
      }
    }).catch(e => {
      // todo
    })
  }

  // 数据源子数据编码唯一性检查
  paramCodeUniqueCheck = (rule, value, callback) => {
    if (value === '') {
      callback()
      return
    }
    let sourceSubItem = {
      fieldTypeSourceId: this.props.match.params.id,
      paramCode: value
    }
    if (this.state.selectedId) {
      sourceSubItem.id = this.state.selectedId
    }
    axios.get('/attr/v1/source/subs/isUniqueSubCode',
      {params: sourceSubItem}).then((res) => {
      if (res.data === false) {
        callback('子数据编码已存在')
      } else {
        callback()
      }
    }).catch(e => {
      // todo
    })
  }

  // 获取 添加子数据modal 的ref
  saveAddFormRef = (ref) => {
    this.addFormRef = ref
  }

  // 获取 修改子数据modal的 ref
  saveEditFormRef = (ref) => {
    this.editFormRef = ref
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      style: {width: 500, marginBottom: 20},
      labelCol: {
        span: 24
      },
      wrapperCol: {
        span: 24
      }
    }
    const hasSelected = this.state.toBeDeletedIds.length > 0
    const selectedSubItem = this.state.sourceSubList.find(item => item.id === this.state.sonId)
    return (
      <TableLayout
        title='查看数据源'
        showBackBtn
        onBackBtnClick={this.handleClickBackBtn}>
        <div className='container-item'>
          <div className='content'>
            <Form layout='inline'>
            <Row>
                <Col span={12}>
                <FormItem {...formItemLayout} label='数据源编码' style={{marginBottom: 20}}>
                    <Input placeholder='数据源编码' disabled
                      value={this.state.paramCode ? this.state.paramCode : undefined} />
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                <FormItem {...formItemLayout} label='数据源名称' style={{marginBottom: 20}}>
                    <Input placeholder='数据源名称' disabled
                      value={this.state.paramName ? this.state.paramName : undefined} />
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Col span={12}> 
                    <div >
                      <Button type='primary' icon='plus' onClick={this.showAddModal} style={{marginRight: 8,marginBottom: 10}}>添加</Button>
                      {/* <Button type='danger' icon='delete' disabled={!hasSelected} style={{marginRight: 8}}
                        loading={this.state.btnDeleteBatchLoading} onClick={this.showBatchDeleteModal}>移除</Button> */}
                      {/* <Button icon='reload' onClick={this.handleRefresh} style={{marginRight: 8}}>刷新</Button> */}
                    </div>
                  </Col>
                  <Col span={6} offset={6}>
                    <Search value={this.state.searchText} onChange={this.handleInputChange}
                      suffix={this.state.searchText
                        ? <Icon key='btnClose' type='close' onClick={this.clearSearchText} style={{marginRight: 5}} /> : null}
                      onSearch={this.handleSearch} placeholder='子数据名称' enterButton />
                  </Col>
                  <Col span={24}>
                    {this.renderSourceSubTable()}
                  </Col>
                </Col>
              </Row>
            </Form>
            {
              this.state.addModalVisible
                ? <SubAddForm handleAddOk={this.handleAddOk}
                  handleAddCancel={this.handleAddCancel}
                  paramNameUniqueCheck={this.paramNameUniqueCheck}
                  paramCodeUniqueCheck={this.paramCodeUniqueCheck}
                  wrappedComponentRef={this.saveAddFormRef} /> : null
            }

            {
              this.state.editModalVisible
                ? <SubEditForm selectedItem={selectedSubItem}
                  handleEditOk={this.handleEditOk}
                  handleEditCancel={this.handleEditCancel}
                  paramNameUniqueCheck={this.paramNameUniqueCheck}
                  paramCodeUniqueCheck={this.paramCodeUniqueCheck}
                  wrappedComponentRef={this.saveEditFormRef} /> : null
            }
          </div>
        </div>
      </TableLayout>
    )
  }
}

export default Form.create()(SupplierMaintenanceDetail)



