
import React from 'react'
import TableLayout from '../../layouts/TableLayout'
import { Button, Table, Form, Icon, Tag, Col, Row, Input, Select, message, Tooltip, Popconfirm } from 'antd'
import request from '../../utils/request'

class RentHouseList extends React.Component {

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
                width: '8%',
            }, {
                title: '小区名称',
                dataIndex: 'communityName',
                align: 'center',
                width: '15%',
            },
            {
                title: '楼栋号',
                dataIndex: 'buildingNumber',
                align: 'center',
                width: '8%',
            },
            {
                title: '单元号',
                dataIndex: 'unit',
                align: 'center',
                width: '8%',
            }
            ,
            {
                title: '房间号',
                dataIndex: 'houseNumbers',
                align: 'center',
                width: '8%',
            }
            ,
            {
                title: '发布人姓名',
                dataIndex: 'userName',
                align: 'center',
                width: '10%',
            }, {
                title: '发布时间',
                dataIndex: 'createdTime',
                align: 'center',
                width: '20%',
                render: (text, record) => {
                    return <span title={text}>{text}</span>
                }
            }, {
                title: '是否封禁',
                dataIndex: 'isRent',
                align: 'center',
                width: '10%',
                render: (text, record) => {
                    let tag;
                    if (text === 0) {
                        tag = <Tag checked={false} style={{ cursor: 'auto', width: 50, marginLeft: 'auto', marginRight: 'auto' }} color={'#4CAF50'}>否</Tag>
                    } else if (text === 1) {
                        tag = <Tag checked={false} style={{ cursor: 'auto', width: 50, color: 'black', marginLeft: 'auto', marginRight: 'auto' }} color={'#E9E9E9'}>是</Tag>
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
                            <Tooltip title={'发布'} placement={'bottom'}>
                                <Popconfirm
                                    title={'确定要重新发布?'}
                                    okText={'是'}
                                    cancelText={'否'}
                                    // onConfirm={(e) => this.handleOnDel('on', record.id)}
                                >
                                    <Button style={{ marginRight: '5px' }}><Icon type='check-circle-o' style={{ color: '#4CAF50' }} /></Button>
                                </Popconfirm>
                            </Tooltip>
                    } else if (!record.isDel) {
                        actionDel =
                            <Tooltip title={'禁用'} placement={'bottom'}>
                                <Popconfirm
                                    title={'确定要禁用此信息吗?'}
                                    okText={'是'}
                                    cancelText={'否'}
                                    // onConfirm={(e) => this.handleOnDel('off', record.id)}
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
                        </div>
                    )
                }
            }],
            data: [],
            searchContent: '',
            pageSize: 10,
            current: 1,
            total: 0,
        }
    }


    // componentWillMount() {
    //     this.getListInfo('')
    // }
    /**
     * 禁用或启用用户
     */
    // handleOnDel = (flag, id) => {
    //     let url = ''
    //     let successMsg = ''
    //     let failedMsg = ''
    //     if (flag === 'on') {
    //         url = `/v1/sysuser/${id}/0`
    //         successMsg = '启用成功'
    //         failedMsg = '启用失败'
    //     } else if (flag === 'off') {
    //         url = `/v1/sysuser/${id}/1`
    //         successMsg = '禁用成功'
    //         failedMsg = '禁用失败'
    //     }
    //     request(url, {
    //         method: 'GET',
    //         // credentials: 'omit'
    //     }).then((res) => {
    //         if (res.message === '成功') {
    //             message.success(successMsg)
    //             this.getListInfo(this.state.searchContent)
    //         } else {
    //             message.error(failedMsg)
    //         }
    //     }).catch((err) => {
    //         console.log(err)
    //     })
    // }

    /**
     *   跳转到编辑或添加页面
     */
    // handleLinkToDetail = (e, flag, id) => {
    //     e.stopPropagation()
    //     this.linkToChange(`/setting/user-update/${flag}/${id}`)
    // };

    /***
     *   路径跳转
     */
    // linkToChange = url => {
    //     const { history } = this.props
    //     history.push(url)
    // };

    /**
     * 将信息填入表格
     */
    addToTable = (data) => {
        let dataSource = []
        console.log(data)
        data.list.map((item, index) => {
        item.order=index+1
        let record=item;
        dataSource.push(record)
        })
        this.setState({
            data: dataSource,
        })
    }
    componentWillMount(){
        this.getBuilding()
    }

    /**
     *  回车或点击搜索符号时触发搜索事件
     */
    // handleOnSearch = (value) => {
    //     this.setState({
    //         current: 1,
    //         searchContent: value
    //     }, () => {
    //         this.getListInfo(value)
    //     })
    // }
   /** 
    * 获取楼盘信息
    * */ 
   getBuilding=()=>{
       let url= '/v1/wyw/renthouse/selectAllByPage?pageNo='+this.state.current+'&pageSize=' + this.state.pageSize
       request(url,{
           method: 'GET'
       }).then((res)=>{
           if(res.message=='成功'){
            this.addToTable(res.data)
           }
       })
   }
    /**
     * 获取用户信息
     */
    // getListInfo = (value) => {
    //     let url = ''
    //     console.log("value",value)
    //     if (value.toString().length === 0) {
    //         url = '/v1/sysuser?pageNo=' + this.state.current + '&pageSize=' + this.state.pageSize
    //     } else {
    //         url = '/v1/sysuser?realName=' + value + '&pageNo=' + this.state.current + '&pageSize=' + this.state.pageSize
    //     }
    //     const data = request(url, {
    //         method: 'GET',
    //         // credentials: 'omit'
    //     })
    //     data.then((res) => {
    //         if (res.message === '成功') {
    //             this.addToTable(res.data)
    //             this.setState({
    //                 searchContent: value,
    //             })
    //         } else {
    //             this.setState({
    //                 data: []
    //             })
    //         }
    //     }).catch((err) => {
    //         console.log(err)
    //     })
    // }



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
                title={'出租屋信息管理'}
            >
                {/* <Form>
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
                </Form> */}
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

export default Form.create()(RentHouseList);