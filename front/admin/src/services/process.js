import request from '../utils/request'
import {stringify} from 'qs'

export async function query (params) {
  const result = await request(`/process/v1/ocms/process/search?${stringify(params)}`)
  return result
}

export async function insert (params) {
  const result = await request(`/process/v1/ocms/process/processCreateAdmin`, {
    method: 'POST',
    body: params
  })
  return result
}
