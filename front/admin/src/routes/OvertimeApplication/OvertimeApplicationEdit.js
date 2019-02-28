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

class OvertimeApplicationEdit extends React.Component {

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
        const { flag } = this.props.match.params
        switch(flag){
            case 'add': this.getAllProject()
            break
            case 'view': this.getOvertimeInfo(this.props)
            this.getAllProject()
            this.getAttachment()
            break
            case 'edit': this.getOvertimeInfo(this.props)
            this.getAllProject()
            this.getAttachment()
            break
        }
    }

    // 回显加班申请信息
    getOvertimeInfo = (props) => {
        axios({
            method:'get',
            url:'holiday/v1/ompOvertime/selectById/' + this.props.match.params.id
        }).then((res) => {
            this.setState({
                projectManager:res.data.projectManager,
                created_by:res.data.createdBy
            })
            props.form.setFieldsValue({
                startdate:moment(res.data.startDate),
                starttime:moment(res.data.startDate.substring(11,13),['HH']),
                enddate:moment(res.data.endDate),
                endtime:moment(res.data.endDate.substring(11,13),['HH']),
                project:res.data.projectId,
                times:Number(res.data.times),
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

    /**
     * 在项目选择变化时获取项目经理名称
     */
    handleProjectChange = (value, e) => {
        this.setState({
            projectManager: e.props.data_name,
            created_by: e.props.created_by
        })
    }

    /***
    * 返回上一个页面
    * @param result
    */
    handleClickBackBtn = (e) => {
        this.linkToChange(`/tsmanage/otapplication`)
    }

    /**
    * 路径跳转
    */
    linkToChange = url => {
        const { history } = this.props
        history.push(url)
    };

    // 文件上传参数
    uploadData = (file) => {
        return {
            'bucket_name':'hoilday',
            'file_name':file.name
        }
    }

    handleCancel = () => this.setState({ 
        previewVisible: false,
    })

    handleCancel2 = () => this.setState({ 
        vpreviewVisible: false,
    })

    handlePreview = (file) => {
        this.setState({
        previewImage: file.url || file.thumbUrl,
        previewVisible: true,
        });
    }

    handleChange = async ({ file, fileList }) => {
        this.setState({ fileList })
        let fileObj = []
        await fileList.map((item) => {
            // console.log(item)
            if (item.response) {
                let attachment = {}
                attachment.mainTableId = Number(this.props.match.params.id)
                attachment.attachmentName = item.response.originFileName
                attachment.attachmentPath = item.response.endPoint + 'hoilday/' + item.response.fileName
                attachment.attachmentTypeId = 3
                fileObj.push(attachment)
            }
        })
        this.setState({
            attachment: fileObj
        })
    }

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

    // 删除附件
    removeChange = (file)=>{

         // console.log(file)
        let attachId = Number(file.uid.substring(1))
        axios({
            method: 'delete',
            url: 'holiday/v1/ompOvertime/remove/' + attachId
        }).then((res) => {
            if (res.data === 'success') {
                message.success('删除成功')
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    // 保存附件
    attachmentToLeave = ()=> {
        axios({
            method: 'post',
            url: 'holiday/v1/ompOvertime/uploadAttachment', 
            data:this.state.attachment
        }).then((res) => {
           
        }).catch((err) => {
            console.log(err)
        })
    }


    // 预览附件
    previewAttachment = (e, item) => {
        this.setState({
            vpreviewVisible: true,
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
    * 附件上传
    */
    attachUpload = () => {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
        <div>
            <Icon type="plus" />
            <div className="ant-upload-text">Upload</div>
        </div>
        );
        return (
            <div className="clearfix">
            <Upload
                accept={'.jpg,.jpeg,.gif,.png'}
                action={`${process.env.server}/file/v1/documents`}
                listType="picture-card"
                data={this.uploadData}
                fileList={fileList}
                onPreview={this.handlePreview}
                onChange={this.handleChange}
                onRemove={(file)=>this.removeChange(file)}  
            >
                {fileList.length >= 3 ? null : uploadButton}
            </Upload>
            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
            </div>
        );
   }

    /**
    * 保存和提交 保存0 提交1
    */
    handleSubmit = (e ,status) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
            let formdata = {
                projectId:values.project,
                auditorId:this.state.created_by,
                startDate:'',
                endDate:'',
                times:values.times,
                reason:values.reason,
                status:status,
                id:''
            }
            formdata.startDate = `${values.startdate.format('YYYY-MM-DD')} ${values.starttime.format('HH')}:00:00`
            formdata.endDate = `${values.enddate.format('YYYY-MM-DD')} ${values.endtime.format('HH')}:00:00`
            if(Number(this.props.match.params.id)!==0){
                formdata.id = Number(this.props.match.params.id)
            }
            axios({
                method: 'post',
                url: 'holiday/v1/ompOvertime/create', 
                data:{
                    ...formdata
                }
            }).then((res) => {
                if(res){
                    message.success('保存成功')
                }
            }).catch((err) => {
                console.log(err)
            })
            this.attachmentToLeave()
          }
        });
    }

    /**
    * 重置页面
    */
    resetForm = () => {
        this.props.form.resetFields()
        this.setState({
            projectManager:''
        })
    }

    btngroup = () => {
        return(
            <Form.Item>
                <Tooltip title={'保存不提交'}>
                    <Button onClick={(e) => this.handleSubmit(e, 0)} type={'primary'}>保存</Button>
                </Tooltip>
                <Tooltip title={'提交'}>
                    <Popconfirm title={"请核对页面信息，确认无误后点击'提交'"} okText={'提交'} cancelText={'取消'}
                        onConfirm={(e) => this.handleSubmit(e, 1)}
                    >
                        <Button style={{ marginLeft: '10px' }} type={'primary'}>提交</Button>
                    </Popconfirm>
                </Tooltip>
                <Tooltip title={'重置'}>
                    <Popconfirm title={'确定要重置整个页面吗'} okText={'是的'} cancelText={'取消'}
                        onConfirm={this.resetForm}
                    >
                        <Button type={'danger'} style={{ marginLeft: '10px' }}>重置</Button>
                    </Popconfirm>
                </Tooltip>
            </Form.Item>
        )
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
        let title = ''
        if (this.props.match.params.flag === 'add') {
            title = '创建加班申请'
        } else if (this.props.match.params.flag === 'edit') {
            title = '修改加班申请'
        } else if (this.props.match.params.flag === 'view') {
            title = '查看加班申请'
        }
        
        return (
            <TableLayout
                title={title}
                showBackBtn
                onBackBtnClick={this.handleClickBackBtn}
            >
                <Form>
                    <Row>
                        <Col>
                            <Form.Item {...formItemLayout} label={'项目选择'}>
                                {getFieldDecorator('project',{
                                    rules: [{ required: true, message: '请选择项目!' }]
                                })(
                                    <Select
                                        filterOption={false}
                                        placeholder={'请选择项目'}
                                        onChange={this.handleProjectChange}
                                        disabled={this.props.match.params.flag==='view'?true:false}
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
                                    disabled={this.props.match.params.flag==='view'?true:false}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Item {...formItemLayout} label={'开始日期'}>
                            <Input.Group compact>
                                {getFieldDecorator('startdate',{
                                     rules: [{ required: true, message: '请选择开始日期!' }]
                                })(
                                    <DatePicker style={{width:350}}
                                        format="YYYY-MM-DD"
                                        placeholder="请选择开始日期"
                                        disabled={this.props.match.params.flag==='view'?true:false}
                                    />
                                )}
                                 {getFieldDecorator('starttime',{
                                     rules: [{ required: true, message: '请选择开始时刻!' }]
                                 })(
                                    <TimePicker style={{width:150}}
                                        format={'HH'}
                                        placeholder="请选择开始时刻"
                                        disabled={this.props.match.params.flag==='view'?true:false}
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
                                {getFieldDecorator('enddate',{
                                    rules: [{ required: true, message: '请选择结束日期!' }]
                                })(
                                    <DatePicker style={{width:350}}
                                        format="YYYY-MM-DD"
                                        placeholder="请选择结束日期"
                                        disabled={this.props.match.params.flag==='view'?true:false}
                                    />
                                )}
                                {getFieldDecorator('endtime',{
                                    rules: [{ required: true, message: '请选择结束时刻!' }]
                                })(
                                    <TimePicker style={{width:150}}
                                        format={'HH'}
                                        placeholder="请选择结束时刻"
                                        disabled={this.props.match.params.flag==='view'?true:false}
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
                                        disabled={this.props.match.params.flag==='view'?true:false}
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
                                        disabled={this.props.match.params.flag==='view'?true:false}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Item {...formItemLayout} label={'附件上传'}>
                                {this.props.match.params.flag === 'view'?this.getPreview():this.attachUpload()}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                        {
                            this.props.match.params.flag === 'view'?'':this.btngroup()
                        }
                        </Col>
                    </Row>
                </Form>
            </TableLayout>
        )
    }
}

export default Form.create()(OvertimeApplicationEdit)