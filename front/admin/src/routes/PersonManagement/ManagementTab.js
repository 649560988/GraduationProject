import React from 'react'
import { Select, Tag, Modal, Table, Icon, Input, Form, Row, Col, Button, Popconfirm, Tooltip } from 'antd'
import axios from 'axios'
import {connect} from 'dva/index'
import TableLayout from '../../layouts/TableLayout'
import Tanchen from '../FromList/index'

// const FormItem = Form.Item
const Option = Select.Option
const Search = Input.Search
@Form.create()
@connect(({ user }) => ({
  user: user
}))
class ManagementTab extends React.Component {
  /**
   * 分页失败**************************
   * @type {*[]}
   */

  columns = [
    {
      title: '序号',
      dataIndex: 'order',
      width: '5%',
      align: 'center'
    },
    {
      title: '用户名',
      dataIndex: 'login_name', 
      width: '10%',
      align: 'center',
      render: (text, record) => {
        if (text) {
          if (text.length > 6) {
            text = text.toString().substring(0, 5) + '...'
          }
        }
        return (
          <span title={record.login_name}>{text}</span>
        )
      }
    },{
      title: '工号',
      dataIndex: 'job_number', 
      width: '8%',
      align: 'center',
      render: (text, record) => {
        if (text) {
          if (text.length > 6) {
            text = text.toString().substring(0, 5) + '...'
          }
        }
        return (
          <span title={record.job_number}>{text}</span>
        )
      }
    },
    {
      title: '电子邮箱',
      dataIndex: 'email',
      width: '11%',
      align: 'center',
      render: (text, record) => {
        if (text) {
          if (text.length > 15) {
            text = text.toString().substring(0, 12) + '...'
          }
        }
        return (
          <span title={record.email}>{text}</span>
        )
      }
    },
    // {
    //   title: '公司名称',
    //   dataIndex: 'corporateName',
    //   width: '19%',
    //   align: 'center',
    //   render: (text, record) => {
    //     return (
    //       <span title={record.corporateNameLong}>{text}</span>
    //     )
    //   }
    // },
    {
      title: '真实姓名',
      dataIndex: 'real_name',
      width: '9%',
      align: 'center',
      render: (text, record) => {
        if (text) {
          if (text.length > 6) {
            text = text.toString().substring(0, 5) + '...'
          }
        }
        return (
          <span title={record.real_name}>{text}</span>
        )
      }
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: '11%',
      align: 'center',
      render: (text) => {
        return (
          <span title={text}>{text}</span>
        )
      }
    },
    {
      title: '用户是否启用',
      dataIndex: 'is_enabled',
      width: '9%',
      align: 'center',
      render: (text) => {
        let tag = ''
        if (text === '是') {
          tag = <Tag checked={false} style={{cursor: 'auto', width: 50, marginLeft: 'auto', marginRight: 'auto'}} color={'#4CAF50'}>是</Tag>
        } else if (text === '否') {
          tag = <Tag checked={false} style={{cursor: 'auto', width: 50, color: 'black', marginLeft: 'auto', marginRight: 'auto'}} color={'#E9E9E9'}>否</Tag>
        }
        return (
          tag
        )
      }
    },
    // {
    //   title: '用户是否为管理员',
    //   dataIndex: 'admin',
    //   width: '12%',
    //   align: 'center'
    // },
    {
      title: '操作',
      dataIndex: 'action',
      width: '14%',
      align: 'center',
      render: (text, record) => {
        let tag = ''
        if(record.is_enabled === '是'){
          tag = <Tooltip placement='bottom' title='禁用'>
          <Popconfirm title='确定要禁用该用户吗' okText='是的' cancelText='取消'
            onConfirm={(e) => { this.handleDisabled(e,record.is_enabled, record.id) }}
          >
            <Button type='danger' style={{marginLeft: 10}}><Icon type='minus-circle-o' /></Button>
          </Popconfirm>
          </Tooltip>
        }else if(record.is_enabled === '否'){
          tag = <Tooltip placement='bottom' title='启用'>
          <Popconfirm title='确定要启用该用户吗' okText='是的' cancelText='取消'
            onConfirm={(e) => { this.handleDisabled(e,record.is_enabled, record.id) }}
          >
            <Button style={{marginLeft: 10}}><Icon type='check-circle-o' style={{color:'#4CAF50'}} /></Button>
          </Popconfirm>
          </Tooltip>
        }
        return (
          <div>
            <Tooltip style={{marginRight: 0}} placement='bottom' title='编辑'>
              <Button onClick={(e) => { this.handleLinkToDetail(e, record.id, record.organization_id, 1) }}><Icon type='edit' /></Button>
            </Tooltip>
            <Tooltip style={{marginRight: 0}} placement='bottom' title='简历'>
              <Button style={{marginLeft: 10}} onClick={(e) => { this.showModal(e, record.id) }}><Icon type='copy' /></Button>
            </Tooltip>
            {tag}
          </div>
        )
      }
    }
  ];

  state = {
    pagesize: 10,
    isCompanyManag: false,
    currentOrganizationId: 1,
    currentRole: [],
    children: [],
    current: 1,
    totals: 0,
    data: [],
    moreSearchState: true,
    moreSearchInfo: '更多筛选',
    value: undefined,
    id: -1,
    userId: -1,
    a: true,
    isSearch: false,
    searchContentLoginName: '',
    searchContentRealName: '',
    type: 'realName',
    values: {},
    visible: false
  };

  componentWillMount () {
    // console.log(this.props.user.currentUser);
    this.setState({
      currentRole: this.props.user.currentUser.roleNameList,
      currentOrganizationId: this.props.user.currentUser.organizationId
    }, () => {
      
    })
    this.selectAll()
  }

  /***
   * 查询所有的外包人员信息
   */
  selectAll = () => {
    let _this = this
    let url = '/iam-ext/v1/outsourcer' + '?'
    url += 'page=' + (this.state.current - 1) + '&size=' + this.state.pagesize
    axios({
      method: 'get',
      url: url,
      data: {}
    }).then((res) => {
      console.log(res)
      let totals = res.data.totalElements
      this.setState({
        isSearch: false,
        totals: totals
      })
      this.addTodata(res.data.content, _this)
    }).catch((err) => {
      console.log(err)
    })
  };

  /**
   * 条件查询
   */
  handleSearch = (values) => {
    this.setState({
      current: 1,
      totals: 0
    }, () => { this.selectData(values) })
  };
  /***
   * 根据用户输入信息查询信息
   */
  selectData = (values) => {
    let url = ''
    console.log(values)
    let type = values.searchType
    let keyword = values.keyword
    let datas = {}
    url = '/iam-ext/v1/outsourcer' + '?'
    url += 'page=' + (this.state.current - 1) + '&size=' + this.state.pagesize
    if (type === 'loginName') {
      datas = {
        loginName: keyword
      }
    } else if (type === 'realName') {
      datas = {
        realName: keyword
      }
    }

    // console.log(url);
    // 调用后台的接口
    axios({
      method: 'get',
      url: url,
      params: datas
    }).then((res) => {
      console.log(res)
      let totals = res.data.totalElements
      this.setState({
        // isSearch: false,
        totals: totals
      })
      this.addTodata(res.data.content, this)
    }).catch((err) => {
      console.log(err)
    })
  };

  /***
   * 将查询到的结果添加到列表的data中
   */
  addTodata = (result, _this) => {
    let datas = []
    let order = 1
    result.forEach(function (value) {
      let item = {}
      item.order = order++
      item.id = value.id
      item.organizationId = value.organizationId
      item.login_name = value.login_name
      item.email = value.email
      item.real_name = value.real_name
      item.phone = value.phone
      item.job_number = value.id
      item.is_enabled = value.is_enabled === 1 ? '是' : '否'
      datas.push(item)
    })
    // 将datas 添加到state中
    this.setState({
      data: datas
    })
  };

  /**
   * 禁用用户
   */
  handleDisabled = (e,isEnabled, id) => {
    e.stopPropagation()
    if(isEnabled === '否'){
      axios({
        method: 'post',
        url: '/iam-ext/v1/outsourcer/enable/' + id
      }).then((res) => {
        const modal = Modal.success({
          title: '启用成功',
          content: '启用成功'
        })
        setTimeout(() => modal.destroy(), 2000)
        this.selectAll()
      }).catch((err) => {
        console.log(err)
      })
    }else{
      axios({
        method: 'post',
        url: '/iam-ext/v1/outsourcer/' + id
      }).then((res) => {
        const modal = Modal.success({
          title: '禁用成功',
          content: '禁用成功'
        })
        setTimeout(() => modal.destroy(), 2000)
        this.selectAll()
      }).catch((err) => {
        console.log(err)
      })
    }
  };

  // 简历弹窗
  showModal = (e, id) => {
    e.stopPropagation()
    this.setState({
      visible: true,
      userId:id
    });
  }

  onCancel = () => {
    this.setState({
      visible: false
    });
  }

  /***
   * 清空两个查询输入框的内容
   */
  handleReset = () => {
    this.props.form.resetFields()
    this.setState({
      isSearch: false,
      current: 1,
      totals: 0
    }, () => { this.selectAll() })
  };

  /**
   *   跳转到编辑或添加页面
   *   flag为1：更新
   *   flag为0：添加
   */
  handleLinkToDetail = (e, userId, oId, flag) => {
    e.stopPropagation()
    this.linkToChange(`/project/personmanageupdate/${userId}/${oId}/${flag}`)
  };

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

  handleKeyDown =() => {
    this.handleSubmit()
  };

  /**
   * 表单提交事件，验证通过则通过handleSearch()调用后台接口
   * @param e
   */
  handleSubmit = (e) => {
    // e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          isSearch: true
        }, () => {
          // console.log(values)
          this.setState({
            values: values
          }, () => {
            this.handleSearch(values)
          })
        })
        // console.log('Received values of form: ', values);
      }
    })
  };

  /***
   * 处理page跳转
   */
  handlePageChange = (page, pagesize) => {
    // console.log(page);
    this.setState({
      current: page,
      pagesize: pagesize
    }, () => {
      if (this.state.isSearch) {
        this.selectData(this.state.values)
      } else {
        this.selectAll()
      }
    })
  }

  handleSubmitLoginName = (e) => {
    this.setState({
      searchContentLoginName: e.target.value
    })
  }

  handleSubmitRealName = (e) => {
    this.setState({
      searchContentRealName: e.target.value
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

  render () {
    const { getFieldDecorator } = this.props.form

    return (
      <TableLayout
        title={'顾问维护'}
        renderTitleSide={() => (
          <Button type='primary' ghost icon='plus' style={{border: 0, fontWeight: 'bold'}} onClick={(e) => { this.handleLinkToDetail(e, -1, -1, 0) }}><span style={{fontSize: 16, fontFamily: '微软雅黑'}}>创建人员</span></Button>
        )}
        id='no'>
        <div>
        <Form layout='horizontal'>
          <Row type='flex' style={{flexDirection: 'row-reverse', justifyContent: 'space-between'}}>
            <Col>
              <Row type='flex'>
              <Input.Group compact>
                {/* <FormItem
                  wrapperCol={{ span: 24 }}
                > */}
                  {getFieldDecorator('searchType', {initialValue: 'realName', rules: []})(
                    <Select className={'choice'} onChange={this.getType} style={{width: 106}}>
                      <Option value={'realName'} key={'realName'}>真实姓名</Option>
                      <Option value={'loginName'} key={'loginName'}>用户名</Option>
                    </Select>
                  )}
                {/* </FormItem> */}
                {/* <FormItem
                  style={{marginRight: 10}}
                  wrapperCol={{ span: 24 }}
                > */}
                  {getFieldDecorator('keyword', {})(
                    <Search placeholder='请输入关键词' onSearch={this.handleSubmit} style={{width: 200}}/>
                  )}
                {/* </FormItem> */}
                </Input.Group>
              </Row>
            </Col>
          </Row>
        </Form>
        </div>
        <Modal
          title="简历详情"
          visible={this.state.visible}
          onCancel={this.onCancel}
          footer={false}
        >
          <Tanchen userId={this.state.userId}/>
        </Modal>

        <Table 
          size={'middle'}
          columns={this.columns}
          dataSource={this.state.data}
          pagination={{
            pageSize: this.state.pagesize,
            current: this.state.current,
            onChange: this.handlePageChange,
            total: this.state.totals,
            showQuickJumper: true,
            showSizeChanger: true,
            onShowSizeChange: this.handlePageChange
          }}
          rowKey='id'
          style={{textAlign: 'center'}}
        />
      </TableLayout>

    )
  }
}

export default Form.create()(ManagementTab)
