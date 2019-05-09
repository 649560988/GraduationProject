
import React from 'react'
import TableLayout from '../../layouts/TableLayout'
import { Button, Table, Form, Icon, Tag, message, Tooltip, Popconfirm ,Drawer} from 'antd'
import request from '../../utils/request'

class SingerReport extends React.Component {

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
            },{
                title: '举报人',
                dataIndex: 'informerUsername',
                align: 'center',
                width: '8%',
            }, {
                title: '被举报人',
                dataIndex: 'againstUsername',
                align: 'center',
                width: '8%',
            },
            {
                title: '举报类型',
                dataIndex: 'violationType',
                align: 'center',
                width: '8%',
            },{
                title: '举报时间',
                dataIndex: 'createdTime',
                align: 'center',
                width: '15%',
                render: (text, record) => {
                    return <span title={text}>{text}</span>
                }
            }, {
                title:'查看举报详细信息',
                dataIndex:'cation',
                align:'center',
                // type:'bu',
                render:()=>{
                    let tag;
                    tag= <Button>1111</Button>
                    return (
                        tag
                    )
                //     <div>
                //     <Button type="primary" onClick={this.showDrawer}>
                //     举报
                //    </Button>
                //    <Drawer
                //     title="举报信息"
                //     placement="right"
                //     closable={false}
                //     onClose={this.onClose}
                //     visible={this.state.visible}
                //    width='20%'
                //   >
                //     <p>请勿恶意举报</p>
                //     <Form onSubmit={this.myHandleSubmit.bind(this)}>
                //     <Form.Item label = {'被举报人'}>
                //       {getFieldDecorator('againstUsername', {
                //         initialValue: this.state.building.userName,
                //       })(<Input size='large'  disabled='disabled' />)}
                //     </Form.Item>
                //     <Form.Item  label={'举报人'}>
                //                   {getFieldDecorator('informerUsername', {
                //                       initialValue: this.state.data.informerUsername,
                //                   })(
                //                       <Input placeholder={'请输入用户名'} disabled='disabled' />
                //                   )}
                //               </Form.Item>
                
                //     <Form.Item label={'举报类型'}>
                //       {getFieldDecorator('violationType', {
                //         initialValue: this.state.data.violationType,
                //       })(
                //         <Input placeholder={'请输入用户名'} disabled='disabled' />
                //       )}
                //     </Form.Item>
                //     <Form.Item label={'举报描述'}>
                //       {getFieldDecorator('violationContent', {
                //            initialValue: this.state.data.violationContent,
                //       })(<TextArea prefix = {< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)'} }/>}
                //       placeholder="请输入举报描述" />)}
                //     </Form.Item>
                //     </Form>
                //   </Drawer>
                //   </div>
                }
            },{
                title: '是否处理',
                dataIndex: 'isResolve',
                align: 'center',
                width: '10%',
                render: (text, record) => {
                    let tag;
                    if (text === 0) {
                        tag = <Tag checked={false} style={{ cursor: 'auto', width: 50, marginLeft: 'auto', marginRight: 'auto' }} color={'#4CAF50'}>未处理</Tag>
                    } else if (text === 1) {
                        tag = <Tag checked={false} style={{ cursor: 'auto', width: 50, color: 'black', marginLeft: 'auto', marginRight: 'auto' }} color={'#E9E9E9'}>已处理</Tag>
                    }
                    return (
                        tag
                    )
                }
            }, {
                title: '操作',
                dataIndex: 'action',
                align: 'center',
                width: '20%',
                render: (text, record) => {
                    let actionDel = '';
                    if (record.isResolve) {
                        actionDel =
                            <Tooltip title={'发布'} placement={'bottom'}>
                                <Popconfirm
                                    title={'确定要重新发布?'}
                                    okText={'是'}
                                    cancelText={'否'}
                                    onConfirm={(e) => this.handleOnDel('on', record.id)}
                                >
                                    <Button style={{ marginRight: '5px' }}><Icon type='check-circle-o' style={{ color: '#4CAF50' }} /></Button>
                                </Popconfirm>
                            </Tooltip>
                    } else if (!record.isResolve) {
                        actionDel =
                            <Tooltip title={'禁用'} placement={'bottom'}>
                                <Popconfirm
                                    title={'确定要禁用此信息吗?'}
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
                                {/* <Button style={{ marginRight: '5px' }} onClick={(e) => this.handleLinkToDetail(e, 'edit', record.id)}><Icon type={'edit'} /></Button> */}
                            </Tooltip>
                            {actionDel}
                        </div>
                    )
                }
            }],
            pageSize: 10,
            current: 1,
            total: 0,
            visible:false,
        }
    }

    onClose = () => {
        // this.myHandleSubmit()
        this.setState({
          visible: false,
        });
      };
      showDrawer = () => {
        this.setState({
          visible: true,
        });
        };

    // componentWillMount() {
    //     this.getListInfo('')
    // }
    /**
     * 禁用或启用用户
     */
    handleOnDel = (flag, id) => {
        let url = ''
        let successMsg = ''
        let failedMsg = ''
        if (flag === 'on') {
            url = `/v1/wyw/renthouse/stopOrStart/${id}/0`
            successMsg = '启用成功'
            failedMsg = '启用失败'
        } else if (flag === 'off') {
            url = `/v1/wyw/renthouse/stopOrStart/${id}/1`
            successMsg = '禁用成功'
            failedMsg = '禁用失败'
        }
        request(url, {
            method: 'GET',
            // credentials: 'omit'
        }).then((res) => {
            if (res.message === '成功') {
                message.success(successMsg)
                // this.getListInfo(this.state.searchContent)
                this.getBuilding()
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
    
//           //获取当前登陆人信息
//   getPersonalInfoById = () => {
//     request('/v1/sysUserDomin/getAuth', {
//         method: 'GET',
//         // credentials: 'omit'
//     }).then((res) => {
//         if (res.message === '成功') {
//             let data=[]
//             this.state.myRentHouse.map((item,index)=>{
//                 if(res.data.id==item.userId){
//                     data.push(item)
//                 }
//             })
//            this.addToTable(data)
//         } else {
//             message.error('获取当前登录人信息失败');
//         }
//     }).catch((err) => {
//         console.log(err)
//     })
// }

   /** 
    * 获取楼盘信息
    * */ 
   getBuilding=()=>{
       let url= '/v1/wyw/signedreport/selectAll?pageNo='+this.state.current+'&pageSize=' + this.state.pageSize
       request(url,{
           method: 'GET'
       }).then((res)=>{
           if(res.message=='成功'){
            this.addToTable(res.data)
           }
       })
   }

    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <TableLayout
                title={'举报受理'}
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

export default Form.create()(SingerReport);