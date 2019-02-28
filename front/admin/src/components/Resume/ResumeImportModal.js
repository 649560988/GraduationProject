import React from 'react'
import { Modal, Upload, message, Button } from 'antd'
import Resume from './'
import { HandResume } from './transformers/HandResume'

export class ResumeImportModal extends React.Component {
  state = {
    step: 0,
    visible: false
  }

  handleOpenModal = () => {
    this.setState({
      uploading: false,
      visible: true
    })
  }

  handleUploaded = (res) => {
    const currentResume = HandResume.fromJSON({
      api: 'hand',
      result: this.props.resumeData
    })
    const resume = HandResume.fromJSON(res, currentResume)

    const resumeData = resume.toJSON()
    console.log(resumeData)

    this.setState({
      uploading: false,
      step: 1,
      resumeData
    })
  }

  render () {
    const { visible } = this.state
    return (
      <div>
        <Button onClick={this.handleOpenModal}>
          导入
        </Button>
        <Modal
          visible={visible}
          closeable={false}
          maskCloseable={false}
        >
          <div>
            {[
              () => (
                <Upload
                  name='file'
                  showUploadList={false}
                  action={`${process.env.server}/base-info/resume/ocmsResume/analysis`}
                  onSuccess={(res) => {
                    this.handleUploaded(res)
                  }}
                  onChange={(info) => {
                    this.setState({
                      uploading: info.file.status === 'uploading'
                    })
                  }}
                  onError={() => {
                    message.error('上传出错')
                  }}
                >
                  <Button>上传</Button>
                </Upload>
              ),

              () => (
                <div>
                  step2
                </div>
              )
            ][this.state.step]()}
          </div>

        </Modal>
      </div>
    )
  }
}
