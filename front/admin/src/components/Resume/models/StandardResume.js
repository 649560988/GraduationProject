import moment from 'moment'
import fromYunjiexi from './fromYunjiexi'
import fromHand from './fromHand'

export const isPlainObject = json => !!json && Object.getPrototypeOf(json) === Object.prototype
export const getArray = json => json instanceof Array ? json : []
export const getPlainObject = json => isPlainObject(json) ? json : {}
let defaultAvatar = null

try {
  defaultAvatar = require('../images/avatar-default.png')
} catch (e) {

}

export class WorkExp {
  constructor (props = {}) {
    this.data = {

    }
    Object.keys(props).forEach(key => {
      this[key] = props[key]
    })
  }

  set companyIndustry (value) { this.data.companyIndustry = value }
  get companyIndustry () { return this.data.companyIndustry }
  set companyName (value) { this.data.companyName = value }
  get companyName () { return this.data.companyName }
  set dutyPerformance (value) { this.data.dutyPerformance = value }
  get dutyPerformance () { return this.data.dutyPerformance }
  set positionName (value) { this.data.positionName = value }
  get positionName () { return this.data.positionName }
  set subordinates (value) { this.data.subordinates = value || 0 }
  get subordinates () { return this.data.subordinates }
  set workingPlace (value) { this.data.workingPlace = value }
  get workingPlace () { return this.data.workingPlace }
  set tenureStartTime (value) { this.data.tenureStartTime = value }
  get tenureStartTime () { return this.data.tenureStartTime }
  set tenureEndTime (value) { this.data.tenureEndTime = value }
  get tenureEndTime () { return this.data.tenureEndTime }

  toPlainObject () {
    return this.data
  }
}

export class EduExp {
  constructor (props = {}) {
    this.data = {
    }
    Object.keys(props).forEach(key => {
      this[key] = props[key]
    })
  }

  get highestEducation () { return this.data.highestEducation }
  set highestEducation (value) { this.data.highestEducation = value }
  get professionalName () { return this.data.professionalName }
  set professionalName (value) { this.data.professionalName = value }
  get schoolName () { return this.data.schoolName }
  set schoolName (value) { this.data.schoolName = value }
  get studyStartTime () { return this.data.studyStartTime }
  set studyStartTime (value) { this.data.studyStartTime = value }
  get studyEndTime () { return this.data.studyEndTime }
  set studyEndTime (value) { this.data.studyEndTime = value }

  toPlainObject () {
    return this.data
  }
}

export class ProExp {
  constructor (props = {}) {
    this.data = {
    }
    Object.keys(props).forEach(key => {
      this[key] = props[key]
    })
  }

  get companyName () { return this.data.companyName }
  set companyName (value) { this.data.companyName = value }
  get projectDesc () { return this.data.projectDesc }
  set projectDesc (value) { this.data.projectDesc = value }
  get projectName () { return this.data.projectName }
  set projectName (value) { this.data.projectName = value }
  get projectPerformance () { return this.data.projectPerformance }
  set projectPerformance (value) { this.data.projectPerformance = value }
  get projectPosition () { return this.data.projectPosition }
  set projectPosition (value) { this.data.projectPosition = value }
  get projectResp () { return this.data.projectResp }
  set projectResp (value) { this.data.projectResp = value }
  get projectStartTime () { return this.data.projectStartTime }
  set projectStartTime (value) { this.data.projectStartTime = value }
  get projectEndTime () { return this.data.projectEndTime }
  set projectEndTime (value) { this.data.projectEndTime = value }

  toPlainObject () {
    return this.data
  }
}

export class Attachment {
  constructor (props = {}) {
    this.data = {
    }
    Object.keys(props).forEach(key => {
      this[key] = props[key]
    })
  }

  get url () { return this.data.url }
  set url (value) { this.data.url = value }
  get filename () { return this.data.filename }
  set filename (value) { this.data.filename = value }
  get id () { return this.data.id }
  set id (value) { this.data.id = value }

  toPlainObject () {
    return this.data
  }
}

export class StandardResume {
  static fromJSON (input, resume) {
    if (input.api === 'hand') {
      return fromHand(resume || new StandardResume(), input.result)
    }
    if (input.api === '云解析') {
      return fromYunjiexi(resume || new StandardResume(), JSON.parse(input.result))
    }
    throw new Error('Unsupport api')
  }

  static fromRawState (state) {

  }

  constructor (props = {}) {
    this.data = {
      updateTime: '',
      realname: '',
      mobile: '',
      email: '',
      avatar: defaultAvatar,

      // basic
      outerId: '',
      idNumber: '',
      birthday: '',
      expectedSalary: '',
      unit: '',
      residenceCode: [],
      residence: '',
      otherInfo: '',
      // 顾问评价
      evaluationLevel: '',
      endWorkDate: '',
      lastCommunicateDate2: '',
      lastCommunicatePeople: '',
      workStatus: '',
      // exp
      eduExp: [],
      workExp: [],
      proExp: [],

      attachments: []
    }
    Object.keys(props).forEach(key => {
      this[key] = props[key]
    })
  }

  get head () {
    const { updateTime, realname, mobile, email, avatar } = this.data
    return {
      updateTime, realname, mobile, email, avatar
    }
  }

  addExp = (expName, item) => {
    let Exp = null
    if (expName === 'eduExp') Exp = EduExp
    if (expName === 'workExp') Exp = WorkExp
    if (expName === 'proExp') Exp = ProExp
    if (!Exp) throw new Error('Unsupport experience type.')
    this.data[expName].push(new Exp(item))
    return this
  }

  addAttachment = (item) => {
    this.data.attachments.push(new Attachment(item))
  }

  get eduExp () { return this.data.eduExp }
  get workExp () { return this.data.workExp }
  get proExp () { return this.data.proExp }
  get projectExp () { return this.data.proExp }
  get attachments () { return this.data.attachments }

  /* 基本 */
  get realname () { return this.data.realname }
  set realname (value) { if (value) this.data.realname = value }
  get mobile () { return this.data.mobile }
  set mobile (value) { this.data.mobile = value }
  get email () { return this.data.email }
  set email (value) { if (value) this.data.email = value }
  get avatar () { return this.data.avatar }
  set avatar (value) { if (value) this.data.avatar = value }
  get gender () { return this.data.gender }
  set gender (value) {
    if (value === '男') {
      this.data.gender = 0
      return
    }
    if (value === '女') {
      this.data.gender = 1
      return
    }
    if (typeof value === 'undefined') return
    this.data.gender = value
  }
  get outerId () { return this.data.outerId }
  set outerId (value) { this.data.outerId = value }
  get idNumber () { return this.data.idNumber }
  set idNumber (value) { if (value) this.data.idNumber = value }
  get birthday () { return this.data.birthday }
  set birthday (value) { if (value) this.data.birthday = value }
  get expectedSalary () { return this.data.expectedSalary }
  set expectedSalary (value) { if (value) this.data.expectedSalary = value }
  get unit () { return this.data.unit }
  set unit (value) { this.data.unit = value }
  get residence () { return this.data.residence }
  set residence (value) { if (value) this.data.residence = value }
  get residenceCode () { return this.data.residenceCode }
  set residenceCode (value) { if (value) this.data.residenceCode = value }
  get otherInfo () { return this.data.otherInfo }
  set otherInfo (value) { if (value) this.data.otherInfo = value }
  get skills () { return this.data.skills }
  set skills (value) { if (value) this.data.skills = value }

  /* 顾问 */
  get evaluationLevel () { return this.data.evaluationLevel }
  set evaluationLevel (value) { if (value) this.data.evaluationLevel = value }
  get endWorkDate () { return this.data.endWorkDate }
  set endWorkDate (value) { if (value) this.data.endWorkDate = value }
  get lastCommunicateDate2 () { return this.data.lastCommunicateDate2 }
  set lastCommunicateDate2 (value) { if (value) this.data.lastCommunicateDate2 = value }
  get lastCommunicatePeople () { return this.data.lastCommunicatePeople }
  set lastCommunicatePeople (value) { if (value) this.data.lastCommunicatePeople = value }
  get workStatus () { return this.data.workStatus }
  set workStatus (value) { if (typeof value === 'undefined') return; this.data.workStatus = value }

  toPlainObject () {
    return {
      ...this.data,
      proExp: this.proExp.map(item => item.toPlainObject()),
      eduExp: this.eduExp.map(item => item.toPlainObject()),
      workExp: this.workExp.map(item => item.toPlainObject())
    }
  }

  // 供../Resume.js渲染使用
  toResumeShape = () => {
    const shape = {
      id: this.resumeId,
      email: this.email,
      idCard: this.idNumber,
      name: this.realname,
      otherRemarks: this.otherInfo,
      residence: this.residence,
      residenceCode: this.residenceCode ? this.residenceCode.join(',') : '',
      sex: this.gender,
      skills: this.skills,
      workYear: this.workYear
    }
    if (this.birthday) shape.birthday = moment(this.birthday).format('YYYY-MM-DD 00:00:00')

    shape.workExperience = this.workExp.filter(item => {
      return !item.id
    }).map(item => {
      return {
        companyIndustry: item.companyIndustry || '',
        companyName: item.companyName || '',
        dutyPerformance: item.dutyPerformance || '',
        positionName: item.positionName || '',
        subordinates: typeof item.subordinates === 'number' ? item.subordinates : 0,
        workingPlace: item.workingPlace || '',
        tenureStartTime: moment(item.tenureStartTime).format('YYYY-MM-DD 00:00:00'),
        tenureEndTime: moment(item.tenureEndTime).format('YYYY-MM-DD 00:00:00')
      }
    })
    shape.eduExperience = this.eduExp.filter(item => {
      return !item.id
    }).map(item => {
      return {
        highestEducation: item.highestEducation || '',
        professionalName: item.professionalName || '',
        schoolName: item.schoolName || '',
        studyStartTime: moment(item.studyStartTime).format('YYYY-MM-DD 00:00:00'),
        studyEndTime: moment(item.studyEndTime).format('YYYY-MM-DD 00:00:00')
      }
    })

    shape.proExperience = this.proExp.filter(item => {
      return !item.id
    }).map(item => {
      return {
        companyName: item.companyName || '',
        projectDesc: item.projectDesc || '',
        projectName: item.projectName || '',
        projectPerformance: item.projectPerformance || '',
        projectPosition: item.projectPosition || '',
        projectResp: item.projectResp || '',
        projectStartTime: moment(item.projectStartTime).format('YYYY-MM-DD 00:00:00'),
        projectEndTime: moment(item.projectEndTime).format('YYYY-MM-DD 00:00:00')
      }
    })
    return shape
  }
}
