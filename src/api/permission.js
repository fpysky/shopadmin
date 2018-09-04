import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'api/admin/permission/permissions',
    method: 'get',
    params: query
  })
}

export function getPidOptions() {
  return request({
    url: 'api/admin/permission/getPidOptions',
    method: 'get'
  })
}

export function permissions(data) {
  return request({
    url: 'api/admin/permission/permissions',
    method: 'post',
    data
  })
}

export function deletePermission(data) {
  return request({
    url: 'api/admin/permission/permissions',
    method: 'delete',
    data
  })
}