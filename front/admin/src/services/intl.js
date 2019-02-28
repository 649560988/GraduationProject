import { stringify } from 'qs'
import request from '../utils/request'

export async function queryIntlList (params) {
  return request(`/iam-ext/v1/language/pageIamLanguage?${stringify(params)}`)
}

export async function checkUnique (params) {
  return request(`/iam-ext/v1/language/checkLangAndCode`, {
    method: 'POST',
    body: params
  })
}

export async function add (params) {
  return request(`/iam-ext/v1/language/create`, {
    method: 'POST',
    body: params
  })
}

export async function updateChange (params) {
  return request(`/iam-ext/v1/language/update`, {
    method: 'POST',
    body: params
  })
}
