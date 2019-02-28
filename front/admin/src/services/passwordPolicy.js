import request from '../utils/request'

export async function queryPasswordPolicyInfo(params){

  return request(`/iam-ext/v1/organizations/${params.organizationId}/password_policies`)
}

export async function updatePasswordPolicyInfo (params) {
  return request(`/iam-ext/v1/organizations/${params.organizationId}/password_policies/${params.id}`,{
    method: 'POST',
    body: params.data
  })
}
