import React, {Component} from 'react'
import {Form, Modal, Select, Input, Row, Col, message, Button, Table, Tooltip, Icon, Popconfirm} from 'antd'
import SubAddForm from '../SubModal/SubAddForm'
import SubEditForm from '../SubModal/SubEditForm'
import styles from './DetailForm.less'
import axios from 'axios'

const FormItem = Form.Item
const Option = Select.Option
const Search = Input.Search

const DetailForm = Form.create()(
  class extends Component {
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
            selectedId: null, // 被选中的子数据id
            searchText: '' // 查询信息
          }
        }

        // 获取列表的数据
        fetch = () => {
          const {pagination, searchText} = this.state

          // ajax获取该数据源id的子数据
          axios.get('/attr/v1/source/subs', {
            params: {
              page: pagination.current - 1,
              size: pagination.pageSize,
              fieldTypeSourceId: this.props.selectedItem.id,
              sourceSubName: searchText
            }
          }).then((res) => {
            this.setState({
              sourceSubList: res.data.content,
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

        componentDidMount () {
          this.fetch()
        }

        // 处理查询值改变事件
        handleInputChange = (e) => {
          this.setState({searchText: e.target.value})
        }

        // 处理查询数据源子数据
        handleSearch = () => {
          this.setState({
            pagination: {
              current: 1,
              pageSize: 5
            }
          }, () => {
            this.fetch()
          })
        }

        // 渲染数据源子数据列表
        renderSourceSubTable = () => {
          const columns = [
            {title: '子数据编码', key: 'sourceSubCode', dataIndex: 'sourceSubCode'},
            {title: '子数据名称', key: 'sourceSubName', dataIndex: 'sourceSubName'},
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

        // 显示添加子数据的模态框
        showAddModal = () => {
          this.setState({addModalVisible: true})
        }

        // 处理批量删除项变化
        handleDeleteChange = (selectedRowKeys) => {
          this.setState({toBeDeletedIds: selectedRowKeys})
        }

        // 批量删除
        handleBatchDelete = () => {
          this.setState({btnDeleteBatchLoading: true})

          // ajax批量删除
          axios.delete('/attr/v1/source/subs/deleteBatch', {
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

        // 获取 添加子数据modal 的ref
        saveAddFormRef = (ref) => {
          this.addFormRef = ref
        }

        // 数据源子数据名称唯一性检查
        sourceSubNameUniqueCheck = (rule, value, callback) => {
          if (value === '') {
            callback()
            return
          }
          let sourceSubItem = {
            fieldTypeSourceId: this.props.selectedItem.id,
            sourceSubName: value
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
        sourceSubCodeUniqueCheck = (rule, value, callback) => {
          if (value === '') {
            callback()
            return
          }
          let sourceSubItem = {
            fieldTypeSourceId: this.props.selectedItem.id,
            sourceSubCode: value
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

        // 处理确认添加子数据
        handleAddOk = () => {
          const form = this.addFormRef.props.form
          form.validateFields((err, values) => {
            if (err) {
              return
            }
            // ajax
            axios.post('/attr/v1/source/subs', {
              fieldTypeSourceId: this.props.selectedItem.id,
              sourceSubName: values.sourceSubName,
              sourceSubCode: values.sourceSubCode
            }).then((res) => {
              if (res.data === true) {
                message.success('添加成功')
                this.setState({addModalVisible: false}, () => {
                  this.handleRefresh()
                })
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

        // 获取 修改子数据modal的 ref
        saveEditFormRef = (ref) => {
          this.editFormRef = ref
        }

        // 显示 子数据修改 模态框
        showEditModal = (id) => {
          this.setState({selectedId: id, editModalVisible: true})
        }

        // 处理确认更新子数据
        handleEditOk = () => {
          const form = this.editFormRef.props.form
          form.validateFields((err, values) => {
            if (err) {
              return
            }

            let selectedItem = this.state.sourceSubList.find(item => item.id === this.state.selectedId)
            if (selectedItem.sourceSubName === values.sourceSubName && selectedItem.sourceSubCode.toString() === values.sourceSubCode) {
              message.warning('没有更改，无需更新')
              this.setState({editModalVisible: false, selectedId: null})
              return
            }

            // ajax更新子数据信息
            // console.log(this.state.selectedId+ " --- "+values.sourceSubName);
            axios.put(`/attr/v1/source/subs/${this.state.selectedId}`, {
              sourceSubName: values.sourceSubName,
              sourceSubCode: values.sourceSubCode
            }).then((res) => {
              if (res.data === true) {
                message.success('更新成功')
                // 更新数据源data
                const index = this.state.sourceSubList.indexOf(selectedItem)
                selectedItem.sourceSubName = values.sourceSubName
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

        // 处理删除数据源子数据记录
        handleDeleteSourceSub = (id) => {
          // ajax请求
          axios.delete(`/attr/v1/source/subs/${id}`).then((res) => {
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

        // 处理分页条件改变
        handlePaginationChange = (current, pageSize) => {
          this.setState({pagination: {current, pageSize}}, () => {
            this.fetch()
          })
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

      // 显示批量删除数据源子数据确认框
      showBatchDeleteModal = () => {
        Modal.confirm({
          title: '批量删除子数据',
          content: '确认删除所有选中的数据源子数据?',
          okText: '确定',
          cancelText: '取消',
          onOk: () => this.handleBatchDelete()
        })
      }

      // 清空搜索框内容
      clearSearchText = () => {
        this.setState({searchText: ''})
      }

      render () {
        const hasSelected = this.state.toBeDeletedIds.length > 0
        const selectedSubItem = this.state.sourceSubList.find(item => item.id === this.state.selectedId)
        const formItemLayout = {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 4 }
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 20 }
          }
        }
        return (
          <Modal title={`数据源 "${this.props.selectedItem ? this.props.selectedItem.sourceName : ''}" 的详细信息`}
            visible={this.props.visible} width={700} className={styles.detailModal} maskClosable={false}
            footer={<Button onClick={this.props.hideDetailModal}>关闭</Button>}
            onCancel={this.props.hideDetailModal}>
            <Form type='vertical'>
              <Row>
                <Col>
                  <FormItem {...formItemLayout} label='字段类型' style={{marginBottom: 0}}>
                    <Select placeholder='字段类型' disabled
                      defaultValue={this.props.selectedItem ? this.props.selectedItem.fieldTypeId : undefined}>
                      {
                        this.props.fieldType.data.map((item, index) => {
                          return (
                            <Option key={item.value} value={item.value}>{item.text}</Option>
                          )
                        })
                      }
                    </Select>
                  </FormItem>
                </Col>
                <Col>
                  <FormItem {...formItemLayout} label='数据源名称' style={{marginBottom: 10}}>
                    <Input placeholder='数据源名称' disabled
                      defaultValue={this.props.selectedItem ? this.props.selectedItem.sourceName : undefined} />
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Col span={12}>
                    <div >
                      <Button type='primary' icon='plus' onClick={this.showAddModal} style={{marginRight: 8}}>添加</Button>
                      <Button type='danger' icon='delete' disabled={!hasSelected} style={{marginRight: 8}}
                        loading={this.state.btnDeleteBatchLoading} onClick={this.showBatchDeleteModal}>移除</Button>
                      <Button icon='reload' onClick={this.handleRefresh} style={{marginRight: 8}}>刷新</Button>
                    </div>
                  </Col>
                  <Col span={9} offset={3}>
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
                  sourceSubNameUniqueCheck={this.sourceSubNameUniqueCheck}
                  sourceSubCodeUniqueCheck={this.sourceSubCodeUniqueCheck}
                  wrappedComponentRef={this.saveAddFormRef} /> : null
            }

            {
              this.state.editModalVisible
                ? <SubEditForm selectedItem={selectedSubItem}
                  handleEditOk={this.handleEditOk}
                  handleEditCancel={this.handleEditCancel}
                  sourceSubNameUniqueCheck={this.sourceSubNameUniqueCheck}
                  sourceSubCodeUniqueCheck={this.sourceSubCodeUniqueCheck}
                  wrappedComponentRef={this.saveEditFormRef} /> : null
            }
          </Modal>
        )
      }
  }
)

export default DetailForm
