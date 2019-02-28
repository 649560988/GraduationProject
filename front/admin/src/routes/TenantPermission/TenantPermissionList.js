import React from 'react'
import { Row, Col, Input, Select, Form, Table, Icon, Button, Tooltip, Tag, Radio } from 'antd'
import axios from 'axios'
import TableLayout from '../../layouts/TableLayout'
// import PromiseView from '../../components/PromiseView'
import styles from './index.less'
import { connect } from 'dva'
import { FormattedMessage } from 'react-intl'

const FormItem = Form.Item
const Search = Input.Search
const Option = Select.Option

@Form.create()
@connect(({ user }) => ({
  user: user
}))
class TenantPermissionList extends React.Component {
  constructor (props) {
    super(props)
    this.columns = [{
      title: <FormattedMessage id='ocms.code.resume.list.order' />,
      dataIndex: 'order',
      width: '5%',
      align: 'center',
      backgroundColor: 'white'
    }, {
      title: <FormattedMessage id='omp.code.tenantmanage.tenantmanage.tenantmanagelist.tenantname' />,
      dataIndex: 'name',
      width: '8%',
      align: 'center',
      sortType: 'string',
      render: (text, record) => {
        let content = text
        if (content.toString().length > 7) {
          content = text.toString().substring(0, 6) + '...'
        }
        return (
          <span title={record.name}>{content}</span>
        )
      }
    }, {
      title: <FormattedMessage id='omp.code.tenantmanage.tenantmanage.tenantmanagelist.tenantcode'/>,
      dataIndex: 'code',
      width: '8%',
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
      title: <FormattedMessage id='omp.code.tenantmanage.tenantmanage.tenantmanagelist.tenantisenable'/>,
      dataIndex: 'isEnabled',
      width: '6%',
      align: 'center'
    }, {
      title: <FormattedMessage id='omp.code.tenantmanage.tenantmanage.tenantmanagelist.tenantstartdate'/>,
      dataIndex: 'startDate',
      width: '16%',
      align: 'center',
      sorter: (a, b, c) => {}
    }, {
      title: <FormattedMessage id='omp.code.tenantmanage.tenantmanage.tenantmanagelist.tenantcreationdate'/>,
      dataIndex: 'creationDate',
      width: '16%',
      align: 'center',
      sorter: (a, b, c) => {}
    }, {
      title: <FormattedMessage id='omp.code.tenantmanage.tenantmanage.tenantmanagelist.tenantenddate'/>,
      dataIndex: 'endDate',
      width: '16%',
      align: 'center',
      sortType: 'Date',
      sorter: (a, b, c) => {}
    }, {
      title: <FormattedMessage id='ocms.code.resume.list.operation'/>,
      dataIndex: 'action',
      width: '12%',
      align: 'center',
      render: (text, record) => {
        return (
          <div>
            <Tooltip style={{marginRight: 0}} placement='bottom' title='编辑'>
              <Button onClick={(e) => { this.handleLinkToDetail(e, record.id) }}><Icon type='edit' /></Button>
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
    console.log(page)
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
    console.log(page)
    console.log(filter)
    console.log(sorter)
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
  handleLinkToDetail = (e, id) => {
    e.stopPropagation()
    this.linkToChange(`/setting/tenantpermissionupdate/${id}`)
  }

  /***
   *   路径跳转
   */
  linkToChange = url => {
    const { history } = this.props
    history.push(url)
  };

  componentWillMount = () => {
    this.selectAll()
  }

  /**
   * 查询所有租户信息
   */
  selectAll = () => {
    console.log('all')
    console.log(this.state.sortOrder)
    console.log(this.state.sortType)
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
      console.log(res.data.content)
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
    console.log('data')
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
      console.log(res.data.content)
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
      if (value.isEnabled === 1) {
        item.isEnabled = <Tag checked={false} style={{width: 50, marginLeft: 'auto', marginRight: 'auto',cursor:'default'}} color={'#4CAF50'}>是</Tag>
      } else if (value.isEnabled === 0) {
        item.isEnabled = <Tag checked={false} style={{width: 50, color: 'black',cursor:'default'}} color={'#E9E9E9'}>否</Tag>
      }
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
      this.selectData();
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <TableLayout
        id='no'
        title={'租户信息'}
        // renderTitleSide={() => (
        //   <Button type='primary' ghost icon='plus' style={{border: 0, fontWeight: 'bold'}} onClick={(e) => { this.handleLinkToDetail(e, 0) }}><span style={{fontSize: 16, fontFamily: 'heiti'}}>添加</span></Button>
        // )}
      >
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
                          <Radio.Button value={'all'} style={{ padding: '0px 16px' }}  onClick={this.getAll}><FormattedMessage id='omp.project.performance.list.all'/></Radio.Button>
                          <Radio.Button value={'enabled'} style={{ padding: '0px 16px' }}  onClick={(e) => this.getEnabled(1)}>启用</Radio.Button>
                          <Radio.Button value={'disabled'} style={{ padding: '0px 16px' }}  onClick={(e) => this.getEnabled(0)}>禁用</Radio.Button>
                        </Radio.Group>
                      </FormItem>
                    </Row>
                  </Col>
                  <Col>
                    <Row type='flex'>
                      <Input.Group compact>
                        {getFieldDecorator('searchType', {initialValue: 'code'})(
                          <Select className={'choice'} onChange={this.getType} style={{width: 108}}>
                            <Option value={'code'} key={'code'}><FormattedMessage id='omp.code.tenantmanage.tenantmanage.tenantmanagelist.tenantcode'/></Option>
                            <Option value={'name'} key={'name'}><FormattedMessage id='omp.code.tenantmanage.tenantmanage.tenantmanagelist.tenantname'/></Option>
                          </Select>
                        )}
                        {getFieldDecorator('keyword', {initialValue: ''})(
                        <Search style={{width: 200}} placeholder='输入关键词' onSearch={this.handleFormSubmit} />
                        )}
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
              onRow={(record) => {
                return {
                  onDoubleClick: (e) => { this.handleLinkToDetail(e, record.id) }
                }
              }}
              rowKey='id'
            />
          </div>
        </div>
      </TableLayout>

    )
  }
}

export default TenantPermissionList
