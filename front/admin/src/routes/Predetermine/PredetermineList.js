import React from 'react'
import TableLayout from '../../layouts/TableLayout'
import { Button, Table, Form, Icon, Tag, Tabs, message, Tooltip, Popconfirm } from 'antd'
import request from '../../utils/request'

class PredetermineList extends React.Component {

    constructor(props) {
        super(props)
        /**
         * columns: 表格的列
         * data: 表格的数据
         * searchContent: 筛选内容
         */
        this.state = {
            orderColumns: [{
                title: '交易编号',
                dataIndex: 'id',
                align: 'center',
                width: '10%',
            }, {
                title: '房屋地址',
                dataIndex: 'houseName',
                align: 'center',
                width: '15%',
            }, 
            {
                title: '租赁人姓名',
                dataIndex: 'rentUserName',
                align: 'center',
                width: '15%',
            }, 
            {
                title: '房东名称',
                dataIndex: 'userName',
                align: 'center',
                width: '15%',
            }, 
            {
                title: '发布时间',
                dataIndex: 'createdTime',
                align: 'center',
                width: '20%',
                render: (text, record) => {
                    return <span title={text}>{text}</span>
                }
            }, {
                title: '交易进度',
                dataIndex: 'status',
                align: 'center',
                width: '10%',
                render: (text, record) => {
                    let tag;
                    if (text === 0) {
                        tag = <Tag checked={false} style={{ cursor: 'auto', width: 50, marginLeft: 'auto', marginRight: 'auto' }} color={'#4CAF50'}>待确定</Tag>
                    } else if (text === 1) {
                        tag = <Tag checked={false} style={{ cursor: 'auto', width: 50, marginLeft: 'auto', marginRight: 'auto' }} color={'#4CAF50'}>待审核</Tag>
                    } else if (text ===2 ) {
                        tag = <Tag checked={false} style={{ cursor: 'auto', width: 50, marginLeft: 'auto', marginRight: 'auto' }} color={'#4CAF50'}>待交易</Tag>
                    }  else if (text ===3) {
                        tag = <Tag checked={false} style={{ cursor: 'auto', width: 50, marginLeft: 'auto', marginRight: 'auto' }} color={'#4CAF50'}>已完成</Tag>
                    } 
                    return (
                        tag
                    )
                }
            }],

            columns: [{
                title: '交易编号',
                dataIndex: 'id',
                align: 'center',
                width: '10%',
            }, {
                title: '房屋地址',
                dataIndex: 'houseName',
                align: 'center',
                width: '15%',
            }, 
            {
                title: '租赁人姓名',
                dataIndex: 'rentUserName',
                align: 'center',
                width: '15%',
            }, 
            {
                title: '房东名称',
                dataIndex: 'userName',
                align: 'center',
                width: '15%',
            }, 
            {
                title: '发布时间',
                dataIndex: 'createdTime',
                align: 'center',
                width: '20%',
                render: (text, record) => {
                    return <span title={text}>{text}</span>
                }
            }, {
                title: '交易进度',
                dataIndex: 'status',
                align: 'center',
                width: '10%',
                render: (text, record) => {
                    let tag;
                     if (text === 0) {
                        tag = <Tag checked={false} style={{ cursor: 'auto', width: 50, marginLeft: 'auto', marginRight: 'auto' }} color={'#4CAF50'}>待确定</Tag>
                    } else if (text === 1) {
                        tag = <Tag checked={false} style={{ cursor: 'auto', width: 50, marginLeft: 'auto', marginRight: 'auto' }} color={'#4CAF50'}>待审核</Tag>
                    } else if (text ===2 ) {
                        tag = <Tag checked={false} style={{ cursor: 'auto', width: 50, marginLeft: 'auto', marginRight: 'auto' }} color={'#4CAF50'}>待交易</Tag>
                    }  else if (text ===3) {
                        tag = <Tag checked={false} style={{ cursor: 'auto', width: 50, marginLeft: 'auto', marginRight: 'auto' }} color={'#4CAF50'}>已完成</Tag>
                    } 
                    return (
                        tag
                    )
                }
            }, {
                title: '交易状态',
                dataIndex: 'action',
                align: 'center',
                width: '30%',
                render: (text, record) => {
                    let actionDel = '';
                    if (record.status==1) {
                        actionDel =
                            <Tooltip title={'发布'} placement={'bottom'}>
                                <Popconfirm
                                    title={'通过审核?'}
                                    okText={'是'}
                                    cancelText={'否'}
                                    onConfirm={(e) => this.handleOnDel( record.id)}
                                >
                                    <Button style={{ marginRight: '5px' }} type={'danger'}><Icon type='minus-circle-o'  /></Button>
                                </Popconfirm>
                            </Tooltip>
                    }
                    return (
                        <div>
                            <Tooltip title={'编辑'} placement={'bottom'}>
                               
                            </Tooltip>
                            {actionDel}
                        </div>
                    )
                }
            }],
            data: [],
            searchContent: '',
            status:0,
            total: 0,
            tg:2,
            finish:[],
            order:[]
        }
    }
    handleOnDel = ( id) => {
         let   url = `/v1/wyw/rentOrder/updateOne/${id}/${this.state.tg}`
         let   successMsg = '禁用成功'
         let   failedMsg = '禁用失败'
        
        request(url, {
            method: 'GET',
            // credentials: 'omit'
        }).then((res) => {
            if (res.message === '成功') {
                message.success(successMsg)
                this.getBuilding()
            } else {
                message.error(failedMsg)
                console.log('未成功',err)
            }
        }).catch((err) => {
            console.log('出错',err)
        })
    }

    componentWillMount(){
        this.getBuilding()
    }
   /** 
    * 获取楼盘信息
    * */ 
   getBuilding=()=>{
       let url= `/v1/wyw/rentOrder/sellectAll`
       request(url,{
           method: 'GET'
       }).then((res)=>{
           if(res.message=='成功'){
            let list=[]
            let finish=[]
            let order=[]
            for(let i of res.data){
                if(i.status==1 && i.type==0){
                    list.push(i)
                }
                if(i.status==3 && i.type==0){
                    finish.push(i)
                }
                if(i.status==2 && i.type==0){
                    order.push(i)
                }
              }
              this.setState({
                        data: list,
                        finish:finish,
                        order:order
                    })
           }
       })
   }

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
                title={'楼盘信息管理'}
            >
                 <Tabs defaultActiveKey="1">
                 <Tabs.TabPane tab='订单审核' key="1"> 
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
                 </Tabs.TabPane>
                 <Tabs.TabPane tab='待完成订单' key="2"> 
                 <Table
                    size={'middle'}
                    columns={this.state.orderColumns}
                    dataSource={this.state.order}
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
                 </Tabs.TabPane>
                 <Tabs.TabPane tab='已完成' key="3"> 
                 <Table
                    size={'middle'}
                    columns={this.state.orderColumns}
                    dataSource={this.state.finish}
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
                 </Tabs.TabPane>
                  </Tabs>
                 
            </TableLayout>
        )
    }
}

export default Form.create()(PredetermineList);