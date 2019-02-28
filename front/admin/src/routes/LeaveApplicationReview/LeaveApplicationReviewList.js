import React from 'react'
import TableLayout from '../../layouts/TableLayout';
import { Form, Tooltip, Button, Icon, Table } from 'antd';
import axios from 'axios/index'
import { connect } from 'dva/index'

@Form.create()
@connect(({ user }) => ({
    user: user
}))
class LeaveApplicationReviewList extends React.Component {
    columns = [{
        title: '序号',
        dataIndex: 'order',
        width: '10%',
        align: 'center'
    }, {
        title: '申请人',
        dataIndex: 'person',
        width: '10%',
        align: 'center',
        render: (text, record) => {
            return (
                <span>{text}</span>
            )
        }
    }, {
        title: '申请日期',
        dataIndex: 'applyDate',
        width: '20%',
        align: 'center',
        render: (text, record) => {
            return (
                <span>{text}</span>
            )
        }
    }, {
        title: '审核状态',
        dataIndex: 'applyStatus',
        width: '20%',
        align: 'center',
        render: (text, record) => {
            return (
                <span>{text}</span>
            )
        }
    }, {
        title: '流程节点',
        dataIndex: 'taskName',
        width: '20%',
        align: 'center',
        render: (text, record) => {
            return (
                <span>{text}</span>
            )
        }
    }, {
        title: '操作',
        dataIndex: 'action',
        width: '20%',
        align: 'center',
        render: (text, record) => {
            return (
                <div>
                    <Tooltip title={'审核'} placement={'bottom'}>
                        <Button onClick={(e) => this.handleLinkToDetail(record)}><Icon type="file-search" /></Button>
                    </Tooltip>
                </div>
            )
        }
    }]

    state = {
        data: [],
        pageSize: 10,
        current: 1,
        totals: 10,
        tableLoading: true,
        leaveList: [],
        applicant: [],
        procData: []
    }

    componentDidMount() {
        this.getReviewList()
    }

    /**
     * 获取需要当前登录人审批的休假申请列表
     */
    getReviewList = () => {
        console.time('测试时间')
        let url = '/process/v1/process/myAudits/' + this.state.current + '/' + this.state.pageSize + '/' + this.props.user.currentUser.id
        axios({
            method: 'get',
            url: url
        }).then((res) => {
            if (res.data.empty === true) {
                this.setState({
                    tableLoading: false,
                    totals: 0
                })
            } else {
                this.setState({
                    procData: res.data
                }, () => {
                    this.getApplicationByProInstId(res.data)
                })
                // this.addToTable(res.data) 
            }
        console.timeEnd('测试时间')
        }).catch((err) => {
            console.log(err)
        })
    }



    /**
     * 根据procInstId去获取整条休假申请的详情
     * procData:流程信息数组
     */
    getApplicationByProInstId = (procDataArr) => {
        let leaveArr = []
        Promise.all(procDataArr.content.map(content =>
            axios({
                method: 'get',
                url: '/holiday/v1/ompLeave/selectSelfByProInstId/' + content.applicationDTO.procInstId
            }))).then((ress) => {
                ress.map((res, i) => {
                    if (res.data.failed === true) {
                        leaveArr.push({ failed: true })
                    } else {
                        leaveArr.push(res.data)
                    }
                    if (i === procDataArr.content.length - 1) {
                        this.setState({
                            leaveList: leaveArr
                        }, () => {
                            this.getApplicantName()
                        })
                    }
                })
            })
    }

    /**
     * 根据详情中的userId去获取申请人信息
     * 获取申请人的姓名
     * data: 业务数据
     */
    getApplicantName = () => {
        let userArr = []
        let leaveList = this.state.leaveList
        for (let i = 0; i < this.state.leaveList.length; i++) {
            if (this.state.leaveList[i].failed === true) {
                leaveList[i].userId = -1
            } else {
                leaveList[i].userId = this.state.leaveList[i].userId
            } 
        }

        Promise.all(leaveList.map(item => 
            axios({
                method: 'get',
                url: '/iam-ext/v1/userext/selectRealName?userId=' + item.userId
            })
        )).then((ress) => {
            ress.map((res) => {
                if (res.data.failed === true) {
                    userArr.push({ failed: true })
                } else {
                    userArr.push(res.data)
                }
            })
            this.setState({
                applicant: userArr
            }, () => {
                this.addToTable()
            })
        }).catch((err) => {
            console.log(err)
        })
    }

    /**
     * 将后台数据填入表格
     */
    addToTable = () => {
        let content = this.state.procData.content
        let info = []
        let order = 0
        content.map((item, index) => {
            let record = {}
            order++
            record.order = order
            record.applyDate = item.applyDate
            record.applyStatus = {
                0: '保存未提交',
                1: '待审核',
                2: '审核不通过',
                3: '审核结束'
            }[item.applicationDTO.applyStatus]
            record.applyDate = item.applicationDTO.applyDate
            record.taskName = item.taskName
            record.taskId = item.taskId
            record.applicationDTO = item.applicationDTO
            if (this.state.applicant[index].failed === true) {
                record.person = 'error'
            } else {
                record.person = this.state.applicant[index].realName
            }
            info.push(record)
        })
        this.setState({
            data: info,
            tableLoading: false,
            totals: this.state.procData.totalElements
        })
    }

    /**
    * 跳转到明细页面
    * 需要向详情页面传taskName和taskId!!!
    */
    handleLinkToDetail = (record) => {
        // this.linkToChange(`/tsmanage/leaveApplicationReviewEdit`, record)
        // console.log(record)
        // console.log(JSON.stringify(record))
        // let info = {
        //     taskId: record.taskId,
        //     taskName: record.taskName,
        //     procInstId: record.applicationDTO.procInstId            
        // }
        this.linkToChange(`/tsmanage/leaveApplicationReviewEdit/${record.taskId}/${record.taskName}/${record.applicationDTO.procInstId}`, record)
    }

    /***
    *   路径跳转
    */
    linkToChange = (url, record) => {
        const { history } = this.props
        // let path = {
        //     pathname: url,
        //     state: record
        // }
        history.push(url)
    };

    /**
    * 用于分页和页面跳转
    */
    handlePageChange = (page, size) => {
        // console.log(page, size)
        this.setState({
            pageSize: size,
            current: page,
            tableLoading: true
        }, () => {
            this.getReviewList()
        })
    }

    render() {
        return (
            <TableLayout
                title={'休假申请列表'}
            >
                <Table
                    size={'middle'}
                    loading={this.state.tableLoading}
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
                    rowKey={'taskId'}
                />
            </TableLayout>
        )
    }
}

export default Form.create()(LeaveApplicationReviewList)