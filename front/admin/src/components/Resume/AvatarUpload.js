import React from 'react'
import { Upload, notification, Icon, message } from 'antd'

export default class AvatarUpload extends React.Component {
  static defaultProps = {
    getUploadHeaders: () => ({}),
    ocmsResumePrefix: '/resource/v1/resource'
  }

  state = {
    avatarUploading: false
  }

  validateUpload = (file) => {
    return new Promise((resolve, reject) => {
      if (file.size > 1048576) {
        message.error('文件不能超过1MB')
        return reject(new Error('文件不能超过1MB'))
      }

      this.setState({
        filename: file.name
      }, resolve)
    })
  }

  render = () => {
    const { resumeId, value } = this.props
    // console.log(resumeId, value)
    return (
      <Upload
        accept={'.jpg,.jpeg,.png'}
        name='file'
        showUploadList={false}
        headers={this.props.getUploadHeaders()}
        beforeUpload={this.validateUpload}
        action={`${this.props.server}${this.props.ocmsResumePrefix}/ocmsResume/upload/photo/${resumeId}`}
        onSuccess={(res) => {
          this.setState({
            avatarUploading: false
          })
          this.props.onChange({ target: { value: res } })
        }}
        onChange={(info) => {
          this.setState({ avatarUploading: info.file.status === 'uploading' })
        }}
        onError={() => {
          notification.error({ title: '上传出错', description: '上传出错' })
        }}
      >
        <div style={{
          width: 155 * 1.5,
          height: 193 * 1.5,
          marginRight: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {this.state.avatarUploading
            ? <Icon type='loading' />
            : <div style={{ width: '100%', height: '100%' }}>
              <img
                src={value}
                alt='头像'
                style={{ width: '100%', height: '100%' }}
              />
              <div>
                <h3 style={{ color: '#4e5fba', textAlign: 'center' }}>更换头像</h3>
                <p style={{ color: '#cacaca', fontSize: 12, margin: 0 }}>只支持.jpg,.jpeg,.png格式,大小不要超过1MB</p>
                <p style={{ color: '#cacaca', fontSize: 12, margin: 0 }}>建议使用1寸证件照70*100像素</p>
              </div>
            </div>
          }
        </div>
      </Upload>
    )
  }
}
