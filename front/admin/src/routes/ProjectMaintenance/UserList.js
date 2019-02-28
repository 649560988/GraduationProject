import React from 'react'
import { Table, Row, Col, Input, Form, Select } from 'antd'
import axios from 'axios'
const Option = Select.Option
const Search = Input.Search

class UserList extends React.Component {

    columns = [{
            title: '用户名',
            dataIndex: 'login_name', 
            width: '15%',
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
          }, {
            title: '工号',
            dataIndex: 'id', 
            width: '15%',
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
          }, {
            title: '电子邮箱',
            dataIndex: 'email',
            width: '25%',
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
          }, {
            title: '真实姓名',
            dataIndex: 'real_name',
            width: '15%',
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
          }, {
            title: '手机号',
            dataIndex: 'phone',
            width: '25%',
            align: 'center',
            render: (text) => {
              return (
                <span title={text}>{text}</span>
              )
            }
          }]

          /**
           * data: 当前页所有用户信息
           */
          state = {
              data:[],
              pageSize: 10,
              current: 1,
              totals: 0,
              searchType: 'job_number',
              searchContent: ''
          }

          
          componentDidMount () {
            this.getUserInfo()
          }

          /**
           * 分页获取用户信息
           */
          getUserInfo = () => {
            axios({
                method: 'get',
                url: 'iam-ext/v1/outsourcer?page=' + (this.state.current - 1) + '&size=' + this.state.pageSize
            }).then((res) => {
                this.setState({
                    totals: res.data.totalElements
                })
                this.addToTable(res.data.content)
            }).catch((err) => {
                console.log(err)
            })
          }
          

          /**
           * 将数据放入table中
           */
          addToTable = (results) => {
              let data = []
            results.map(item => {
                data.push(item)
            })
            this.setState({
                data: data
            })
          }

          

          /**
           * 处理分页以及表格页跳转
           */
          handlePageChange = (page, pageSize) => {
            this.setState({
                current: page,
                pageSize: pageSize
            }, () => {
                this.searchUser()
            })
          }

          /**
           * 获取筛选类型
           */
          getSearchType = (value) => {
            this.setState({
                searchType: value
            })
          }

        

          /**
           * 获取筛选内容
           */
          getSearchContent = (e) => {
            this.setState({
                searchContent: e.target.value
            })
          }

          /**
           * 处理搜索的回车或点击事件
           */
          handleOnSearch = () => {
            this.setState({
                current: 1
            }, () => {
                this.searchUser()
            })
          }

          /**
           * 根据条件内容筛选用户
           */
          searchUser = () => {
              let data = {}
              if (this.state.searchType === 'job_number') {
                data = {
                    id: this.state.searchContent
                }
              } else if (this.state.searchType === 'real_name') {
                // data.realName = this.state.searchContent
                data = {
                    realName: this.state.searchContent
                }
              }
            axios({
                method: 'get',
                url: 'iam-ext/v1/outsourcer?page=' + (this.state.current - 1) + '&size=' + this.state.pageSize,
                params: data
            }).then((res) => {
                this.setState({
                    totals: res.data.totalElements
                })
                this.addToTable(res.data.content)
            }).catch((err) => {
                console.log(err)
                this.setState({
                    data: []
                })
            })
          }

          /**
           * 选择用户时的回调函数
           * 调用父组件方法向父组件传用户信息
           */
        handleOnChange = (selectedRowKeys, selectedRows) => {
            this.props.getSelectedUserInfo(selectedRows)
        }

    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <div>
                <Form layout='horizontal'>
                        <div >
                            <Row type='flex' style={{ flexDirection: 'row-reverse' }}>
                                <Col>
                                    <Row type='flex'>
                                        <Input.Group compact>
                                            {
                                                getFieldDecorator('searchType', { initialValue: 'job_number' })(
                                                <Select className={'choice'} onChange={this.getSearchType} style={{ width: 108, marginBottom: 23 }}>
                                                    <Option value={'job_number'} key={'job_number'}>工号</Option>
                                                    <Option value={'real_name'} key={'real_name'}>真实姓名</Option>
                                                </Select>
                                            )}
                                            {
                                                getFieldDecorator('keyword', { initialValue: '' })(
                                                <Search onChange={this.getSearchContent} onSearch={this.handleOnSearch} style={{ width: 200 }} placeholder='输入关键词' />
                                            )}
                                        </Input.Group>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                    </Form>
                <Table
                    pagination={{
                        pageSize: this.state.pageSize,
                        current: this.state.current,
                        onChange: this.handlePageChange,
                        total: this.state.totals,
                        showQuickJumper: true,
                        showSizeChanger: true,
                        onShowSizeChange: this.handlePageChange
                      }}
                    size={'middle'}
                    columns={this.columns}
                    dataSource={this.state.data}
                    rowSelection={{type: 'radio', onChange: this.handleOnChange}}
                />
            </div>
        )
    }
}
export default Form.create()(UserList)