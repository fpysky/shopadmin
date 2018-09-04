import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'api/admin/permission/adminers',
    method: 'get',
    params: query
  })
}

export function getAllRole() {
  return request({
    url: 'api/admin/permission/getAllRole',
    method: 'get'
  })
}

export function getAdminRoles(query) {
  return request({
    url: 'api/admin/permission/getAdminRoles',
    method: 'get',
    params: query
  })
}

export function adminers(data) {
  return request({
    url: 'api/admin/permission/adminers',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: 'api/admin/permission/adminers',
    method: 'put',
    data
  })
}

export function deleteAdminer(data) {
  return request({
    url: 'api/admin/permission/adminers',
    method: 'delete',
    data
  })
}