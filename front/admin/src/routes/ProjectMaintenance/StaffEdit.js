import React from 'react'
import { Table, Button, Tooltip, Popconfirm, Icon, Form, Row, Col, Input, Select, Modal, DatePicker, message } from 'antd';
import TableLayout from '../../layouts/TableLayout'
import styled from 'styled-components';
import moment from 'moment';
import { connect } from 'dva'
import UserList from './UserList'
import axios from 'axios'
// const FormItem = Form.Item
const Option = Select.Option
const Search = Input.Search

const StyledInput = styled(Input)`
    border: 0;
    background: rgba(255, 255, 255, 0);
    &:hover {
        border: 1px solid #d9d9d9;
    }
`
@connect(({ user }) => ({
    user: user
}))
class StaffEdit extends React.Component {
    /**
     * isAdd: 是否是新增的行
     * isEditing: 是否是正在编辑行
     */
    columns = [{
        title:
            <Tooltip title={'添加人员'} placement={'bottom'}>
                <Button onClick={(e) => this.handleAddNewRow()} style={{ border: '0px' }}><Icon type='plus' style={{ fontSize: '20px', marginTop: '4px' }} /></Button>
            </Tooltip>,
        dataIndex: 'action',
        width: '9%',
        align: 'center',
        render: (text, record) => {
            let opt = ''
            if (record.isEditing === false) {
                opt = <Tooltip title={'删除'} placement={'bottom'}>
                    <Popconfirm title={'确定要从项目中移除此人吗?'} okText={'是的'} cancelText={'取消'}
                        onConfirm={(e) => this.handleDelete(e, record)}>
                        <Button style={{ border: 0, background: 'rgba(255, 255, 255, 0)' }}><Icon style={{ fontSize: '16px', color: 'red' }} type="delete" theme="outlined" /></Button>
                    </Popconfirm>
                </Tooltip>
            } else if (record.isEditing === true) {
                opt = <div>
                    <Tooltip title={'确认'} placement={'bottom'}>
                        <Popconfirm title={'确定要保存此条记录吗?'} okText={'是的'} cancelText={'取消'}
                            onConfirm={(e) => this.handleAdd(e, record)}>
                            <Button style={{ border: 0, background: 'rgba(255, 255, 255, 0)', width: '20px', paddingLeft: '2px' }}><Icon style={{ fontSize: '16px', color: '#4CAF50' }} type="check-circle-o" /></Button>
                        </Popconfirm>
                    </Tooltip>
                    <Tooltip title={'取消'} placement={'bottom'}>
                        <Popconfirm title={'确定要放弃此次操作吗?'} okText={'是的'} cancelText={'取消'}
                            onConfirm={(e) => this.handleClose(e, record)}>
                            <Button style={{ border: 0, background: 'rgba(255, 255, 255, 0)', width: '20px', paddingLeft: '2px', marginLeft: '10px' }}><Icon style={{ fontSize: '16px', color: 'red' }} type="close-circle-o" /></Button>
                        </Popconfirm>
                    </Tooltip>
                </div>
            }
            return (
                opt
            )
        }
    }, {
        title: '姓名',
        dataIndex: 'realName',
        width: '11%',
        align: 'center',
        render: (text, record) => {
            let content = text
            let edit = {}
            if (record.isAdd === false) {
                edit = {
                    disabled: true
                }
            } else {
                edit = {
                    disabled: false
                }
            }
            return <StyledInput {...edit} readOnly={true} onFocus={(e) => this.handleOnFocus(e, text, record, 'realName')} style={{ textAlign: 'center' }} title={text} defaultValue={content} onClick={(e) => this.selectUser(e, record)} onBlur={(e) => this.handleOnBlur(e, record, 'realName')} />
        }
    }, {
        title: '职位',
        dataIndex: 'position',
        width: '12%',
        align: 'center',
        render: (text, record) => {
            let content = text
            // if (text){
            //     if (content.toString().length > 5) {
            //         content = content.substring(0, 5) + '...'
            //     }
            // }
            return <StyledInput title={text} onFocus={(e) => this.handleOnFocus(e, text, record, 'position')} style={{ textAlign: 'center' }} onChange={(e) => this.handleOnChange(e, record, 'position')} defaultValue={content} onBlur={(e) => this.handleOnBlur(e, record, 'position')} />
        }
    }, {
        title: '开始时间',
        dataIndex: 'startDate',
        width: '20%',
        align: 'center',
        render: (text, record) => {
            let startDate = ''
            if (text) {
                startDate = { defaultValue: moment(text, 'YYYY-MM-DD HH:mm:ss') }
            } else {
                startDate = ''
            }
            return <DatePicker format="YYYY-MM-DD 00:00:00" style={{ border: 0, background: 'rgba(255, 255, 255, 0)' }} {...startDate} onFocus={(e) => this.handleOnFocus(e, text, record, 'startDate')} onChange={(date, dateString) => this.handleOnChange(dateString, record, 'startDate')} onBlur={(e) => this.handleOnBlur(e, record, 'startDate')} />
        }
    }, {
        title: '结束时间',
        dataIndex: 'endDate',
        width: '20%',
        align: 'center',
        render: (text, record) => {
            let endDate = ''
            if (text) {
                endDate = { defaultValue: moment(text, 'YYYY-MM-DD HH:mm:ss') }
            } else {
                endDate = ''
            }
            return <DatePicker format="YYYY-MM-DD 23:59:59" style={{ border: 0, background: 'rgba(255, 255, 255, 0)' }} {...endDate} onFocus={(e) => this.handleOnFocus(e, text, record, 'endDate')} onChange={(date, dateString) => this.handleOnChange(dateString, record, 'endDate')} onBlur={(e) => this.handleOnBlur(e, record, 'endDate')} />
        }
    }, {
        title: '成本单价',
        dataIndex: 'cost',
        width: '13%',
        align: 'right',
        render: (text, record) => {
            if (!text) {
                text = Number(0).toFixed(2)
            } else {
                text = Number(text).toFixed(2)
            }
            return <StyledInput title={text} style={{ textAlign: 'right' }} onFocus={(e) => this.handleOnFocus(e, text, record, 'cost')} onChange={(e) => this.handleOnChange(e, record, 'cost')} defaultValue={text} onBlur={(e) => this.handleOnBlur(e, record, 'cost')} />
        }
    }, {
        title: '销售单价',
        dataIndex: 'sale',
        width: '15%',
        align: 'right',
        editable: true,
        render: (text, record) => {
            if (!text) {
                text = Number(0).toFixed(2)
            } else {
                text = Number(text).toFixed(2)
            }
            return <StyledInput title={text} style={{ textAlign: 'right' }} onFocus={(e) => this.handleOnFocus(e, text, record, 'sale')} onChange={(e) => this.handleOnChange(e, record, 'sale')} defaultValue={text} onBlur={(e) => this.handleOnBlur(e, record, 'sale')} />
        }
    }]

    /**
     * ifSearch: 是否正在搜索
     * tdOldContent: 单元格在获取焦点时的内容
     */
    state = {
        allData: [],
        data: [],
        showModal: false,
        selectedUser: [],
        pageSize: 8,
        totals: 0,
        current: 1,
        searchType: 'realName',
        searchContent: '',
        projectId: 0,
        organizationCode: 0,
        userId: 0,
        isSearch: false,
        selectedRow: {},
        tableLoading: true,
        tdOldContent: '',
    }

    componentDidMount() {
        this.setState({
            projectId: this.props.match.params.id,
            organizationCode: this.props.user.currentUser.organizationId
        }, () => {
            this.getAllUser()
        })
    }

    /**
     * 放弃添加
     */
    handleClose = (e, record) => {
        // for (let i = 0; i < this.state.data.length; i++) {
        //     if (record.id === data[i].id) {
        //         data[i].isEditing = false
        //     }
        // }
        if ( record.isAdd === true ) {
            this.setState({
                data: this.state.allData
            })
        } else if ( record.isAdd === false ) {
            this.setState({
                data: [],
                tableLoading: true
            }, () => {
                this.getAllUser()
            })
            
        }
    }

    /**
     * 输入框失焦
     */
    handleOnBlur = (e, record, type) => {
        if (this.state.tdOldContent !== e.target.value) {
            if (type === 'cost' || type === 'sale') {
                e.target.value = Number(e.target.value).toFixed(2)
            }
            if (type === 'startDate' || type === 'endDate') {
                if (record.startDate && record.endDate) {
                    if (moment(record.startDate, 'YYYY-MM-DD HH:mm:ss') > moment(record.endDate, 'YYYY-MM-DD HH:mm:ss')) {
                        e.target.value = ''
                    }
                }
            } else {
                if (type === 'cost' || type === 'sale') {
                    if (Number(e.target.value) !== Number(this.state.tdOldContent)) {
                        // this.updateUser(record, type)
                    }
                } else {
                    // this.updateUser(record, type)
                }
            }
        }
    }

    /**
     * 输入框获得焦点时给各个标志位赋值
     */
    handleOnFocus = (e, text, record, type) => {
        let data = this.state.data
        for (let i = 0; i < this.state.data.length; i++) {
            if (record.id === data[i].id) {
                data[i].isEditing = true
            }
        }
        this.setState({
            tdOldContent: e.target.value,
            data: data,
        })
    }


    /**
     * 控制单价只能输入数字且长度小于32
     * 并将改变的数据保存至列表
     */
    handleOnChange = (e, record, type) => {
        if (type === 'realName') {
            record.realName = e.target.value
        } else if (type === 'position') {
            record.position = e.target.value
        } else if (type === 'startDate') {
            record.startDate = e
            if (record.startDate && record.endDate) {
                if (moment(record.startDate, 'YYYY-MM-DD HH:mm:ss') > moment(record.endDate, 'YYYY-MM-DD HH:mm:ss')) {
                    message.error('开始时间不该晚于结束时间')
                } else {
                    // this.updateUser(record, type)
                }
            } else {
                // this.updateUser(record, type)
            }
        } else if (type === 'endDate') {
            record.endDate = e
            if (record.startDate && record.endDate) {
                if (moment(record.startDate, 'YYYY-MM-DD HH:mm:ss') > moment(record.endDate, 'YYYY-MM-DD HH:mm:ss')) {
                    message.error('开始时间不该晚于结束时间')
                } else {
                    // this.updateUser(record, type)
                }
            } else {
                // this.updateUser(record, type)
            }
        } else if (type === 'cost') {
            record.cost = e.target.value
        } else if (type === 'sale') {
            record.sale = e.target.value
        }
        if (type === 'cost' || type === 'sale') {
            if (e.target.value.toString().indexOf('.') > -1) {
                let position = e.target.value.toString().indexOf('.')
                if (e.target.value.toString().indexOf('.') > 32) {
                    e.target.value = e.target.value.toString().substring(0, 32) + e.target.value.toString().substring(position)
                }
            } else if (e.target.value.toString().indexOf('.') === -1) {
                if (Number(e.target.value.length) > 32) {
                    e.target.value = e.target.value.toString().substring(0, 32)
                }
            }
            e.target.value = e.target.value.replace(/[^\-?\d.]/g, '')
        }
    }


    /**
     * 获取项目内所有人员信息
     */
    getAllUser = (info) => {
        if (info === undefined) {
            info = 'edit'
        }
        axios({
            method: 'get',
            url: '/omp-projectmanage/v1/projectResume/selectByProjectId/' + this.state.projectId + '?page=' + (this.state.current - 1) + '&size=' + this.state.pageSize
        }).then((res) => {
            // console.log(res)
            this.setState({
                totals: res.data.totalElements
            })
            if (res.data.failed === true) {
                this.setState({
                    totals: 0,
                    tableLoading: false
                })
            } else {
                if (res.data.content.length === 0 || res.data.content.empty) {
                    this.setState({
                        tableLoading: false,
                        allData: res.data.content
                    })
                } else {
                    this.getUserNameById(res.data.content, info)
                }
            }
        }).catch((err) => {
            console.log(err)
            this.setState({
                tableLoading: false
            })
        })
    }

    /**
    * 根据用户id获取用户信息(真实姓名)
    * 并将数据放入列表中
    */
    getUserNameById = (data, info) => {
        let user = []
        let userIds = []
        for (let i = 0; i < data.length; i++) {
            if (data[i].userId) {
                userIds.push(data[i].userId)
            } else {
                data[i].isEditing = false
                data[i].isAdd = false
                user.push(data[i])
            }
        }
        // console.log(userIds)
        Promise.all(userIds.map(item => 
            axios({
                method: 'get',
                url: '/iam-ext/v1/outsourcer/' + item
            }))).then((ress) => {
                // console.log(ress)
                // console.log(data)

                data.some((record, index) => {
                    ress.some((res, i) => {
                        if (record.userId === res.data.id) {
                            record.realName = res.data.real_name
                            record.isEditing = false
                            record.isAdd = false
                            user.push(data[index])
                            return true
                        } else {
                            return false
                        }
                    })
                    if (index === data.length -1) {
                        this.setState({
                            tableLoading: false,
                            data: user,
                            allData: user,
                        }, () => {
                            if (info === 'add') {
                                this.setState({
                                    data: [{
                                        isEditing: true,
                                        isAdd: true
                                    }, ...this.state.data]
                                })
                            }
                        })
                    }
                })

                // ress.map((res, i) => {
                //     data.some((record, index) => {
                //         if (record.userId === res.data.id) {
                //             record.realName = res.data.real_name
                //             record.isEditing = false
                //             record.isAdd = false
                //             user.push(data[index])
                //             return true
                //         } else {
                //             return false
                //         }
                //     })
                //     console.log(user)
                //     if (i === ress.length - 1) {
                //         this.setState({
                //             tableLoading: false,
                //             data: user,
                //             allData: user,
                //         }, () => {
                //             if (info === 'add') {
                //                 this.setState({
                //                     data: [{
                //                         isEditing: true,
                //                         isAdd: true
                //                     }, ...this.state.data]
                //                 })
                //             }
                //         })
                //     }
                // })
            })
    }

    /**
     * 选取用户
     */
    selectUser = (e, record) => {
        record.isEditing = true
        this.setState({
            selectedRow: record,
            showModal: true
        })
    }

    /**
     * 删除项目内人员
     */
    handleDelete = (e, record) => {
        axios({
            method: 'delete',
            url: '/omp-projectmanage/v1/projectResume/' + record.id
        }).then((res) => {
            this.setState({
                data: [],
                tableLoading: true
            }, () => {
                this.getAllUser()
            })
        }).catch((err) => {
            console.log(err)
        })
    }

    /**
     * 点击添加项目人员按钮,添加一行只有项目id和组织编码的项目记录
     */
    handleAddNewRow = () => {
        // console.log(this.state.data)
        if (this.state.data.length === 0) {
            this.setState({
                data: [{
                    isEditing: true,
                    isAdd: true
                }, ...this.state.data]
            })
        } else {
            this.setState({
                tableLoading: true
            }, () => {
                this.toFirstPage()
            })
        }
    }

    /**
     * 跳转到第一页
     */
    toFirstPage = () => {
        this.setState({
            current: 1
        }, () => {
            this.getAllUser('add')
        })
    }

    /**
     * 确定添加或修改一条记录
     */
    handleAdd = (e, record) => {
        if (record.startDate !== undefined && record.endDate !== undefined) {
            if (moment(record.startDate, 'YYYY-MM-DD HH:mm:ss') > moment(record.endDate, 'YYYY-MM-DD HH:mm:ss')) {
                message.error('开始时间不该晚于结束时间')
            } else {
                if (record.realName === undefined) {
                    message.error('请点击姓名单元格以选择人员')
                } else if (record.realName !== undefined) {
                    if (record.realName.length === 0) {
                        message.error('请点击姓名单元格以选择人员')
                    } else {
                        if (record.isAdd === true) {
                            axios({
                                method: 'post',
                                url: '/omp-projectmanage/v1/projectResume/create',
                                data: {
                                    ...record,
                                    organizationCode: this.state.organizationCode.toString(),
                                    projectId: this.state.projectId,
                                }
                            }).then((res) => {
                                // console.log(res)
                                if (res.data) {
                                    if (res.data.failed === true) {
                                        message.error(res.data.message)
                                    } else {
                                        message.success('添加成功')
                                        this.setState({
                                            data: [],
                                            tableLoading: true
                                        }, () => {
                                            this.getAllUser()
                                        })
                                    }
                                }
                            }).catch((err) => {
                                console.log(err)
                            })
                        } else if (record.isAdd === false) {
                            // console.log('编辑')
                            // console.log(record)
                            if (record.startDate === '' || record.endDate === '') {
                                message.error('请选择开始时间和结束时间')
                            } else {
                                this.updateUser(record, '')
                            }
                        }
                    }
                }
            }
        } else {
            message.error('请选择开始时间和结束时间')
        }
    }


    /***
    * 返回上一个页面
    * @param result
    */
    handleClickBackBtn = (e) => {
        this.linkToChange(`/project/maintenance`)
    }

    /**
    * 路径跳转
    */
    linkToChange = url => {
        const { history } = this.props
        history.push(url)
    };

    /**
    * 确认添加或修改用户
    */
    handleOk = () => {
        let newRow = this.state.selectedRow
        if (this.state.selectedUser) {
            newRow.realName = this.state.selectedUser[0].real_name
            newRow.userId = this.state.selectedUser[0].id
            this.setState({
                showModal: false,
                selectedRow: newRow
            })
        } else {
            this.setState({
                showModal: false
            })
        }
    }

    /**
     * 修改项目人员
     */
    updateUser = (record, type) => {
        // console.log(record)
        axios({
            method: 'put',
            url: '/omp-projectmanage/v1/projectResume/' + record.id,
            data: record
        }).then((res) => {
            // console.log(res)
            if (res.data.failed === true) {
                message.error(res.data.message)
            } else {
                let data = this.state.data
                message.success('修改成功')
                for (let i = 0; i < this.state.data.length; i++) {
                    if (data[i].id === record.id) {
                        data[i].isEditing = false
                    }
                }
                this.setState({
                    data: data
                })
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    /**
     * 获取添加时被选中的用户信息
     */
    getSelectedUserInfo = (user) => {
        // console.log(user)
        this.setState({
            selectedUser: user,
        })
    }

    /**
     * 点击弹窗取消按钮或叉叉
     */
    handleCancel = () => {
        this.setState({
            showModal: false
        })
    }

    /**
    * 处理分页以及表格页跳转
    */
    handlePageChange = (page, pageSize) => {
        this.setState({
            current: page,
            pageSize: pageSize,
            tableLoading: true
        }, () => {
            this.setState({
                data: []
            }, () => {
                if (this.state.isSearch) {
                    this.getSearchResults()
                } else if (!this.state.isSearch) {
                    this.getAllUser()
                }
            })
        })
    }

    /**
     * 获取筛选条件
     */
    getSearchType = (value) => {
        // console.log(value)
        this.setState({
            searchType: value
        })
    }

    /**
     * 获取筛选内容
     */
    getSearchContent = (e) => {
        // console.log(e.target.value)
        this.setState({
            searchContent: e.target.value
        })
    }

    /**
     * 处理搜索的回车或点击事件
     */
    handleOnSearch = (value) => {
        if (value.length === 0) {
            this.setState({
                current: 1,
                isSearch: false,
                tableLoading: true
            }, () => {
                this.getAllUser()
            })
        } else if (value.length > 0) {
            this.setState({
                current: 1,
                isSearch: true,
                tableLoading: true
            }, () => {
                this.getSearchResults()
            })
        }
    }

    /**
     * 获取筛选结果
     */
    getSearchResults = () => {
        axios({
            method: 'get',
            url: '/omp-projectmanage/v1/projectResume/selectByProjectId/' + this.state.projectId + '?page=' + (this.state.current - 1) + '&size=' + this.state.pageSize + '&' + this.state.searchType + '=' + this.state.searchContent
        }).then((res) => {
            // console.log(res)
            if (res.data.failed === true) {
                this.setState({
                    totals: res.data.totalElements,
                    data: [],
                    tableLoading: false
                })
            } else {
                if (res.data.content.length === 0) {
                    this.setState({
                        totals: res.data.totalElements,
                        data: [],
                        tableLoading: false
                    })
                } else {
                    this.setState({
                        totals: res.data.totalElements,
                        data: [],
                    }, () => {
                        this.getUserNameById(res.data.content, '')
                    })
                }
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <TableLayout
                title={'编辑项目人员'}
                showBackBtn
                onBackBtnClick={this.handleClickBackBtn}
            >
                <div>
                    <Form layout='horizontal'>
                        <div >
                            <Row type='flex' style={{ flexDirection: 'row-reverse' }}>
                                <Col>
                                    <Row type='flex'>
                                        <Input.Group compact>
                                            {
                                                getFieldDecorator('searchType', { initialValue: 'realName' })(
                                                    <Select onChange={this.getSearchType} className={'choice'} style={{ width: 108, marginBottom: 23 }}>
                                                        <Option value={'realName'} key={'realName'}>真实姓名</Option>
                                                    </Select>
                                                )}
                                            {
                                                getFieldDecorator('keyword', { initialValue: '' })(
                                                    <Search onSearch={this.handleOnSearch} onChange={this.getSearchContent} style={{ width: 200 }} placeholder='输入关键词' />
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
                        rowKey='id'
                        loading={this.state.tableLoading}
                    />
                </div>
                <Modal
                    destroyOnClose={true}
                    width={800}
                    title={'添加项目人员'}
                    visible={this.state.showModal}
                    onCancel={this.handleCancel}
                    footer={
                        <div>
                            <Button type={'primary'} onClick={(e) => this.handleOk()}>添加</Button>
                            <Button onClick={(e) => this.handleCancel()}>取消</Button>
                        </div>
                    }
                >
                    <UserList getSelectedUserInfo={this.getSelectedUserInfo} />
                </Modal>
            </TableLayout>
        )
    }
}

export default Form.create()(StaffEdit)
