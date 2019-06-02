import React from 'react'
import TableLayout from '../../layouts/TableLayout'
import { Button, Table, Form, Icon, Tag, Tabs , message, Tooltip, Popconfirm} from 'antd'
import request from '../../utils/request'
import MyMenu from '../Menu/MyMenu';
class MyPredetermine extends React.Component {

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
                title: '租赁人姓名',
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
                    <Tooltip title={''} placement={'bottom'}>
                    <Popconfirm
                        title={'确定取消交易?'}
                        okText={'是'}
                        cancelText={'否'}
                        onConfirm={(e) => this.handleOnDel(record.id)}
                    >
                        <Button style={{ marginRight: '5px' }} type={'danger'}><Icon type='minus-circle-o'  /></Button>
                    </Popconfirm>
                </Tooltip>
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
            qx:2,
            user:'',
            orderData:[],
            finish:[]
        }
    }
    componentWillMount(){
        this.getBuilding()
    }
    handleOnDel = ( id) => {
        let   url = `/v1/wyw/rentOrder/delete/${id}/${this.state.qx}`
       request(url, {
           method: 'GET',
           // credentials: 'omit'
       }).then((res) => {
           if (res.message === '成功') {
               message.success('订单已完成')
               this.getBuilding()
           } else {
               message.error('操作失败')
               console.log('未成功',err)
           }
       }).catch((err) => {
           console.log('出错',err)
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
                console.log('getCurrentUser.value',value)
                console.log('getCurrentUser.res.data',res.data)
                for(let i of value){
                    if(i.rentUserId==res.data.id){
                        list.push(i)
                    }
                  }
                this.setState({
                    data: list,
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
                if(i.type==0){
                    list.push(i)
                }
            }
            console.log('getBuilding',list)
            this.getCurrentUser(list)
           }
       })
   }

    handlePageChange = (page, pageSize) => {
        this.setState({
            pageSize,
            current: page,
        }, () => {
            // this.getListInfo(this.state.searchContent)
        })
    }


    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <div style={{ padding: 20, overflowY: 'auto', flex: 1 }}>
            <MyMenu></MyMenu>
            <TableLayout
                title={'我的预定'}
            >
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
                        // onShowSizeChange: this.handlePageChange
                    }}
                />
            </TableLayout>
        </div>
        )
    }
}

export default Form.create()(MyPredetermine);