import React from 'react'
import TableLayout from '../../layouts/TableLayout';
import YearPicker from '../LeaveApplication/YearPicker'
import { Table, Form, Button, Tooltip, Icon, Row, Col, Input, Select } from 'antd';
import axios from 'axios'

const Option = Select.Option

class OvertimeApplicationTab extends React.Component {

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
        width: '20%',
        align: 'center',
        render: (text, record) => {
            return (
                <span>{text}</span>
            )
        }
    }, {
        title: '审核状态',
        dataIndex: 'status',
        width: '10%',
        align: 'center',
        render: (text, record) => {
            if(record.status === 0){
                text='保存未提交'
            }else if(record.status === 1){
                text = '待审核'
            }else if(record.status === 2){
                text = '审核通过'
            }else if(record.status === 3){
                text = '审核未通过'
            }
            return (
                <span>{text}</span>
            )
        }
    },  {
        title: '操作',
        dataIndex: 'action',
        width: '20%',
        align: 'center',
        render: (text, record) => {
            return (
                <div>
                    <Tooltip title={'查看'} placement={'bottom'}>
                        <Button style={{ marginRight: '10px' }} onClick={() => this.handleLinkToDetail(record.id, 'view')}><Icon type={'eye-o'} /></Button>
                    </Tooltip>
                    <Tooltip title={'编辑'} placement={'top'}>
                        <Button disabled={record.status===2||record.status===3?true:false} onClick={() => this.handleLinkToDetail(record.id, 'edit')}><Icon type={'edit'} /></Button>
                    </Tooltip>
                </div>
            )
        }
    }]

    state = {
        data: [],
        pageSize: 10,
        current: 1,
        totals: 2,
        year:'',
        approvalStatus:''
    }

    /**
    * 按钮点击事件，添加或修改项目信息
    */
    handleLinkToDetail = (id, flag) => {
        this.linkToChange(`/tsmanage/otApplicationEdit/${id}/${flag}`)
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
     * 选择年份
     */
    handleYearPicker = (date) => {
        this.setState({
            year:date.format('YYYY')
        },()=>{this.fetchList()})     
    }

    /**
     * 清空年份
     */
    handleYearClear = () => {
        this.setState({
            year:''
        },()=>{this.fetchList()}) 
    }

    /**
     * 选择审批状态
     */
    handleStatus = (Option,value) => {
        if(value === undefined){
            this.setState({
                approvalStatus:''
            },()=>this.fetchList())
        }else{
            this.setState({
                approvalStatus:value.key
            },()=>this.fetchList())
        }
    }

    /**
     * 获取列表数据
     */
    fetchList = () => {
        axios({
            method: 'get',
            url: '/holiday/v1/ompOvertime/selectSelf',
            params:{
                page:this.state.current-1,
                size:this.state.pageSize,
                year:this.state.year,
                status:this.state.approvalStatus
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

    render() {
        return (
            <TableLayout
                title={'加班申请'}
                renderTitleSide={() => (
                    <Button type='primary' ghost icon='plus' style={{ border: 0, fontWeight: 'bold' }} onClick={(e) => { this.handleLinkToDetail(0, 'add') }} >
                        <span style={{ fontSize: 16, fontFamily: '微软雅黑' }}>添加加班申请</span>
                    </Button>
                )
                }
            >

                <Form layout='horizontal'>
                    <Row type={'flex'} style={{ flexDirection: 'row-reverse', justifyContent: 'space-between' }}>
                        <Col>
                            <Input.Group compact>
                                <YearPicker onChange={this.handleYearPicker} onClear={this.handleYearClear} />
                                <Select open={false} showArrow={false} value={'status'} style={{ width: '86px', marginLeft: '10px' }} >
                                    <Option key={0} value={'status'}>审核状态</Option>
                                </Select>
                                <Select allowClear={true} style={{ width: 150 }} onChange={this.handleStatus}>
                                    <Option key={'0'} value={'已保存未提交'} >已保存未提交</Option>
                                    <Option key={'1'} value={'待审核'} >待审核</Option>
                                    <Option key={'2'} value={'审核通过'} >审核结束</Option>
                                    <Option key={'3'} value={'审核未通过'} >审核未通过</Option>
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
                />
            </TableLayout>
        )
    }
}

export default Form.create()(OvertimeApplicationTab)