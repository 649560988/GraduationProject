import React from 'react'
import { Button, Row, Col, Input, Form, Table, Select, Tooltip, Icon, Popconfirm, message } from 'antd'
import TableLayout from '../../layouts/TableLayout'
import styles from './maintenance.less'
import { FormattedMessage } from 'react-intl'
import axios from 'axios'

const FormItem = Form.Item
const Search = Input.Search
const Option = Select.Option

@Form.create()

class ProjectMaintenance extends React.Component {

  constructor(props) {
    super(props)
    this.columns = [{
      title: <FormattedMessage id='ocms.code.resume.list.order' />,
      dataIndex: 'order',
      width: '8%',
      align: 'center',
      backgroundColor: 'white'
    }, {
      title: '项目名称',
      dataIndex: 'projectName',
      width: '22%',
      align: 'center',
      render: (text, record) => {
        let content = text
        content.toString().length > 12
          ? content = text.toString().substring(0, 12) + '...'
          : content = text
        return (
          <span title={record.projectName}>{content}</span>
        )
      }
    }, {
      title: '项目编号',
      dataIndex: 'projectNo',
      width: '20%',
      align: 'center',
      render: (text, record) => {
        let content = text
        content.toString().length > 15
          ? content = text.toString().substring(0, 15) + '...'
          : content = text
        return (
          <span title={record.projectNo}>{content}</span>
        )
      }
    }, {
      title: '项目经理',
      dataIndex: 'projectManager',
      width: '10%',
      align: 'center',
      render: (text, record) => {
        let content = text
        content.toString().length > 4
          ? content = text.toString().substring(0, 4) + '...'
          : content = text
        return (
          <span title={record.projectManager}>{content}</span>
        )
      }
    }, {
      title: '部门名称',
      dataIndex: 'deptName',
      width: '15%',
      align: 'center',
      render: (text, record) => {
        let content = text
        content.toString().length > 8
          ? content = text.toString().substring(0, 8) + '...'
          : content = text
        return (
          <span title={record.deptName}>{content}</span>
        )
      }
    }, {
      title: <FormattedMessage id='ocms.code.resume.list.operation' />,
      dataIndex: 'action',
      width: '25%',
      align: 'center',
      render: (text, record) => {
        return (
          <div>
            <Tooltip placement='bottom' title='编辑'>
              <Button onClick={(e) => { this.handleLinkToDetail(e, record.id) }}><Icon type='edit' /></Button>
            </Tooltip>
            <Tooltip placement='bottom' title='编辑项目人员'>
              <Button style={{marginLeft: 10}} onClick={(e) => { this.handleEditObjStaff(e, record) }}><Icon style={{fontSize: '14px', marginTop: '2px'}} type="team"/></Button>
            </Tooltip>
            <Tooltip placement='bottom' title='删除'>
              <Popconfirm title='确定要删除该用户吗?' okText='是的' cancelText='取消'
                onConfirm={(e) => { this.handleDeletet(e, record) }}
              >
                <Button style={{marginLeft: 10}} type='danger'><Icon type='delete' /></Button>
              </Popconfirm>
            </Tooltip>
          </div>
        )
      }
    }]
  }

  
  state = {
    data: [],
    current: 1,
    totals: 0,
    pageSize: 10,
    isSearch: false,
  }

  componentWillMount = () => {
    this.queryAllProjects()
  }

  /**
   * 编辑项目人员
   */
  handleEditObjStaff = (e, record) => {
    this.props.history.push(`/project/editStaff/${record.id}`)
  }


  /**
   * 删除项目
   */
  handleDeletet = (e, record) => {
    axios({
      method: 'delete',
      url: '/omp-projectmanage/v1/project/' + record.id + '/' + record.projectNo
    }).then((res) => {
      if (res.data) {
        if (res.data.failed === true) {
          message.error(res.data.message)
        } else {
          message.success('删除成功')
          this.queryAllProjects()
        }
      }
    }).catch((err) => {
      console.log(err)
    })
  }


  /**
   * 填充表格数据
   */
  addToData = (result) => {
    let order = 1
    let datas = []
    /**
     * 遍历之前判断是否存在
     */
    if (!result) {
      return;
    }
    result.forEach(function (value) {
      let item = {}
      item.order = order++
      item.projectName = value.projectName
      item.projectNo = value.projectNo
      item.projectManager = value.projectManager
      item.deptName = value.deptName
      item.id = value.id
      datas.push(item)
    })
    this.setState({
      data: datas
    })
  }

  /**
   * 查询所有的项目信息
   */
  queryAllProjects = () => {
    let url = '/omp-projectmanage/v1/project/getPage?page=' + (this.state.current - 1) + '&size=' + this.state.pageSize
    axios({
      method: 'post',
      url: url,
      data: {}
    }).then((res) => {
      this.setState({
        isSearch: false,
        totals: res.data.totalElements
      })
      this.addToData(res.data.content)
    }).catch((err) => {
      console.log(err)
    })
  }

  /**
   * 条件查询
   */
  queryFilterProjects = () => {
    let url = '/omp-projectmanage/v1/project/getPage?page=' + (this.state.current - 1) + '&size=' + this.state.pageSize
    let filter = {}
    this.state.type === 'projectNo' ? filter.projectNo = this.state.searchContent : filter.projectName = this.state.searchContent
    axios({
      method: 'post',
      url: url,
      data: filter
    }).then((res) => {
      this.setState({
        totals: res.data.totalElements
      })
      this.addToData(res.data.content)
    }).catch((err) => {
      console.log(err)
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
      this.queryFilterProjects()
    })
  }

  /**
 * 处理用户的点击分页
 */
  handlePageChange = (page, pagesize) => {
    let _this = this
    this.setState({
      current: page,
      pageSize: pagesize
    }, () => {
      if (this.state.isSearch) {
        _this.queryAllProjects()
      } else {
        _this.queryFilterProjects()
      }
    })
  }

  /**
   * 按钮点击事件，添加或修改项目信息
   * add：添加
   * 其他：修改
  */
  handleLinkToDetail = (e, opr) => {
    e.stopPropagation()
    this.linkToChange(`/project/maintenanceUpdate/${opr}`)
  }

  /**
   * 路径跳转
   */
  linkToChange = url => {
    const { history } = this.props
    history.push(url)
  };

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <TableLayout title={'项目维护'} renderTitleSide={
        () => (
          <Button type='primary' ghost icon='plus' style={{ border: 0, fontWeight: 'bold' }} onClick={(e) => { this.handleLinkToDetail(e, 'Add') }} >
            <span style={{ fontSize: 16, fontFamily: '微软雅黑' }}>添加</span>
          </Button>
        )
      }>
        <div>
          {/* 搜索按钮 */}
          <div className={styles.CardHeader}>
            <Form layout='horizontal'>
              <div >
                <Row type='flex' style={{ justifyContent: 'space-between' }}>
                  <Col>
                    <Row type='flex'>
                      <FormItem
                        wrapperCol={{ span: 24 }}
                      >
                      </FormItem>
                    </Row>
                  </Col>
                  <Col>
                    <Row type='flex'>
                      <Input.Group compact>
                        {getFieldDecorator('searchType', { initialValue: 'projectNo' })(
                          <Select className={'choice'} onChange={this.getType} style={{ width: 108, marginBottom: 23 }}>
                            <Option value={'projectNo'} key={'projectNo'}>项目编号</Option>
                            <Option value={'projectName'} key={'projectName'}>项目名称</Option>
                          </Select>
                        )}
                        {getFieldDecorator('keyword', { initialValue: '' })(
                          <Search style={{ width: 200 }} placeholder='输入关键词' onSearch={this.handleFormSubmit} />
                        )}
                      </Input.Group>
                    </Row>
                  </Col>
                </Row>
              </div>
            </Form>
          </div>
          {/* 显示列表 */}
          <div>
            <Table size='middle' columns={this.columns} dataSource={this.state.data} bordered={false}
              style={{ textAlign: 'center' }} rowKey='id' onChange={this.handleSortChange}
              pagination={{
                pageSize: this.state.pageSize,
                current: this.state.current,
                onChange: this.handlePageChange,
                total: this.state.totals,
                showQuickJumper: true,
                showSizeChanger: true,
                onShowSizeChange: this.handlePageChange
              }}
              onRow={(record) => {
                return {
                  onDoubleClick: (e) => { this.handleLinkToDetail(e, record.id) }
                }
              }}
              >
            </Table>
          </div>
        </div>

      </TableLayout>
    );
  }
}

export default ProjectMaintenance