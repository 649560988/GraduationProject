import React, { Component } from 'react'
import { connect } from 'dva'
import { Card, Button, Row, Col, Select, message, Table, Upload, Icon, Modal, Popover } from 'antd'
import styles from './BulkUpload.less'
import axios from 'axios'

const Option = Select.Option

@connect(({ user }) => ({
  userId: user.currentUser.id
}))

class BulkUpload extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dataSource: [],
      templateType: undefined,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      uploadModalVisible: false,
      fileList: [],
      uploading: false,
      optionItems: []
    }
  }

  // 获取数据
  fetchDataSource = () => {
    const { current, pageSize } = this.state.pagination
    return axios.get('/attachment/v1/baseupload/pageAll', {
      params: {
        page: current - 1,
        size: pageSize
      }
    })
  }

  // 获取下拉框的选项
  fetchSelectData = () => {
    return axios.get('/attr/v1/sources/queryBySourceName', { params: { sourceName: '附件类型' } })
  }

  // 拉取初始化数据信息
  fetch = () => {
    const { optionItems } = this.state
    const _this = this
    axios.all([this.fetchSelectData(), this.fetchDataSource()])
      .then(axios.spread(function (selRes, dataRes) {
        // 两个请求现在都执行完成
        const { sourceSubList } = selRes.data
        sourceSubList.map(item => { optionItems.push({ key: item.id, value: item.sourceSubName, code: item.sourceSubCode }) })
        _this.setState({
          optionItems,
          dataSource: dataRes.data.content,
          pagination: {
            current: dataRes.data.number + 1,
            pageSize: dataRes.data.size,
            total: dataRes.data.totalElements
          }
        })
      }))
  }

  componentDidMount () {
    this.fetch()
  }

  // 获取select的ref
  saveSelectRef = (ref) => {
    this.selectRef = ref
  }

  // 下拉框改变事件
  handleSelectChange = value => {
    this.setState({templateType: value})
  }

  // 下载模板事件
  handleTemplateDownload = () => {
    const { templateType } = this.state
    if (templateType === undefined) {
      message.warning(`请先选择模板类型`)
      this.selectRef.focus()
      return
    }

    let instance = axios.create({
      responseType: 'blob'
    })
    instance.post(`/base-info/v1/excel/excelDownload/${templateType}`).then(res => {
      console.log(res)
      // 获取后台文件名
      const fileName = res['headers']['content-disposition'].split('filename=')[1]
      const blob = res.data

      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, fileName)
      } else {
        var link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = fileName

        // 此写法兼容可火狐浏览器
        document.body.appendChild(link)

        var evt = document.createEvent('MouseEvents')
        evt.initEvent('click', false, false)
        link.dispatchEvent(evt)

        document.body.removeChild(link)
      }

      // var blob = new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'});
      // var downloadElement = document.createElement('a');
      // var href = window.URL.createObjectURL(blob); //创建下载的链接
      // downloadElement.href = href;
      // downloadElement.download = 'xxx.xlsx'; //下载后文件名
      // document.body.appendChild(downloadElement);
      // downloadElement.click(); //点击下载
      // document.body.removeChild(downloadElement); //下载完成移除元素
      // window.URL.revokeObjectURL(href); //释放掉blob对象
    }).catch(err => {
      console.log(err)
      message.error('请求失败')
    })
  }

  handleShowUploadModal = () => {
    this.setState({uploadModalVisible: true})
  }

  // 渲染列表
  renderTable = () => {
    const columns = [
      {
        title: '序号',
        key: 'no',
        align: 'center',
        width: '10%',
        dataIndex: '',
        render: (text, record, index) => (<span>{index + 1}</span>)
      },
      {
        title: <span>文件名<Icon type='question-circle-o' style={{marginLeft: 8, cursor: 'pointer'}} title='点击文件名即可下载相应文件' /></span>,
        key: 'fileName',
        width: '30%',
        dataIndex: 'fileName',
        render: (text, record) => {
          return (
            <span>
              <a href={record.path} title='点击下载该文件'>{record.fileName}</a>
            </span>)
        }
      },
      {
        title: '上传人',
        key: 'createrName',
        align: 'center',
        dataIndex: 'createrName'
      },
      {
        title: '上传时间',
        key: 'creationDate',
        align: 'center',
        dataIndex: 'creationDate'
      },
      {
        title: '文件类型',
        key: 'fileType',
        align: 'center',
        dataIndex: 'fileType',
        render: (text, record, index) => {
          const { optionItems } = this.state
          const item = optionItems.find(item => item.code === parseInt(record.fileType))
          return item ? item.value : ''
        }
      }
    ]

    const pagination = {
      current: this.state.pagination.current,
      pageSize: this.state.pagination.pageSize,
      total: this.state.pagination.total,
      onChange: (current, pageSize) => this.handlePaginationChange(current, pageSize),
      onShowSizeChange: (current, pageSize) => this.handlePaginationChange(1, pageSize),
      showQuickJumper: true,
      showSizeChanger: true
    }

    return (
      <Table rowKey={record => record.id} dataSource={this.state.dataSource} className={styles.table}
        filterBar={false} columns={columns} size='middle' pagination={pagination} />
    )
  }

  // 处理页码改变
  handlePaginationChange = (current, pageSize) => {
    this.setState({pagination: {current, pageSize}}, () => {
      this.fetchDataSource().then(res => {
        this.setState({
          dataSource: res.data.content,
          pagination: {
            current: res.data.number + 1,
            pageSize: res.data.size,
            total: res.data.totalElements
          }})
      })
    })
  }

  // 隐藏上传文件模态框
  handleHideUploadModal = () => {
    this.setState({ uploadModalVisible: false, fileList: [] })
  }

  // 上传文件前的校验
  handleBeforeUpload = (file) => {
    const isExcel = /^.*(\.xls|\.xlsx)$/.test(file.name)
    if (!isExcel) {
      message.error('仅支持上传Excel文件')
    } else if (this.state.fileList.length > 0) {
      message.error('一次只能上传单个文件')
    } else {
      this.setState(({ fileList }) => ({
        fileList: [...fileList, file]
      }))
    }
    return false
  }

  // 处理移除待上传列表中的文件
  handleRemoveFile = (file) => {
    this.setState(({ fileList }) => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)
      return {
        fileList: newFileList
      }
    })
  }

  //
  handleUploadFile = () => {
    const { fileList } = this.state
    // console.log(fileList[0].name);
    const formData = new FormData()
    fileList.forEach((file) => {
      formData.append('file', file)
    })

    this.setState({
      uploading: true
    })

    // ajax请求，
    // 先调用文件上传接口上传，返回文件路径
    // 再传递文件路径给excel解析接口，返回结果true或false，以及提示信息
    // 结果为true，则将文件信息保存到record表
    let config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    axios.post('/file/v1/files/bulk/upload', formData, config).then(res => {
      const urlFile = res.data
      axios.post(`/base-info/v1/excel/excelUpload?urlFile=${encodeURIComponent(urlFile)}`).then(res => {
        if (res.data.result === true) {
          const fileType = this.state.optionItems.find(item => item.value === res.data.type).code
          axios.post('/attachment/v1/baseupload/insertL', {
            createdBy: this.props.userId,
            fileName: fileList[0].name,
            path: urlFile,
            fileType: fileType
          }).then(res => {
            if (res.data === true) {
              message.success('批量导入成功')
              this.handleHideUploadModal()
              this.setState({
                pagination: {
                  current: 1,
                  pageSize: 10
                }
              }, () => {
                this.fetchDataSource().then(res => {
                  this.setState({
                    dataSource: res.data.content,
                    pagination: {
                      current: res.data.number + 1,
                      pageSize: res.data.size,
                      total: res.data.totalElements
                    }
                  })
                }).catch(err => {
                  console.log('数据源更新失败', err)
                })
              })
            } else {
              message.error('批量导入失败，请重试')
            }
            this.setState({fileList: [], uploading: false})
          }).catch(err => {
            console.log(err)
            message.error('请求失败，请重试')
            this.setState({fileList: [], uploading: false})
          })
        } else {
          const errors = res.data.resultInfo.split(';')
          Modal.error({
            title: '文件解析出错',
            content: <div dangerouslySetInnerHTML={{__html: errors.join('<br/>')}} />
          })
          this.setState({fileList: [], uploading: false})
        }
      }).catch(err => {
        console.log(err)
        message.error('文件解析请求失败，请重试')
        this.setState({fileList: [], uploading: false})
      })
    }).catch(err => {
      console.log(err)
      message.error('文件上传出错，请重试')
      this.setState({fileList: [], uploading: false})
    })
  }

  // 渲染上传文件模态框
  renderUploadModal = () => {
    const Dragger = Upload.Dragger

    const props = {
      name: 'file',
      action: '//jsonplaceholder.typicode.com/posts/',
      fileList: this.state.fileList,
      beforeUpload: this.handleBeforeUpload,
      onRemove: this.handleRemoveFile
    }

    return (
      <Modal visible={this.state.uploadModalVisible} title='批量导入' maskClosable={false}
        onCancel={this.handleHideUploadModal} className={styles.uploadModal}
        footer={[
          <Button key='btnConfirm' type='primary' loading={this.state.uploading} onClick={this.handleUploadFile}
            disabled={!(this.state.fileList.length > 0)}>
            { this.state.uploading ? '数据导入中...' : '确定'}
          </Button>,
          <Button key='btnClose' onClick={this.handleHideUploadModal}>关闭</Button>]}>
        <Dragger {...props}>
          <p className='ant-upload-drag-icon'>
            <Icon type='inbox' />
          </p>
          <p className='ant-upload-text'>点击或者拖拽Excel文件至此区域来进行批量导入</p>
          <p className='ant-upload-hint'><span style={{color: 'red'}}>*</span> 仅支持上传单个Excel文件</p>
        </Dragger>
      </Modal>
    )
  }

  render () {
    return (
      <Card>
        <Row style={{marginBottom: 24}}>
          <Col span={4}>
            <Select placeholder='请选择模板类型' onChange={this.handleSelectChange} defaultValue={this.state.templateType}
              style={{width: '100%'}} ref={this.saveSelectRef}>
              {this.state.optionItems.map(item => (<Option key={item.key} value={item.code}>{item.value}</Option>))}
            </Select>
          </Col>
          <Col span={4} style={{paddingLeft: 20}}>
            <Button icon='download' onClick={this.handleTemplateDownload}>下载模板</Button>
          </Col>
          <Col span={3} offset={13} style={{textAlign: 'right'}}>
            <Button type='primary' icon='upload' onClick={this.handleShowUploadModal}>批量导入</Button>
          </Col>
        </Row>
        {this.renderTable()}
        {this.state.uploadModalVisible && this.renderUploadModal()}
      </Card>
    )
  }
}

export default BulkUpload
