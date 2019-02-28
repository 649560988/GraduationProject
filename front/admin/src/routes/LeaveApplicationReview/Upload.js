import React from 'react'
import { Icon, message, Modal, Slider } from 'antd'
import AvatarEditor from 'react-avatar-editor'
import styled from 'styled-components'
import { FilePicker } from '../../components/FilePicker'
import dataURLToBlob from '../../utils/dataURLToBlob'
import { upload } from '../../utils/upload'

const AvatarImageWrapper = styled.div`
  width: 58px;
  height: 58px;
  align-items: center;
  border-radius: 0px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  background-color: #F5F5F5;
`

export default class AvatarUpload extends React.Component {
  static defaultProps = {
    modalVisible: false,
    getUploadHeaders: () => ({})
  }

  state = {
    scale: 10,
    file: null,
    avatarUploading: false
  }

  validateUpload = (fileList) => {
    if (fileList.length > 0) {
      const file = fileList[0]
      // console.log(file)
      if (file.size > 1048576) {
        return message.error('文件不能超过1MB')
      }
      this.setState({
        modalVisible: true,
        file
      })
    }
  }

  onAvatarImageClick = () => {
    this.setState({
      modalVisible: true
    })
  }

  onCancel = () => {
    this.filepicker.current.clean()
    this.setState({
      scale: 10,
      imageScale: 1,
      modalVisible: false
    })
  }

  onOk = () => {
    this.filepicker.current.clean()
    this.setState({
      scale: 10,
      imageScale: 1,
      modalVisible: false,
      avatarUploading: true
    }, this.uploadFile)
  }

  filepicker= React.createRef()
  AvatarEditor = React.createRef()

  getFile = () => {
    const dataUrl = this.AvatarEditor.current.getImage().toDataURL()
    const blob = dataURLToBlob(dataUrl)
    return new File([blob], this.state.file.name, { lastModified: this.state.file.lastModified })
  }

  uploadFile = () => {
    const headers = this.props.getUploadHeaders()
    const url = `${this.props.server}/iam/v1/users/${this.props.userId}/upload_photo`
    upload({
      file: this.getFile(),
      name: 'file',
      onError: () => {
        this.setState({
          avatarUploading: false
        })
        message.error('上传失败')
      },
      onSuccess: (data) => {
        // console.log(data)
        this.setState({
          avatarUploading: false
        })
        this.props.onChange({ target: { value: data } })
      },
      url,
      headers
    })
  }

  getData = (file) => {
    return file
  }

  render = () => {
    const { value } = this.props
    console.log(this.props)
    return (
      <React.Fragment>
        <div style={{ display: 'flex' }}>
          <FilePicker
            ref={this.filepicker}
            style={{ cursor: 'pointer' }}
            accept={'.jpg,.jpeg,.png,.gif'}
            withObjectUrl
            onFileChange={this.validateUpload}
          >
            <AvatarImageWrapper >
              {this.state.avatarUploading
                ? <Icon type='loading' />
                : <img src={value} alt='附件' style={{ width: '100%', height: '100%', borderRadius: 0 }} />
              }
            </AvatarImageWrapper>
          </FilePicker>
        </div>
        <Modal
          visible={this.state.modalVisible}
          onCancel={this.onCancel}
          onOk={this.onOk}
          closable={false}
          width={448}
        >
          <div>
            <AvatarEditor
              width={350}
              height={350}
              borderRadius={0}
              ref={this.AvatarEditor}
              scale={this.state.imageScale}
              image={this.state.file}
            />
            <Slider
              value={this.state.scale}
              onChange={(value) => this.setState({
                imageScale: value / 10,
                scale: value
              })}
              dots={false}
              min={10}
              max={100}
            />
          </div>
        </Modal>
      </React.Fragment>
    )
  }
}
