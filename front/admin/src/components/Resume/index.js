import React from 'react'
import axios from 'axios'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import qs from 'qs'
import {
  Col,
  Divider,
  Form,
  Input,
  DatePicker,
  Select,
  Radio,
  Cascader,
  Icon,
  message,
  Modal,
  Row,
  Layout,
  Tooltip,
  Button,
  Upload
} from 'antd'
import ResumeBlock from './ResumeBlock'
import styles from './resume.css'
import AvatarUpload from './AvatarUpload'
import PromiseView from './PromiseView'
import Text from './Text'
import { StandardResume } from './models/StandardResume'

const isPlainObject = json => !!json && Object.getPrototypeOf(json) === Object.prototype
const getArray = json => json instanceof Array ? json : []
const getPlainObject = json => isPlainObject(json) ? json : {}
const defaultAvatar = require('./images/avatar-default.png')

axios.defaults.withCredentials = true
const noop = () => { }

class Resume extends React.Component {
  static defaultProps = {
    enableAvatar: true,
    enableAttachment: true,
    editable: true,
    enableImport: false,
    showAttachment: true,
    showUpdatetime: true,
    ocmsResumePrefix: '/resource/v1/resource',
    getUploadHeaders: () => ({})
  }

  state = {
    unit: [],
    avatarUploading: false,
    attachmentUploading: false,
    regionData: [],
    editing: '',
    head: {
      updateTime: '',
      realname: '',
      mobile: '',
      email: '',
      avatar: { url: defaultAvatar }
    },
    basic: {
      outerId: '',
      idNumber: '',
      birthday: '',
      expectedSalary: '',
      email: '',
      residenceCode: [],
      residence: '',
      otherInfo: ''
    },
    evaluation: {

    },
    workExp: [
    ],
    eduExp: [
    ],
    projectExp: [
    ],
    attachments: [
    ]
  }

  componentDidMount () {
    this.init()
    this.reloadAttachment()
    this.loadUnitData()
    this.loadRegion()
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
          resolve(require('./data.json'))
        })
      }),
      loadRegionHandle: (status, result) => {
        if (status === 'resolved') {
          this.setState({ regionData: result })
        }
      }
    })
  }

  init = () => {
    this.setState({
      initHandle: (state, result) => {
        if (state === 'resolved') {
          this.setState(this.getModelFromStandardResume(result))
        }
      },
      initPromise: new Promise(async (resolve, reject) => {
        try {
          let resume = this.props.defaultValue
          if (!resume || !(resume instanceof StandardResume)) {
            const res = await axios.get(`${this.props.ocmsResumePrefix}/ocmsResume/all/${this.props.resumeId}`)
            resume = StandardResume.fromJSON({ api: 'hand', result: res.data })
          }
          resolve(resume)
        } catch (e) {
          reject(e)
        }
      })
    })
  }

  reloadAttachment = () => {
    this.setState({
      reloadAttachmentHandle: (state, result) => {
        if (state === 'resolved') {
          this.setState({
            attachmentUploading: false,
            attachments: result.map(item => ({
              url: item.attachmentPath,
              filename: item.attachmentName,
              id: item.id
            }))
          })
        }
      },
      reloadAttachmentPromise: new Promise(async (resolve, reject) => {
        try {
          const res = await axios.get(`${this.props.ocmsResumePrefix}/ocmsResume/get/attach/${this.props.resumeId}`)
          resolve(res.data)
        } catch (e) {
          reject(e)
        }
      })
    })
  }

  updateSearch = () => {
    process.nextTick(async () => {
      try {
        await axios.post(`/search/resume/solr/deltaImport`, {})
      } catch (e) {
        console.error(e)
      }
    })
  }

  validateFileSize = (file) => {
    return new Promise((resolve, reject) => {
      if (file.size > 5242880) {
        message.error('文件不能超过5MB')
        return reject(new Error('文件不能超过5MB'))
      }

      this.setState({
        filename: file.name
      }, resolve)
    })
  }

  formatUnit = (unit) => {
    const target = this.state.unit.find(item => {
      return String(item.value) === String(unit)
    })
    return target ? target.label : ''
  }

  formatResidence = (val) => {
    const { regionData } = this.state
    let result = ''
    if (!val || !(val instanceof Array)) return result
    if (regionData.length === 0) return result
    const val2 = val.slice()
    let list = regionData
    while (val2.length > 0) {
      let id = val2.shift()
      // console.log(id, list)
      let current = list.find(item => item.value === id)
      if (!current) break
      result += current.label
      list = current.children
      if (!list) break
    }
    return result
  }

  formatDateRange = (dateRange) => {
    let str = ''
    if (!dateRange) return str
    try {
      str = `${dateRange[0].format('YYYY.MM')}~${dateRange[1].format('YYYY.MM')}`
    } catch (e) {
    }
    return str
  }

  formatWorkYear = (workYear) => {
    // console.log(`formatWorkYear: ${typeof workYear} ${workYear}`)
    if (['1', '2', '3', '4', '5'].includes(workYear)) {
      return {
        '1': '应届生',
        '2': '1-3年',
        '3': '4-6年',
        '4': '7-10年',
        '5': '10年以上'
      }[workYear]
    }
    return '未填写'
  }

  maxstr (str, len) {
    try {
      if (!str) return '未填写'
      if (str.length < len) return str
      return str.substr(0, len) + '...'
    } catch (e) {
      return str
    }
  }

  validatePhone = (rule, value, callback) => {
    if (/^(?=\d{11}$)^1(?:3\d|4[57]|5[^4\D]|66|7[^249\D]|8\d|9[89])\d{8}$/.test(value)) {
      callback()
    } else {
      callback(new Error('请输入正确格式的手机号码'))
    }
  }

  getModelFromStandardResume = (resume) => {
    console.log(resume)
    const model = {
      resumeId: resume.resumeId,
      head: {},
      basic: {},
      workExp: [],
      evaluation: {},
      eduExp: [],
      projectExp: [],
      attachments: []
    }

    Object.assign(model.head, {
      updateTime: resume.updateTime,
      realname: resume.realname,
      mobile: resume.mobile,
      email: resume.email,
      gender: resume.gender, // 0男 1女
      workYear: resume.workYear,
      skills: resume.skills,
      avatar: resume.avatar || defaultAvatar
    })
    Object.assign(model.basic, {
      outerId: resume.resumeId,
      idNumber: resume.idNumber,
      birthday: resume.birthday,
      expectedSalary: resume.expectedSalary,
      unit: resume.unit,
      residenceCode: resume.residenceCode,
      otherInfo: resume.otherInfo
    })
    Object.assign(model.evaluation, {
      evaluationLevel: resume.evaluationLevel,
      endWorkDate: resume.endWorkDate ? moment(resume.endWorkDate) : undefined,
      lastCommunicateDate2: resume.lastCommunicateDate2 ? moment(resume.lastCommunicateDate2) : undefined,
      lastCommunicatePeople: resume.lastCommunicatePeople,
      workStatus: resume.workStatus
    })
    model.eduExp = resume.eduExp.map(item => {
      return {
        id: item.id,
        highestEducation: item.highestEducation,
        professionalName: item.professionalName,
        schoolName: item.schoolName,
        studyTime: [moment(item.studyStartTime), moment(item.studyEndTime)]
      }
    })
    model.workExp = resume.workExp.map(item => {
      return {
        id: item.id,
        bizId: item.bizId,
        companyIndustry: item.companyIndustry,
        companyName: item.companyName,
        createdBy: item.createdBy,
        creationDate: item.creationDate,
        dutyPerformance: item.dutyPerformance,
        isDel: item.isDel,
        lastUpdateDate: item.lastUpdateDate,
        lastUpdatedBy: item.lastUpdatedBy,
        objectVersionNumber: item.objectVersionNumber,
        positionName: item.positionName,
        subordinates: item.subordinates,
        tenureTime: [moment(item.tenureStartTime), moment(item.tenureEndTime)],
        workingPlace: item.workingPlace
      }
    })
    model.projectExp = resume.proExp.map(item => {
      return {
        id: item.id,
        bizId: item.bizId,
        companyName: item.companyName,
        createdBy: item.createdBy,
        creationDate: item.creationDate,
        isDel: item.isDel,
        lastUpdateDate: item.lastUpdateDate,
        lastUpdatedBy: item.lastUpdatedBy,
        objectVersionNumber: item.objectVersionNumber,
        projectDesc: item.projectDesc,
        projectName: item.projectName,
        projectPerformance: item.projectPerformance,
        projectPosition: item.projectPosition,
        projectResp: item.projectResp,
        projectTime: [moment(item.projectStartTime), moment(item.projectEndTime)]
      }
    })
    model.attachments = resume.attachments.map(item => ({
      url: item.attachmentPath,
      filename: item.attachmentName,
      id: item.id
    }))

    return model
  }

  getModelFromAPI = (json) => {
    const model = {
      head: {},
      basic: {},
      workExp: [],
      evaluation: {},
      eduExp: [],
      projectExp: [],
      attachments: []
    }
    const safeJson = getPlainObject(json)
    safeJson.eduExperience = getArray(safeJson.eduExperience)
    safeJson.proExperience = getArray(safeJson.proExperience)
    safeJson.workExperience = getArray(safeJson.workExperience)
    safeJson.attachments = getArray(safeJson.attachments)
    safeJson.workYear = String(safeJson.workYear)
    model.resumeId = safeJson.id
    Object.assign(model.head, {
      updateTime: safeJson.lastUpdateDate,
      realname: safeJson.name,
      mobile: safeJson.mobile,
      email: safeJson.email,
      gender: safeJson.sex, // 0男 1女
      workYear: ['1', '2', '3', '4', '5'].includes(safeJson.workYear) ? safeJson.workYear : undefined,
      skills: safeJson.skills,
      avatar: { url: safeJson.photo || defaultAvatar }
    })
    Object.assign(model.basic, {
      outerId: safeJson.id,
      idNumber: safeJson.idCard,
      birthday: safeJson.birthday ? moment(safeJson.birthday) : undefined,
      expectedSalary: safeJson.expectationSalary,
      unit: safeJson.unit,
      email: safeJson.email,
      residenceCode: safeJson.residenceCode || [],
      otherInfo: safeJson.otherRemarks
    })
    Object.assign(model.evaluation, {
      evaluationLevel: safeJson.evaluationLevel,
      endWorkDate: safeJson.endWorkDate ? moment(safeJson.endWorkDate) : undefined,
      lastCommunicateDate2: safeJson.lastCommunicateDate2 ? moment(safeJson.lastCommunicateDate2) : undefined,
      lastCommunicatePeople: safeJson.lastCommunicatePeople,
      workStatus: safeJson.workStatus
    })
    model.eduExp = safeJson.eduExperience.map(item => {
      return {
        id: item.id,
        highestEducation: item.highestEducation,
        professionalName: item.professionalName,
        schoolName: item.schoolName,
        studyTime: [moment(item.studyStartTime), moment(item.studyEndTime)]
      }
    })
    model.workExp = safeJson.workExperience.map(item => {
      return {
        id: item.id,
        bizId: item.bizId,
        companyIndustry: item.companyIndustry,
        companyName: item.companyName,
        createdBy: item.createdBy,
        creationDate: item.creationDate,
        dutyPerformance: item.dutyPerformance,
        isDel: item.isDel,
        lastUpdateDate: item.lastUpdateDate,
        lastUpdatedBy: item.lastUpdatedBy,
        objectVersionNumber: item.objectVersionNumber,
        positionName: item.positionName,
        subordinates: item.subordinates,
        tenureTime: [moment(item.tenureStartTime), moment(item.tenureEndTime)],
        workingPlace: item.workingPlace
      }
    })
    model.projectExp = safeJson.proExperience.map(item => {
      return {
        id: item.id,
        bizId: item.bizId,
        companyName: item.companyName,
        createdBy: item.createdBy,
        creationDate: item.creationDate,
        isDel: item.isDel,
        lastUpdateDate: item.lastUpdateDate,
        lastUpdatedBy: item.lastUpdatedBy,
        objectVersionNumber: item.objectVersionNumber,
        projectDesc: item.projectDesc,
        projectName: item.projectName,
        projectPerformance: item.projectPerformance,
        projectPosition: item.projectPosition,
        projectResp: item.projectResp,
        projectTime: [moment(item.projectStartTime), moment(item.projectEndTime)]
      }
    })
    model.attachments = safeJson.attachments.map(item => ({
      url: item.attachmentPath,
      filename: item.attachmentName,
      id: item.id
    }))
    // console.log(safeJson, model)
    return model
  }

  handleFormSubmit = (e, props) => {
    e.preventDefault()
    props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        this.handleBlockSave(e, {
          ...props,
          editingData: values
        })
      }
    })
  }

  handleBlockSave = (e, props) => {
    const { blockName, index = 0, editingData, toggleEdit } = props
    // console.log(props)

    this.setState({
      // FIXME: @heineiuo 用PromiseView改写
      [`${blockName}${index}SavePromise`]: new Promise(async (resolve, reject) => {
        try {
          if (blockName === 'head') {
            const res = await axios.post(`${this.props.ocmsResumePrefix}/ocmsResume/${this.state.resumeId}`, {
              name: editingData.realname,
              sex: editingData.gender,
              mobile: editingData.mobile,
              skills: editingData.skills,
              workYear: editingData.workYear,
              email: editingData.email
            })

            if (res.status > 200) throw new Error('保存失败')
            this.setState({
              avatarUploading: false,
              head: {
                ...props.data,
                ...editingData
              }
            }, toggleEdit)
            message.success('保存成功')
            this.updateSearch()
            resolve()
          } else if (blockName === 'basic') {
            // console.log(editingData)
            const res = await axios.post(`${this.props.ocmsResumePrefix}/ocmsResume/${this.state.resumeId}`, {
              idCard: editingData.idNumber,
              birthday: moment(editingData.birthday).format('YYYY-MM-DD 00:00:00'),
              expectationSalary: editingData.expectedSalary,
              email: editingData.email,
              unit: editingData.unit,
              residenceCode: editingData.residenceCode.join(','),
              residence: this.formatResidence(editingData.residenceCode),
              otherRemarks: editingData.otherInfo
            })
            // console.log(res)
            if (res.status > 200) throw new Error('保存失败')
            delete editingData.outerId
            this.setState({
              basic: {
                ...props.data,
                ...editingData
              }
            }, toggleEdit)
            message.success('保存成功')
            this.updateSearch()
            resolve()
          } else if (blockName === 'evaluation') {
            // console.log(editingData)
            const res = await axios.post(`${this.props.ocmsResumePrefix}/ocmsResume/${this.state.resumeId}`, {
              evaluationLevel: editingData.evaluationLevel,
              endWorkDate: moment(editingData.endWorkDate).format('YYYY-MM-DD 00:00:00'),
              lastCommunicateDate2: moment(editingData.lastCommunicateDate2).format('YYYY-MM-DD 00:00:00'),
              lastCommunicatePeople: editingData.lastCommunicatePeople,
              workStatus: editingData.workStatus
            })

            if (res.status > 200 || res.data.failed) {
              throw new Error(res.data.message || '保存失败')
            }
            this.setState({
              evaluation: {
                ...props.data,
                ...editingData
              }
            }, toggleEdit)
            message.success('保存成功')
            this.updateSearch()
            resolve()
          } else if (blockName === 'workExp') {
            const tenureTime = editingData.tenureTime || []
            const data = {
              companyIndustry: editingData.companyIndustry,
              companyName: editingData.companyName,
              dutyPerformance: editingData.dutyPerformance,
              positionName: editingData.positionName,
              subordinates: editingData.subordinates,
              workingPlace: editingData.workingPlace,
              tenureStartTime: moment(tenureTime[0]).format('YYYY-MM-DD 00:00:00'),
              tenureEndTime: moment(tenureTime[1]).format('YYYY-MM-DD 00:00:00')
            }
            const res = await axios.post(
              `${this.props.ocmsResumePrefix}/ocmsWork/${props.data.isNew ? 'create' : 'update'}/${props.data.isNew ? this.state.resumeId : props.data.id}`,
              data
            )
            // console.log(res)
            if (res.status > 200) throw new Error('保存失败')
            this.setState({
              [blockName]: this.state[blockName].map(item => {
                if (item.isNew) {
                  return {
                    ...props.data,
                    ...editingData,
                    isNew: false,
                    id: res.data.id
                  }
                }
                if (item.id === props.data.id) {
                  return {
                    ...props.data,
                    ...editingData
                  }
                }
                return item
              })
            }, toggleEdit)
            message.success('保存成功')
            this.updateSearch()
            resolve()
          } else if (blockName === 'eduExp') {
            const studyTime = editingData.studyTime || []
            const data = {
              highestEducation: editingData.highestEducation,
              professionalName: editingData.professionalName,
              schoolName: editingData.schoolName,
              studyStartTime: moment(studyTime[0]).format('YYYY-MM-DD 00:00:00'),
              studyEndTime: moment(studyTime[1]).format('YYYY-MM-DD 00:00:00')
            }
            const res = await axios.post(
              `${this.props.ocmsResumePrefix}/ocmsEdu/${props.data.isNew ? 'create' : 'update'}/${props.data.isNew ? this.state.resumeId : props.data.id}`,
              data
            )
            if (res.status > 200) throw new Error('保存失败')

            this.setState({
              [blockName]: this.state[blockName].map(item => {
                if (item.isNew) {
                  return {
                    ...props.data,
                    ...editingData,
                    isNew: false,
                    id: res.data.id
                  }
                }
                if (item.id === props.data.id) {
                  return {
                    ...props.data,
                    ...editingData
                  }
                }
                return item
              })
            }, toggleEdit)
            message.success('保存成功')
            this.updateSearch()
            resolve()
          } else if (blockName === 'projectExp') {
            const projectTime = editingData.projectTime || []
            const data = {
              companyName: editingData.companyName,
              projectDesc: editingData.projectDesc,
              projectStartTime: moment(projectTime[0]).format('YYYY-MM-DD 00:00:00'),
              projectEndTime: moment(projectTime[1]).format('YYYY-MM-DD 00:00:00'),
              projectName: editingData.projectName,
              projectPerformance: editingData.projectPerformance,
              projectPosition: editingData.projectPosition,
              projectResp: editingData.projectResp
            }
            const res = await axios.post(
              `${this.props.ocmsResumePrefix}/ocmsPro/${props.data.isNew ? 'create' : 'update'}/${props.data.isNew ? this.state.resumeId : props.data.id}`,
              data
            )
            if (res.status > 200) throw new Error('保存失败')
            this.setState({
              [blockName]: this.state[blockName].map(item => {
                if (item.isNew) {
                  return {
                    ...props.data,
                    ...editingData,
                    isNew: false,
                    id: res.data.id
                  }
                }
                if (item.id === props.data.id) {
                  return {
                    ...props.data,
                    ...editingData
                  }
                }
                return item
              })
            }, toggleEdit)
            message.success('保存成功')
            this.updateSearch()
            resolve()
          } else {
            message.error('保存失败')
            reject(new Error('未知类型'))
          }
        } catch (e) {
          message.error('保存失败')
          // reject(e)
          resolve()
        }
      })
    })
  }

  handleClickDelete = (e, props) => {
    Modal.confirm({
      title: '是否确认删除',
      onOk: () => {
        const { blockName } = props
        const ocmsKey = {
          workExp: 'ocmsWork',
          eduExp: 'ocmsEdu',
          projectExp: 'ocmsPro'
        }[blockName]
        this.setState({
          // FIXME: 使用PromiseView改写
          [`${blockName}Id${props.data.id}DeletePromise`]: new Promise(async (resolve, reject) => {
            try {
              // console.log(props)
              await axios.post(`${this.props.ocmsResumePrefix}/${ocmsKey}/delete/${props.data.id}`)
              // console.log(res)
              this.setState({
                [blockName]: this.state[blockName].filter(item => item.id !== props.data.id)
              })
              message.success('删除成功')
              resolve()
            } catch (e) {
              message.error('删除失败')
              console.error(e)
              reject(e)
            }
          })
        })
      }
    })
  }

  handleOpenAttachment = (e, attach) => {
    window.open(attach.url)
  }

  handleClickDeleteAttachment = (e, attach, index) => {
    e.preventDefault()
    e.stopPropagation()
    Modal.confirm({
      title: '是否确认删除',
      onOk: () => {
        this.setState({
          [`attach_${attach.id}_DeleteHandle`]: (status, result) => {
            if (status === 'resolved') {
              this.setState({
                [`attach_${attach.id}_DeleteHandle`]: undefined,
                [`attach_${attach.id}_DeletePromise`]: undefined,
                attachments: this.state.attachments.filter(item => item.id !== attach.id)
              })
              this.updateSearch()
              message.success('删除成功')
            } else if (status === 'rejected') {
              console.error(result)
              message.error('删除失败')
            }
          },
          [`attach_${attach.id}_DeletePromise`]: new Promise(async (resolve, reject) => {
            try {
              const res = await axios.delete(`${this.props.ocmsResumePrefix}/ocmsResume/remove/attach/${attach.id}`)
              if (res.status === 200) {
                return resolve()
              }
              reject(new Error(res.data))
            } catch (e) {
              reject(e)
            }
          })
        })
      }
    })
  }

  handleBlockToggleEdit = ({ data, blockName, isEditing }) => {
    if (!isEditing) {
      if (!['eduExp', 'projectExp', 'workExp'].includes(blockName)) {
        return false
      }

      if (this.isBlockEditingNew(blockName)) {
        this.setState({
          ...this.state,
          [blockName]: this.state[blockName].filter(item => !item.isNew)
        })
      }
    }
  }

  handleClickBackBtn = (e) => {
    const query = qs.parse(this.props.location.search.substr(1))
    const backURL = !query.from ? '/base-info-defend/external-consultant' : query.from
    this.props.history.push(backURL)
  }

  /**
   * @param {string} blockName oneOf(['eduExp', 'projectExp', 'workExp'])
   */
  addBlock = (blockName) => {
    if (!['eduExp', 'projectExp', 'workExp'].includes(blockName)) {
      return false
    }
    this.setState({
      ...this.state,
      [blockName]: [
        ...this.state[blockName],
        {
          isNew: true
        }
      ]
    })
  }

  isBlockEditingNew = (blockName) => {
    if (!['eduExp', 'projectExp', 'workExp'].includes(blockName)) {
      return false
    }
    return this.state[blockName].some(item => item.isNew)
  }

  renderAttachment = (props) => {
    const { onClick = noop } = props
    return (
      <div className={styles.Resume__attachmentBg} onClick={onClick} />
    )
  }

  /**
   * 次级标题
   */
  renderBlockSubTitle = (props) => {
    return (
      <Row
        type='flex'
        justify='space-between'
        style={{
          height: 40,
          backgroundColor: '#f7f7f7',
          borderRadius: 4,
          borderLeft: '4px solid #3f51b5',
          boxShadow: '1px 4px 5px rgba(0,0,0,0.09)'
        }}>
        <Col style={{
          lineHeight: '40px',
          fontSize: 17,
          paddingLeft: 44
        }}>
          <div style={{ display: 'flex' }}>
            <div style={{ marginRight: 10 }}>{props.title}</div>
            {!props.supTitle ? null
              : <div style={{ fontSize: 14, color: '#BBB' }}>({props.supTitle})</div>
            }
          </div>
        </Col>
        {this.props.editable
          ? <Col style={{
            paddingRight: 10,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <div
              onClick={props.onClickEdit || noop}
              className={styles.Resume__editBtn} style={{ marginRight: 30 }} />
            <div
              onClick={props.onClickDelete || noop}
              className={styles.Resume__trashBtn} />
          </Col>
          : null
        }
      </Row>
    )
  }

  /**
   * 轻量级的次级标题
   */
  renderBlockSubLightTitle = (props) => {
    return (
      <Row
        type='flex'
        justify='space-between'
        style={{
          height: 40
        }}
      >
        <Col style={{
          lineHeight: '40px',
          fontSize: 17,
          paddingLeft: 44
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ fontSize: 17, marginRight: 12 }}>{props.title}</div>
            {!props.supTitle ? null
              : <div style={{ fontSize: 14, color: '#BBB' }}>({props.supTitle})</div>
            }
          </div>
        </Col>
        {this.props.editable
          ? <Col style={{
            paddingRight: 10,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          }}>

            <div
              onClick={props.onClickEdit || noop}
              className={styles.Resume__editBtn}
              style={{ marginRight: 30 }} />
            <div
              onClick={props.onClickDelete || noop}
              className={styles.Resume__trashBtn} />
          </Col>
          : null}
      </Row>
    )
  }

  renderBlockTitle = (props) => {
    const { icon, iconSize = { width: 25, height: 25 }, style = {} } = props
    return (
      <Row type='flex' style={{ height: 30, ...style }}>
        <Col style={{ marginRight: 18 }}>
          <div style={{ ...iconSize, ...{ backgroundImage: `url(${icon})` } }} />
        </Col>
        <Col style={{ fontSize: 18 }} >
          {props.title}
        </Col>
      </Row>
    )
  }

  renderHead = (props) => {
    return (
      <Row>
        <Col
        >
          {this.props.editable
            ? <div
              className={styles.Resume__editBtn}
              style={{ position: 'absolute', top: 0, right: 0 }}
              onClick={props.toggleEdit}
            />
            : null}
          <Row type='flex'>
            <Col>
              <div style={{
                width: 155,
                height: 193,
                marginRight: 80
              }}>
                <img
                  src={typeof props.data.avatar === 'string' ? props.data.avatar : null}
                  alt='头像'
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </Col>
            <Col>
              <Row style={{ marginBottom: 50 }} type='flex' align='bottom'>
                <Col style={{ fontSize: 24, color: '#333', marginRight: 48 }}>{props.data.realname}</Col>
                {this.props.showUpdatetime
                  ? <Col style={{ fontSize: 14, color: '#999', paddingBottom: 4 }}>更新时间：{props.data.updateTime}</Col>
                  : null
                }
              </Row>
              <Row type='flex' style={{ marginBottom: 30 }}>
                <Col style={{ marginRight: 30 }}>
                  <Tooltip title={props.data.skills}>
                    <div>擅长：{this.maxstr(props.data.skills, 9) || '未填写'}</div>
                  </Tooltip>
                </Col>
                <Col>
                  <Divider type='vertical' />
                </Col>
                <Col style={{ marginLeft: 30, marginRight: 30 }}>工作经验：{this.formatWorkYear(props.data.workYear)}</Col>
              </Row>
              <Row type='flex'>
                <Col style={{ marginRight: 20 }}>
                  <div style={{
                    width: 15,
                    height: 23,
                    backgroundImage: `url(${require('./images/mobile.png')})`
                  }} />
                </Col>
                <Col>
                  {props.data.mobile}
                </Col>
                <Col style={{ width: 56 }} />
                <Col style={{ marginRight: 20 }}>
                  <div style={{
                    width: 27,
                    height: 22,
                    backgroundImage: `url(${require('./images/email.png')})`
                  }} />
                </Col>
                <Col>
                  {props.data.email}
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }

  renderHeadEdit = (props) => {
    const { form: { getFieldDecorator } } = props

    return (
      <div >
        <Row>
          <Col
          >
            <div >
              <div className={styles.Resume__editingBlock} style={{ padding: 20 }}>
                <Form layout='horizontal' onSubmit={e => this.handleFormSubmit(e, props)}>
                  <Row>
                    <Col xs={{ span: 24 }} md={{ offset: 3, span: 7 }}>
                      {this.props.enableAvatar
                        ? <Form.Item>
                          {getFieldDecorator('avatar', {
                            initialValue: props.data.avatar
                          })(
                            <AvatarUpload
                              getUploadHeaders={this.props.getUploadHeaders}
                              server={this.props.server}
                              resumeId={this.props.resumeId}
                            />
                          )}
                        </Form.Item>
                        : <div
                          style={{
                            width: 155 * 1.5,
                            height: 193 * 1.5,
                            marginRight: 80
                          }}
                          onClick={e => {
                            Modal.info({
                              title: '抱歉',
                              content: '功能正在开发中，敬请期待。'
                            })
                          }}
                        >
                          <img
                            src={typeof props.editingData.avatar === 'string' ? props.editingData.avatar : null}
                            alt='头像'
                            style={{ width: '100%', height: '100%' }}
                          />
                          <div>
                            <h3 style={{ color: '#4e5fba', textAlign: 'center' }}>更换头像</h3>
                            <p style={{ color: '#cacaca', fontSize: 12, margin: 0 }}>只支持JPG,JPEG或PNG格式,大小不要超过1MB</p>
                            <p style={{ color: '#cacaca', fontSize: 12, margin: 0 }}>建议使用1寸证件照70*100像素</p>
                          </div>
                        </div>
                      }
                    </Col>
                    <Col xs={{ span: 24 }} md={{ span: 14 }}>

                      <Row type='flex'>
                        <Col xs={{ span: 24 }}>
                          <Form.Item
                            label='姓名'
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 18 }}
                          >
                            {getFieldDecorator('realname', {
                              initialValue: props.data.realname,
                              rules: [
                                { required: true, message: '请输入姓名' },
                                {
                                  validator: (rule, value, callback) => {
                                    if (/^[\u4e00-\u9fa5]{2,20}$/.test(value)) {
                                      callback()
                                    } else {
                                      callback(new Error('请输入正确的姓名格式，不要输入特殊字符，长度2~20'))
                                    }
                                  }
                                }
                              ]
                            })(<Input />)}
                          </Form.Item>
                        </Col>

                        <Col xs={{ span: 24 }}>
                          <Form.Item
                            label='性别'
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 18 }}
                          >
                            {getFieldDecorator('gender', {
                              initialValue: props.data.gender,
                              rules: [{ required: true, message: '请选择性别' }]
                            })(<Radio.Group>
                              <Radio value={0}>男</Radio>
                              <Radio value={1}>女</Radio>
                            </Radio.Group>)}
                          </Form.Item>
                        </Col>

                        <Col xs={{ span: 24 }}>
                          <Form.Item
                            label='擅长模块'
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 18 }}
                          >
                            {getFieldDecorator('skills', {
                              initialValue: props.data.skills,
                              rules: [{ required: true, message: '请输入擅长模块' }]
                            })(<Input />)}
                          </Form.Item>
                        </Col>

                        <Col xs={{ span: 24 }} >
                          <Form.Item
                            label='手机号'
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 18 }}
                          >
                            {getFieldDecorator('mobile', {
                              initialValue: props.data.mobile,
                              rules: [
                                { required: true, message: '请输入手机号' },
                                { validator: this.validatePhone }
                              ]
                            })(<Input disabled />)}
                          </Form.Item>
                        </Col>

                        <Col xs={{ span: 24 }} >
                          <Form.Item
                            label='邮箱'
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 18 }}
                          >
                            {getFieldDecorator('email', {
                              initialValue: props.data.email,
                              rules: [
                                { required: true, message: '请输入邮箱' },
                                { type: 'email', message: '请输入正确格式的邮箱' }
                              ]
                            })(<Input />)}
                          </Form.Item>
                        </Col>
                        <Col xs={{ span: 24 }} >
                          <Form.Item
                            label='工作经验'
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 18 }}
                          >
                            {getFieldDecorator('workYear', {
                              initialValue: props.data.workYear,
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
                      </Row>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={{ offset: 8, span: 4 }}>
                      <Form.Item>
                        <Button htmlType='submit'>保存</Button>
                      </Form.Item>
                    </Col>
                    <Col xs={{ span: 4 }}>
                      <Form.Item>
                        <Button onClick={props.toggleEdit}>取消</Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    )
  }

  renderBasic = (props) => {
    const BlockTitle = this.renderBlockTitle
    return (
      <Row>
        <Col
        // xs={{ span: 24, offset: 0 }}
        // md={{ span: 24, offset: 0 }}
        // lg={{ span: 22, offset: 2 }}
        >
          {this.props.editable
            ? <div
              className={styles.Resume__editBtn}
              style={{ position: 'absolute', top: 0, right: 0 }}
              onClick={props.toggleEdit}
            />
            : null}

          <BlockTitle
            icon={require('./images/basic-info.png')}
            title='基本信息'
            iconSize={{ width: 23, height: 27 }}
          />
          <Row style={{ paddingLeft: 41 }}>
            <Col xs={24} md={12}>
              <div className={styles.Resume__text}>外协工号： {props.data.outerId}</div>
              <div className={styles.Resume__text}>身份证号： {props.data.idNumber}</div>
              <div className={styles.Resume__text}>出生日期： {props.data.birthday ? moment(props.data.birthday).format('YYYY-MM-DD') : ''}</div>
            </Col>
            <Col xs={24} md={12}>
              <div className={styles.Resume__text}>期望薪资： {props.data.expectedSalary}{this.formatUnit(props.data.unit)}</div>
              <div className={styles.Resume__text}>常居地： {this.formatResidence(props.data.residenceCode)}</div>
            </Col>
            <Col xs={24}>
              <div style={{ wordBreak: 'break-all' }}>
                其他备注：{props.data.otherInfo}
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }

  renderBasicEdit = (props) => {
    const BlockTitle = this.renderBlockTitle
    const { form: { getFieldDecorator } } = props

    return (
      <div >
        <Row>
          <Col
          // xs={{ span: 24, offset: 0 }}
          // md={{ span: 20, offset: 2 }}
          // lg={{ span: 18, offset: 3 }}
          >
            <BlockTitle
              icon={require('./images/basic-info.png')}
              title='基本信息'
              iconSize={{ width: 23, height: 27 }}
            />
            <div style={{ paddingLeft: 48 }}>
              <div className={styles.Resume__editingBlock} style={{ padding: 20 }}>
                <Form layout='horizontal' onSubmit={(e) => this.handleFormSubmit(e, props)}>
                  <Row type='flex'>
                    <Col xs={{ span: 24 }} md={{ span: 12 }}>
                      <Form.Item
                        label='身份证号'
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                      >
                        {getFieldDecorator('idNumber', {
                          initialValue: props.data.idNumber,
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
                        {getFieldDecorator('residenceCode', {
                          initialValue: props.data.residenceCode,
                          rules: [{ required: true, message: '请输入常居地' }]
                        })(
                          <Cascader options={this.state.regionData} />
                        )}
                      </Form.Item>
                    </Col>

                    <Col xs={{ span: 24 }} md={{ span: 12 }}>
                      <Form.Item
                        label='出生日期'
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                      >
                        {getFieldDecorator('birthday', {
                          initialValue: props.data.birthday || undefined,
                          rules: [{ required: true, message: '请填写出生日期' }]
                        })(<DatePicker
                          defaultValue={moment().subtract(20, 'Y')}
                          disabledDate={(currentDate) => {
                            if (currentDate > new Date()) return true
                            return false
                          }}
                        />)}
                      </Form.Item>
                    </Col>
                    <Col md={{ span: 12 }} />

                    <Col xs={{ span: 24 }} md={{ span: 12 }}>
                      <Form.Item
                        label='期望薪资'
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                      >
                        {getFieldDecorator('expectedSalary', {
                          initialValue: props.data.expectedSalary,
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
                          initialValue: props.data.unit || this.state.unit.length > 0 ? this.state.unit[0].value : undefined,
                          rules: [{ required: true, message: 'unit' }]
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

                    <Col xs={{ span: 24 }} md={{ span: 24 }}>
                      <Form.Item
                        label='其他备注'
                        labelCol={{ span: 3 }}
                        wrapperCol={{ span: 21 }}
                      >
                        {getFieldDecorator('otherInfo', {
                          initialValue: props.data.otherInfo,
                          rules: []
                        })(<Input.TextArea autosize={{ minRows: 3 }} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={{ offset: 8, span: 4 }}>
                      <Button htmlType='submit'>保存</Button>
                    </Col>
                    <Col xs={{ span: 4 }}>
                      <Button onClick={props.toggleEdit}>取消</Button>
                    </Col>
                  </Row>
                </Form>

              </div>
            </div>
          </Col>
        </Row>
      </div>
    )
  }

  renderEvaluation = props => {
    const BlockTitle = this.renderBlockTitle

    return (
      <Row>
        <Col
        // xs={{ span: 24, offset: 0 }}
        // md={{ span: 20, offset: 2 }}
        // lg={{ span: 18, offset: 3 }}
        >
          {this.props.editable
            ? <div
              className={styles.Resume__editBtn}
              style={{ position: 'absolute', top: 0, right: 0 }}
              onClick={props.toggleEdit}
            />
            : null}

          <BlockTitle
            icon={require('./images/basic-info.png')}
            title='顾问评价'
            iconSize={{ width: 23, height: 27 }}
          />
          <Row style={{ paddingLeft: 41 }}>
            <Col md={{ span: 12 }}>评估等级： {props.data.evaluationLevel}</Col>
            <Col md={{ span: 12 }}>计划出项目日期：{props.data.endWorkDate ? props.data.endWorkDate.format('YYYY-MM-DD') : '未填写'}</Col>
            <Col md={{ span: 12 }}>使用状态：{['有效', '无效'][props.data.workStatus]}</Col>
            <Col md={{ span: 12 }}>最近一次沟通时间：{props.data.lastCommunicateDate2 ? props.data.lastCommunicateDate2.format('YYYY-MM-DD') : '未填写'}</Col>
            <Col md={{ span: 12 }}>沟通人：{props.data.lastCommunicatePeople}</Col>
          </Row>
        </Col>
      </Row>
    )
  }

  renderEvaluationEdit = props => {
    const BlockTitle = this.renderBlockTitle
    const { form: { getFieldDecorator } } = props

    return (
      <div >
        <Row>
          <Col
          // xs={{ span: 24, offset: 0 }}
          // md={{ span: 20, offset: 2 }}
          // lg={{ span: 18, offset: 3 }}
          >
            <BlockTitle
              icon={require('./images/basic-info.png')}
              title='顾问评价'
              iconSize={{ width: 23, height: 27 }}
            />
            <div style={{ paddingLeft: 48 }}>
              <div className={styles.Resume__editingBlock} style={{ padding: 20 }}>
                <Form layout='horizontal' onSubmit={(e) => this.handleFormSubmit(e, props)}>
                  <Row type='flex'>
                    <Col xs={{ span: 24 }} md={{ span: 12 }}>
                      <Form.Item
                        label='评估等级'
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 17 }}
                      >
                        {getFieldDecorator('evaluationLevel', {
                          initialValue: props.data.evaluationLevel,
                          rules: [
                            // { required: true, message: '请输入评估等级', }
                          ]
                        })(<Input />)}
                      </Form.Item>
                    </Col>

                    <Col xs={{ span: 24 }} md={{ span: 12 }}>
                      <Form.Item
                        label='计划出项目日期'
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 17 }}
                      >
                        {getFieldDecorator('endWorkDate', {
                          initialValue: props.data.endWorkDate,
                          rules: []
                        })(
                          <DatePicker />
                        )}
                      </Form.Item>
                    </Col>

                    <Col xs={{ span: 24 }} md={{ span: 12 }}>
                      <Form.Item
                        label='使用状态'
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 17 }}
                      >
                        {getFieldDecorator('workStatus', {
                          initialValue: String(props.data.workStatus || 0),
                          rules: []
                        })(<Select >
                          <Select.Option value='0'>有效</Select.Option>
                          <Select.Option value='1'>无效</Select.Option>
                        </Select>)}
                      </Form.Item>
                    </Col>
                    <Col md={{ span: 12 }} />

                    <Col xs={{ span: 24 }} md={{ span: 12 }}>
                      <Form.Item
                        label='最近一次沟通日期'
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                      >
                        {getFieldDecorator('lastCommunicateDate2', {
                          initialValue: props.data.lastCommunicateDate2,
                          rules: []
                        })(<DatePicker />)}
                      </Form.Item>
                    </Col>
                    <Col md={{ span: 12 }} />

                    <Col xs={{ span: 24 }} md={{ span: 12 }}>
                      <Form.Item
                        label='沟通人'
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                      >
                        {getFieldDecorator('lastCommunicatePeople', {
                          initialValue: props.data.lastCommunicatePeople,
                          rules: []
                        })(<Input />)}
                      </Form.Item>
                    </Col>

                  </Row>

                  <Row>
                    <Col xs={{ offset: 8, span: 4 }}>
                      <Button htmlType='submit'>保存</Button>
                    </Col>
                    <Col xs={{ span: 4 }}>
                      <Button onClick={props.toggleEdit}>取消</Button>
                    </Col>
                  </Row>
                </Form>

              </div>
            </div>
          </Col>
        </Row>
      </div>
    )
  }

  renderWorkExpEdit = (props) => {
    const {
      form: { getFieldDecorator }
    } = props

    return (
      <div style={{ paddingLeft: 48 }}>
        <div className={styles.Resume__editingBlock} style={{ padding: 20 }}>
          <h3>{props.data.isNew ? '添加' : '编辑'}工作经历</h3>
          <Form layout='horizontal' onSubmit={(e) => this.handleFormSubmit(e, props)}>
            <Row type='flex'>
              <Col xs={{ span: 24 }} md={{ span: 12 }}>
                <Form.Item
                  label='公司名称'
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                >
                  {getFieldDecorator('companyName', {
                    initialValue: props.data.companyName,
                    rules: [{ required: true, message: '请输入公司名称' }]
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 12 }}>
                <Form.Item
                  label='职位名称'
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                >
                  {getFieldDecorator('positionName', {
                    initialValue: props.data.positionName,
                    rules: [{ required: true, message: '请输入职位名称' }]
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col xs={{ span: 24 }} md={{ span: 12 }}>
                <Form.Item
                  label='公司行业'
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                >
                  {getFieldDecorator('companyIndustry', {
                    initialValue: props.data.companyIndustry,
                    rules: [{ required: true, message: '请输入公司行业' }]
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col xs={{ span: 24 }} md={{ span: 12 }}>
                <Form.Item
                  label='工作地点'
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                >
                  {getFieldDecorator('workingPlace', {
                    initialValue: props.data.workingPlace,
                    rules: [{ required: true, message: '请输入工作地点' }]
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col xs={{ span: 24 }} md={{ span: 12 }}>
                <Form.Item
                  label='下属人数'
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                >
                  {getFieldDecorator('subordinates', {
                    initialValue: Number(props.data.subordinates) || 0,
                    rules: [{ required: true, message: '请输入下属人数' }]
                  })(<Input type='number' />)}
                </Form.Item>
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 24 }}>
                <Form.Item
                  label='任职时间'
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 21 }}
                >
                  {getFieldDecorator('tenureTime', {
                    initialValue: props.data.tenureTime,
                    rules: [{ required: true, message: '请输入任职时间' }]
                  })(<DatePicker.RangePicker />)}
                </Form.Item>
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 24 }}>
                <Form.Item
                  label='职责业绩'
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 21 }}
                >
                  {getFieldDecorator('dutyPerformance', {
                    initialValue: props.data.dutyPerformance,
                    rules: [{ required: true, message: '请输入职责业绩' }]
                  })(<Input.TextArea autosize={{ minRows: 2 }} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col xs={{ offset: 8, span: 4 }}>
                <Form.Item>
                  <Button htmlType='submit'>保存</Button>
                </Form.Item>
              </Col>
              <Col xs={{ span: 4 }}>
                <Form.Item>
                  <Button onClick={props.toggleEdit}>取消</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    )
  }

  renderWorkExp = (props) => {
    const BlockSubTitle = this.renderBlockSubTitle
    return (
      <div>
        <BlockSubTitle
          title={props.data.companyName}
          supTitle={this.formatDateRange(props.data.tenureTime)}
          onClickEdit={props.toggleEdit}
          onClickDelete={(e) => this.handleClickDelete(e, props)}
        />
        <div style={{ paddingLeft: 48, paddingTop: 20 }}>
          <div style={{ display: 'flex' }}>
            <div >工作职位：</div>
            <div style={{ flex: 1 }}><Text className={styles.Resume__text}>{props.data.positionName}</Text></div>
          </div>
          <div style={{ display: 'flex' }}>
            <div >工作地点：</div>
            <div style={{ flex: 1 }}><Text className={styles.Resume__text}>{props.data.workingPlace}</Text></div>
          </div>
          <div style={{ display: 'flex' }}>
            <div >公司行业：</div>
            <div style={{ flex: 1 }}><Text className={styles.Resume__text}>{props.data.companyIndustry}</Text></div>
          </div>
          <div style={{ display: 'flex' }}>
            <div >下属人数：</div>
            <div style={{ flex: 1 }}><Text className={styles.Resume__text}>{props.data.subordinates}</Text></div>
          </div>
          <div style={{ display: 'flex' }}>
            <div >职责业绩：</div>
            <div style={{ flex: 1 }}><Text className={styles.Resume__text}>{props.data.dutyPerformance}</Text></div>
          </div>
        </div>
      </div>
    )
  }

  renderBottomButton = (props) => {
    return (
      <Row
        type='flex'
        align='center'
        justify='center'
        onClick={props.onClick || noop}
        style={{
          cursor: 'pointer',
          backgroundColor: '#dde2ff',
          height: 84,
          lineHeight: '84px',
          marginLeft: -30,
          marginRight: -30,
          marginBottom: -60
        }}>
        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
          <div style={{
            marginRight: 18,
            width: 17,
            height: 17,
            backgroundImage: `url(${require('./images/plus.png')})`
          }} />
          <div style={{
            fontSize: 18,
            color: '#3f51b5'
          }}>
            {props.title}
          </div>
        </div>
      </Row>
    )
  }

  renderEduExp = (props) => {
    const BlockSubLightTitle = this.renderBlockSubLightTitle
    return (
      <div>
        <BlockSubLightTitle
          onClickEdit={props.toggleEdit}
          onClickDelete={e => this.handleClickDelete(e, props)}
          title={props.data.schoolName}
          supTitle={this.formatDateRange(props.data.studyTime)}
        />
        <div style={{ paddingLeft: 48 }}>
          <div style={{ display: 'flex' }}>
            <div >专业：</div>
            <div style={{ flex: 1 }}><Text className={styles.Resume__text}>{props.data.professionalName}</Text></div>
          </div>

          <div style={{ display: 'flex' }}>
            <div >学历：</div>
            <div style={{ flex: 1 }}><Text className={styles.Resume__text}>{props.data.highestEducation}</Text></div>
          </div>
        </div>
      </div>
    )
  }

  renderEduExpEdit = (props) => {
    const { form: { getFieldDecorator } } = props

    return (
      <div style={{ paddingLeft: 48 }}>
        <div className={styles.Resume__editingBlock} style={{ padding: 20 }}>
          <h3>{props.data.isNew ? '添加' : '编辑'}教育经历</h3>
          <Form layout='horizontal' onSubmit={e => this.handleFormSubmit(e, props)}>
            <Row type='flex'>
              <Col xs={{ span: 24 }} md={{ span: 24 }}>
                <Form.Item
                  label='学校名称'
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 21 }}
                >
                  {getFieldDecorator('schoolName', {
                    initialValue: props.data.schoolName,
                    rules: [{ required: true, message: '请输入学校名称' }]
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 24 }}>
                <Form.Item
                  label='专业名称'
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 21 }}
                >
                  {getFieldDecorator('professionalName', {
                    initialValue: props.data.professionalName,
                    rules: [{ required: true, message: '请输入专业名称' }]
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 24 }}>
                <Form.Item
                  label='就读时间'
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 21 }}
                >
                  {getFieldDecorator('studyTime', {
                    initialValue: props.data.studyTime,
                    rules: [{ required: true, message: '请输入就读时间' }]
                  })(<DatePicker.RangePicker />)}
                </Form.Item>
              </Col>

              <Col xs={{ span: 24 }} md={{ span: 12 }}>
                <Form.Item
                  label='最高学历'
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                >
                  {getFieldDecorator('highestEducation', {
                    initialValue: props.data.highestEducation,
                    rules: [{ required: true, message: '请输入最高学历' }]
                  })(
                    <Select>
                      <Select.Option value='大专'>大专</Select.Option>
                      <Select.Option value='本科'>本科</Select.Option>
                      <Select.Option value='硕士'>硕士</Select.Option>
                      <Select.Option value='博士'>博士</Select.Option>
                      <Select.Option value='MBA'>MBA</Select.Option>
                      <Select.Option value='EMBA'>EMBA</Select.Option>
                      <Select.Option value='中专'>中专</Select.Option>
                      <Select.Option value='中技'>中技</Select.Option>
                      <Select.Option value='高中'>高中</Select.Option>
                      <Select.Option value='初中'>初中</Select.Option>
                      <Select.Option value='其他'>其他</Select.Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>

            </Row>
            <Row>
              <Col xs={{ offset: 8, span: 4 }}>
                <Form.Item>
                  <Button htmlType='submit'>保存</Button>
                </Form.Item>
              </Col>
              <Col xs={{ span: 4 }}>
                <Form.Item>
                  <Button onClick={props.toggleEdit}>取消</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>

        </div>
      </div>
    )
  }

  renderProjectExpEdit = (props) => {
    const { form: { getFieldDecorator } } = props
    return (
      <div style={{ paddingLeft: 48 }}>
        <div className={styles.Resume__editingBlock} style={{ padding: 20 }}>
          <h3>{props.data.isNew ? '添加' : '编辑'}项目经历</h3>
          <Form layout='horizontal' onSubmit={e => this.handleFormSubmit(e, props)}>
            <Row type='flex'>
              <Col xs={{ span: 24 }} md={{ span: 24 }}>
                <Form.Item
                  label='项目名称'
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 21 }}
                >
                  {getFieldDecorator('projectName', {
                    initialValue: props.data.projectName,
                    rules: [{ required: true, message: '请输入项目名称' }]
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 12 }}>
                <Form.Item
                  label='公司名称'
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                >
                  {getFieldDecorator('companyName', {
                    initialValue: props.data.companyName,
                    rules: [{ required: true, message: '请输入公司名称' }]
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col xs={{ span: 24 }} md={{ span: 12 }}>
                <Form.Item
                  label='项目职务'
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                >
                  {getFieldDecorator('projectPosition', {
                    initialValue: props.data.projectPosition,
                    rules: [{ required: true, message: '请输入项目职务' }]
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col xs={{ span: 24 }} md={{ span: 24 }}>
                <Form.Item
                  label='项目时间'
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 21 }}
                >
                  {getFieldDecorator('projectTime', {
                    initialValue: props.data.projectTime,
                    rules: [{ required: true, message: '请输入项目职务' }]
                  })(<DatePicker.RangePicker />)}
                </Form.Item>
              </Col>

              <Col xs={{ span: 24 }} md={{ span: 24 }}>
                <Form.Item
                  label='项目描述'
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 21 }}
                >
                  {getFieldDecorator('projectDesc', {
                    initialValue: props.data.projectDesc,
                    rules: [{ required: true, message: '请输入项目职务' }]
                  })(<Input.TextArea
                    placeholder='请详细描述项目内容，填写文字限1000字以内'
                    autosize={{ minRows: 3 }}
                  />)}
                </Form.Item>
              </Col>

              <Col xs={{ span: 24 }} md={{ span: 24 }}>
                <Form.Item
                  label='项目职责'
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 21 }}
                >
                  {getFieldDecorator('projectResp', {
                    initialValue: props.data.projectResp,
                    rules: [{ required: true, message: '请输入项目职务' }]
                  })(<Input.TextArea
                    placeholder='请详细描述您的职责范围以及工作描述，填写文字限1000字以内'
                    autosize={{ minRows: 3 }}
                  />)}
                </Form.Item>
              </Col>

              <Col xs={{ span: 24 }} md={{ span: 24 }}>
                <Form.Item
                  label='项目业绩'
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 21 }}
                >
                  {getFieldDecorator('projectPerformance', {
                    initialValue: props.data.projectPerformance,
                    rules: [{ required: true, message: '请输入项目职务' }]
                  })(<Input.TextArea
                    placeholder='请详细描述您在项目中取得的业绩，填写文字限1000字以内'
                    autosize={{ minRows: 3 }}
                  />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col xs={{ offset: 8, span: 4 }}>
                <Form.Item>
                  <Button htmlType='submit'>保存</Button>
                </Form.Item>
              </Col>
              <Col xs={{ span: 4 }}>
                <Form.Item>
                  <Button onClick={props.toggleEdit}>取消</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    )
  }

  renderProjectExp = (props) => {
    const BlockSubTitle = this.renderBlockSubTitle
    return (
      <div>
        <BlockSubTitle
          title={props.data.projectName}
          supTitle={this.formatDateRange(props.data.projectTime)}
          onClickEdit={props.toggleEdit}
          onClickDelete={e => this.handleClickDelete(e, props)}
        />
        <div style={{ paddingLeft: 48, paddingTop: 20 }}>
          <div style={{ display: 'flex' }}>
            <div >项目业务：</div>
            <div style={{ flex: 1 }}><Text className={styles.Resume__text}>{props.data.projectName}</Text></div>
          </div>
          <div style={{ display: 'flex' }}>
            <div >所在公司：</div>
            <div style={{ flex: 1 }}><Text className={styles.Resume__text}>{props.data.companyName}</Text></div>
          </div>
          <div style={{ display: 'flex' }}>
            <div >项目描述：</div>
            <div style={{ flex: 1 }}><Text className={styles.Resume__text}>{props.data.projectDesc}</Text></div>
          </div>
          <div style={{ display: 'flex' }}>
            <div >项目职责：</div>
            <div style={{ flex: 1 }}><Text className={styles.Resume__text}>{props.data.projectResp}</Text></div>
          </div>
          <div style={{ display: 'flex' }}>
            <div>项目业绩：</div>
            <div style={{ flex: 1 }}><Text className={styles.Resume__text}>{props.data.projectPerformance}</Text></div>
          </div>
        </div>
      </div>
    )
  }

  render () {
    const BlockTitle = this.renderBlockTitle
    const BottomButton = this.renderBottomButton

    return (
      <Layout>
        {this.props.showBackbutton
          ? <Button.Group style={{marginBottom: 10}}>
            <Button onClick={this.handleClickBackBtn}>
              <Icon type='left' />返回
            </Button>
          </Button.Group>
          : null
        }
        <PromiseView
          onStateChange={this.state.loadRegionHandle}
          promise={this.state.loadRegionPromise}
        />
        <PromiseView
          onStateChange={this.state.loadUnitHandle}
          promise={this.state.loadUnitPromise}
        />
        <PromiseView
          onStateChange={this.state.initHandle}
          promise={this.state.initPromise}
        >
          {(status, result) => {
            if (status === 'pending') {
              return (
                <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                  <Icon type='loading' />
                  <div>正在加载</div>
                </div>
              )
            }
            if (status === 'rejected') {
              return (
                <div>
                  {result.message}
                  {result.stack}
                </div>
              )
            }
            return (
              <Layout.Content style={{
                minHeight: 1000
                // paddingTop: 20
                // maxWidth: 1000
                // paddingLeft: 20,
                // paddingRight: 20
              }}>
                <Row>
                  {/**
                    * 基础信息
                    */}
                  <Col
                    style={{
                      padding: '60px 30px',
                      boxShadow: '0 1px 3px #CCC',
                      backgroundColor: '#fff',
                      marginBottom: 20
                    }}
                  >
                    <ResumeBlock
                      onToggleEdit={this.handleBlockToggleEdit}
                      blockName={'head'}
                      index={0}
                      data={this.state.head}
                    >
                      {(props) => props.isEditing ? this.renderHeadEdit(props) : this.renderHead(props)}
                    </ResumeBlock>
                    <ResumeBlock
                      onToggleEdit={this.handleBlockToggleEdit}
                      blockName={'basic'}
                      index={0}
                      data={this.state.basic}
                    >
                      {(props) => props.isEditing ? this.renderBasicEdit(props) : this.renderBasic(props)}
                    </ResumeBlock>

                    {!this.props.enableEvaluation ? null
                      : <ResumeBlock
                        onToggleEdit={this.handleBlockToggleEdit}
                        blockName={'evaluation'}
                        index={0}
                        data={this.state.evaluation}
                      >
                        {(props) => props.isEditing ? this.renderEvaluationEdit(props) : this.renderEvaluation(props)}
                      </ResumeBlock>
                    }
                  </Col>

                  {/**
                    * 工作经历
                    */}
                  <Col
                    style={{
                      padding: '60px 30px',
                      boxShadow: '0 1px 3px #CCC',
                      backgroundColor: '#fff',
                      marginBottom: 20
                    }}
                  >
                    <Row>
                      <Col
                      // xs={{ span: 24, offset: 0 }}
                      // md={{ span: 20, offset: 2 }}
                      // lg={{ span: 18, offset: 3 }}
                      >
                        <BlockTitle
                          iconSize={{ width: 29, height: 25 }}
                          icon={require('./images/work-exp.png')}
                          title='工作经历'
                        />
                      </Col>
                    </Row>
                    <div >
                      <Row>
                        <Col
                        // xs={{ span: 24, offset: 0 }}
                        // md={{ span: 20, offset: 2 }}
                        // lg={{ span: 18, offset: 3 }}
                        >
                          {this.state.workExp.length === 0
                            ? <div style={{ padding: '30px 0' }}>
                              {this.props.editable
                                ? '工作经历最能提现你的能力，且完善后才可投递简历哦！'
                                : '未填写'
                              }
                            </div>
                            : this.state.workExp.map((exp, index) => {
                              return (
                                <ResumeBlock
                                  key={index}
                                  defaultEditing={exp.isNew}
                                  onToggleEdit={this.handleBlockToggleEdit}
                                  blockName={'workExp'}
                                  index={index}
                                  data={this.state.workExp[index]}
                                >
                                  {(props) => props.isEditing
                                    ? this.renderWorkExpEdit(props)
                                    : this.renderWorkExp(props)}
                                </ResumeBlock>
                              )
                            })
                          }
                        </Col>
                      </Row>
                    </div>
                    {this.isBlockEditingNew('workExp') || !this.props.editable
                      ? null
                      : <BottomButton
                        onClick={e => this.addBlock('workExp')}
                        title='添加工作经历'
                      />
                    }
                  </Col>

                  {/**
                    * 教育经历
                    */}
                  <Col style={{
                    padding: '60px 30px',
                    boxShadow: '0 1px 3px #CCC',
                    backgroundColor: '#fff',
                    marginBottom: 20
                  }}
                  >
                    <Row>
                      <Col
                      // xs={{ span: 24, offset: 0 }}
                      // md={{ span: 20, offset: 2 }}
                      // lg={{ span: 18, offset: 3 }}
                      >
                        <BlockTitle
                          iconSize={{ width: 31, height: 26 }}
                          icon={require('./images/edu-exp.png')}
                          title='教育经历'
                        />
                      </Col>
                    </Row>
                    <div >
                      <Row>
                        <Col
                        // xs={{ span: 24, offset: 0 }}
                        // md={{ span: 20, offset: 2 }}
                        // lg={{ span: 18, offset: 3 }}
                        >
                          {this.state.eduExp.length === 0
                            ? <div style={{ padding: '30px 0' }}>
                              {this.props.editable ? '教育经历最能体现你的学习能力和专业能力，且完善后才可投递简历哦' : '未填写'}
                            </div>
                            : this.state.eduExp.map((exp, index) => {
                              return (
                                <ResumeBlock
                                  key={index}
                                  defaultEditing={exp.isNew}
                                  onToggleEdit={this.handleBlockToggleEdit}
                                  blockName={'eduExp'}
                                  index={index}
                                  data={this.state.eduExp[index]}
                                >
                                  {(props) => props.isEditing
                                    ? this.renderEduExpEdit(props)
                                    : this.renderEduExp(props)}
                                </ResumeBlock>
                              )
                            })
                          }
                        </Col>
                      </Row>
                    </div>
                    {this.isBlockEditingNew('eduExp') || !this.props.editable
                      ? null
                      : <BottomButton
                        onClick={e => this.addBlock('eduExp')}
                        title='添加教育经历'
                      />
                    }
                  </Col>

                  {/**
                    * 项目经历
                    */}
                  <Col style={{
                    padding: '60px 30px',
                    boxShadow: '0 1px 3px #CCC',
                    backgroundColor: '#fff',
                    marginBottom: 20
                  }}
                  >
                    <Row>
                      <Col
                      // xs={{ span: 24, offset: 0 }}
                      // md={{ span: 24, offset: 0 }}
                      // lg={{ span: 18, offset: 3 }}
                      >
                        <BlockTitle
                          iconSize={{ width: 26, height: 25 }}
                          icon={require('./images/project-exp.png')}
                          title='项目经历'
                        />
                      </Col>
                    </Row>
                    <div >
                      <Row>
                        <Col
                        // xs={{ span: 24, offset: 0 }}
                        // md={{ span: 24, offset: 0 }}
                        // lg={{ span: 20, offset: 4 }}
                        >
                          {this.state.projectExp.length === 0
                            ? <div style={{ padding: '30px 0' }}>
                              {this.props.editable
                                ? <div>
                                  <div>项目经验是用人单位衡量人才能力的重要指标哦！</div>
                                  <div>来说说令你难忘的项目经历吧！</div>
                                </div>
                                : <div>未填写</div>
                              }
                            </div>
                            : this.state.projectExp.map((exp, index) => {
                              return (
                                <ResumeBlock
                                  key={index}
                                  defaultEditing={exp.isNew}
                                  onToggleEdit={this.handleBlockToggleEdit}
                                  blockName={'projectExp'}
                                  index={index}
                                  data={this.state.projectExp[index]}
                                >
                                  {(props) => props.isEditing
                                    ? this.renderProjectExpEdit(props)
                                    : this.renderProjectExp(props)}
                                </ResumeBlock>
                              )
                            })
                          }
                        </Col>
                      </Row>
                    </div>
                    {this.isBlockEditingNew('projectExp') || !this.props.editable
                      ? null
                      : <BottomButton
                        onClick={e => this.addBlock('projectExp')}
                        title='添加项目经历'
                      />
                    }
                  </Col>

                  {/**
                  * 添加附件
                  */}
                  <Col style={{
                    display: !this.props.showAttachment ? 'none' : undefined,
                    padding: '60px 30px',
                    boxShadow: '0 1px 3px #CCC',
                    backgroundColor: '#fff',
                    marginBottom: 20
                  }}
                  >
                    <Row>
                      <Col
                      // xs={{ span: 24, offset: 0 }}
                      // md={{ span: 24, offset: 0 }}
                      // lg={{ span: 22, offset: 2 }}
                      >
                        <BlockTitle
                          style={{ marginBottom: 30 }}
                          iconSize={{ width: 20, height: 25 }}
                          icon={require('./images/attachment.png')}
                          title={`${this.props.editable ? '添加' : ''}附件`}
                        />
                        {this.props.editable
                          ? <div style={{fontSize: 13, color: '#999', marginBottom: 10}}>
                          支持.doc, .docx, .pdf格式，大小不超过5MB。
                          </div>
                          : null
                        }
                        <Row type='flex'>
                          <PromiseView
                            promise={this.state.reloadAttachmentPromise}
                            onStateChange={this.state.reloadAttachmentHandle}
                          />
                          {this.state.attachments.length === 0 ? null
                            : this.state.attachments.map((attach, index) => {
                              return (
                                <div
                                  key={attach.id}
                                  className={styles.Resume__attachmentBg}
                                  style={{ paddingTop: 136 }}
                                  onClick={(e) => this.handleOpenAttachment(e, attach, index)}
                                >
                                  <PromiseView
                                    promise={this.state[`attach_${attach.id}_DeletePromise`]}
                                    onStateChange={this.state[`attach_${attach.id}_DeleteHandle`]}
                                  >
                                    {(status, result) => {
                                      if (status === 'resolved') return null
                                      const clickHandle = e => this.handleClickDeleteAttachment(e, attach, index)
                                      return (
                                        <div
                                          className={styles.Resume__attachmentBg__deleteBtn}
                                          onClick={status === 'pending' ? noop : clickHandle}
                                        >
                                          <Icon
                                            type={status === 'pending' ? 'loading' : 'close'}
                                            style={{ fontSize: 16, color: '#BBB' }}
                                          />
                                        </div>
                                      )
                                    }}
                                  </PromiseView>
                                  <div className={styles.Resume__attachName}>{attach.filename}</div>
                                </div>
                              )
                            })
                          }
                          {!this.props.editable
                            ? null
                            : this.props.enableAttachment ? <Upload
                              accept={'.doc,.docx,.pdf'}
                              beforeUpload={this.validateFileSize}
                              name='file'
                              showUploadList={false}
                              headers={this.props.getUploadHeaders()}
                              action={`${this.props.server}${this.props.ocmsResumePrefix}/ocmsResume/attachment/${this.state.basic.outerId}?file_name=${this.state.filename}`}
                              onSuccess={(res) => {
                                this.reloadAttachment()
                              }}
                              onChange={(info) => {
                                this.setState({
                                  attachmentUploading: info.file.status === 'uploading'
                                  // filename:
                                })
                              }}
                              onError={() => {
                                message.error('上传出错')
                              }}
                            >
                              <div
                                className={styles.Resume__attachmentBg}
                                style={this.state.attachmentUploading ? {
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                } : {
                                  backgroundImage: `url(${require('./images/attachment-plus.png')})`
                                }}>
                                {this.state.attachmentUploading ? <Icon type='loading' /> : null}
                              </div>
                            </Upload>
                              : <div
                                onClick={e => {
                                  Modal.info({
                                    title: '抱歉',
                                    content: '功能正在开发中，敬请期待。'
                                  })
                                }}
                                className={styles.Resume__attachmentBg}
                                style={{
                                  backgroundImage: `url(${require('./images/attachment-plus.png')})`
                                }} />
                          }
                        </Row>
                      </Col>
                    </Row>

                  </Col>
                </Row>
              </Layout.Content>
            )
          }}
        </PromiseView>

      </Layout>
    )
  }
}

export default withRouter(Resume)
