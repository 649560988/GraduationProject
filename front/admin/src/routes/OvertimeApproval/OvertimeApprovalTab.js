import React from 'react'
import TableLayout from '../../layouts/TableLayout'
import axios from 'axios'
import { Form, Button, Tooltip, Table, Icon } from 'antd'

class OvertimeApprovalTab extends React.Component {

    columns = [{
        title: '序号',
        dataIndex: 'order',
        width: '10%',
        align: 'center',
        render: (text, record) => {
            return (
                <span title={text}>{text}</span>
            )
        }
    }, {
        title: '开始时间',
        dataIndex: 'start_date',
        width: '15%',
        align: 'center',
        render: (text, record) => {
            return (
                <span>{text}</span>
            )
        }
    }, {
        title: '结束时间',
        dataIndex: 'end_date',
        width: '15%',
        align: 'center',
        render: (text, record) => {
            return (
                <span>{text}</span>
            )
        }
    }, {
        title: '合计时长',
        dataIndex: 'times',
        width: '15%',
        align: 'center',
        render: (text, record) => {
            return (
                <span>{text}</span>
            )
        }
    }, {
        title: '审核状态',
        dataIndex: 'status',
        width: '15%',
        align: 'center',
        render: (text, record) => {
            return (
                <span>未审核</span>
            )
        }
    }, {
        title: '提交人',
        dataIndex: 'realName',
        width: '10%',
        align: 'center',
        render: (text, record) => {
            return (
                <span>{text}</span>
            )
        }
    },  {
        title: '操作',
        dataIndex: 'action',
        width: '20%',
        align: 'center',
        render: (text,record) => {
            return (
                <div>
                    <Tooltip title={'审批'} placement={'top'}>
                        <Button onClick={() => this.handleLinkToDetail(record.id)}><Icon type={'file-search'} /></Button>
                    </Tooltip>
                </div>
            )
        }
    }]

    state = {
        data: [],
        pageSize: 10,
        current: 1,
    }

    /**
    * 按钮点击事件，添加或修改项目信息
    */
    handleLinkToDetail = (id) => {
        this.linkToChange(`/tsmanage/otapprovalEdit/${id}`)
    }

    /**
     * 路径跳转
     */
    linkToChange = url => {
        const { history } = this.props
        history.push(url)
    };

    /**
     * 用于分页和页面跳转
     */
    handlePageChange = (page, size) => {
        this.setState({
            pageSize: size,
            current: page
        })
    }

    /**
     * 获取列表数据
     */
    fetchList = () => {
        axios({
            method: 'get',
            url: '/holiday/v1/ompOvertime/selectToAudit',
            params:{
                page:this.state.current-1,
                size:this.state.pageSize,
            }
        }).then((res) => {
            let order = 1
            let data = res.data.content
            data.map((item)=>{item.order = order ++})
            this.setState({
                data
            })
        }).catch((err) => {
            console.log(err)
        })
    }

    componentDidMount(){
        this.fetchList()
    }

    render () {
        return (
            <TableLayout
                title={'加班审批'}
            >
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
                />
            </TableLayout>
        )
    }
}

export default Form.create()(OvertimeApprovalTab)