import React from 'react'
import { Table, Icon, Input, Form, message, Col, Button, Popconfirm, Tooltip} from 'antd'
import axios from 'axios/index'
import { connect } from 'dva'

// import './CompanyBaseInfoList.css';

const FormItem = Form.Item

@connect(({ process: { list}, user}) => {
  if (list && user) {
    return (
      {
        content: list.content,
        currentUser: user.currentUser,
        pagination: {
          pageSize: list.size,
          defaultCurrent: 1,
          current: list.number + 1,
          total: list.totalElements
        }
      })
  }
}
)
/****
 * created by knight on 2018/7/4
 *
 * 流程信息及筛选查询
 */
class ProcessTemplet extends React.Component {
  columns = [
    {
      title: '序号',
      dataIndex: 'id',
      width: '10%',
      key: 'id'
    },
    {
      title: '流程名称',
      dataIndex: 'processName',
      width: '25%',
      key: 'processName'
    },
    {
      title: '类型',
      dataIndex: 'resourcesName',
      width: '15%',
      key: 'resourcesName'
    },
    {
      title: '公司名称',
      dataIndex: 'companyName',
      width: '25%',
      key: 'companyName'
    }, {
      title: '操作',
      dataIndex: 'action',
      width: '25%',
      render: (text, record) => {
        console.log(record)
        return (
          <div>
            {this.props.currentUser.admin
              ? <div>
                <Tooltip title='点击编辑'>
                  <Button onClick={(e) => { this.handleUpdateClick(e, record.id) }}>
                    <Icon type='edit' /></Button>
                </Tooltip>
                {record.isDel ? <Tooltip title='启用该模板'>
                  <Button type='danger' onClick={(e) => { this.handleDeleteFalse(record.id) }}
                    style={{ marginLeft: 10 }}><Icon type='check-circle-o' /></Button>
                </Tooltip>
                  : <Popconfirm title='确定要禁用吗' okText='是的' cancelText='取消'
                    onConfirm={(e) => { this.handleDelete(record.id) }}
                  >
                    <Tooltip title='禁用这个模板'>
                      <Button type='danger' style={{ marginLeft: 10 }}><Icon type='minus-circle-o' /></Button>
                    </Tooltip>
                  </Popconfirm>}
              </div>
              : <div>
                {record.companyId === 0
                  ? <div>
                    <Tooltip title='无权编辑'>
                      <Button onClick={(e) => { this.handleUpdateClick(e, record.id) }} disabled>
                        <Icon type='edit' /></Button>
                    </Tooltip>
                    {record.isDel
                      ? <Tooltip title='无权编辑'>
                        <Button type='danger' onClick={(e) => { this.handleDeleteFalse(record.id) }} style={{ marginLeft: 10 }}
                          disabled>
                          <Icon type='check-circle-o' /></Button>
                      </Tooltip>
                      : <Tooltip title='无权编辑'>
                        <Button type='danger' style={{ marginLeft: 10 }} disabled>
                          <Icon type='minus-circle-o' /></Button>
                      </Tooltip>}
                  </div>
                  : <div>
                    <Tooltip title='点击编辑'>
                      <Button onClick={(e) => { this.handleUpdateClick(e, record.id) }} >
                        <Icon type='edit' /></Button>
                    </Tooltip>
                    {record.isDel ? <Tooltip title='启用该模板'>
                      <Button type='danger' onClick={(e) => { this.handleDeleteFalse(record.id) }} style={{ marginLeft: 10 }}
                      >
                        <Icon type='check-circle-o' /></Button>
                    </Tooltip>
                      : <Popconfirm title='确定要禁用吗' okText='是的' cancelText='取消'
                        onConfirm={(e) => { this.handleDelete(record.id) }}
                      >
                        <Tooltip title='禁用这个模板'>

                          <Button type='danger' style={{ marginLeft: 10 }} >
                            <Icon type='minus-circle-o' /></Button>
                        </Tooltip>
                      </Popconfirm>
                    }
                  </div>}
              </div>}
          </div>
        )
      }
    }
  ];

  state = {
    filterData: {
      processName: '',
      companyName: '',
      resourcesName: ''
    }
  }

  componentDidMount () {
    let companyId = this.props.currentUser.organizationId
    if (this.props.currentUser.admin) {
      companyId = 0
    }
    this.props.dispatch({
      type: 'process/fetch',
      payload: {page: 0, size: 5, companyId: companyId}
    })
    this.setState({
      companyId
    })
  }

  /**
   * 切换页码
   * @param pagination
   */
  pageChange=(pagination) => {
    const pageData = {
      page: pagination.current - 1,
      size: pagination.pageSize
    }
    const filterData = {...this.state.filterData, ...pageData, ...{companyId: this.state.companyId}}
    this.props.dispatch({
      type: 'process/fetch',
      payload: filterData
    })
  }
  /**
   * 设置筛选信息
   * @param e
   */
  setFilterData=(e) => {
    let tem = {}
    if (e.target.id === 'processName') {
      tem = { processName: e.target.value }
    } else if (e.target.id === 'companyName') {
      tem = { companyName: e.target.value }
    } else if (e.target.id === 'resourcesName') {
      tem = { resourcesName: e.target.value }
    }
    const data = {...this.state.filterData, ...tem, ...{companyId: this.state.companyId}}
    const pageData = {
      page: 0,
      size: this.props.pagination.pageSize
    }
    const filterData = {...data, ...pageData}
    // this.props.form.setFieldsValue(filterData);
    this.props.dispatch({
      type: 'process/fetch',
      payload: filterData
    })
    this.setState({
      filterData
    })
  }
  /***
   *
   * 清空三个查询输入框的内容
   */
  clearInput = () => {
    this.props.form.resetFields()
    this.setState({
      filterData: {
        processName: '',
        companyName: '',
        sourceType: ''
      }
    }, () => {
      const data = []
      const pageData = {
        page: this.props.pagination.number,
        size: 5
      }
      console.log(pageData)
      const filterData = {...data, ...pageData, ...{companyId: this.state.companyId}}
      this.props.dispatch({
        type: 'process/fetch',
        payload: filterData
      })
    })
  };
  /**
   *   点击一条记录跳转到明细页面
   */
  handleUpdateClick = (e, id) => {
    e.stopPropagation()
    this.linkToChange(`/setting/process-template-update/${id}/${this.state.companyId}`)
  }
  /***
   *   路径跳转
   */
  linkToChange = url => {
    const { history } = this.props
    history.push(url)
  };

  /***
   * 禁用模板
   * @returns {*}
   */
  handleDelete=(id) => {
    axios({
      method: 'put',
      url: 'process/v1/ocms/process/template?id=' + id
    }).then((res) => {
      if (res.data) {
        const newData = {
          page: this.props.pagination.current - 1,
          size: this.props.pagination.pageSize,
          companyId: this.state.companyId
        }
        const data1 = {...newData, ...this.state.filterData}
        message.success('禁用成功', 1)
        this.props.dispatch({
          type: 'process/fetch',
          payload: data1
        })
      } else {
        message.success('存在使用该模板的流程', 1)
      }
    }).catch((err) => {
      message.error('禁用失败', 1)
      console.log(err)
    })
  }
  handleDeleteFalse=(id) => {
    axios({
      method: 'put',
      url: 'process/v1/ocms/process/' + id,
      data: {
        isDel: 0
      }
    }).then((res) => {
      const newData = {
        page: this.props.pagination.current - 1,
        size: this.props.pagination.pageSize,
        companyId: this.state.companyId
      }
      const data1 = {...newData, ...this.state.filterData}
      message.success('启用成功', 1)
      this.props.dispatch({
        type: 'process/fetch',
        payload: data1
      })
      console.log(res.data)
    }).catch((err) => {
      message.error('启用失败', 1)
      console.log(err)
    })
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
    const list = []
    if (this.props.content) {
      for (let item of this.props.content) {
        list.push({...item, ...{key: item.id}})
      }
    }
    return (
      <div id='no'>
        <Form id='moreSearch' layout='inline' style={{marginBottom: 20}}>
          <FormItem
            {...formItemLayout}
            label='流程名称'
          >
            {getFieldDecorator('processName')(
              <Input id='processName' prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
                onChange={this.setFilterData} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='类型'
          >
            {getFieldDecorator('resourcesName')(
              <Input id='sourceType' prefix={<Icon type='contacts' style={{ color: 'rgba(0,0,0,.25)' }} />}
                onChange={this.setFilterData} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='公司名称'
          >
            {getFieldDecorator('companyName')(
              <Input id='companyName' type='companyName' prefix={<Icon type='info-circle-o' style={{ color: 'rgba(0,0,0,.25)' }} />}
                onChange={this.setFilterData} />
            )}
          </FormItem>
          <FormItem>
            <Button type='primary' onClick={() => { this.linkToChange('/setting/process-template-aad') }}>添加</Button>
          </FormItem>
          <FormItem>
            <Button onClick={this.clearInput}>重置</Button>
          </FormItem>
        </Form>
        <Table columns={this.columns}
          dataSource={list}
          pagination={this.props.pagination}
          onChange={this.pageChange}
        />
      </div>
    )
  }
}

export default Form.create()(ProcessTemplet)
