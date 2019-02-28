import React from 'react'
import TableLayout from '../../layouts/TableLayout';
import { Form, Row, Col, Select, Input, DatePicker, TimePicker,Button, Upload, Icon, Modal, Tooltip, Popconfirm, message } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { connect } from 'dva/index'

const Option = Select.Option

@Form.create()
@connect(({ user }) => ({
    user: user
}))

class OvertimeApprovalEdit extends React.Component {

    state = {
        projectsList: [],
        projectManager: '',
        created_by:'',
        previewVisible: false,
        previewImage: '',
        fileList: [],
        filename:'',
        uploadAction:'',
        attachment:{},
        isAttachmentExist:false,
        showModal:false,
        imgSrc:'',
        vpreviewVisible:false
    }

    componentDidMount() {
        this.getOvertimeInfo(this.props)
        this.getAllProject()
        this.getAttachment()
    }

    // 回显加班申请信息
    getOvertimeInfo = (props) => {
        axios({
            method:'get',
            url:'holiday/v1/ompOvertime/selectById/' + this.props.match.params.id
        }).then((res) => {
            this.setState({
                projectManager:res.data.projectId
            })
            let startDate = res.data.startDate
            let starttime = startDate.substring(11,13)
            let endDate = res.data.endDate
            let endtime = endDate.substring(11,13)
            props.form.setFieldsValue({
                startdate:moment(startDate),
                starttime:moment(starttime,['HH']),
                enddate:moment(endDate),
                endtime:moment(endtime,['HH']),
                project:res.data.projectId,
                times:res.data.times,
                reason:res.data.reason
            })
        }).catch((err) => {
            console.log(err)
        })
    }

    /**
     * 获取所有项目
     */
    getAllProject = () => {
        let option = ''
        let projects = []
        axios({
            method: 'get',
            url: '/omp-projectmanage/v1/projectResume/selectByUserId/' + this.props.user.currentUser.id, 
        }).then((res) => {
            console.log(res.data)
            res.data.map((item) => {
                option = <Option data_name={item.project_manager} created_by={item.created_by} key={item.project_id} value={item.project_id}>项目名称：{item.project_name}</Option>
                projects.push(option)
            })
            console.log(projects)
            this.setState({
                projectsList: projects
            })
        }).catch((err) => {
            console.log(err)
        })
    }

    /***
    * 返回上一个页面
    * @param result
    */
    handleClickBackBtn = (e) => {
        this.linkToChange(`/tsmanage/otapproval`)
    }

    /**
    * 路径跳转
    */
    linkToChange = url => {
        const { history } = this.props
        history.push(url)
    };

    // 预览附件
    previewAttachment = (e, item) => {
        this.setState({
            vpreviewVisible: true,
        })
    }

    handleCancel2 = () => this.setState({ 
        vpreviewVisible: false,
    })

    // 查看加班申请附件
    getPreview = ()=>{
        let attachment = ''
        if (this.state.fileList.length > 0) {
            this.state.fileList.map((item) => {
                attachment = [...attachment, <span style={{ marginRight: '8px' }}>
                    <img src={item.url} onClick={(e) => this.previewAttachment(e, item)} style={{ width: '100px', height: '100px' }} />
                    {/* <span><Icon id={item.name} title={'预览附件'} type={'eye-o'} /></span> */}
                    <Modal visible={this.state.vpreviewVisible} footer={null} onCancel={this.handleCancel2}>
                        <img alt="example" style={{ width: '100%' }} src={item.url} />
                    </Modal>
                </span>
                ]
            })
        }
        return attachment
    }

    // 预览附件
    previewAttachment = (e, item) => {
        this.setState({
            vpreviewVisible: true
        })
    }

    // 查看某条附件
    getAttachment = ()=> {
        axios({
            method: 'get',
            url: 'holiday/v1/ompOvertime/selectAttachment?attachmentTypeId=3&mainTableId=' + Number(this.props.match.params.id)
        }).then((res) => {
            if (res.data.length > 0) {
                let fileList = []
                res.data.map((item) => {
                    let file = {}
                    file.uid = '-' + item.id
                    file.name = item.attachmentName
                    file.status = 'done'
                    file.url = item.attachmentPath
                    fileList.push(file)
                })
                this.setState({
                    fileList: fileList,
                    isAttachmentExist: true
                })
            } else {
                this.setState({
                    isAttachmentExist: false
                })
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    /**
    * 同意和驳回 
    */
    handleSubmit = (e ,status) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
            
            axios({
                method: 'post',
                url: 'holiday/v1/ompOvertime/update/' + this.props.match.params.id, 
                data:{
                    auditOpinion:values.auditOpinion,
                    status:status
                }
            }).then((res) => {
                message.success('审批成功')
            }).catch((err) => {
                console.log(err)
            })
          }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            style: { width: 500, marginBottom: 15 },
            labelCol: {
              span: 24
            },
            wrapperCol: {
              span: 24
            }
        }
        
        return (
            <TableLayout
                title={'加班申请审批'}
                showBackBtn
                onBackBtnClick={this.handleClickBackBtn}
            >
                <Form>
                    <Row>
                        <Col>
                            <Form.Item {...formItemLayout} label={'项目选择'}>
                                {getFieldDecorator('project',{
                                   
                                })(
                                    <Select
                                        filterOption={false}
                                        placeholder={'请选择项目'}
                                        disabled={true}
                                    >
                                        {this.state.projectsList}
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Item {...formItemLayout} label={'项目经理'}>
                                <Input 
                                    value={this.state.projectManager}
                                    disabled={true}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Item {...formItemLayout} label={'开始日期'}>
                                <Input.Group compact>
                                {getFieldDecorator('startdate')(
                                    <DatePicker style={{width:350}}
                                        format="YYYY-MM-DD"
                                        placeholder="请选择开始日期"
                                        disabled={true}
                                    />
                                )}
                                 {getFieldDecorator('starttime')(
                                    <TimePicker style={{width:150}}
                                        format={'HH'}
                                        placeholder="请选择开始时间"
                                        disabled={true}
                                    />
                                )}
                                </Input.Group>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Item {...formItemLayout} label={'结束日期'}>
                            <Input.Group compact>
                                {getFieldDecorator('enddate')(
                                    <DatePicker style={{width:350}}
                                        format="YYYY-MM-DD"
                                        placeholder="请选择结束日期"
                                        disabled={true}
                                    />
                                )}
                                {getFieldDecorator('endtime')(
                                    <TimePicker style={{width:150}}
                                        format={'HH'}
                                        placeholder="请选择结束时间"
                                        disabled={true}
                                    />
                                )}
                            </Input.Group>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Item {...formItemLayout} label={'合计时长(以小时为单位)'}>
                                {getFieldDecorator('times', {
                                    rules: [{ required: true, message: '请输入合计时长(正整数)!' }]
                                })(
                                    <Input
                                        type={'number'}
                                        disabled={true}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Item {...formItemLayout} label={'原因说明'}>
                                {getFieldDecorator('reason', {
                                    rules: [{ required: true, whitespace: true, message: '请输入原因' }]
                                })(
                                    <Input.TextArea
                                        style={{ height: '100px' }}
                                        disabled={true}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Item {...formItemLayout} label={'附件'}>
                                {this.getPreview()}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Item {...formItemLayout} label={'审核意见'}>
                                {getFieldDecorator('auditOpinion', {
                                    rules: [{ required: true, whitespace: true, message: '请输入审核意见' }]
                                })(
                                    <Input.TextArea
                                        style={{ height: '100px' }}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button onClick={(e, result) => this.handleSubmit(e, 2)} type={'primary'}>同意</Button>
                            <Button onClick={(e, result) => this.handleSubmit(e, 3)} type={'danger'} style={{ marginLeft: '10px' }}>驳回</Button>
                        </Col>
                    </Row>
                </Form>
            </TableLayout>
        )
    }
}

export default Form.create()(OvertimeApprovalEdit)