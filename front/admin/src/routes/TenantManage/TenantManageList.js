import React from 'react'
import { message, Radio, Row, Col, Input, Select, Form, Table, Icon, Button, Popconfirm, Tooltip, Tag } from 'antd'
import axios from 'axios'
import TableLayout from '../../layouts/TableLayout'
// import PromiseView from '../../components/PromiseView'
import styles from './index.less'
import { connect } from 'dva'
import { FormattedMessage } from 'react-intl'

const FormItem = Form.Item
const Search = Input.Search
const Option = Select.Option
// const ButtonGroup = Button.Group

@Form.create()
@connect(({ user }) => ({
  user: user
}))
class TenantManageList extends React.Component {
  constructor (props) {
    super(props)
    this.columns = [{
      // title: '序号',
      title: <FormattedMessage id='ocms.code.resume.list.order' />,
      dataIndex: 'order',
      width: '8%',
      align: 'center',
      backgroundColor: 'white'
    }, {
      // title: '租户名称',
      title: <FormattedMessage id='omp.code.tenantmanage.tenantmanage.tenantmanagelist.tenantname' />,
      dataIndex: 'name',
      width: '11%',
      align: 'center',
      sortType: 'string',
      render: (text, record) => {
        let content = text
        if (content.toString().length > 6) {
          content = text.toString().substring(0, 5) + '...'
        }
        return (
          <span title={record.name}>{content}</span>
        )
      }
    }, {
      // title: '租户编码',
      title: <FormattedMessage id='omp.code.tenantmanage.tenantmanage.tenantmanagelist.tenantcode' />,
      dataIndex: 'code',
      width: '9%',
      align: 'center',
      render: (text, record) => {
        let content = text
        if (content.toString().length > 7) {
          content = text.toString().substring(0, 6) + '...'
        }
        return (
          <span title={record.code}>{content}</span>
        )
      }
    }, {
      // title: '是否启用',
      title: <FormattedMessage id='omp.code.tenantmanage.tenantmanage.tenantmanagelist.tenantisenable' />,
      dataIndex: 'isEnabled',
      width: '8%',
      align: 'center',
      render: (text, record) => {
        let content = ''
        if (text === 1) {
          content = <Tag checked={false} style={{cursor: 'auto', width: 50, marginLeft: 'auto', marginRight: 'auto'}} color={'#4CAF50'}>是</Tag>
        } else if (text === 0) {
          content = <Tag checked={false} style={{cursor: 'auto', width: 50, marginLeft: 'auto', marginRight: 'auto', color: 'black'}} color={'#E9E9E9'}>否</Tag>
        }
        return (
          content
        )
      }
    }, {
      // title: '启用时间',
      title: <FormattedMessage id='omp.code.tenantmanage.tenantmanage.tenantmanagelist.tenantstartdate' />,
      dataIndex: 'startDate',
      width: '16%',
      align: 'center',
      sorter: (a, b, c) => {}
    }, {
      // title: '创建时间',
      title: <FormattedMessage id='omp.code.tenantmanage.tenantmanage.tenantmanagelist.tenantcreationdate' />,
      dataIndex: 'creationDate',
      width: '16%',
      align: 'center',
      sorter: (a, b, c) => {}
    }, {
      // title: '失效时间',
      title: <FormattedMessage id='omp.code.tenantmanage.tenantmanage.tenantmanagelist.tenantenddate' />,
      dataIndex: 'endDate',
      width: '16%',
      align: 'center',
      sortType: 'Date',
      sorter: (a, b, c) => {}
    }, {
      // title: '操作',
      title: <FormattedMessage id='omp.project.performance.list.operation' />,
      dataIndex: 'action',
      width: '16%',
      align: 'center',
      render: (text, record) => {
        return (
          <div style={{width: 'auto', marginLeft: 'auto', marginRight: 'auto'}}>
            <Tooltip style={{marginRight: 0}} placement='bottom' title='编辑'>
              <Button onClick={(e) => { this.handleLinkToDetail(e, record.id, 1) }}><Icon type='edit' /></Button>
            </Tooltip>
            <Tooltip placement='bottom' title='启用'>
              <Popconfirm title='确定要启用该用户吗?' okText='是的' cancelText='取消'
                onConfirm={(e) => { this.handleEnabled(e, record.id) }}
              >
                <Button style={{marginLeft: 10, display: record.isEnabled === 1 ? 'none' : 'inline'}}><Icon type='check-circle-o' style={{color:'#4CAF50'}} /></Button>
              </Popconfirm>
            </Tooltip>
            <Tooltip placement='bottom' title='禁用'>
              <Popconfirm title='确定要禁用该用户吗?' okText='是的' cancelText='取消'
                onConfirm={(e) => { this.handleDisabled(e, record.id) }}
              >
                <Button type='danger' style={{marginLeft: 10, display: record.isEnabled === 1 ? 'inline' : 'none'}}><Icon type='minus-circle-o' /></Button>
              </Popconfirm>
            </Tooltip>
          </div>
        )
      }
    } ]
  }

  /**
   * data:用来向table存数据
   * allDatas:查询所得所有租户信息
   * type:筛选类型 是否启用 租户编码 租户名称
   */
  state = {
    sortOrder: 'asc',
    sortType: 'id',
    type: 'code',
    current: 1,
    totals: 0,
    data: [],
    allDatas: [],
    isSearch: false,
    pageSize: 10
  };

  /**
   * 处理用户的点击分页
   */
  handlePageChange = (page, pagesize) => {
    let _this = this
    // console.log(page)
    this.setState({
      current: page,
      pageSize: pagesize
    }, () => {
      if (this.state.isSearch) {
        _this.selectData()
      } else {
        _this.selectAll()
      }
    })
  }

  /**
   * 处理排序
   */
  handleSortChange = (page, filter, sorter) => {
    // console.log(page)
    // console.log(filter)
    // console.log(sorter)
    if (!(sorter.order)) {
      sorter.order = this.state.sortOrder
      sorter.field = this.state.sortType
    }
    let _this = this
    this.setState({
      current: page.current,
      sortOrder: sorter.order,
      sortType: sorter.field
    }, () => {
      if (this.state.isSearch) {
        _this.selectData()
      } else {
        _this.selectAll()
      }
    })
  }

  /**
   * flag为1：编辑
   * flag为0：创建
   */
  handleLinkToDetail = (e, id, flag) => {
    // console.log(flag)
    e.stopPropagation()
    this.linkToChange(`/setting/tenantmanage-updateoradd/${id}/${flag}`)
  }

  /***
   *   路径跳转
   */
  linkToChange = url => {
    const { history } = this.props
    history.push(url)
  };

  /**
   * 启用
   */
  handleEnabled = (e, id) => {
    let flag = 0
    for (let i = 0; i < this.state.data.length; i++) {
      if (this.state.data[i].id === id) {
        if ( this.state.data[i].isEnabled === 1 ) {
          flag = 0
          break
        } else if ( this.state.data[i].isEnabled === 0 ) {
          flag = 1
          break
        }
      }
    }
    if (flag === 1) {
      axios({
        method: 'post',
        url: '/organizationManager/v1/organizations/enable/' + id,
      }).then((res) => {
        // console.log(res)
        if (res.data === true) {
          message.success('启用成功')
          for (let i = 0; i < this.state.data.length; i++) {
            if (this.state.data[i].id === id) {
              // console.log(this.state.data[i])
              this.state.data[i].isEnabled = 1
              break
            }
          }
          this.setState({
            data: this.state.data
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    } else if (flag === 0) {
      message.error('该用户已启用')
    }
  }

  /**
   * 禁用
   */
  handleDisabled = (e, id) => {
    // console.log('禁用'+id)
    let flag = 0
    for (let i = 0; i < this.state.data.length; i++) {
      if (this.state.data[i].id === id) {
        if ( this.state.data[i].isEnabled === 1 ) {
          flag = 0
          break
        } else if ( this.state.data[i].isEnabled === 0 ) {
          flag = 1
          break
        }
      }
    }
    if (flag === 0) {
      axios({
        method: 'post',
        url: '/organizationManager/v1/organizations/disenable/'+ id,
      }).then((res) => {
        // console.log(res)
        if (res.data === true) {
          message.success('禁用成功')
          for (let i = 0; i < this.state.data.length; i++) {
            if (this.state.data[i].id === id) {
              this.state.data[i].isEnabled = 0
              break
            }
          }
          this.setState({
            data: this.state.data
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    } else if (flag === 1) {
      message.error('该用户已禁用')
    }
    
  }

  componentWillMount = () => {
    this.selectAll()
  }

  /**
   * 查询所有租户信息
   */
  selectAll = () => {
    // console.log('all')
    // console.log(this.state.sortOrder)
    // console.log(this.state.sortType)
    let sortOrder = 'asc'
    if (this.state.sortOrder === 'descend') {
      sortOrder = 'desc'
    } else {
      sortOrder = 'asc'
    }
    let url = '/organizationManager/v1/organizations?page=' + (this.state.current - 1) + '&size=' + this.state.pageSize + '&sort=' + this.state.sortType + ',' + sortOrder
    axios({
      method: 'get',
      url: url
    }).then((res) => {
      // console.log(res.data.content)
      this.setState({
        isSearch: false,
        allDatas: res.data.content,
        totals: res.data.totalElements
      })
      this.addToData(res.data.content)
    }).catch((err) => {
      console.log(err)
    })
  }

  /**
   * 根据筛选条件type 以及筛选内容value 获取查询结果
   */
  selectData = () => {
    // console.log('data')
    let sortOrder = 'asc'
    if (this.state.sortOrder === 'descend') {
      sortOrder = 'desc'
    } else {
      sortOrder = 'asc'
    }
    let url = '/organizationManager/v1/organizations?page=' + (this.state.current - 1) + '&size=' + this.state.pageSize + '&sort=' + this.state.sortType + ',' + sortOrder + '&' + this.state.type + '=' + this.state.searchContent
    axios({
      method: 'get',
      url: url
    }).then((res) => {
      // console.log(res.data.content)
      this.setState({
        allDatas: res.data.content,
        totals: res.data.totalElements
      })
      this.addToData(res.data.content)
    }).catch((err) => {
      console.log(err)
    })
  }

  /**
   * 将租户信息添加到表格中
   */
  addToData = (result) => {
    let order = 1
    let datas = []
    result.forEach(function (value) {
      let item = {}
      item.order = order++
      item.name = value.name
      item.code = value.code
      // if (value.isEnabled === 1) {
      //   item.isEnabled = <Tag checked={false} style={{cursor: 'auto', width: 50, marginLeft: 'auto', marginRight: 'auto'}} color={'#4CAF50'}>是</Tag>
      // } else if (value.isEnabled === 0) {
      //   item.isEnabled = <Tag checked={false} style={{cursor: 'auto', width: 50, marginLeft: 'auto', marginRight: 'auto', color: 'black'}} color={'#E9E9E9'}>否</Tag>
      // }
      item.isEnabled = value.isEnabled
      item.startDate = value.startDate
      item.creationDate = value.creationDate
      item.endDate = value.endDate
      item.id = value.id
      datas.push(item)
    })
    this.setState({
      data: datas
    })
  }

  /**
   * 获取筛选条件内容
   */
  handleFormSubmit = (value) => {
    let choose = this.props.form.getFieldValue('searchType')
    this.setState({
      type: choose,
      current: 1,
      isSearch: true,
      searchContent: value
    }, () => {
      this.selectData()
    })
  }

  /**
   * 获取筛选条件，code或者name
   */
  getType = (value) => {
    this.setState({
      type: value
    })
  }

  /**
   * 点击全部按钮
   */
  getAll = () => {
    this.setState({
      current: 1
    }, () => {
      this.selectAll()
    })
  }

  /**
   * 获取筛选条件启用或者禁用
   */
  getEnabled = (value) => {
    this.setState({
      current: 1,
      isSearch: true,
      type: 'isEnabled',
      searchContent: value
    }, () => {
      this.selectData()
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <TableLayout
        id='no'
        title={'租户信息'}
        renderTitleSide={() => (
          <Button type='primary' ghost icon='plus' style={{border: 0, fontWeight: 'bold'}} onClick={(e) => { this.handleLinkToDetail(e, 0, 0) }}><span style={{fontSize: 16, fontFamily: '微软雅黑'}}>创建新租户</span></Button>
        )} >
        <div>
          {/* <PromiseView promise={this.state.loadRegionPromise} onStateChange={this.state.loadRegionHandle} /> */}
          {/* <PromiseView promise={this.state.fetchPromise} onStateChange={this.state.fetchHandle} /> */}
          <div className={styles.CardHeader}>
            <Form layout='horizontal'>
              <div >
                <Row type='flex' style={{ justifyContent: 'space-between' }}>
                  <Col>
                    <Row type='flex'>
                      <FormItem
                        wrapperCol={{ span: 24 }}
                      >
                        <Radio.Group  size='default' defaultValue={'all'}>
                          <Radio.Button value={'all'} style={{ padding: '0px 16px' }}  onClick={this.getAll}>全部</Radio.Button>
                          <Radio.Button value={'enabled'} style={{ padding: '0px 16px' }}  onClick={(e) => this.getEnabled(1)}>启用</Radio.Button>
                          <Radio.Button value={'disabled'} style={{ padding: '0px 16px' }}  onClick={(e) => this.getEnabled(0)}>禁用</Radio.Button>
                        </Radio.Group>
                        {/* <ButtonGroup>
                          <Button style={{borderRadius: '0px'}} onClick={this.getAll}>全部</Button>
                          <Button onClick={(e) => this.getEnabled(1)}>启用</Button>
                          <Button style={{borderRadius: '0px'}} onClick={(e) => this.getEnabled(0)}>禁用</Button>
                        </ButtonGroup> */}
                      </FormItem>
                    </Row>
                  </Col>
                  <Col>
                    <Row type='flex'>
                    <Input.Group compact>
                      {/* <FormItem
                        wrapperCol={{ span: 24 }}
                      > */}
                        {getFieldDecorator('searchType', {initialValue: 'code', rules: []})(
                          <Select className={'choice'} onChange={this.getType} style={{width: 106}}>
                            <Option value={'code'} key={'code'}>租户编码</Option>
                            <Option value={'name'} key={'name'}>租户名称</Option>
                          </Select>
                        )}
                      {/* </FormItem>
                      <FormItem
                        style={{marginRight: 10}}
                        wrapperCol={{ span: 24 }}
                      > */}
                        {getFieldDecorator('keyword', {})(
                          <Search placeholder='请输入关键词' onSearch={this.handleFormSubmit} style={{width: 200}} />
                        )}
                      {/* </FormItem> */}
                      </Input.Group>
                    </Row>
                  </Col>
                </Row>
              </div>
            </Form>
          </div>
          <div >

            <Table
              size='middle'
              columns={this.columns}
              dataSource={this.state.data}
              onChange={this.handleSortChange}
              pagination={{
                pageSize: this.state.pageSize,
                current: this.state.current,
                onChange: this.handlePageChange,
                total: this.state.totals,
                showQuickJumper: true,
                showSizeChanger: true,
                onShowSizeChange: this.handlePageChange
              }}
              bordered={false}
              style={{textAlign: 'center'}}
              // onRow={(record) => {
              //   return {
              //     onDoubleClick: (e) => { this.handleLinkToDetail(e, record.id, 1) }
              //   }
              // }}
              rowKey='id'
            />
          </div>
        </div>
      </TableLayout>

    )
  }
}

export default TenantManageList
