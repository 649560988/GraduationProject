import React from 'react'
import TableLayout from '../../layouts/TableLayout'
import { Button, Table, Form, Icon, Tag, Tabs , message, Tooltip, Popconfirm} from 'antd'
import request from '../../utils/request'
import MyMenu from '../Menu/MyMenu';
class Yuyuekf extends React.Component {

    constructor(props) {
        super(props)
        /**
         * columns: 表格的列
         * data: 表格的数据
         * searchContent: 筛选内容
         */

        this.state = {
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
                title: '预约人姓名',
                dataIndex: 'rentUserName',
                align: 'center',
                width: '15%',
            }, 
            {
                title: '联系方式',
                dataIndex: 'phone',
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
                        tag = <Tag checked={false} style={{ cursor: 'auto', width: 50, marginLeft: 'auto', marginRight: 'auto' }} color={'#4CAF50'}>未通知</Tag>
                    } else if (text === 1) {
                        tag = <Tag checked={false} style={{ cursor: 'auto', width: 50, marginLeft: 'auto', marginRight: 'auto' }} color={'#4CAF50'}>已通知</Tag>
                    }
                    return (
                        tag
                    )
                }
            },{
                title: '交易状态',
                dataIndex: 'action',
                align: 'center',
                width: '30%',
                render: (text, record) => {
                    let actionDel = '';
                    if (record.status==0) {
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
            tz:[],
            tg:1
        }
    }
    componentWillMount(){
        this.getBuilding()
    }
    handleOnDel = ( id) => {
        let   url = `/v1/wyw/rentOrder/updateOne/${id}/${this.state.tg}`
        request(url, {
            method: 'GET',
        }).then((res) => {
            if (res.message === '成功') {
                this.getBuilding()
            } else {
            }
        }).catch((err) => {
            console.log(err)
        })
   }
   	//获取当前用户
       getCurrentUser = (value) => {
           console.log('传递的职位',value)
		let url = '/v1/sysUserDomin/getAuth'
		request(url, {
			method: 'GET'
		}).then((res) => {
			if (res.message === '成功') {
                let list=[]
                let tz=[]
                for(let i of value){
                    if(i.userId==res.data.id&&i.status==0){
                        list.push(i)
                    }
                    if(i.userId==res.data.id&&i.status==1){
                        tz.push(i)
                    }
                  }
                this.setState({
                    data: list,
                    tz:tz
                })
			} else {
				console.log(err)
			}
		}).catch(() => {})
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
            for(let i of res.data){
                if(i.type==1){
                    list.push(i)
                }
            }
            this.getCurrentUser(list)
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
            <div style={{ padding: 20, overflowY: 'auto', flex: 1 }}>
            <MyMenu></MyMenu>
            <TableLayout
                title={'预约看房'}
            >
            <Tabs defaultActiveKey="1">
                 <Tabs.TabPane tab='待通知' key="1"> 
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
                    }}
                />
                 
                 </Tabs.TabPane>
                 <Tabs.TabPane tab='已通知' key="2"> 
                 <Table
                    size={'middle'}
                    columns={this.state.columns}
                    dataSource={this.state.tz}
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
        </div>
        )
    }
}

export default Form.create()(Yuyuekf);