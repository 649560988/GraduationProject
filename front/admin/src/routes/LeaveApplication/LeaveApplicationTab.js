import React from 'react'
import { Table, Form, Button, Tooltip, Icon, Row, Col, Input, Select } from 'antd'
import YearPicker from './YearPicker'
import TableLayout from '../../layouts/TableLayout'
import axios from 'axios/index'
import { connect } from 'dva/index'
// import moment from 'moment';
// const Search = Input.Search
const Option = Select.Option

@Form.create()
@connect(({ user }) => ({
    user: user
}))
class LeaveApplicationTab extends React.Component {
    columns = [{
        title: '序号',
        dataIndex: 'order',
        width: '8%',
        align: 'center',
        render: (text, record) => {
            return (
                <span>{text}</span>
            )
        }
    }, {
        title: '假期类型',
        dataIndex: 'type',
        width: '15%',
        align: 'center',
        render: (text, record) => {
            return (
                <span>{text}</span>
            )
        }
    }, {
        title: '开始时间',
        dataIndex: 'startDate',
        width: '20%',
        align: 'center',
        render: (text, record) => {
            return (
                <span>{text}</span>
            )
        }
    }, {
        title: '结束时间',
        dataIndex: 'endDate',
        width: '20%',
        align: 'center',
        render: (text, record) => {
            return (
                <span>{text}</span>
            )
        }
    }, {
        title: '合计时长',
        dataIndex: 'times',
        width: '8%',
        align: 'center',
        render: (text, record) => {
            return (
                <span>{text}</span>
            )
        }
    }, {
        title: '审核状态',
        dataIndex: 'status',
        width: '12%',
        align: 'center',
        render: (text, record) => {
            return (
                <span>{text}</span>
            )
        }
    }, {
        title: '操作',
        dataIndex: 'action',
        width: '17%',
        align: 'center',
        render: (text, record) => {
            let disabled = ''
            record.status === '审核不通过' || record.status === '保存未提交' ? disabled = {} : disabled = { disabled: true }
            return (
                <div>
                    <Tooltip title={'查看'} placement={'bottom'}>
                        <Button
                            style={{ marginRight: '10px' }}
                            onClick={(e) => this.handleLinkToDetail(record.id, '-1')}
                        >
                            <Icon type={'eye-o'} />
                        </Button>
                    </Tooltip>
                    <Tooltip title={'编辑'} placement={'bottom'}>
                        <Button
                            {...disabled}
                            onClick={(e) => this.handleLinkToDetail(record.id, '0')}
                        >
                            <Icon type={'edit'} />
                        </Button>
                    </Tooltip>
                </div>
            )
        }
    }]

    /**
     * year: 筛选条件年份
     * searchType: 筛选条件： 工号或姓名
     * searchContent: 筛选内容
     * status: 审核状态
     */
    state = {
        data: [],
        year: '',
        // searchTYpe: 'realName',
        // searchContent: '',
        status: -1,
        pageSize: 10,
        current: 1,
        totals: 2
    }

    componentDidMount() {
        this.getLeaveApplicationList()
    }

    /**
     * 获取休假申请列表
     */
    getLeaveApplicationList = () => {
        // console.log(this.state.pageSize, this.state.current)
        axios({
            method: 'get',
            url: '/holiday/v1/ompLeave/selectSelf/' + this.props.user.currentUser.id + '?page=' + (this.state.current - 1) + '&size=' + this.state.pageSize
        }).then((res) => {
            // console.log(res)
            this.addToTable(res)
        }).catch((err) => {
            console.log(err)
        })
    }

    /**
     * 将后台数据修改后填入列表
     */
    addToTable = (res) => {
        let data = []
        let order = 0
        // console.log(res)
        res.data.content.map((item) => {
            let record = {}
            order++
            if ([0, 1, 2, 3].includes(item.status)) {
                record.status = {
                    0: '保存未提交',
                    1: '待审核',
                    2: '审核不通过',
                    3: '审核结束'
                }[item.status]
            } else {
                record.status = '未填写'
            }
            if ([103, 104, 105, 106, 107, 108, 109, 110, 111].includes(item.type)) {
                record.type = {
                    103: '带薪年假',
                    104: '额外福利年假',
                    105: '带薪病假',
                    106: '病假',
                    107: '事假',
                    108: '婚假',
                    109: '陪产假',
                    110: '丧假',
                    111: '长病假'
                }[item.type]
            } else {
                record.type = '未填写'
            }
            record.order = order
            record.startDate = item.startDate
            record.endDate = item.endDate
            record.times = item.times
            record.id = item.id
            data.push(record)
        })
        this.setState({
            totals: res.data.totalElements,
            data: data
        })
    }

    /**
     * 跳转到明细页面
     * id : 休假申请的id
     * flag: 1 : 添加
     *       0 : 编辑
     */
    handleLinkToDetail = (id, flag) => {
        this.linkToChange(`/tsmanage/leaveApplicationEdit/${id}/${flag}`)
    }

    /***
     *   路径跳转
     */
    linkToChange = url => {
        const { history } = this.props
        history.push(url)
    };

    /**
     * 在用户变更年份时
     * 获取筛选结果
     */
    handleYearPicker = (date) => {
        // console.log(date)
        this.setState({
            year: date.format('YYYY'),
            current: 1,
        }, () => {
            this.getSearchResult()
        })
    }



    /**
     * 年份清空时的筛选结果
     */
    handleYearClear = () => {
        this.setState({
            year: '',
            current: 1,
        }, () => {
            this.getSearchResult()
        })
    }

    // /**
    //  * 获取筛选类型
    //  */
    // getSearchType = (value) => {
    //     this.setState({
    //         searchTYpe: value
    //     }, () => { console.log(value) })
    // }

    /**
     * 获取审核状态筛选内容
     */
    getSearchContent = (value) => {
        // console.log(value)
        if (value === undefined) {
            this.setState({
                status: -1,
                current: 1,
            }, () => {
                this.getSearchResult()
            })
        } else if (value !== undefined) {
            this.setState({
                status: Number(value),
                current: 1,
            }, () => {
                this.getSearchResult()
            })
        }
    }

    /**
     * 获取筛选结果
     */
    getSearchResult = () => {
        let url = ''
        if (this.state.status > -1) {
            if (this.state.year === '') {
                url = '/holiday/v1/ompLeave/selectSelf/' + this.props.user.currentUser.id
                    + '?page=' + (this.state.current - 1)
                    + '&size=' + this.state.pageSize
                    + '&status=' + Number(this.state.status)
            } else if (this.state.year !== '') {
                url = '/holiday/v1/ompLeave/selectSelf/' + this.props.user.currentUser.id
                    + '?page=' + (this.state.current - 1)
                    + '&size=' + this.state.pageSize
                    + '&year=' + this.state.year
                    + '&status=' + Number(this.state.status)
            }
        } else if (this.state.status === -1) {
            if (this.state.year === '') {
                url = '/holiday/v1/ompLeave/selectSelf/' + this.props.user.currentUser.id
                    + '?page=' + (this.state.current - 1)
                    + '&size=' + this.state.pageSize
            } else if (this.state.year !== '') {
                url = '/holiday/v1/ompLeave/selectSelf/' + this.props.user.currentUser.id
                    + '?page=' + (this.state.current - 1)
                    + '&size=' + this.state.pageSize
                    + '&year=' + this.state.year
            }
        }
        // console.log(url)
        axios({
            method: 'get',
            url: url
        }).then((res) => {
            // console.log(res)
            this.addToTable(res)
        }).catch((err) => {
            console.log(err)
        })
    }

    /**
     * 用于分页和页面跳转
     */
    handlePageChange = (page, size) => {
        // console.log(page, size)
        this.setState({
            pageSize: size,
            current: page
        }, () => {
            if (this.state.status === -1 && this.state.year === '') {
                this.getLeaveApplicationList()
            } else {
                this.getSearchResult()
            }
        })
    }

    render() {
        return (
            <TableLayout
                title={'休假申请'}
                renderTitleSide={() => (
                    <Button type='primary' ghost icon='plus' style={{ border: 0, fontWeight: 'bold' }} onClick={(e) => { this.handleLinkToDetail('0', '1') }}>
                        <span style={{ fontSize: 16, fontFamily: '微软雅黑' }}>创建休假申请</span>
                    </Button>
                )}
            >
                <Form layout='horizontal'>
                    <Row type={'flex'} style={{ flexDirection: 'row-reverse', justifyContent: 'space-between' }}>
                        <Col>
                            <Input.Group compact>
                                <YearPicker onClear={this.handleYearClear} onChange={this.handleYearPicker} />
                                {/* <Select defaultValue={'realName'} onChange={this.getSearchType} style={{ width: 86, marginLeft: '10px' }}>
                                <Option key={'realName'} value={'realName'} >姓名</Option>
                                <Option key={'jobNumber'} value={'jobNumber'} >工号</Option>
                            </Select>
                            <Search onChange={this.getSearchContent} onSearch={this.getSearchResult} style={{ width: '150px', borderRight: '1px solid #D9D9D9' }} /> */}
                                <Select open={false} showArrow={false} value={'status'} style={{ width: '86px', marginLeft: '10px' }} >
                                    <Option key={0} value={'status'}>审核状态</Option>
                                </Select>
                                <Select
                                    allowClear={true}
                                    onChange={this.getSearchContent}
                                    style={{ width: 150 }}
                                >
                                    <Option key={'0'} value={'0'} >保存未提交</Option>
                                    <Option key={'1'} value={'1'} >待审核</Option>
                                    <Option key={'2'} value={'2'} >审核不通过</Option>
                                    <Option key={'3'} value={'3'} >审核结束</Option>
                                </Select>
                            </Input.Group>
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
                    rowKey={'id'}
                />

            </TableLayout >
        )
    }
}
export default Form.create()(LeaveApplicationTab)