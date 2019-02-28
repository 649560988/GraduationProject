import get from '../get'

export default (resume, result) => {
  if (result.error_code > 0) throw new Error(result.error_msg || '解析失败')

  const { cv_parse: cvParse } = result.data
  const {
    occupations/* 工作经历 */,
    educations/* 教育经历 */,
    projects
  } = cvParse

  let skills = get(cvParse, 'skills.skills')
  if (skills) resume.skills = skills.join('').replace(/\r?\n/g, ' ')
  resume.realname = get(cvParse, 'basic_info.name')
  resume.gender = get(cvParse, 'basic_info.gender')
  resume.birthday = get(cvParse, 'basic_info.birthday')
  resume.email = get(cvParse, 'contact.email')
  resume.expectedSalary = get(cvParse, 'job_objective.expect_salary_upper')
  if (get(cvParse, 'basic_info.id_number_valid')) {
    resume.idNumber = get(cvParse, 'basic_info.id_number')
  }

  const location = get(cvParse, 'basic_info.location') || get(cvParse, 'basic_info.extract_location')
  if (location) {
    resume.longResidence = `${location.province || ''}${location.city || ''}${location.district || ''}`
  }

  resume.workYears = get(cvParse, 'basic_info.work_years')
  resume.otherInfo = get(cvParse, 'self_evaluate')

  occupations.forEach(item => {
    resume.addExp('workExp', {
      companyIndustry: item.industry,
      companyName: item.company,
      dutyPerformance: item.predicted_job_function || item.job_category,
      positionName: item.title,
      subordinates: item.underling_num,
      workingPlace: item.hasOwnProperty('workplace')
        ? `${item.workplace.province || ''}${item.workplace.city || ''}${item.workplace.district || ''}`
        : '',
      tenureStartTime: item.start_time ? item.start_time : new Date(),
      tenureEndTime: item.not_ended ? item.end_time : new Date()
    })
  })

  educations.forEach(item => {
    resume.addExp('eduExp', {
      highestEducation: item.degree,
      professionalName: item.major,
      schoolName: item.school,
      studyStartTime: item.start_time ? item.start_time : new Date(),
      studyEndTime: item.not_ended ? new Date() : item.end_time
    })
  })

  projects.forEach(item => {
    resume.addExp('proExp', {
      projectDesc: item.desc,
      projectName: item.name,
      projectPerformance: item.project_performance,
      projectPosition: item.post,
      projectResp: item.project_responsibility,
      projectStartTime: `${item.start_year}/${item.start_month}`,
      projectEndTime: item.not_ended ? new Date() : `${item.end_year}/${item.end_month}`
    })
  })

  return resume
}
