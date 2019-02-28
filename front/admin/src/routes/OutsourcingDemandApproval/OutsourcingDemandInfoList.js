/****
 * created by zhuganghui on 2018/7/20
 *
 * 外协需求申请基本信息查询及显示页面
 * 提供条件查询，双击每一条记录进入对应的明细页面
 *
 */

import React from 'react'
import { Select, Table, Icon, Input, Form, Row, Col, Button, Tooltip, Popconfirm } from 'antd'
import { connect } from 'dva'
import styles from './OutsourcingDemandInfoList.css'
import axios from 'axios'
const FormItem = Form.Item
const Option = Select.Option
@Form.create()
@connect(({ user }) => ({
  user: user
}))
class OutsourcingDemandInfoList extends React.Component {
  columns = [
    {
      title: '序号',
      dataIndex: 'order',
      fixed: 'left',
      align: 'center',
      width: 80
    },
    {
      title: '外协申请号',
      dataIndex: 'demandNo',
      width: 120
    },
    {
      title: '项目名称',
      dataIndex: 'objectName',
      width: 180,
      render: (text, record) => {
        return (
          <span title={record.objectNameLong}>{text}</span>
        )
      }
    },
    {
      title: '系统',
      dataIndex: 'type',
      width: 100
    },
    {
      title: '技能',
      dataIndex: 'modular',
      width: 150,
      render: (text, record) => {
        return (
          <span title={record.modularLong}>{text}</span>
        )
      }
    },
    {
      title: '从业年限',
      dataIndex: 'employmentTime',
      width: 120
    },
    {
      title: '申请状态',
      dataIndex: 'status',
      width: 120
    },
    {
      title: '价格',
      dataIndex: 'price',
      width: 100
    },
    {
      title: '价格单位',
      dataIndex: 'priceUnit',
      width: 120
    },
    {
      title: '需求开始日期',
      dataIndex: 'remandStartDate',
      width: 200
    },
    {
      title: '需求周期（月）',
      dataIndex: 'remandCycle',
      width: 150
    },
    {
      title: '工作地点',
      dataIndex: 'workAddress',
      width: 120
    },
    {
      title: '审批状态',
      dataIndex: 'examineStatus',
      width: 120
    },
    {
      title: '审批人',
      dataIndex: 'examineRealName',
      width: 120
    },
    {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      width: 150,
      render: (text, record) => {
        let isself = (record.examineId == this.props.user.currentUser.id)
        let status = (record.examineStatus === '审批中')
        const btnApproval = (
          <Button disabled={(!isself) || (!status)} onClick={(e) => { this.handleLinkToDetail(e, record.id, 1) }} style={{marginLeft: 8}}>
            <Icon type='check' />
          </Button>
        )
        return (
          <div>
            <Tooltip placement='bottom' title='查看'>
              <Button onClick={(e) => { this.handleLinkToDetail(e, record.id, 0) }}><Icon type='eye-o' /></Button>
            </Tooltip>
            {(isself === true)
              ? <Tooltip placement='bottom' title='审批' >{btnApproval}</Tooltip> : btnApproval
            }
          </div>
        )
      }
    }
  ];

  state = {
    enterState: 0,
    current: 1,
    totals: 0,
    data: [],
    moreSearchState: true,
    moreSearchInfo: '更多筛选',
    toBeClosedIds: [], // 带批量关闭需求的id集合
    btnCloseBatchLoading: false, // 批量删除按钮loading状态
    applicationState: false // 申请状态控制按钮和复选框状态
  }

  componentWillMount () {
    this.selectData()
  }

  /***
   * 处理page跳转
   */
  handlePageChange = (page) => {
    this.setState({
      current: page
    }, () => { this.selectData() })
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
   * 根据page查询企业信息
   */
  selectData = () => {
    let search = this.props.form.getFieldValue('searchInput')
    let url = '/search/resume/solr/demand/searchExamine/' + (this.state.current - 1) + '/6'
    // let url ="/base-info/resume/ocmsDemand/getDemands/{page}/{size}?page=";
    // url+=(this.state.current-1)+"size=6";
    if (search != undefined) {
      url += '?keyword=' + search
    }
    let datas = {}
    // 获取三个输入框的输入
    // let demandNoValue = this.props.form.getFieldValue('demandNo');
    // let typeValue = this.props.form.getFieldValue('type');
    // let modularValue = this.props.form.getFieldValue('modular');
    let employmentTimeValue = this.props.form.getFieldValue('employmentTime')
    let statusValue = this.props.form.getFieldValue('status')
    let examineStatusValue = this.props.form.getFieldValue('examineStatus')

    // if(demandNoValue !== undefined){
    //   if(this.Trim(demandNoValue) !== ""){
    //     datas.demandNo = demandNoValue;
    //   }
    // }
    // if(typeValue !== undefined){
    //   if(this.Trim(typeValue) !== ""){
    //     datas.type = typeValue;
    //   }
    // }
    // if(modularValue !== undefined){
    //   if(this.Trim(modularValue) !== ""){
    //     datas.modular = modularValue;
    //   }
    // }
    if (employmentTimeValue !== undefined) {
      if (this.Trim(employmentTimeValue) !== '') {
        datas.employmentTime = employmentTimeValue
      }
    }
    if (statusValue !== undefined) {
      if (this.Trim(statusValue) !== '') {
        datas.status = statusValue
      }
    }
    if (examineStatusValue !== undefined) {
      if (this.Trim(examineStatusValue) !== '') {
        datas.examineStatus = examineStatusValue
      }
    }

    let isadmin = this.props.user.currentUser.admin
    let roleInfo = this.props.user.currentUser.role

    // TODO: 改成通过是否有权限判断(user.currentUser.permissions)
    if (roleInfo == '外协专员') {
      datas.examineId = this.props.user.currentUser.id
    }

    // 根据角色显示不同信息，项目经理只能看到发布的需求信息
    // TODO: 改成通过是否有权限判断(user.currentUser.permissions)
    if (isadmin || roleInfo == '外协专员') {
      // 调用后台的接口
      axios({
        method: 'post',
        url: url,
        data: datas
      }).then((res) => {
        console.log(res)
        let totals = res.data.total
        // let totals = res.data.totalElements;
        // 添加数据到data
        this.addTodata(res.data.list)
        // this.addTodata(res.data.content);
        this.setState({
          totals: totals
        })
      }).catch((err) => {
        console.log(err)
      })
    }
  }

  /***
   * 将查询到的结果添加到列表的data中
   */
  addTodata = (result) => {
    let datas = []
    let order = 1
    // let userid=this.props.user.currentUser.id;//等于审批人id
    // let isadmin=this.props.user.currentUser.admin;
    // if(result!==null){
    if (result != undefined || result !== null) {
      result.forEach((value) => {
        // if(value.examineStatus!=0&&(isadmin||userid==5)){
        if (value.examineStatus != 0) { // 只显示审批中审批完成审批失败，创建不显示
          let item = {}
          item.order = order++
          item.id = value.id
          // 审批人id
          item.examineId = value.examineId
          // 外协需求号
          item.demandNo = value.demandNo
          // 项目名称
          item.objectNameLong = value.objectName
          if (value.objectName !== null) {
            if (value.objectName.length > 10) {
              item.objectName = value.objectName.substring(0, 10) + '...'
            } else {
              item.objectName = value.objectName
            }
          }
          // 系统
          item.type = value.type
          // 技能
          item.modularLong = value.modular
          if (value.modular !== null) {
            if (value.modular.length > 8) {
              item.modular = value.modular.substring(0, 8) + '...'
            } else {
              item.modular = value.modular
            }
          }
          // 审批人
          item.examineRealName = value.examineRealName
          // 从业年限
          if (value.employmentTime == 0) {
            item.employmentTime = '不限'
          } else if (value.employmentTime == 1) {
            item.employmentTime = '应届生'
          } else if (value.employmentTime == 2) {
            item.employmentTime = '1-3年'
          } else if (value.employmentTime == 3) {
            item.employmentTime = '4-6年'
          } else if (value.employmentTime == 4) {
            item.employmentTime = '7-10年'
          } else if (value.employmentTime == 5) {
            item.employmentTime = '10年以上'
          }
          // 申请状态
          if (value.status == 0) {
            item.status = '有效'
          } else if (value.status == 1) {
            item.status = '失效'
          } else if (value.status == 2) {
            item.status = '关闭'
          }
          // 价格
          item.price = value.price
          // 价格单位
          if (value.priceUnit == 0) {
            item.priceUnit = '元/天'
          } else if (value.priceUnit == 1) {
            item.priceUnit = '元/月'
          }
          // 需求开始日期
          item.remandStartDate = value.remandStartDate
          // 需求周期
          item.remandCycle = value.remandCycle
          // if(value.remandCycle == 0){
          //   item.remandCycle = "不限";
          // }else if(value.remandCycle == 1){
          //   item.remandCycle = "一周内";
          // }else if(value.remandCycle == 2){
          //   item.remandCycle = "两周内";
          // }else if(value.remandCycle == 3){
          //   item.remandCycle = "一月内";
          // }
          // 工作地点
          item.workAddress = value.workAddress
          // 审批状态
          if (value.examineStatus == 0) {
            item.examineStatus = '创建'
          } else if (value.examineStatus == 1) {
            item.examineStatus = '审批中'
          } else if (value.examineStatus == 2) {
            item.examineStatus = '审批完成'
          } else if (value.examineStatus == 3) {
            item.examineStatus = '审批拒绝'
          }
          datas.push(item)
        }
      })
    }

    // 将datas 添加到state中
    this.setState({
      data: datas
    })
  }

  /***
   * 批量需求关闭
   */
  handleCloseDemands = () => {
    // console.log(this.state.toBeClosedIds.toString());
    // 设置为 loading 状态
    this.setState({
      btnCloseBatchLoading: true
    })

    let url = '/base-info/resume/ocmsDemand/downStatus?ids='
    url += this.state.toBeClosedIds.toString()

    axios({
      method: 'post',
      url: url
    }).then((res) => {
      if (res.data == true) {
        console.log('批量需求关闭成功')
        // 取消loading状态
        this.setState({
          btnCloseBatchLoading: false,
          toBeClosedIds: []
        }, () => { this.selectData() })
      }
    }).catch((err) => {
      console.log(err)
    })
  }

  /**
   * 复选框change
   * @param selectedRowKeys
   */
  handleSelectedRowChange = (selectedRowKeys) => {
    // console.log(selectedRowKeys);
    this.setState({
      toBeClosedIds: selectedRowKeys
    })
  }

  /***
   * 清空六个查询输入框的内容
   */
  handleReset = () => {
    this.props.form.resetFields()
    this.setState({
      current: 1,
      totals: 0
    }, () => { this.selectData() })
  }

  /**
   *   跳转到明细页面
   */
  handleLinkToDetail = (e, id, stat) => {
    e.stopPropagation()
    this.linkToChange(`/external-demand/outsourcingApproval/${id}/${stat}`)
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
    const rowSelection = {
      selectedRowKeys: this.state.toBeClosedIds,
      onChange: this.handleSelectedRowChange,
      getCheckboxProps: (record) => ({
        disabled: record.status !== '有效' || record.examineStatus === '审批中' || record.examineStatus === '审批拒绝' || record.examineStatus === '创建'
      })
    }
    const hasSelected = this.state.toBeClosedIds.length > 0

    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      style: {width: 300, marginBottom: 10},
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
                  <Input onPressEnter={this.handleSearch} />
                )}
              </FormItem>
            </Col>
            <Col style={{ marginRight: 200 }}>
              <FormItem>
                <Button type='primary' onClick={this.handleSearch}>搜索</Button>
              </FormItem>
            </Col>
            <Col style={{ marginRight: 20 }}>
              <FormItem>
                <Button type='primary' onClick={this.handleMoreSearch}>{this.state.moreSearchInfo}</Button>
              </FormItem>
            </Col>
            <Col >
              <FormItem>
                <Button type='primary' disabled={!hasSelected}
                  loading={this.state.btnCloseBatchLoading}
                  onClick={this.handleCloseDemands}
                >
                  需求关闭
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Form id='moreSearch' layout='horizontal' style={{display: 'none'}}>
          {/* <Row type="flex"> */}
          {/* <Col> */}
          {/* <FormItem */}
          {/* {...formItemLayout} */}
          {/* label="外协申请号" */}
          {/* > */}
          {/* {getFieldDecorator('demandNo', {})( */}
          {/* <Input/> */}
          {/* )} */}
          {/* </FormItem> */}
          {/* </Col> */}
          {/* <Col> */}
          {/* <FormItem */}
          {/* {...formItemLayout} */}
          {/* label="系统" */}
          {/* > */}
          {/* {getFieldDecorator('type', {})( */}
          {/* <Input /> */}
          {/* )} */}
          {/* </FormItem> */}
          {/* </Col> */}
          {/* <Col> */}
          {/* <FormItem */}
          {/* {...formItemLayout} */}
          {/* label="技能" */}
          {/* > */}
          {/* {getFieldDecorator('modular', {})( */}
          {/* <Input/> */}
          {/* )} */}
          {/* </FormItem> */}
          {/* </Col> */}
          {/* </Row> */}
          <Row type='flex'>
            <Col>
              <FormItem
                {...formItemLayout}
                label='从业年限'
              >
                {getFieldDecorator('employmentTime', {})(
                  <Select placeholder='选择从业年限'>
                    <Option value='0'>不限</Option>
                    <Option value='1'>应届生</Option>
                    <Option value='2'>1-3年</Option>
                    <Option value='3'>4-6年</Option>
                    <Option value='4'>7-10年</Option>
                    <Option value='5'>10年以上</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col>
              <FormItem
                {...formItemLayout}
                label='申请状态'
              >
                {getFieldDecorator('status', {})(
                  <Select placeholder='选择申请状态'>
                    <Option value='0'>有效</Option>
                    <Option value='1'>失效</Option>
                    <Option value='2'>关闭</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col>
              <FormItem
                {...formItemLayout}
                label='审批状态'
              >
                {getFieldDecorator('examineStatus', {})(
                  <Select placeholder='选择审批状态'>
                    <Option value='1'>审批中</Option>
                    <Option value='2'>审批完成</Option>
                    <Option value='3'>审批拒绝</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col style={{marginLeft: 50}}>
              <FormItem>
                <Button onClick={this.handleReset}>重置</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>

        <Table columns={this.columns}
          dataSource={this.state.data}
          rowClassName={() => styles.Table__row}
          rowSelection={rowSelection}
          scroll={{ x: 1900 }}
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

export default OutsourcingDemandInfoList
