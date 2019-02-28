import React from 'react'
import { Table, Icon, Input, Form, Select, DatePicker, Row, Col, Button, Radio } from 'antd'
import axios from 'axios'
import { FormattedMessage } from 'react-intl'
import styles from './index.less'
import PromiseView from '../../components/PromiseView'
import { connect } from 'dva'
import moment from 'moment'
import TableLayout from '../../layouts/TableLayout'

const FormItem = Form.Item

@Form.create()
@connect(({ user }) => ({
  currentUser: user.currentUser,
  permissions: user.currentUser.permissions
}))
class ProjectBaseInfoList extends React.Component {
  constructor (props) {
    super(props)
    this.columns = [
      {
        // 序号
        title: <FormattedMessage id='ocms.code.resume.list.order' />,
        dataIndex: 'order',
        fixed: 'left'
      },
      {
        // 姓名
        title: <FormattedMessage id='ocms.code.resume.list.name' />,
        dataIndex: 'name'
      },
      {
        // 擅长模块
        title: <FormattedMessage id='ocms.code.resume.list.skills' />,
        dataIndex: 'skills'
      },
      {
        // 联系电话
        title: <FormattedMessage id='ocms.code.resume.list.mobile' />,
        dataIndex: 'mobile',
        width: '9%'
      },
      {
        // 从业年限
        title: <FormattedMessage id='ocms.code.resume.list.workYear' />,
        dataIndex: 'workYear',
        render: (text, record) => {
          return (
            <div>
              {!text ? '-' : {
                '1': <FormattedMessage id='ocms.code.resume.list.workYear.1' />, // '应届生',
                '2': <FormattedMessage id='ocms.code.resume.list.workYear.2' />, // '1-3年',
                '3': <FormattedMessage id='ocms.code.resume.list.workYear.3' />, // '4-6年',
                '4': <FormattedMessage id='ocms.code.resume.list.workYear.4' />, // '7-10年',
                '5': <FormattedMessage id='ocms.code.resume.list.workYear.5' /> // '10年以上'
              }[String(text)]}
            </div>
          )
        }
      },
      {
        // 邮箱
        title: <FormattedMessage id='ocms.code.resume.list.email' />,
        dataIndex: 'email'
        // width: '10%',
      },
      {
        // 评估级别
        title: <FormattedMessage id='ocms.code.resume.list.evaluationLevel' />,
        dataIndex: 'evaluationLevel'
        // width: '10%',
      },
      {
        // 外协工号
        title: <FormattedMessage id='ocms.code.resume.list.id' />,
        dataIndex: 'id'
      },
      {
        // 计划出项目日期
        title: <FormattedMessage id='ocms.code.resume.list.endWorkDate' />,
        dataIndex: 'endWorkDate',
        render: (text) => {
          return moment(text).format('YYYY-MM-DD')
        }
      },
      {
        // 性别
        title: <FormattedMessage id='ocms.code.resume.list.sex' />,
        dataIndex: 'sex',
        render: (text, record) => {
          return (
            <div>
              {[
                <FormattedMessage id='ocms.code.resume.list.sex.0' />, // 男
                <FormattedMessage id='ocms.code.resume.list.sex.1' /> // 女
              ][record.sex]}
            </div>
          )
        }
      },
      {
        // 最高学历
        title: <FormattedMessage id='ocms.code.resume.list.education' />,
        dataIndex: 'education'
      },
      {
        // 常居地
        title: <FormattedMessage id='ocms.code.resume.list.residence' />,
        dataIndex: 'residence',
        render: (text, record) => {
          return (
            <div>{this.formatResidence(text)}</div>
          )
        }
      },
      {
        // 操作
        title: <FormattedMessage id='ocms.code.resume.list.operation' />,
        key: 'operation',
        fixed: 'right',
        width: 80,
        render: (text, record) => {
          return (
            <div>
              <Button
                onClick={(e) => { this.handleLinkToDetail(e, record.id) }}
              >
                <Icon type={this.props.permissions.includes('baseinfo-service.ocms-resume.update') ? 'edit' : 'eye'} />
              </Button>
            </div>
          )
        }
      }
    ]
  }

  state = {
    regionData: [],
    pagination: {
      pageSize: 8,
      current: 1,
      total: 0
    },
    search: {},
    data: [],
    tableLoading: true,
    isMoreFormOptionsShow: false
  }

  componentDidMount () {
    this.fetchData()
    this.loadRegion()
  }

  formatResidence = (val) => {
    const { regionData } = this.state
    let result = ''
    if (!val) return result
    if (regionData.length === 0) return result
    let val2 = typeof val === 'string' ? val.split(',') : val.slice()
    let list = regionData
    while (val2.length > 0) {
      let id = val2.shift()
      // console.log(id, list)
      let current = list.find(item => item.value === id)
      if (!current) break
      result += current.label
      list = current.children
      if (!list) break
    }
    return result
  }

  loadRegion = () => {
    this.setState({
      loadRegionPromise: new Promise((resolve, reject) => {
        require.ensure([], (require) => {
          resolve(require('../../components/Resume/data.json'))
        })
      }),
      loadRegionHandle: (status, result) => {
        if (status === 'resolved') {
          this.setState({ regionData: result })
        }
      }
    })
  }
  /**
   * 条件查询
   */
  handleSearch = () => {
    this.fetchData({
      pagination: {
        ...this.state.pagination,
        current: 1
      }
    })
  }

  /***
   *  更多筛选按钮
   */
  handleClickMoreSearch = () => {
    this.setState({
      isMoreFormOptionsShow: !this.state.isMoreFormOptionsShow
    })
  }

  /***
   * 查询所有的项目信息
   */
  fetchData = (options = {}) => {
    const { pagination = this.state.pagination, search = this.state.search } = options
    const { pageSize, current } = pagination

    const { keyword, ...body } = search

    this.setState({
      search,
      fetchPromise: axios.post(`/search/resume/solr/search/${current - 1}/${pageSize}?keyword=${keyword || ''}`, {
        ...body
      }),
      fetchHandle: (status, res) => {
        if (status === 'pending') {
          this.setState({
            tableLoading: true
          })
        } else if (status === 'resolved') {
          const { list: content, total: totalElements } = res.data
          this.setState({
            tableLoading: false,
            pagination: {
              ...this.state.pagination,
              total: totalElements,
              current,
              pageSize
            },
            data: content.map((item, index) => {
              return {
                ...item,
                order: index + 1 + (current === 1 ? 0 : (current - 1) * pageSize)
              }
            })
          })
        } else {
          this.setState({
            tableLoading: false
          })
        }
      }
    })
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.fetchData({ pagination })
  }

  /***
   * 清空三个查询输入框的内容
   */
  handleReset = () => {
    this.props.form.resetFields()
    this.fetchData({
      ...this.state,
      pagination: {
        ...this.state.pagination,
        current: 1
      }
    })
  }

  /**
   * 跳转到明细页面
   */
  handleLinkToDetail = (e, id) => {
    const { history } = this.props
    e.stopPropagation()
    history.push(`/base-info-defend/external-consultant-resume/${id}`)
  }

  handleFormSubmit = (e) => {
    e.preventDefault()
    const { isMoreFormOptionsShow } = this.state
    const filterIfShow = (value) => isMoreFormOptionsShow ? value : undefined
    this.props.form.validateFields((err, values) => {
      if (err) {
        return console.error(err)
      }
      const search = {
        keyword: values.keyword,
        name: filterIfShow(values.name),
        skills: filterIfShow(values.skills),
        sex: filterIfShow(values.sex),
        endWorkDate: filterIfShow(!values.endWorkDate ? undefined : moment(values.endWorkDate).format('YYYY-MM-DD 00:00:00')),
        workYear: filterIfShow(!values.workYear ? undefined : values.workYear),
        evaluationLevel: filterIfShow(values.evaluationLevel)
      }
      this.fetchData({
        resetPage: true,
        search,
        pagination: {
          ...this.state.pagination,
          current: 1
        }
      })
    })
  }

  renderInputNumberRange = (props = {}) => {
    const value = props.value || [undefined, undefined]
    return (
      <Input.Group>
        <Input
          type={props.type}
          style={{ width: '37%', textAlign: 'center' }}
          placeholder=''
          value={value[0]}
          onChange={e => props.onChange({ target: { value: [e.target.value, value[1]] } })}
        />
        <Input
          style={{
            width: '16%',
            borderLeft: 0,
            pointerEvents: 'none',
            backgroundColor: '#fff'
          }}
          placeholder='~'
          disabled
        />
        <Input
          type={props.type}
          style={{
            width: '37%',
            textAlign: 'center',
            borderLeft: 0
          }}
          value={value[1]}
          placeholder=''
          onChange={e => props.onChange({ target: { value: [value[0], e.target.value] } })}
        />
      </Input.Group>
    )
  }

  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <TableLayout
        title={'外协顾问信息'}
        renderHeaderSide={() => (
          <Button >右侧</Button>
        )}
        renderTitleSide={() => (
          <Button >title右侧</Button>
        )}
      >
        <div >
          <PromiseView promise={this.state.loadRegionPromise} onStateChange={this.state.loadRegionHandle} />
          <PromiseView promise={this.state.fetchPromise} onStateChange={this.state.fetchHandle} />
          <div className={styles.CardHeader}>
            <Form layout='horizontal' onSubmit={this.handleFormSubmit}>
              <div >
                <Row type='flex' style={{ justifyContent: 'space-between' }}>
                  <Col />
                  <Col>
                    <Row type='flex'>
                      <FormItem
                        style={{marginRight: 10}}
                        wrapperCol={{ span: 24 }}
                      >
                        {getFieldDecorator('keyword', {})(
                          <Input placeholder='请输入关键词' onPressEnter={this.handleFormSubmit} />
                        )}
                      </FormItem>
                      <FormItem
                        style={{marginRight: 10}}
                      >
                        <Button
                          type='primary'
                          htmlType='submit'
                        >搜索</Button>
                      </FormItem>

                      <FormItem>
                        <Button
                          type='primary'
                          onClick={this.handleClickMoreSearch}
                        >
                          {this.state.isMoreFormOptionsShow ? '关闭筛选' : '更多筛选'}
                        </Button>
                      </FormItem>

                      {this.props.permissions.includes('baseinfo-service.ocms-resume.create')
                        ? <FormItem>
                          <Button type='primary'
                            onClick={(e) => { this.props.history.push('/base-info-defend/external-consultant-create') }}
                          >添加</Button>
                        </FormItem>
                        : null}
                    </Row>
                  </Col>
                </Row>
              </div>

              <div style={{ display: this.state.isMoreFormOptionsShow ? 'block' : 'none' }}>
                <Form
                  layout='horizontal'
                  style={{ paddingLeft: 20, paddingRight: 20 }}
                >
                  <Row type='flex' style={{ marginBottom: 0 }}>
                    <FormItem
                      label='性别'
                      style={{ width: 200 }}
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 20 }}
                    >
                      {getFieldDecorator('sex', {
                      })(
                        <Radio.Group>
                          <Radio value={0}>男</Radio>
                          <Radio value={1}>女</Radio>
                        </Radio.Group>
                      )}
                    </FormItem>
                    <FormItem
                      label='计划出项目日期'
                      style={{ flex: 1 }}
                      labelCol={{ span: 10 }}
                      wrapperCol={{ span: 14 }}
                    >
                      {getFieldDecorator('endWorkDate', {})(
                        <DatePicker />
                      )}
                    </FormItem>
                    <FormItem
                      style={{ flex: 1 }}
                      labelCol={{ span: 6 }}
                      wrapperCol={{ span: 18 }}
                      label='从业年限'
                    >
                      {getFieldDecorator('workYear', {
                        initialValue: '',
                        rules: []
                      })(
                        <Select>
                          <Select.Option value='1'>应届生</Select.Option>
                          <Select.Option value='2'>1-3年</Select.Option>
                          <Select.Option value='3'>4-6年</Select.Option>
                          <Select.Option value='4'>7-10年</Select.Option>
                          <Select.Option value='5'>10年以上</Select.Option>
                        </Select>
                      )}
                    </FormItem>
                  </Row>
                  <Row type='flex' style={{ justifyContent: 'flex-end', paddingRight: 30 }}>
                    <FormItem>
                      <Button onClick={this.handleReset}>重置</Button>
                    </FormItem>
                  </Row>
                </Form>
              </div>
            </Form>
          </div>
          <div >
            <Table
              loading={this.state.tableLoading}
              scroll={{ x: 1600 }}
              columns={this.columns}
              rowClassName={() => styles.Table__row}
              dataSource={this.state.data}
              pagination={this.state.pagination}
              onChange={this.handleTableChange}
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

export default ProjectBaseInfoList
