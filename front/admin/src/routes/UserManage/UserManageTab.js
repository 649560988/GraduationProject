import React from 'react'
import TableLayout from '../../layouts/TableLayout'
import { Button, Table, Form, Icon, Tag, Col, Row, Input, Select, message, Tooltip, Popconfirm } from 'antd'
import request from '../../utils/request'

class UserManageTab extends React.Component {

    constructor(props) {
        super(props)
        /**
         * columns: 表格的列
         * data: 表格的数据
         * searchContent: 筛选内容
         */
        this.state = {
            columns: [{
                title: '序号',
                dataIndex: 'order',
                align: 'center',
                width: '10%',
            }, {
                title: '用户名',
                dataIndex: 'userName',
                align: 'center',
                width: '15%',
                render: (text, record) => {
                    if (text === null) {
                        return <span title={text}>{text}</span>
                    } else {
                        if (text.length > 8) {
                            return <span title={text}>{text.substring(0, 8)}...</span>
                        } else {
                            return <span title={text}>{text}</span>
                        }
                    }
                }
            }, {
                title: '真实姓名',
                dataIndex: 'realName',
                align: 'center',
                width: '15%',
                render: (text, record) => {
                    return <span title={text}>{text}</span>
                }
            }, {
                title: '手机号码',
                dataIndex: 'telephone',
                align: 'center',
                width: '20%',
                render: (text, record) => {
                    return <span title={text}>{text}</span>
                }
            }, {
                title: '是否启用',
                dataIndex: 'isDel',
                align: 'center',
                width: '10%',
                render: (text, record) => {
                    let tag;
                    if (text === 0) {
                        tag = <Tag checked={false} style={{ cursor: 'auto', width: 50, marginLeft: 'auto', marginRight: 'auto' }} color={'#4CAF50'}>是</Tag>
                    } else if (text === 1) {
                        tag = <Tag checked={false} style={{ cursor: 'auto', width: 50, color: 'black', marginLeft: 'auto', marginRight: 'auto' }} color={'#E9E9E9'}>否</Tag>
                    }
                    return (
                        tag
                    )
                }
            }, {
                title: '操作',
                dataIndex: 'action',
                align: 'center',
                width: '30%',
                render: (text, record) => {
                    let actionDel = '';
                    if (record.isDel) {
                        actionDel =
                            <Tooltip title={'启用'} placement={'bottom'}>
                                <Popconfirm
                                    title={'确定要启用此用户吗?'}
                                    okText={'是'}
                                    cancelText={'否'}
                                    onConfirm={(e) => this.handleOnDel('on', record.id)}
                                >
                                    <Button style={{ marginRight: '5px' }}><Icon type='check-circle-o' style={{ color: '#4CAF50' }} /></Button>
                                </Popconfirm>
                            </Tooltip>
                    } else if (!record.isDel) {
                        actionDel =
                            <Tooltip title={'禁用'} placement={'bottom'}>
                                <Popconfirm
                                    title={'确定要禁用此用户吗?'}
                                    okText={'是'}
                                    cancelText={'否'}
                                    onConfirm={(e) => this.handleOnDel('off', record.id)}
                                >
                                    <Button style={{ marginRight: '5px' }} type={'danger'}><Icon type='minus-circle-o' /></Button>
                                </Popconfirm>
                            </Tooltip>
                    }
                    return (
                        <div>
                            <Tooltip title={'编辑'} placement={'bottom'}>
                                <Button style={{ marginRight: '5px' }} onClick={(e) => this.handleLinkToDetail(e, 'edit', record.id)}><Icon type={'edit'} /></Button>
                            </Tooltip>
                            {actionDel}
                            <Tooltip title={'重置密码'} placement={'bottom'} >
                                <Popconfirm
                                    title={'确定要重置此用户的密码?'}
                                    okText={'是'}
                                    cancelText={'否'}
                                    onConfirm={(e) => this.resetPassword(record)}
                                >
                                    <Button type={'danger'}><Icon type="key" /></Button>
                                </Popconfirm>
                            </Tooltip>
                        </div>
                    )
                }
            }],
            data: [],
            searchContent: '',
            pageSize: 10,
            current: 1,
            total: 0,
            order:1,
        }
    }
    componentWillMount() {
        this.getListInfo('')
    }

    /**
     * 管理员重置用户密码为012345678
     */
    resetPassword = (record) => {
        let data = {}
        data.id = record.id
        data.password = '012345678'
        data.version = record.version
        data.sysRoles = []
        request('/v1/sysuser', {
            method: 'PUT',
            body: data
        }).then((res) => {
            if (res.message === '成功') {
                message.success('重置密码成功，该用户新密码为012345678')
            } else {
                message.error(res.message)
            }
        }).catch((err) => {
            console.log(err)
        })
    }



    /**
     * 禁用或启用用户
     */
    handleOnDel = (flag, id) => {
        let url = ''
        let successMsg = ''
        let failedMsg = ''
        if (flag === 'on') {
            url = `/v1/sysuser/${id}/0`
            successMsg = '启用成功'
            failedMsg = '启用失败'
        } else if (flag === 'off') {
            url = `/v1/sysuser/${id}/1`
            successMsg = '禁用成功'
            failedMsg = '禁用失败'
        }
        request(url, {
            method: 'GET',
            // credentials: 'omit'
        }).then((res) => {
            if (res.message === '成功') {
                message.success(successMsg)
                this.getListInfo(this.state.searchContent)
            } else {
                message.error(failedMsg)
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    /**
     *   跳转到编辑或添加页面
     */
    handleLinkToDetail = (e, flag, id) => {
        e.stopPropagation()
        this.linkToChange(`/setting/user-update/${flag}/${id}`)
    };

    /***
     *   路径跳转
     */
    linkToChange = url => {
        const { history } = this.props
        history.push(url)
    };
    /**
     * 将信息填入表格
     */
    addToTable = (data) => {
        let dataSource = []
        data.list.map((item, index) => {
          item.sysRoles.map((mitem)=>{
              if(mitem.name=='common_user'||mitem.name=='building_user'){
                item.order = this.state.order++;
                let record = item
                dataSource.push(record)
              }
          })
        })
        this.setState({
            data: dataSource,
            current: data.pageNum,
            total: data.total
        })
    }
    /**
     *  回车或点击搜索符号时触发搜索事件
     */
    handleOnSearch = (value) => {
        this.setState({
            current: 1,
            searchContent: value
        }, () => {
            this.getListInfo(value)
        })
    }
    /**
     * 获取用户信息
     */
    getListInfo = (value) => {
        let url = ''
        console.log("value",value)
        if (value.toString().length === 0) {
            url = '/v1/sysuser?pageNo=' + this.state.current + '&pageSize=' + this.state.pageSize
        } else {
            url = '/v1/sysuser?realName=' + value + '&pageNo=' + this.state.current + '&pageSize=' + this.state.pageSize
        }
        const data = request(url, {
            method: 'GET',
            // credentials: 'omit'
        })
        data.then((res) => {
            if (res.message === '成功') {
                this.addToTable(res.data)
                this.setState({
                    searchContent: value,
                })
            } else {
                this.setState({
                    data: []
                })
            }
        }).catch((err) => {
            console.log(err)
        })
    }
    /**
     *  处理页面跳转
     */
    handlePageChange = (page, pageSize) => {
        this.setState({
            pageSize,
            current: page,
        }, () => {
            this.getListInfo(this.state.searchContent)
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <TableLayout
                title={'用户'}
                renderTitleSide={() => (
                    <Button type='primary' ghost icon='plus' style={{ border: 0, fontWeight: 'bold' }} onClick={(e) => { this.handleLinkToDetail(e, 'add', null) }}><span style={{ fontSize: 16, fontFamily: '微软雅黑' }}>创建新用户</span></Button>
                )}
            >
                <Form>
                    <Row style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                        <Col>
                            <Form.Item>
                                <Input.Group compact>
                                    <Select value={'realName'} open={false} showArrow={false} style={{ width: 106 }}>
                                        <Select.Option checked={true} value={'realName'} key={'realName'}>真实姓名</Select.Option>
                                    </Select>
                                    {getFieldDecorator('keyword', {})(
                                        <Input.Search onSearch={this.handleOnSearch} style={{ width: '200px' }} />
                                    )}
                                </Input.Group>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <Table
                    size={'middle'}
                    columns={this.state.columns}
                    dataSource={this.state.data}
                    rowKey={'id'}
                    pagination={{
                        pageSize: this.state.pageSize,
                        current: this.state.current,
                        onChange: this.handlePageChange,
                        total: this.state.total,
                        showQuickJumper: true,
                        showSizeChanger: true,
                        onShowSizeChange: this.handlePageChange
                    }}
                />
            </TableLayout>
        )
    }
}

export default Form.create()(UserManageTab);