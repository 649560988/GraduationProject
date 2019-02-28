import moment from 'moment'

const isPlainObject = json => !!json && Object.getPrototypeOf(json) === Object.prototype
const getArray = json => json instanceof Array ? json : []
const getPlainObject = json => isPlainObject(json) ? json : {}

export default (resume, json) => {
  const safeJson = getPlainObject(json)
  safeJson.eduExperience = getArray(safeJson.eduExperience)
  safeJson.proExperience = getArray(safeJson.proExperience)
  safeJson.workExperience = getArray(safeJson.workExperience)
  safeJson.attachments = getArray(safeJson.attachments)
  safeJson.workYear = String(safeJson.workYear)

  // id
  resume.resumeId = safeJson.id

  // 基础信息
  resume.updateTime = safeJson.lastUpdateDate
  resume.realname = safeJson.name
  resume.mobile = safeJson.mobile
  resume.email = safeJson.email
  resume.gender = safeJson.sex // 0男 1女
  resume.workYear = ['1', '2', '3', '4', '5'].includes(safeJson.workYear) ? safeJson.workYear : undefined
  resume.skills = safeJson.skills
  resume.avatar = safeJson.photo

  // 附加信息
  resume.outerId = safeJson.id
  resume.idNumber = safeJson.idCard
  resume.birthday = safeJson.birthday ? moment(safeJson.birthday) : undefined
  resume.expectedSalary = safeJson.expectationSalary
  resume.unit = safeJson.unit
  resume.email = safeJson.email
  resume.otherInfo = safeJson.otherRemarks
  let isOldValue = false
  if (safeJson.residence) {
    const list = safeJson.residence.split(',')
    if (list.length > 0 && Number(list[0]) > 0) {
      isOldValue = true
    }
  }
  if (isOldValue) {
    resume.residenceCode = safeJson.residence.split(',')
  } else {
    if (typeof safeJson.residenceCode === 'string') {
      resume.residenceCode = safeJson.residenceCode.split(',')
    }
    resume.residence = safeJson.residence
  }

  // 顾问评价
  resume.evaluationLevel = safeJson.evaluationLevel
  resume.endWorkDate = safeJson.endWorkDate ? moment(safeJson.endWorkDate) : undefined
  resume.lastCommunicateDate2 = safeJson.lastCommunicateDate2 ? moment(safeJson.lastCommunicateDate2) : undefined
  resume.lastCommunicatePeople = safeJson.lastCommunicatePeople
  resume.workStatus = safeJson.workStatus

  // 工作经验
  safeJson.workExperience.forEach(item => {
    resume.addExp('workExp', {
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
    })
  })

  // 项目经验
  safeJson.proExperience.forEach(item => {
    resume.addExp('proExp', {
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
    })
  })

  // 教育经历
  safeJson.eduExperience.forEach(item => {
    resume.addExp('eduExp', {
      id: item.id,
      highestEducation: item.highestEducation,
      professionalName: item.professionalName,
      schoolName: item.schoolName,
      studyTime: [moment(item.studyStartTime), moment(item.studyEndTime)]
    })
  })

  safeJson.attachments.forEach(item => {
    resume.addAttachment({
      url: item.attachmentPath,
      filename: item.attachmentName,
      id: item.id
    })
  })

  return resume
}
