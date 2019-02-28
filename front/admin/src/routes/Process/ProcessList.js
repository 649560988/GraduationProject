import React from 'react'
import { Table, Icon, Input, Form, Row, Col, Button, Popconfirm } from 'antd'

import axios from 'axios'
import { connect } from 'dva'

// import './CompanyBaseInfoList.css';

const FormItem = Form.Item

@connect(({ process: { list}, loading }) => {
  return (
    {
      list,
      loading: 1
    })
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
      dataIndex: 'sourceType',
      width: '15%',
      key: 'sourceType'
    },
    {
      title: '公司名称',
      dataIndex: 'corporateName',
      width: '25%',
      key: 'corporateName'
    }, {
      title: '操作',
      dataIndex: 'action',
      width: '25%',
      render: (text, record) => {
        return (
          <div>
            <Button onClick={(e) => { this.handleUpdateClick(e, record.id) }}><Icon type='edit' /></Button>

            <Popconfirm title='确定要删除吗' okText='是的' cancelText='取消'
              onConfirm={(e) => { this.handleDelete(record.id) }}
            >
              <Button type='danger' style={{marginLeft: 10}}><Icon type='delete' /></Button>
            </Popconfirm>

          </div>
        )
      }
    }
  ];

  state = {
    pagination: {
      pageSize: 6,
      defaultCurrent: 1
    },
    filterData: {
      processName: '',
      corporateName: '',
      sourceType: ''
    },
    tree: 1
  }

  componentWillMount () {
  }

  setFilterData=(e) => {
    let tem = {}
    if (e.target.id === 'processName') {
      tem = { processName: e.target.value }
    } else if (e.target.id === 'corporateName') {
      tem = { corporateName: e.target.value }
    } else if (e.target.id === 'sourceType') {
      tem = { sourceType: e.target.value }
    }
    const filterData = {...this.state.filterData, ...tem}
    this.props.form.setFieldsValue(filterData)
    this.props.dispatch({
      type: 'process/fetch',
      payload: filterData
    })
    this.setState({
      filterData
    })
  }
  /***
   * 清空三个查询输入框的内容
   */
  clearInput = () => {
    this.props.form.resetFields()
    this.setState({
      filterData: {
        processName: '',
        corporateName: '',
        sourceType: ''
      }
    })
  };
  /**
   *   点击一条记录跳转到明细页面
   */
  handleUpdateClick = (id) => {
    console.log(id)
    this.linkToChange(`/setting/ProcessMake`)
  }
  /***
   *   路径跳转
   */
  linkToChange = url => {
    const { history } = this.props
    history.push(url)
  };

  /***
   * 删除模板
   * @returns {*}
   */
  handleDelete=(id) => {
    console.log('删除' + id)
  }
  render () {
    console.log(this.props.list)
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
            {getFieldDecorator('sourceType')(
              <Input id='sourceType' prefix={<Icon type='contacts' style={{ color: 'rgba(0,0,0,.25)' }} />}
                onChange={this.setFilterData} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='公司名称'
          >
            {getFieldDecorator('corporateName')(
              <Input id='corporateName' type='corporateName' prefix={<Icon type='info-circle-o' style={{ color: 'rgba(0,0,0,.25)' }} />}
                onChange={this.setFilterData} />
            )}
          </FormItem>
          <FormItem>
            <Button type='primary' onClick={() => { this.linkToChange('/process/ProcessMake') }}>添加</Button>
          </FormItem>
          <FormItem>
            <Button onClick={this.clearInput}>重置</Button>
          </FormItem>
        </Form>
        <Table columns={this.columns}
          dataSource={this.props.list}
          pagination={this.state.pagination}
        />
      </div>
    )
  }
}

export default Form.create()(ProcessTemplet)
