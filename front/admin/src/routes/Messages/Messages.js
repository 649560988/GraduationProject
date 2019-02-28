import React from 'react'
import { Row, Col, Input, Select, Form, Table, Icon, Button, Tooltip, Modal, Popconfirm } from 'antd'
import axios from 'axios'
import TableLayout from '../../layouts/TableLayout'
// import PromiseView from '../../components/PromiseView'
import styles from './index.less'
import { connect } from 'dva'
import request from '../../utils/request'
import { FormattedMessage } from 'react-intl'

const FormItem = Form.Item
const Search = Input.Search
const Option = Select.Option

/***
 *删除成功弹窗
*/
function success () {
const modal = Modal.success({
    title: '删除成功',
    content: '删除成功'
})
setTimeout(() => modal.destroy(), 1000)
}
/***
 *删除失败弹窗
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
class SupplierMaintenanceList extends React.Component {
  constructor (props) {
    super(props)
    this.columns = [{
      title: '序号',
      dataIndex: 'order',
      width: '5%',
      align: 'center',
      backgroundColor: 'white'
    }, {
      title: '标题',
      dataIndex: 'title',
      width: '25%',
      align: 'center',
      sortType: 'string',
      render: (text, record) => {
        let content = text
        if (content.toString().length > 20) {
          content = text.toString().substring(0, 19) + '...'
        }
        return (
          <span title={record.code}>{content}</span>
        )
      }
    }, {
      title: '消息内容',
      dataIndex: 'content',
      align: 'center',
      render: (text, record) => {
        let content = text
        if (content.toString().length > 20) {
          content = text.toString().substring(0, 19) + '...'
        }
        return (
          <span title={record.name}>{content}</span>
        )
      }
    },   {
      title: '操作',
      dataIndex: 'action',
      width: '15%',
      align: 'center',
      render: (text, record) => {
        return (
            <div>
                <Tooltip placement='bottom' title='编辑'>
                    <Button onClick={(e) => { this.handleLinkToDetail(e, record.id) }}><Icon type='edit' /></Button>
                </Tooltip>
                <Tooltip placement='bottom' title='删除'>
                    <Popconfirm title='确定要删除吗' okText='是的' cancelText='取消'
                        onConfirm={(e) => { this.handleDelete(e, record.id) }}
                    >
                        <Button type='danger' style={{ marginLeft: 10, marginRight: 10 }}><Icon type='delete' /></Button>
                    </Popconfirm>
                </Tooltip>
            </div>
        )
      }
    } ]
  }

  /**
   * data:用来向table存数据
   * type:筛选类型 编码 名称
   */
  state = {
    type: 'code',
    current: 1,
    totals: 0,
    data: [],
    isSearch: false,
    pageSize: 10
  };

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
    this.linkToChange(`/messagesDetail/${id}`)
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
    let url = '/v1/message/queryAll?pageNo=' + (this.state.current) + '&pageSize=' + this.state.pageSize 

    request(url, {
      method: 'GET'
    }).then((res) => {
        if (res.message === '成功') {
          this.setState({
            isSearch: false,
            totals: res.data.total
          })
          this.addToData(res.data.list)
        } else {
          console.log(err)
        }
    }).catch(() => {

    })
  }

  /**
   * 根据筛选条件type 以及筛选内容value 获取查询结果
   */
  selectData = () => {
    let url = ''
    if (!this.state.searchContent) {
        url = '/v1/message/queryAll?pageNo=' + this.state.current + '&pageSize=' + this.state.pageSize
    } else {
        url = '/v1/message/queryAll?pageNo=' + this.state.current + '&pageSize=' + this.state.pageSize + '&title=' + this.state.searchContent
    }
    request(url, {
      method: 'GET'
    }).then((res) => {
        if (res.message === '成功') {
          this.setState({
            totals: res.data.total
          })
          this.addToData(res.data.list)
        } else {
          console.log(err)
        }
    }).catch(() => {
      console.log("请求错误")
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
      item.id = value.id
      item.title = value.title
      item.content = value.content
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
    this.setState({
      current: 1,
      searchContent: value
    }, () => {
      this.selectData()
    })
  }
  /**
   * 删除一条记录
  */
  handleDelete = (e, id) => {
    console.log(id)
    e.stopPropagation()
    // 调用后台接口删除一条记录
    let url = '/v1/message/delete/'
    url += id
    // 删除数据
    request(url,{
      method: 'GET'
    }).then((res) => {
      if (res.message == '成功') {
        // 过滤掉删除的信息
        // const { data } = this.state
        // const nextData = data.filter(item => item.id !== id)
        // this.setState({
        //     data: nextData
        // }, () => {
        //     this.selectData()
        // })
        this.selectData()
        success()
      } else {
        error(res.data.message)
      }
    }).catch((err) => {
      console.log(err)
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
        title={'消息管理'}
        renderTitleSide={() => (
            <Button type='primary' ghost icon='plus' style={{border: 0, fontWeight: 'bold'}} onClick={(e) => { this.handleLinkToDetail(e, 0) }}><span style={{fontSize: 16, fontFamily: '微软雅黑'}}>添加</span></Button>
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
                      </FormItem>
                    </Row>
                  </Col>
                  <Col>
                    <Row type='flex'>
                      <Input.Group compact>
                        {getFieldDecorator('searchType', {initialValue: 'code'})(
                          <Select className={'choice'} onChange={this.getType} open={false} showArrow={false} style={{width: 108,marginBottom:23}}>
                            <Option checked={true} value={'code'} key={'code'}>消息标题</Option>
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

export default SupplierMaintenanceList
