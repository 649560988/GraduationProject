import React from 'react'
import {
  Cascader,
  Steps,
  Form,
  Row,
  Col,
  Card,
  Button,
  Input,
  message,
  Select
} from 'antd'
import axios from 'axios'
import PromiseView from '../../components/PromiseView'

const { Item: FormItem } = Form
const { Step } = Steps
const steps = [{
  title: '创建基本信息',
  content: 'First-content'
}, {
  title: '编辑详情',
  content: 'Last-content'
}]

@Form.create()
class ResumeCreate extends React.Component {
  state = {
    current: 0,
    unit: [],
    regionData: []
  }

  componentDidMount () {
    this.loadUnitData()
    this.loadRegion()
  }

  updateSearch = () => {
    process.nextTick(async () => {
      try {
        await axios.post(`${process.env.server}/search/resume/solr/deltaImport`, {})
      } catch (e) {
        console.error(e)
      }
    })
  }

  loadUnitData = () => {
    this.setState({
      loadUnitPromise: new Promise(async (resolve, reject) => {
        try {
          const res = await axios.get(`/attr/v1/sources/queryBySourceName?sourceName=%E4%BB%B7%E6%A0%BC%E5%8D%95%E4%BD%8D`)
          resolve(res.data.sourceSubList)
        } catch (e) {
          reject(e)
        }
      }),
      loadUnitHandle: (status, result) => {
        if (status === 'resolved') {
          this.setState({
            unit: result.map(item => {
              return {
                label: item.sourceSubName,
                value: item.sourceSubCode
              }
            })
          })
        }
      }
    })
  }

  loadRegion = () => {
    this.setState({
      loadRegionPromise: new Promise((resolve, reject) => {
        require.ensure([], (require) => {
          resolve(require('../../components/Resume/data.json'))
        })
      }),
      loadRegionHandle: (status, result) => {
        if (status === 'resolved') {
          this.setState({ regionData: result })
        }
      }
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.setState({
      submitHandler: (status, result) => {
        if (status === 'resolved') {
          this.updateSearch()
          if (typeof result === 'object' && result.id) {
            return this.props.history.push(`/base-info-defend/external-consultant-resume/${result.id}`)
          } else {
            return this.props.history.push(`/base-info-defend/external-consultant`)
          }
        } else if (status === 'rejected') {
          message.error('创建失败')
        }
      },
      submitPromise: new Promise((resolve, reject) => {
        this.props.form.validateFields(async (err, values) => {
          if (err) return reject(err)
          try {
            const res = await axios.post(`/base-info/resume/ocmsResume`, {
              ...values,
              residence: values.residence.join(',')
            })
            if (res.statusText === 'OK') return resolve(res.data)
            throw new Error(res.data.message || '创建失败')
          } catch (e) {
            reject(e)
          }
        })
      })
    })
  }

  render () {
    const { current } = this.state
    const { getFieldDecorator } = this.props.form

    return (
      <div>
        <PromiseView onStateChange={this.state.submitHandler} promise={this.state.submitPromise} />
        <PromiseView onStateChange={this.state.loadRegionHandle} promise={this.state.loadRegionPromise} />
        <PromiseView onStateChange={this.state.loadUnitHandle} promise={this.state.loadUnitPromise} />
        <Row style={{ marginBottom: 20 }}>
          <Col xs={{ span: 24 }} md={{ span: 10, offset: 7 }}>
            <Steps current={current}>
              {steps.map(item => <Step key={item.title} title={item.title} />)}
            </Steps>
          </Col>
        </Row>

        <Card>
          <Form onSubmit={this.handleSubmit} layout='horizontal'>
            <Row>
              <Col xs={{ span: 24 }} md={{ span: 12 }}>
                <FormItem
                  label='姓名'
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                >
                  {getFieldDecorator('name', {
                    rules: [
                      { required: true, message: '姓名不能为空' },
                      {
                        validator: (rule, value, callback) => {
                          if (/^[\u4e00-\u9fa5]{2,20}$/.test(value)) return callback()
                          callback(new Error('用户名不能有特殊字符'))
                        }
                      }
                    ]
                  })(<Input />)}
                </FormItem>
              </Col>

              <Col xs={{ span: 24 }} md={{ span: 12 }}>
                <FormItem
                  label='擅长模块'
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                >
                  {getFieldDecorator('skills', {
                    rules: [
                      { required: true, message: '请输入擅长模块' }
                    ]
                  })(<Input />)}
                </FormItem>
              </Col>

              <Col xs={{ span: 24 }} md={{ span: 12 }}>
                <Form.Item
                  label='工作经验'
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                >
                  {getFieldDecorator('workYear', {
                    rules: [{ required: true, message: '请输入工作经验' }]
                  })(
                    <Select>
                      <Select.Option value='1'>应届生</Select.Option>
                      <Select.Option value='2'>1-3年</Select.Option>
                      <Select.Option value='3'>4-6年</Select.Option>
                      <Select.Option value='4'>7-10年</Select.Option>
                      <Select.Option value='5'>10年以上</Select.Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>

              <Col xs={{ span: 24 }} md={{ span: 12 }}>
                <Form.Item
                  label='手机号'
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                >
                  {getFieldDecorator('mobile', {
                    rules: [
                      { required: true, message: '请输入手机号' },
                      { validator: (rule, value, callback) => {
                        if (!value) return callback()
                        if (/^(?=\d{11}$)^1(?:3\d|4[57]|5[^4\D]|66|7[^249\D]|8\d|9[89])\d{8}$/.test(value)) {
                          return callback()
                        }
                        callback(new Error('请输入正确格式的手机号码'))
                      }}
                    ]
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col xs={{ span: 24 }} md={{ span: 12 }}>
                <Form.Item
                  label='邮箱'
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                >
                  {getFieldDecorator('email', {
                    rules: [
                      { required: true, message: '请输入邮箱' },
                      { type: 'email', message: '请输入正确格式的邮箱' }
                    ]
                  })(<Input />)}
                </Form.Item>
              </Col>

            </Row>
            <Row>

              <Col xs={{ span: 24 }} md={{ span: 12 }}>
                <Form.Item
                  label='期望薪资'
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                >
                  {getFieldDecorator('expectationSalary', {
                    rules: [{ required: true, message: '请输入期望薪资' }]
                  })(<Input type='number' />)}
                </Form.Item>
              </Col>

              <Col xs={{ span: 24 }} md={{ span: 12 }}>
                <Form.Item
                  label='薪资单位'
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                >
                  {getFieldDecorator('unit', {
                    rules: [{ required: true, message: '请输入薪资单位' }]
                  })(
                    <Select>
                      {this.state.unit.map(item => {
                        return (
                          <Select.Option
                            key={item.value}
                            value={item.value}
                          >{item.label}</Select.Option>
                        )
                      })}
                    </Select>
                  )}
                </Form.Item>
              </Col>

              <Col xs={{ span: 24 }} md={{ span: 12 }}>
                <Form.Item
                  label='身份证号'
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                >
                  {getFieldDecorator('idCard', {
                    rules: [{ required: true, message: '请输入身份证号' },
                      {
                        validator: (rule, value, callback) => {
                          if (/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value)) {
                            callback()
                          } else {
                            callback(new Error('请输入正确格式的身份证号码'))
                          }
                        }
                      }]
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col xs={{ span: 24 }} md={{ span: 12 }}>
                <Form.Item
                  label='常居地'
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                >
                  {getFieldDecorator('residence', {
                    rules: [{ required: true, message: '请输入常居地' }]
                  })(
                    <Cascader options={this.state.regionData} />
                  )}
                </Form.Item>
              </Col>

              <Col xs={{ span: 24 }} md={{ span: 24 }}>
                <Form.Item
                  label='其他备注'
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 21 }}
                >
                  {getFieldDecorator('otherRemarks', {
                    rules: []
                  })(<Input.TextArea autosize={{ minRows: 3 }} />)}
                </Form.Item>
              </Col>
            </Row>

            <Row type='flex' style={{ justifyContent: 'center' }}>
              <FormItem xs={{ span: 4 }} md={{ offset: 0, span: 4 }}>
                <Button htmlType='submit' type='primary'>创建</Button>
              </FormItem>
              <div style={{ width: 20 }} />
              <FormItem>
                <Button onClick={this.props.history.goBack}>取消</Button>
              </FormItem>
            </Row>
          </Form>
        </Card>
      </div>
    )
  }
}

export default ResumeCreate
