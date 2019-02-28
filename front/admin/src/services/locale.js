import axios from 'axios'
import axiosWrapper from '../utils/axiosWrapper'

/**
 * 获取语言包
 * @param {string} lang  zh_cn, en_us
 */
export async function queryLocalePackage ({ locale }) {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('antd-pro-token')
    ? `Bearer ${localStorage.getItem('antd-pro-token')}`
    : undefined

  // TODO 临时
  // if (locale === 'en_us') {
  //   return {
  //     'choerodon.code.iam.role': 'Rolemanage',
  //     'ocms.code.resume.list.name': 'Name',
  //     'ocms.code.demand': 'Demand',
  //     'ocms.code.process-template-customization': 'ProcessTemplate',
  //     'ocms.code.resume.list.evaluationLevel': 'EvaluationLevel',
  //     'ocms.code.resume': 'Resume',
  //     'ocms.code.resume.list.operation': 'Operation',
  //     'ocms.code.resume.list.email': 'Email',
  //     'ocms.code.resume.list.workYear': 'Workyear',
  //     'ocms.code.usermanager': 'Usermanager',
  //     'ocms.code.approval': 'DemandApproval',
  //     'ocms.code.resume.list.education': 'Education',
  //     'ocms.code.resume.list.sex': 'Sex',
  //     'ocms.code.resume.list.sex.1': 'Woman',
  //     'ocms.code.resume.list.sex.0': 'Man',
  //     'ocms.code.baseinfo': 'Baseinfo',
  //     'ocms.code.data-dictionary': 'DataDictionary',
  //     'ocms.code.ocms': 'OCMS',
  //     'ocms.code.resume.list.mobile': 'Mobile',
  //     'ocms.code.company': 'Company',
  //     'ocms.code.resume.list.endWorkDate': 'FinishWorkDate',
  //     'ocms.code.index': 'Index',
  //     'ocms.code.resume.list.workYear.4': '7-10Years',
  //     'ocms.code.resume.list.workYear.5': 'More than 10 years',
  //     'ocms.code.resume.list.order': 'Order',
  //     'ocms.code.resume.list.residence': 'Residence',
  //     'ocms.code.menumanage': 'Menumanage',
  //     'ocms.code.process-customization': 'ProcessCustom ',
  //     'ocms.code.application': 'DemandApplication',
  //     'ocms.code.resume.list.workYear.2': '1-3Years',
  //     'ocms.code.resume.list.workYear.3': '4-6Years',
  //     'ocms.code.project': 'Project',
  //     'ocms.code.resume.list.workYear.1': 'GraduatingStudents',
  //     'ocms.code.resume.list.skills': 'Skills',
  //     'ocms.code.batchimport': 'Batchimport',
  //     'ocms.code.resume.list.id': 'WorkNumber',
  //     'ocms.code.syssetting': 'Step'
  //   }
  // } else {
  //   return {
  //     'choerodon.code.iam.role': '角色管理',
  //     'ocms.code.resume.list.name': '姓名',
  //     'ocms.code.demand': '外协需求',
  //     'ocms.code.process-template-customization': '流程模板定制',
  //     'ocms.code.resume.list.evaluationLevel': '评估级别',
  //     'ocms.code.resume': '外协顾问信息',
  //     'ocms.code.resume.list.operation': '操作',
  //     'ocms.code.resume.list.email': '邮箱',
  //     'ocms.code.resume.list.workYear': '从业年限',
  //     'ocms.code.usermanager': '用户管理',
  //     'ocms.code.approval': '外协需求审批',
  //     'ocms.code.resume.list.education': '最高学历',
  //     'ocms.code.resume.list.sex': '性别',
  //     'ocms.code.resume.list.sex.1': '女',
  //     'ocms.code.resume.list.sex.0': '男',
  //     'ocms.code.baseinfo': '基础信息维护',
  //     'ocms.code.data-dictionary': '数据字典设置',
  //     'ocms.code.ocms': '外协管理平台',
  //     'ocms.code.resume.list.mobile': '联系电话',
  //     'ocms.code.company': '公司基础信息',
  //     'ocms.code.resume.list.endWorkDate': '计划出项目日期',
  //     'ocms.code.index': '首页',
  //     'ocms.code.resume.list.workYear.4': '7-10年',
  //     'ocms.code.resume.list.workYear.5': '10年以上',
  //     'ocms.code.resume.list.order': '序号',
  //     'ocms.code.resume.list.residence': '常居地',
  //     'ocms.code.menumanage': '菜单配置',
  //     'ocms.code.process-customization': '流程定制',
  //     'ocms.code.application': '外协需求申请',
  //     'ocms.code.resume.list.workYear.2': '1-3年',
  //     'ocms.code.resume.list.workYear.3': '4-6年',
  //     'ocms.code.project': '项目基础信息',
  //     'ocms.code.resume.list.workYear.1': '应届生',
  //     'ocms.code.resume.list.skills': '擅长模块',
  //     'ocms.code.batchimport': '批量导入',
  //     'ocms.code.resume.list.id': '外协工号',
  //     'ocms.code.syssetting': '系统设置'
  //   }
  // }

  // delete axios.defaults.headers.common['Authorization']
  // const data = await axiosWrapper(axios.get(`http://api.omp.console.retailsolution.cn/iam-ext/v1/language?lang=${locale}`))
  // axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('antd-pro-token')}`

  // const data = await axiosWrapper(axios.get(`/iam-ext/v1/language?lang=${locale}`))
  // return data
}
