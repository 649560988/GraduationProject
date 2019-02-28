/****
 * created by zhuganghui on 2018/7/20
 *
 * 项目信息查询及显示页面
 * 提供条件查询，双击每一条记录进入对应的明细页面
 */
import React from 'react'
import { Table, Icon, Input, Form, Row, Col, Button, Popconfirm, Tooltip, Modal, Select } from 'antd'
import axios from 'axios'
import { connect } from 'dva'
import styles from './ProjectBaseInfoList.css'
const FormItem = Form.Item

/***
 *保存成功弹窗
 */
function success () {
  const modal = Modal.success({
    title: '删除成功',
    content: '删除成功'
  })
  setTimeout(() => modal.destroy(), 1000)
}
/***
 *保存失败弹窗
 */
function error (reason) {
  Modal.error({
    title: '删除失败',
    content: reason
  })
}
@Form.create()
@connect(({ user }) => ({
  user: user
}))
class ProjectBaseInfoList extends React.Component {
  state = {
    enterState: 0,
    current: 1,
    totals: 0,
    data: [],
    moreSearchState: true,
    moreSearchInfo: '更多筛选'
  }

  columns = [
    {
      title: '序号',
      dataIndex: 'order',
      width: '6%'
    },
    {
      title: '项目编号',
      dataIndex: 'objectNo',
      width: '12%',
      render: (text, record) => {
        return (
          <span title={record.objectNoLong}>{text}</span>
        )
      }
    },
    {
      title: '项目名称',
      dataIndex: 'objectName',
      width: '12%',
      render: (text, record) => {
        return (
          <span title={record.objectNameLong}>{text}</span>
        )
      }
    },
    {
      title: '项目经理',
      dataIndex: 'objectManager',
      width: '10%',
      render: (text, record) => {
        return (
          <span title={record.objectManagerLong}>{text}</span>
        )
      }
    },
    {
      title: '项目状态',
      dataIndex: 'status',
      width: '9%'
    },
    {
      title: '开始日期',
      dataIndex: 'objectStartDate',
      width: '10%'
    },
    {
      title: '结束日期',
      dataIndex: 'objectEndDate',
      width: '10%'
    },
    {
      title: '所属公司',
      dataIndex: 'companyName',
      width: '12%',
      render: (text, record) => {
        return (
          <span title={record.companyNameLong}>{text}</span>
        )
      }
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: '19%',
      render: (text, record) => {
        return (
          <div>
            {this.state.enterState == 0
              ? <div>
                <Tooltip placement='bottom' title='编辑'>
                  <Button onClick={(e) => { this.handleLinkToDetail(e, record.id) }}><Icon type='edit' /></Button>
                </Tooltip>
                <Tooltip placement='bottom' title='删除'>
                  <Popconfirm title='确定要删除吗' okText='是的' cancelText='取消'
                    onConfirm={(e) => { this.handleDelete(e, record.id) }}
                  >
                    <Button type='danger' style={{marginLeft: 10, marginRight: 10}}><Icon type='delete' /></Button>
                  </Popconfirm>
                </Tooltip>
                <Tooltip placement='bottom' title='添加需求信息'>
                  <Button onClick={(e) => { this.handleLinkToDemand(e, record.id) }}><Icon type='plus' /></Button>
                </Tooltip>
              </div>
              : <div />
            }
          </div>
        )
      }
    }
  ];

  componentWillMount () {
    let isadmin = this.props.user.currentUser.admin
    if (isadmin == true) {
      this.setState({
        enterState: 1
      })
    }
    this.selectData()
  }
  /**
   * 条件查询
   */
  handleSearch = () => {
    this.setState({
      current: 1,
      totals: 0
    }, () => { this.selectData() })
  }

  /***
   * 处理page跳转
   */
  handlePageChange = (page) => {
    // console.log(page);
    this.setState({
      current: page
    }, () => { this.selectData() })
  }

  /***
   * 根据page查询企业信息
   */
  selectData = () => {
    // let url = "/base-info/resume/ocmsObject/page?";
    // url += "page="+ (this.state.current-1) + "&size=6";
    let url = '/search/resume/solr/Object/search/'
    url += (this.state.current - 1) + '/6'

    let searchInputValue = this.props.form.getFieldValue('searchInput')
    if (searchInputValue !== undefined) {
      if (this.Trim(searchInputValue) !== '') {
        url += '?keyword=' + searchInputValue
      }
    }

    let datas = {}
    // 获取下拉框的输入
    let statusValue = this.props.form.getFieldValue('status')
    let created = this.props.user.currentUser.id

    let role = this.props.user.currentUser.role
    let isadmin = this.props.user.currentUser.admin
    // TODO: 改成通过是否有权限判断(user.currentUser.permissions)
    if (!isadmin && role == '项目经理') {
      datas.createdBy = created
    }
    if (statusValue !== undefined) {
      if (this.Trim(statusValue) !== '') {
        datas.status = statusValue
      }
    }

    // 调用后台的接口
    axios({
      method: 'post',
      url: url,
      data: datas
    }).then((res) => {
      let totals = res.data.total
      // 添加数据到data
      this.addTodata(res.data.list)
      this.setState({
        totals: totals
      })
    }).catch((err) => {
      console.log(err)
    })
  }

  /***
   *  更多筛选按钮
   */
  handleMoreSearch = () => {
    let moreSearchForm = document.getElementById('moreSearch')
    // 改变筛选按钮的状态
    if (this.state.moreSearchState) {
      moreSearchForm.style.display = 'block'
      this.setState({
        moreSearchState: false,
        moreSearchInfo: '关闭筛选'
      })
    } else {
      moreSearchForm.style.display = 'none'
      this.setState({
        moreSearchState: true,
        moreSearchInfo: '更多筛选'
      })
      this.handleReset()
    }
  }

  /***
   * 将查询到的结果添加到列表的data中
   */
  addTodata = (result) => {
    let datas = []
    let order = 1
    result.forEach(function (value) {
      let item = {}
      item.order = order++
      item.id = value.id
      item.objectNoLong = value.objectNo
      if ((value.objectNo != null) && (value.objectNo.length > 8)) {
        item.objectNo = value.objectNo.substring(0, 8) + '...'
      } else {
        item.objectNo = value.objectNo
      }
      item.objectNameLong = value.objectName
      if ((value.objectName != null) && (value.objectName.length > 5)) {
        item.objectName = value.objectName.substring(0, 5) + '...'
      } else {
        item.objectName = value.objectName
      }
      item.objectManagerLong = value.objectManager
      if ((value.objectManager != null) && (value.objectManager.length > 4)) {
        item.objectManager = value.objectManager.substring(0, 4) + '...'
      } else {
        item.objectManager = value.objectManager
      }
      item.status = value.status === 0 ? '有效' : '无效'
      item.objectStartDate = new Date(value.objectStartDate).toLocaleDateString()
      item.objectEndDate = new Date(value.objectEndDate).toLocaleDateString()
      item.companyNameLong = value.companyName
      if ((value.companyName != null) && (value.companyName.length > 5)) {
        item.companyName = value.companyName.substring(0, 5) + '...'
      } else {
        item.companyName = value.companyName
      }
      datas.push(item)
    })

    // 将datas 添加到state中
    this.setState({
      data: datas
    })
  }

  /**
   * 删除一条记录
   */
  handleDelete = (e, id) => {
    e.stopPropagation()
    // 调用后台接口删除一条记录

    let url = '/base-info/resume/ocmsObject/'
    url += id
    // 删除数据

    axios({
      method: 'delete',
      url: url
    }).then((res) => {
      console.log(res)
      if (res.data === true) {
        axios({
          method: 'post',
          url: '/search/resume/solr/Object/deltaImport',
          data: {}
        }).then((res) => {
          if (res.status === 200) {
            // 过滤掉删除的信息
            const { data } = this.state
            const nextData = data.filter(item => item.id !== id)
            this.setState({
              data: nextData
            }, () => {
              this.selectData()
            })
            success()
          }
        }).catch((err) => {
          console.log(err)
          error(err)
        })
      } else {
        error(res.data.message)
      }
    }).catch((err) => {
      console.log(err)
    })
  }

  /***
   * 清空三个查询输入框的内容
   */
  handleReset = () => {
    this.props.form.resetFields()
    this.setState({
      current: 1,
      totals: 0
    }, () => { this.selectData() })
  }

  /**
   * 去除两端空格
   * @param str
   * @returns {*}
   * @constructor
   */
  Trim = (str) => {
    return str.replace(/(^\s*)|(\s*$)/g, '')
  }

  /**
   *   跳转到明细页面
   */
  handleLinkToDetail = (e, id) => {
    e.stopPropagation()
    this.linkToChange(`/base-info-defend/projectUpdate/${id}`)
  }
  /**
   *   跳转到需求页面
   */
  handleLinkToDemand = (e, id) => {
    e.stopPropagation()
    this.linkToChange(`/external-demand/applicationDetail/1/0/${id}`)
  }

  /***
   *   路径跳转
   */
  linkToChange = url => {
    const { history } = this.props
    history.push(url)
  };

  /**
   * 去除两端空格
   * @param str
   * @returns {*}
   * @constructor
   */
  Trim = (str) => {
    return str.replace(/(^\s*)|(\s*$)/g, '')
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    }

    return (
      <div id='no'>
        <Form layout='horizontal'>
          <Row type='flex' style={{marginLeft: 20}}>
            <Col xs={{span: 12}} style={{ marginRight: 20}}>
              <FormItem
                wrapperCol={{span: 24}}
              >
                {getFieldDecorator('searchInput', {})(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col style={{ marginRight: 87}}>
              <FormItem>
                <Button type='primary' onClick={this.handleSearch}>搜索</Button>
              </FormItem>
            </Col>
            <Col style={{ marginRight: 20}}>
              <FormItem>
                <Button type='primary' onClick={this.handleMoreSearch}>{this.state.moreSearchInfo}</Button>
              </FormItem>
            </Col>
            {this.state.enterState == 0
              ? <Col>
                <FormItem>
                  <Button type='primary'
                    onClick={(e) => { this.handleLinkToDetail(e, 0) }}
                  >添加</Button>
                </FormItem>
              </Col>
              : <Col />
            }
          </Row>
        </Form>
        <Form id='moreSearch' layout='inline' style={{display: 'none', marginBottom: 20}}>
          <FormItem label='使用状态' style={{ marginLeft: 20 }}>
            {getFieldDecorator('status', {
              initialValue: this.state.data.status
            })(
              <Select placeholder='请选择使用状态' style={{width: 200}}>
                <Option value='0'>有效</Option>
                <Option value='1'>无效</Option>
              </Select>
            )}
          </FormItem>
          <FormItem>
            <Button onClick={this.handleReset}>重置</Button>
          </FormItem>
        </Form>
        <Table columns={this.columns}
          dataSource={this.state.data}
          rowClassName={() => styles.Table__row}
          pagination={{
            pageSize: 6,
            current: this.state.current,
            onChange: this.handlePageChange,
            total: this.state.totals
          }}
          rowKey='id'
        />
      </div>

    )
  }
}

export default ProjectBaseInfoList
