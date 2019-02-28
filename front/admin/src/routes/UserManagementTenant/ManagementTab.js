import React from 'react'
import { message, Select, Table, Icon, Input, Form, Row, Col, Button, Popconfirm, Tooltip, Tag } from 'antd'
import axios from 'axios'
import {connect} from 'dva/index'
import TableLayout from '../../layouts/TableLayout'
const Search = Input.Search
// const ButtonGroup = Button.Group
// const FormItem = Form.Item
const Option = Select.Option

@Form.create()
@connect(({ user }) => ({
  user: user
}))
class ManagementTab extends React.Component {
  columns = [
    {
      title: '登录名',
      dataIndex: 'loginName',
      width: '9%',
      align: 'center',
      render: (text, record) => {
        if (text) {
          if (text.length > 6) {
            text = (text.toString()).substring(0, 5) + '...'
          }
        }
        return (
          <span title={record.loginName}>{text}</span>
        )
      }
    },
    {
      title: '真实姓名',
      dataIndex: 'realName',
      width: '9%',
      align: 'center',
      render: (text, record) => {
        if (text) {
          if (text.length > 6) {
            text = (text.toString()).substring(0, 5) + '...'
          }
        }
        return (
          <span title={record.realName}>{text}</span>
        )
      }
    },
    {
      title: '工号',
      dataIndex: 'jobNumber',
      width: '11%',
      align: 'center',
      render: (text, record) => {
        if (text) {
          if (text.length > 10) {
            text = (text.toString()).substring(0, 8) + '...'
          }
        }
        return (
          <span title={record.jobNumber}>{text}</span>
        )
      }
    },
    {
      title: '区域',
      dataIndex: 'domainName',
      width: '8%',
      align: 'center',
      render: (text, record) => {
        if (text) {
          if (text.length > 7) {
            text = (text.toString()).substring(0, 6) + '...'
          }
        }
        return (
          <span title={record.domainName}>{text}</span>
        )
      }
    },
    {
      title: '角色',
      dataIndex: 'role',
      width: '11%',
      align: 'center',
      render: (text, record) => {
        if (text) {
          if (text.length > 6) {
            text = text.toString().substring(0, 5) + '...'
          }
        }
        return (
          <span title={record.role}>{text}</span>
        )
      }
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: '13%',
      align: 'center',
      render: (text, record) => {
        if (text) {
          if (text.length > 10) {
            text = text.toString().substring(0, 9) + '...'
          }
        }
        return (
          <span title={record.email}>{text}</span>
        )
      }
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      width: '6%',
      align: 'center',
      render: (text, record) => {
        let content = ''
        if (text === true) {
          content = <Tag checked={false} style={{cursor: 'auto', width: 50, marginLeft: 'auto', marginRight: 'auto'}} color={'#4CAF50'}>启用</Tag>
        } else if (text === false) {
          content = <Tag checked={false} style={{cursor: 'auto', width: 50, color: 'black', marginLeft: 'auto', marginRight: 'auto'}} color={'#E9E9E9'}>禁用</Tag>
        }
        return (
          content
        )
      }
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: '16%',
      align: 'center',
      render: (text, record) => {
        return (
          <div>
            <Tooltip style={{marginRight: 0}} placement='bottom' title='编辑'>
              <Button onClick={(e) => { this.handleLinkToDetail(e, record.id, 0, 1) }}><Icon type='edit' /></Button>
              {/* <Button style={{border: 0, backgroundColor: '0  0  0  0'}} onClick={(e) => { this.handleLinkToDetail(e, record.id, 0, 1) }}>编辑</Button> */}
            </Tooltip>
            {/* <Divider type='vertical' style={{marginLeft: '2px', marginRight: '2px'}} /> */}
            <Tooltip placement='bottom' title='启用'>
              <Popconfirm title='确定要启用该用户吗' okText='是的' cancelText='取消'
                onConfirm={(e) => { this.handleEnabled(e, record.id) }}
              >
                <Button style={{marginLeft: 10, display: record.enabled === true ? 'none' : 'inline'}}><Icon type='check-circle-o' style={{color:'#4CAF50'}} /></Button>
                {/* <Button style={{color: '#62B965', border: 0}}>启用</Button> */}
              </Popconfirm>
            </Tooltip>
            {/* <Divider type='vertical' style={{marginLeft: '2px', marginRight: '2px'}} /> */}
            <Tooltip placement='bottom' title='禁用'>
              <Popconfirm title='确定要禁用该用户吗' okText='是的' cancelText='取消'
                onConfirm={(e) => { this.handleDisabled(e, record.id) }}
              >
                <Button type='danger' style={{marginLeft: 10, display: record.enabled === true ? 'inline' : 'none'}}><Icon type='minus-circle-o' /></Button>
                {/* <Button style={{color: 'red', border: 0}}>停用</Button> */}
              </Popconfirm>
            </Tooltip>
          </div>
        )
      }
    }
  ];

  state = {
    type: 'realName',
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
    pageSize: 10,
    isSearch: false,
    values: {}
  };

  componentWillMount () {
    console.log(this.props.user.currentUser)
    // this.setState({
    //   currentRole: this.props.user.currentUser.roleNameList,
    //   currentOrganizationId: this.props.user.currentUser.organizationId
    // }, () => {
      // if (this.props.user.currentUser.role === '公司管理员') {
      //   this.setState({
      //     isCompanyManag: true
      //   }, () => {
      //     if (this.state.isCompanyManag) {
      //       axios({
      //         method: 'get',
      //         url: 'base-info/v1/company/getCompanyInfoByOrganizationId?organizationId=' + this.state.currentOrganizationId
      //       }).then((res) => {
      //         this.setState({
      //           children: []
      //         }, () => {
      //           this.setState({
      //             children: [...this.state.children, <Option key={res.data.organizationId} value={res.data.corporateName}>{res.data.corporateName}</Option>]
      //           })
      //         })
      //       }).catch((err) => {
      //         console.log(err)
      //       })
      //     }
      //   })
      //   // break;
      // } else {
      //   this.companySearch('')
      // }
    // })
    this.selectAll()
  }

  /***
   * 查询所有的项目信息首先默认公司id为登录人的组织id
   */
  selectAll = () => {
    let _this = this
    let url = '/iam-ext/v1/organizations/organizationAdmin/' + this.props.user.currentUser.organizationId + '?'
    // let url = '/iam/v1/organizations/' + this.props.user.currentUser.organizationId + '/users/search?'
    url += 'page=' + (this.state.current - 1) + '&size=' + this.state.pageSize
    // console.log(url)
    axios({
      method: 'post',
      url: url,
      data: {}
    }).then((res) => {
      // console.log(res)
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
   * 根据用户输入信息查询
   */
  selectData = (values) => {
    // 获取搜索类型和内容
    let type = values.searchType// 搜索类型
    let content = values.keyword// 搜索内容
    let data = {}
    if (type === 'domainName') {
      data = {
        domainName: content
      }
    } else if (type === 'realName') {
      data = {
        realName: content
      }
    }
    let url = ''
    // if (this.state.id === -1) {
    //   url = '/iam/v1/organizations/1/users/search?'
    //   url += 'page=' + (this.state.current - 1) + '&size=' + this.state.pageSize
    // } else {
    // console.log(this.state.id)
    url = '/iam-ext/v1/organizations/organizationAdmin/' + this.props.user.currentUser.organizationId + '?'
    // url = '/iam/v1/organizations/' + this.state.id + '/users/search?'
    url += 'page=' + (this.state.current - 1) + '&size=' + this.state.pageSize
    // }

    // console.log(url)
    // 调用后台的接口
    axios({
      method: 'post',
      url: url,
      data: data
    }).then((res) => {
      let totals = res.data.totalElements
      this.setState({
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
    // console.log(result)
    result.forEach(function (value) {
      let item = {}
      item.order = order++
      item.id = value.id
      item.jobNumber = value.jobNumber
      item.domainName = value.domainName
      item.role = value.role
      item.loginName = value.loginName
      item.email = value.email
      item.realName = value.realName
      // item.phone = value.phone
      item.enabled = value.enabled
      // item.enabled = value.enabled === true ? <Tag checked={false} style={{width: 50, marginLeft: 'auto', marginRight: 'auto'}} color={'#4CAF50'}>启用</Tag> : <Tag checked={false} style={{width: 50, color: 'black', marginLeft: 'auto', marginRight: 'auto'}} color={'#E9E9E9'}>禁用</Tag>
      item.admin = value.admin === true ? '是' : '否'
      datas.push(item)
    })
    // 将datas 添加到state中
    this.setState({
      data: datas
    })
  };

  /**
   * 启用用户
   */
  handleEnabled = (e, id) => {
    let flag = 0
    for (let i = 0; i < this.state.data.length; i++) {
      if (this.state.data[i].id === id) {
        if ( this.state.data[i].enabled === true ) {
          flag = 0
          break
        } else if ( this.state.data[i].enabled === false ) {
          flag = 1
          break
        }
      }
    }
    if (flag === 1) {
      axios({
        method: 'put',
        url: '/iam-ext/v1/userext/'+id+'/enable',
      }).then((res) => {
        // console.log(res)
        if (res.data === true) {
          message.success('启用成功')
          for (let i = 0; i < this.state.data.length; i++) {
            if (this.state.data[i].id === id) {
              // console.log(this.state.data[i])
              this.state.data[i].enabled = true
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
   * 禁用用户
   */
  handleDisabled = (e, id) => {
    let flag = 0
    for (let i = 0; i < this.state.data.length; i++) {
      if (this.state.data[i].id === id) {
        if ( this.state.data[i].enabled === true ) {
          flag = 0
          break
        } else if ( this.state.data[i].enabled === false ) {
          flag = 1
          break
        }
      }
    }
    if (flag === 0) {
      axios({
        method: 'put',
        url: '/iam-ext/v1/userext/'+id+'/disable',
      }).then((res) => {
        if (res.data === true) {
          message.success('禁用成功')
          for (let i = 0; i < this.state.data.length; i++) {
            if (this.state.data[i].id === id) {
              this.state.data[i].enabled = false
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
    
  };

  /***
   * 清空三个查询输入框的内容
   */
  handleReset = () => {
    this.props.form.resetFields()
    this.setState({
      current: 1,
      totals: 0
    }, () => { this.selectAll() })
  };
  /***
   * 处理page跳转
   */
  handlePageChange = (page, pagesize) => {
    // console.log(page);
    this.setState({
      current: page,
      pageSize: pagesize
    }, () => {
      if (this.state.isSearch) {
        this.selectData(this.state.values)
      } else {
        this.selectAll()
      }
    })
  }

  /**
   *   跳转到编辑或添加页面
   *   flag为1：更新
   *   flag为0：添加
   */
  handleLinkToDetail = (e, userId, oId, flag) => {
    e.stopPropagation()
    this.linkToChange(`/setting/usermanageupdate/${userId}/${oId}/${flag}`)
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

  /**
   * 模糊匹配用户输入的公司名称
   */
  // companySearch = (value) => {
  //   // console.log(value);
  //   this.fetch(value, this)
  // };

  // fetch=(value, _this) => {
  //   let flag = 0
  //   axios({
  //     method: 'get',
  //     url: 'iam/v1/organizations?name=' + value + '&page=0&size=6',
  //     async: false
  //   }).then((res) => {
  //     console.log(res)
  //     for (let i = 0; i < res.data.content.length; i++) {
  //       for (let j = 0; j < this.state.children.length; j++) {
  //         if (res.data.content[i].name === this.state.children[j].props.value) {
  //           flag = 1
  //           break
  //         }
  //       }
  //       if (flag === 0) {
  //         this.setState({
  //           children: [...this.state.children, <Option key={res.data.content[i].id} value={res.data.content[i].name}>{res.data.content[i].name}</Option>]
  //         })
  //         // children.push(<Option key={res.data.content[i].organizationId} value={res.data.content[i].corporateName}>{res.data.content[i].corporateName}</Option>);
  //         //   _this.setState({
  //         //     a:!_this.state.a
  //         //   })
  //       }
  //       flag = 0
  //     }
  //   }).catch((err) => {
  //     console.log(err)
  //   })
  // };

  /**
 * 获取组织id
 */
  // handleChange=(value, obj) => {
  //   this.setState({
  //     id: obj.key
  //   })
  // };

  // handleKeyDown =() => {
  //   this.handleSubmit()
  // };

  /**
   * 获取筛选条件，code或者name
   */
  getType = (value) => {
    this.setState({
      type: value
    })
  }

  /**
   * 表单提交事件，验证通过则通过handleSearch()调用后台接口
   * @param e
   */
  handleSubmit = (e) => {
    // e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values)
        this.setState({
          isSearch: true,
          values: values
        }, () => {
          this.handleSearch(values)
        })
      }
    })
  };

  render () {
    const { getFieldDecorator } = this.props.form

    // let init = ''
    // if (this.state.children[0]) {
    // init = this.state.children[0].props.value
    // }

    return (
      <TableLayout
        title={'用户管理'}
        renderTitleSide={() => (
          <Button type='primary' ghost icon='plus' style={{border: 0, fontWeight: 'bold'}} onClick={(e) => { this.handleLinkToDetail(e, -1, -1, 0) }}><span style={{fontSize: 16, fontFamily: '微软雅黑'}}>创建新用户</span></Button>
        )}
        id='no'>
        <Form layout='horizontal'>
          <Row type='flex' style={{flexDirection: 'row-reverse', justifyContent: 'space-between'}}>
            {/* <Col>
              <Row type='flex'>
                <FormItem
                  wrapperCol={{ span: 24 }}
                >
                  <ButtonGroup >
                    <Button style={{borderRadius: '0px'}} onClick={this.getAll}>全部</Button>
                  </ButtonGroup>
                </FormItem>
              </Row>
            </Col> */}
            <Col>
              <Row type='flex'>
              <Input.Group compact>
                {/* <FormItem
                  wrapperCol={{ span: 24 }}
                > */}
                  {getFieldDecorator('searchType', {initialValue: 'realName', rules: []})(
                    <Select className={'choice'} onChange={this.getType} style={{width: 106}}>
                      <Option value={'realName'} key={'realName'}>真实姓名</Option>
                      <Option value={'domainName'} key={'domainName'}>区域</Option>
                    </Select>
                  )}
                {/* </FormItem>
                <FormItem 
                  style={{marginRight: 10}}
                  wrapperCol={{ span: 24 }}
                >*/}
                  {getFieldDecorator('keyword', {})(
                    <Search placeholder='请输入关键词' onSearch={this.handleSubmit}  style={{ width: 200 }}  />
                  )}
                {/* </FormItem> */}
                </Input.Group>
              </Row>
            </Col>
          </Row>
        </Form>

        <Table
          size={'middle'}
          columns={this.columns}
          dataSource={this.state.data}
          pagination={{
            pageSize: this.state.pageSize,
            current: this.state.current,
            onChange: this.handlePageChange,
            total: this.state.totals,
            showQuickJumper: true,
            showSizeChanger: true,
            onShowSizeChange: this.handlePageChange
          }}
          // onRow={(record) => {
          //   return {
          //     onDoubleClick: (e) => { this.handleLinkToDetail(e, record.id, record.organizationId, 1) }
          //   }
          // }}
          rowKey='id'
          style={{textAlign: 'center'}}
        />
      </TableLayout>

    )
  }
}

export default Form.create()(ManagementTab)
