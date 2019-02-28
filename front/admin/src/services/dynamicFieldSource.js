import request from '../utils/request'
import { stringify } from 'qs'

export async function fetch (params) {
  return request(`http://api.ocms.console.retailsolution.cn/attr/v1/sources?${stringify(params)}`)
}
